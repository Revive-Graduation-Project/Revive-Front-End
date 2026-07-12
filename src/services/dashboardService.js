/**
 * Dashboard Service Layer
 * ─────────────────────────────────────────────────────────────────
 * All calls go through the shared `api` axios instance which:
 *   - Attaches the Bearer token automatically
 *   - Handles token refresh on 401
 *   - Routes through mock adapter when VITE_USE_MOCK=true
 *
 * To switch from mock → real backend:
 *   Set VITE_USE_MOCK=false in .env — nothing else changes.
 */

import { api } from "./api";
import * as Mappers from "./mappers/dashboardMappers";
import { useAuthStore } from "../store";
import { evaluateStock } from "../utils/stockUtils";
import { formatTimeAgo } from "../utils/activityLog";
import axios from "axios";

const isOrderDone = (o) => {
  const st = (o?.status || "").toUpperCase();
  return st === "DONE" || st === "COMPLETED" || st === "DELIVERED" || st === "CONFIRMED";
};

// ── Dashboard Overview ────────────────────────────────────────────
export const getDashboardMetrics = async () => {
  const [metricsRaw, orders] = await Promise.all([
    getOrdersMetrics().catch(() => ({ totalOrders: 0, totalOrdersChange: 0 })),
    getOrders().catch(() => [])
  ]);
  const completed = orders.filter(isOrderDone);
  const totalRevenueValue = completed.reduce((sum, o) => sum + (o.total || 0), 0);
  const customers = new Set(orders.map(o => o.customer).filter(Boolean)).size;
  return Mappers.mapDashboardMetrics({
    totalOrders:    { value: metricsRaw.totalOrders || orders.length, change: metricsRaw.totalOrdersChange || 0, trend: "up" },
    totalCustomers: { value: customers, change: 0, trend: "up" },
    totalRevenue:   { value: totalRevenueValue, change: 0, trend: "up" },
  });
};

export const getRevenueData = async () => {
  const orders = await getOrders().catch(() => []);
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revenueByMonth = {};

  orders.forEach(o => {
    // Use preserved ISO createdAt from mapOrders
    if (isOrderDone(o) && o.createdAt) {
      const date = new Date(o.createdAt);
      if (!isNaN(date.getTime())) {
        const key = MONTHS[date.getMonth()];
        revenueByMonth[key] = (revenueByMonth[key] || 0) + (o.total || 0);
      }
    }
  });

  const result = Object.entries(revenueByMonth).map(([month, rev]) => ({
    month,
    revenue: Math.round(rev), // exact EGP amount
  }));

  // Minimal fallback only when truly no orders exist
  return Mappers.mapRevenueData(
    result.length ? result : [{ month: "—", income: 0, revenue: 0, expense: 0 }]
  );
};

export const getTopCategories = async () => {
  const items = await getMenuItems().catch(() => []);
  const counts = {};
  items.forEach(item => {
    const cat = item.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const colors = ["#F97316", "#8B5CF6", "#3B82F6", "#10B981", "#EC4899"];
  const data = Object.entries(counts).map(([name, value], index) => ({
    name, value, color: colors[index % colors.length]
  }));
  return Mappers.mapTopCategories(data);
};
export const getOrdersOverview = async () => {
  const orders = await getOrders().catch(() => []);
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const counts = { Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0 };

  orders.forEach(o => {
    if (o.createdAt) {
      const d = new Date(o.createdAt);
      if (!isNaN(d.getTime())) {
        counts[DAYS[d.getDay()]]++;
      }
    }
  });

  const todayKey = DAYS[new Date().getDay()];
  return DAYS.map(day => ({
    day,
    orders:    counts[day],
    highlight: day === todayKey,
  }));
};
export const getOrderTypes = async () => {
  const staticData = [
    { name: "Dine-in", count: 420, percentage: 55, color: "#F97316" },
    { name: "Takeaway", count: 230, percentage: 30, color: "#8B5CF6" },
    { name: "Delivery", count: 115, percentage: 15, color: "#10B981" },
  ];
  return Mappers.mapOrderTypes(staticData);
};
export const getTrendingMenus = async () => {
  const orders = await getOrders().catch(() => []);
  const mealMap = {}; // mealId → aggregated totals

  orders.forEach(o => {
    if (!Array.isArray(o.orderItems)) return;
    o.orderItems.forEach(item => {
      const key = item.mealId;
      if (!key) return;
      if (!mealMap[key]) {
        mealMap[key] = {
          id:           key,
          name:         item.name  || "Unknown Dish",
          image:        item.image || "",
          totalOrders:  0,
          totalRevenue: 0,
        };
      }
      mealMap[key].totalOrders  += item.quantity || 1;
      mealMap[key].totalRevenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  return Object.values(mealMap)
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 3)
    .map(m => ({
      id:      m.id,
      name:    m.name,
      orders:  m.totalOrders,
      revenue: m.totalRevenue,
      rating:  0,   // no rating in order DTO
      image:   m.image,
    }));
};
export const getInventoryAlerts = async () => {
  const ingredients = await getIngredients().catch(() => []);
  
  const lowStock = ingredients
    .filter(i => {
      const { isOutOfStock, isLowStock } = evaluateStock(i.stock, i.unit);
      return isOutOfStock || isLowStock;
    })
    .map(i => ({
      id: i.id,
      name: i.name,
      stock: `${i.stock} ${i.unit || "g"}`,
      unit: i.unit || "g",
      image: i.image || ""
    }));

  return {
    lowStock
  };
};
export const getRecentActivity = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("revive_activity_log") || "[]");
    return Promise.resolve(
      stored.map(e => ({
        id:     e.id,
        user:   e.user   || "Staff",
        role:   e.role   || "Admin",
        action: e.action || "",
        time:   formatTimeAgo(e.time),  // "5 mins ago" etc.
        avatar: e.avatar || "",
      }))
    );
  } catch {
    return Promise.resolve([]);
  }
};
export const getCustomerReviews    = () => Promise.resolve([
  { id: 1, name: "Sarah K.", rating: 5, comment: "The food was amazing and arrived super fast! Loved the new menu layout.", time: "10 mins ago", avatar: "" },
  { id: 2, name: "Mike R.", rating: 4, comment: "Great burger, but fries could be a bit crispier. Good service overall.", time: "1 hour ago", avatar: "" },
  { id: 3, name: "Emily D.", rating: 5, comment: "Best healthy food option in town. Highly recommend the avocado salad!", time: "3 hours ago", avatar: "" }
]);

// ── Orders ────────────────────────────────────────────────────────
export const getOrdersMetrics = async () => {
  // Fetch raw metrics + all orders in parallel
  const [rawMetrics, orders] = await Promise.all([
    api.get("/api/orders/admin/metrics").then(r => r.data).catch(() => ({})),
    getOrders().catch(() => []),
  ]);

  // Compute daily goal client-side from today's orders
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    o => o.createdAt && new Date(o.createdAt).toDateString() === today
  );
  const salesCurrent = todayOrders
    .filter(isOrderDone)
    .reduce((s, o) => s + (o.total || 0), 0);

  // Adaptive "Smart" Daily Goal: 110% of historical daily average (when >= 3 days of order history exist)
  const daysMap = {};
  let totalHistSales = 0;
  let totalHistOrders = 0;

  orders.forEach(o => {
    if (isOrderDone(o) && o.createdAt) {
      const dayKey = new Date(o.createdAt).toDateString();
      daysMap[dayKey] = true;
      totalHistSales += (o.total || 0);
      totalHistOrders += 1;
    }
  });

  const numDays = Object.keys(daysMap).length;
  const defaultSalesTarget = rawMetrics.dailyGoal?.salesTarget ?? rawMetrics.salesTarget ?? 10000;
  const defaultOrdersTarget = rawMetrics.dailyGoal?.ordersTarget ?? rawMetrics.ordersTarget ?? 200;

  const salesTarget = numDays >= 3
    ? Math.max(1000, Math.ceil(((totalHistSales / numDays) * 1.1) / 100) * 100)
    : defaultSalesTarget;

  const ordersTarget = numDays >= 3
    ? Math.max(10, Math.ceil(((totalHistOrders / numDays) * 1.1) / 5) * 5)
    : defaultOrdersTarget;

  const finalSalesCurrent = Math.max(rawMetrics.dailyGoal?.salesCurrent || 0, rawMetrics.salesCurrent || 0, salesCurrent);
  const finalOrdersCurrent = Math.max(rawMetrics.dailyGoal?.ordersCurrent || 0, rawMetrics.ordersCurrent || 0, todayOrders.length);

  return Mappers.mapOrdersMetrics({
    ...rawMetrics,
    dailyGoal: {
      salesCurrent: finalSalesCurrent,
      salesTarget: salesTarget,
      ordersCurrent: finalOrdersCurrent,
      ordersTarget: ordersTarget,
    },
  });
};
export const getOrders = (params = {}) =>
  api.get("/api/orders/admin/all", { params: { size: 500, ...params } }).then(r => Mappers.mapOrders(r.data));

const ADMIN_ORDER_STATUS_MAP = {
  queue: "PENDING",
  pending: "PENDING",
  preparing: "PREPARING",
  ready: "READY",
  done: "DONE",
  completed: "DONE",
  cancelled: "CANCELED",
  canceled: "CANCELED",
};

export const updateOrderStatus = (orderId, status) => {
  const mapped = ADMIN_ORDER_STATUS_MAP[status?.toLowerCase()] || status?.toUpperCase() || status;
  const numericId = String(orderId).replace('#', '');
  return api.patch(`/api/orders/admin/${encodeURIComponent(numericId)}/status`, { status: mapped }).then(r => r.data);
};

// ── Kitchen ───────────────────────────────────────────────────────
export const getKitchenOrders = async () => {
  const orders = await getOrders().catch(() => []);
  const queue = [], preparing = [], ready = [], done = [];
  orders.forEach(o => {
    const status = o.status?.toUpperCase() || "PENDING";
    if (status === "PENDING" || status === "AWAITING_PAYMENT" || status === "PAID") queue.push(o);
    else if (status === "PREPARING") preparing.push(o);
    else if (status === "READY" || status === "READY_FOR_PICKUP") ready.push(o);
    else if (status === "COMPLETED" || status === "DELIVERED" || status === "CONFIRMED") done.push(o);
  });
  return Mappers.mapKitchenOrders({ queue, preparing, ready, done });
};
export const updateKitchenStatus = (orderId, status) => updateOrderStatus(orderId, status);

// ── Kitchen Service (tickets + chef management) ───────────────────
const TICKET_BACKEND_STATUS_MAP = {
  Queue:     "QUEUED",
  Preparing: "PREPARING",
  Ready:     "READY",
  Done:      "DONE",
  Cancelled: "CANCELED",
  QUEUED:    "QUEUED",
  PREPARING: "PREPARING",
  READY:     "READY",
  DONE:      "DONE",
  CANCELED:  "CANCELED",
};

export const getActiveKitchenTickets = () =>
  api.get("/api/kitchen/tickets/active").then(r => Mappers.mapKitchenTickets(r.data));

export const updateTicketStatus = (ticketId, status) => {
  const backendStatus = TICKET_BACKEND_STATUS_MAP[status] || status?.toUpperCase() || "QUEUED";
  return api.patch(`/api/kitchen/tickets/${ticketId}/status`, { status: backendStatus }).then(r => r.data);
};

export const updateChefStatus      = (chefId, status)      => api.patch(`/api/kitchen/chefs/${chefId}/status`, { status }).then(r => r.data);
export const updateChefStation     = (chefId, station)     => api.patch(`/api/kitchen/chefs/${chefId}/station`, { station }).then(r => r.data);
export const updateChefDisplayName = (chefId, displayName) => api.patch(`/api/kitchen/chefs/${chefId}/display-name`, { displayName }).then(r => r.data);

// ── Menu (Chef Menu page) ─────────────────────────────────────────
export const getMenuCategories = async () => {
  // The backend doesn't have a /categories endpoint, so we derive it from the menu items directly.
  const items = await getMenuItems();
  const counts = {};
  items.forEach(item => {
    const cat = item.category || "Other";
    counts[cat] = (counts[cat] || 0) + 1;
  });
  
  const total = items.length;
  const categories = Object.entries(counts).map(([name, count], index) => {
    const colors = ["#F97316", "#8B5CF6", "#3B82F6", "#10B981", "#EC4899"];
    return {
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: colors[index % colors.length],
      change: "+0%" // Placeholder since we can't calculate historical change purely from current items
    };
  });

  return Mappers.mapMenuCategories({
    totalChange: "+0%",
    items: categories
  });
};
export const getMenuItems          = (params = {}) => api.get("/api/menu", { params }).then(r => Mappers.mapMenuItems(r.data));
export const deleteMenuItem        = (id) => api.delete(`/api/menu/${id}`).then(r => r.data);
export const updateMenuItem        = (id, data) => api.put(`/api/menu/${id}`, data).then(r => r.data);
export const createMenuItem        = (data) => api.post("/api/menu", data).then(r => r.data);
export const updateMenuDiscount    = (id, data) => api.patch(`/api/menu/${id}/discount`, data).then(r => r.data);
export const uploadMealImage       = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const headers = { "Content-Type": "multipart/form-data" };
  const user = useAuthStore.getState().user;
  if (user && user.role) {
    headers["X-User-Role"] = user.role;
  }
  return api.post(`/api/menu/${id}/image`, formData, { headers }).then(r => r.data);
};

// ── Recipe Builder ────────────────────────────────────────────────
export const getRecipeIngredients  = () => api.get("/api/ingredients").then(r => r.data);
export const saveRecipe            = (data) => api.post("/api/menu", data).then(r => r.data);

// ── Menu Management ───────────────────────────────────────────────
export const getMenuUploads = () => {
  const uploads = JSON.parse(localStorage.getItem('menuUploads') || '[]');
  return Promise.resolve(Mappers.mapMenuUploads(uploads));
};

export const uploadMenuFile = async (payload) => {
  const file = payload?.file || payload;
  const onUploadProgress = payload?.onUploadProgress;
  const formData = new FormData();
  formData.append("file", file);

  const headers = { "Content-Type": "multipart/form-data" };
  const user = useAuthStore.getState().user;
  if (user && user.role) {
    headers["X-User-Role"] = user.role;
  }

  const result = await api.post("/api/inventory/upload", formData, { headers, onUploadProgress }).then(r => r.data);

  // Store in localStorage so it appears in the Recent Uploads table
  const uploads = JSON.parse(localStorage.getItem('menuUploads') || '[]');
  const now = new Date();
  
  const newUpload = {
    id: `UPL-${Date.now()}`,
    filename: file.name,
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    status: "Success",
    added: 0, 
    updated: 0
  };
  
  localStorage.setItem('menuUploads', JSON.stringify([newUpload, ...uploads]));

  return result;
};

export const validateMenuFile = async (payload) => {
  const file = payload?.file || payload;
  const formData = new FormData();
  formData.append("file", file);
  const headers = { "Content-Type": "multipart/form-data" };
  const user = useAuthStore.getState().user;
  if (user?.role) headers["X-User-Role"] = user.role;
  return api.post("/api/inventory/validate", formData, { headers }).then(r => r.data);
};

export const getImportJobStatus = async (jobId) => {
  return api.get(`/api/inventory/import-status/${jobId}`).then(r => r.data);
};

export const getActiveImportJob = async () => {
  const res = await api.get("/api/inventory/import-jobs/active").catch(err => {
    if (err?.response?.status === 204) return null;
    throw err;
  });
  return res ? res.data : null;
};

export const getAllImportJobs = async () => {
  return api.get("/api/inventory/import-jobs").then(r => r.data.content || r.data);
};

export const cancelImportJob = async (jobId) => {
  const headers = {};
  const user = useAuthStore.getState().user;
  if (user?.role) headers["X-User-Role"] = user.role;
  return api.post(`/api/inventory/import-jobs/${jobId}/cancel`, {}, { headers }).then(r => r.data);
};

export const importMenuJson = async (validMeals) => {
  const headers = {};
  const user = useAuthStore.getState().user;
  if (user?.role) headers["X-User-Role"] = user.role;
  return api.post("/api/inventory/import-json", validMeals, { headers }).then(r => r.data);
};

// ── Ingredients ───────────────────────────────────────────────────────────────────
export const getIngredientsMetrics = async () => {
  const ingredients = await getIngredients().catch(() => []);
  const total = ingredients.length;
  const outOfStock = ingredients.filter(i => evaluateStock(i.stock, i.unit).isOutOfStock).length;
  const lowStock = ingredients.filter(i => evaluateStock(i.stock, i.unit).isLowStock).length;
  return Mappers.mapIngredientsMetrics({
    total, totalChange: 0,
    lowStock, lowStockChange: 0,
    outOfStock, outOfStockChange: 0
  });
};
export const getIngredients             = (params = {}) => api.get("/api/ingredients", { params }).then(r => Mappers.mapIngredients(r.data));
export const updateIngredientStock      = (id, data)    => {
  const payload = {
    ingredientId: Number(id),
    stock: Number(data.stock !== undefined ? data.stock : data)
  };
  return api.patch(`/api/ingredients/${id}/stock`, payload).then(r => r.data);
};
export const bulkUpdateIngredientsStock = (data)        => api.patch("/api/ingredients/bulk/stock", data).then(r => r.data);
export const reserveIngredientsStock    = (data)        => api.post("/api/ingredients/reserve", data).then(r => r.data);
export const revertIngredientsStock     = (data)        => api.post("/api/ingredients/revert", data).then(r => r.data);


export const uploadIngredientsFile = (payload) => {
  const file = payload?.file || payload;
  const onUploadProgress = payload?.onUploadProgress;
  const formData = new FormData();
  formData.append("file", file);

  const headers = {};
  const user = useAuthStore.getState().user;
  if (user && user.role) {
    headers["X-User-Role"] = user.role;
  }

  return api.post("/api/inventory/upload", formData, { headers, onUploadProgress }).then(r => r.data);
};
