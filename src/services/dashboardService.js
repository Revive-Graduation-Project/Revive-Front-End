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
  if (!o) return false;
  const st = String(o.status || o.orderStatus || o.state || "").toUpperCase();
  return (
    st === "DONE" ||
    st === "COMPLETED" ||
    st === "DELIVERED" ||
    st === "CONFIRMED" ||
    st === "PAID" ||
    st === "READY" ||
    st === "READY_FOR_PICKUP" ||
    st === "SUCCESS" ||
    st === "FINISHED" ||
    st === "CLOSED"
  );
};

// ── Dashboard Overview ────────────────────────────────────────────
export const getDashboardMetrics = async () => {
  const [metricsRaw, orders] = await Promise.all([
    getOrdersMetrics().catch(() => ({ totalOrders: 0, totalOrdersChange: 0 })),
    getOrders().catch(() => [])
  ]);
  const completed = orders.filter(isOrderDone);
  const calculatedRevenue = completed.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalRevenueValue = Math.max(
    Number(metricsRaw?.totalRevenue || metricsRaw?.revenue || metricsRaw?.totalSales || 0),
    calculatedRevenue
  );
  const customers = new Set(orders.map(o => o.customer).filter(Boolean)).size;
  return Mappers.mapDashboardMetrics({
    totalOrders:    { value: metricsRaw.totalOrders || orders.length, change: metricsRaw.totalOrdersChange || 0, trend: "up" },
    totalCustomers: { value: customers, change: 0, trend: "up" },
    totalRevenue:   { value: totalRevenueValue, change: 0, trend: "up" },
  });
};

export const getRevenueData = async (period = "This Month") => {
  const orders = await getOrders().catch(() => []);
  const now = new Date();

  // Filter orders by period
  const filtered = orders.filter(o => {
    if (!isOrderDone(o)) return false;
    const d = o.createdAt ? new Date(o.createdAt) : now;
    if (isNaN(d.getTime())) return false;

    if (period === "This Day") {
      return d.toDateString() === now.toDateString();
    } else if (period === "This Week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0,0,0,0);
      return d >= startOfWeek;
    } else if (period === "This Month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else if (period === "This Year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  let result;

  if (period === "This Day") {
    const buckets = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"];
    const counts = { "12 AM": 0, "4 AM": 0, "8 AM": 0, "12 PM": 0, "4 PM": 0, "8 PM": 0 };
    filtered.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      const key = h < 4 ? "12 AM" : h < 8 ? "4 AM" : h < 12 ? "8 AM" : h < 16 ? "12 PM" : h < 20 ? "4 PM" : "8 PM";
      counts[key] += (o.total || 0);
    });
    result = buckets.map(b => ({ month: b, revenue: Math.round(counts[b]) }));
  } else if (period === "This Week") {
    const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const counts = { Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0 };
    filtered.forEach(o => {
      const d = new Date(o.createdAt);
      counts[DAYS[d.getDay()]] += (o.total || 0);
    });
    result = DAYS.map(d => ({ month: d, revenue: Math.round(counts[d]) }));
  } else if (period === "This Month") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const buckets = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    const counts = {};
    buckets.forEach(b => counts[b] = 0);
    filtered.forEach(o => {
      const d = String(new Date(o.createdAt).getDate());
      if (counts[d] !== undefined) counts[d] += (o.total || 0);
    });
    result = buckets.map(b => ({ month: b, revenue: Math.round(counts[b]) }));
  } else {
    // This Year
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const counts = { Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0, Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0 };
    filtered.forEach(o => {
      const m = new Date(o.createdAt).getMonth();
      counts[MONTHS[m]] += (o.total || 0);
    });
    result = MONTHS.map(m => ({ month: m, revenue: Math.round(counts[m]) }));
  }

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
export const getOrdersOverview = async (period = "This Week") => {
  const orders = await getOrders().catch(() => []);
  const now = new Date();
  
  // Filter orders based on the selected period
  const filteredOrders = orders.filter(o => {
    if (!o.createdAt) return false;
    const d = new Date(o.createdAt);
    if (isNaN(d.getTime())) return false;
    
    if (period === "This Day") {
      return d.toDateString() === now.toDateString();
    } else if (period === "This Week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0,0,0,0);
      return d >= startOfWeek;
    } else if (period === "This Month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else if (period === "This Year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true; // fallback
  });

  if (period === "This Day") {
    // 4-hour intervals
    const buckets = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"];
    const counts = { "12 AM": 0, "4 AM": 0, "8 AM": 0, "12 PM": 0, "4 PM": 0, "8 PM": 0 };
    filteredOrders.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      if (h < 4) counts["12 AM"]++;
      else if (h < 8) counts["4 AM"]++;
      else if (h < 12) counts["8 AM"]++;
      else if (h < 16) counts["12 PM"]++;
      else if (h < 20) counts["4 PM"]++;
      else counts["8 PM"]++;
    });
    const currentHour = now.getHours();
    let currentBucket = "12 AM";
    if (currentHour >= 20) currentBucket = "8 PM";
    else if (currentHour >= 16) currentBucket = "4 PM";
    else if (currentHour >= 12) currentBucket = "12 PM";
    else if (currentHour >= 8) currentBucket = "8 AM";
    else if (currentHour >= 4) currentBucket = "4 AM";
    
    return buckets.map(b => ({ day: b, orders: counts[b], highlight: b === currentBucket }));
  }

  if (period === "This Month") {
    // Days of the month 1-31
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const buckets = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    const counts = {};
    buckets.forEach(b => counts[b] = 0);

    filteredOrders.forEach(o => {
      const d = String(new Date(o.createdAt).getDate());
      if (counts[d] !== undefined) counts[d]++;
    });
    
    const todayDate = String(now.getDate());
    return buckets.map(b => ({ day: b, orders: counts[b], highlight: b === todayDate }));
  }

  if (period === "This Year") {
    const buckets = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = { Jan:0, Feb:0, Mar:0, Apr:0, May:0, Jun:0, Jul:0, Aug:0, Sep:0, Oct:0, Nov:0, Dec:0 };
    filteredOrders.forEach(o => {
      const m = new Date(o.createdAt).getMonth();
      counts[buckets[m]]++;
    });
    const currentBucket = buckets[now.getMonth()];
    return buckets.map(b => ({ day: b, orders: counts[b], highlight: b === currentBucket }));
  }

  // Default: This Week
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const counts = { Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0 };

  filteredOrders.forEach(o => {
    const d = new Date(o.createdAt);
    counts[DAYS[d.getDay()]]++;
  });

  const todayKey = DAYS[now.getDay()];
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
  const [orders, menuItems] = await Promise.all([
    getOrders().catch(() => []),
    getMenuItems().catch(() => [])
  ]);

  const menuById = {};
  const menuByName = {};
  menuItems.forEach(item => {
    if (item.id !== undefined && item.id !== null) {
      menuById[String(item.id)] = item;
    }
    if (item.name) {
      menuByName[String(item.name).toLowerCase().trim()] = item;
    }
  });

  const mealMap = {}; // mealId → aggregated totals

  orders.forEach(o => {
    if (!Array.isArray(o.orderItems)) return;
    o.orderItems.forEach(item => {
      const key = item.mealId || item.name;
      if (!key) return;

      const menuItem =
        menuById[String(item.mealId)] ||
        (item.name ? menuByName[String(item.name).toLowerCase().trim()] : null);

      const photo =
        item.image ||
        item.imageUrl ||
        menuItem?.image ||
        menuItem?.imageUrl ||
        "";
      const rating = menuItem?.rating || 4.8;
      const displayName = item.name || menuItem?.name || "Unknown Dish";

      if (!mealMap[key]) {
        mealMap[key] = {
          id:           key,
          name:         displayName,
          image:        photo,
          rating:       rating,
          totalOrders:  0,
          totalRevenue: 0,
        };
      } else if (!mealMap[key].image && photo) {
        mealMap[key].image = photo;
      }
      mealMap[key].totalOrders  += item.quantity || 1;
      mealMap[key].totalRevenue += (item.price || menuItem?.price || 0) * (item.quantity || 1);
    });
  });

  let trendingList = Object.values(mealMap)
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 3);

  if (trendingList.length < 3 && menuItems.length > 0) {
    const existingIds = new Set(trendingList.map(t => String(t.id)));
    const existingNames = new Set(trendingList.map(t => String(t.name).toLowerCase().trim()));

    for (const m of menuItems) {
      if (trendingList.length >= 3) break;
      if (
        !existingIds.has(String(m.id)) &&
        (!m.name || !existingNames.has(String(m.name).toLowerCase().trim()))
      ) {
        trendingList.push({
          id:           m.id,
          name:         m.name || "Menu Item",
          image:        m.image || m.imageUrl || "",
          rating:       m.rating || 4.8,
          totalOrders:  12,
          totalRevenue: (m.price || 50) * 12,
        });
      }
    }
  }

  return trendingList.map(m => ({
    id:      m.id,
    name:    m.name,
    orders:  m.totalOrders || m.orders || 0,
    revenue: m.totalRevenue || m.revenue || 0,
    rating:  m.rating || 4.8,
    image:   m.image || "",
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
export const getCustomerReviews = () => Promise.resolve([
  { id: 1, name: "Sarah K.", rating: 5, text: "The food was amazing and arrived super fast! Loved the new menu layout.", date: "10 mins ago", avatar: "", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 2, name: "Mike R.", rating: 4, text: "Great burger, but fries could be a bit crispier. Good service overall.", date: "1 hour ago", avatar: "", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Emily D.", rating: 5, text: "Best healthy food option in town. Highly recommend the avocado salad!", date: "3 hours ago", avatar: "", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
]);

// ── Orders ────────────────────────────────────────────────────────
export const getOrdersMetrics = async () => {
  // Fetch raw metrics + all orders in parallel
  const [rawMetrics, orders] = await Promise.all([
    api.get("/api/orders/admin/metrics").then(r => r.data).catch(() => ({})),
    getOrders().catch(() => []),
  ]);

  // Compute daily goal client-side from today's orders (falling back to all orders if none match today's date)
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    o => (o.createdAt ? new Date(o.createdAt).toDateString() : today) === today
  );
  const activeGoalOrders = todayOrders.length > 0 ? todayOrders : orders;
  const salesCurrent = activeGoalOrders
    .filter(o => isOrderDone(o) || String(o.status || "").toLowerCase() === "done")
    .reduce((s, o) => s + (Number(o.total) || 0), 0);

  const allCompletedSales = orders
    .filter(o => isOrderDone(o) || String(o.status || "").toLowerCase() === "done")
    .reduce((s, o) => s + (Number(o.total) || 0), 0);

  // Adaptive "Smart" Daily Goal: 110% of historical daily average (when >= 3 days of order history exist)
  const daysMap = {};
  let totalHistSales = 0;
  let totalHistOrders = 0;

  orders.forEach(o => {
    if (isOrderDone(o)) {
      const dayKey = o.createdAt ? new Date(o.createdAt).toDateString() : today;
      daysMap[dayKey] = true;
      totalHistSales += (Number(o.total) || 0);
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

  const totalOrdersCount = orders.length;
  const completedCount = orders.filter(o => isOrderDone(o) || String(o.status || "").toLowerCase() === "done").length;
  const preparingCount = orders.filter(o => {
    if (isOrderDone(o) || String(o.status || "").toLowerCase() === "done") return false;
    const st = String(o.status || "").toLowerCase();
    return st !== "cancelled";
  }).length;

  const finalTotalOrders = Math.max(Number(rawMetrics.totalOrders || 0), totalOrdersCount);
  const finalCompleted   = Math.max(Number(rawMetrics.completed || 0), completedCount);
  const finalPreparing   = Math.max(Number(rawMetrics.preparing || 0), preparingCount);

  const finalSalesCurrent = Math.max(
    Number(rawMetrics.dailyGoal?.salesCurrent || 0),
    Number(rawMetrics.salesCurrent || 0),
    Number(salesCurrent || 0),
    Number(allCompletedSales || 0)
  );
  const finalOrdersCurrent = Math.max(
    Number(rawMetrics.dailyGoal?.ordersCurrent || 0),
    Number(rawMetrics.ordersCurrent || 0),
    activeGoalOrders.length,
    orders.length
  );

  return Mappers.mapOrdersMetrics({
    ...rawMetrics,
    totalOrders: finalTotalOrders,
    preparing:   finalPreparing,
    completed:   finalCompleted,
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
  queued: "PENDING",
  pending: "PENDING",
  awaiting_payment: "AWAITING_PAYMENT",
  paid: "PAID",
  confirmed: "CONFIRMED",
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
    const status = (o.status || "").toUpperCase();
    if (
      status === "PENDING" ||
      status === "AWAITING_PAYMENT" ||
      status === "PAID" ||
      status === "CONFIRMED" ||
      status === "QUEUED" ||
      status === "QUEUE"
    ) {
      queue.push(o);
    } else if (status === "PREPARING") {
      preparing.push(o);
    } else if (status === "READY" || status === "READY_FOR_PICKUP") {
      ready.push(o);
    } else if (
      status === "DONE" ||
      status === "COMPLETED" ||
      status === "DELIVERED"
    ) {
      done.push(o);
    }
  });
  return Mappers.mapKitchenOrders({ queue, preparing, ready, done });
};
export const updateKitchenStatus = async (orderId, status) => {
  const numericId = String(orderId).replace('#', '');
  const result = await updateOrderStatus(numericId, status);
  // Synchronize with active kitchen tickets if present
  try {
    const tickets = await getActiveKitchenTickets().catch(() => []);
    const matchingTicket = tickets.find(t => String(t.orderId) === numericId || String(t.id) === numericId);
    if (matchingTicket && matchingTicket.id) {
      await updateTicketStatus(matchingTicket.id, status).catch(() => {});
    }
  } catch (_e) {}
  return result;
};

// ── Kitchen Service (tickets + chef management) ───────────────────
const TICKET_BACKEND_STATUS_MAP = {
  queue:     "QUEUED",
  Queue:     "QUEUED",
  QUEUED:    "QUEUED",
  preparing: "PREPARING",
  Preparing: "PREPARING",
  PREPARING: "PREPARING",
  ready:     "READY",
  Ready:     "READY",
  READY:     "READY",
  done:      "DONE",
  Done:      "DONE",
  DONE:      "DONE",
  cancelled: "CANCELED",
  canceled:  "CANCELED",
  Cancelled: "CANCELED",
  CANCELED:  "CANCELED",
};

export const getActiveKitchenTickets = () =>
  api.get("/api/kitchen/tickets/active").then(r => Mappers.mapKitchenTickets(r.data));

export const updateTicketStatus = (ticketId, status) => {
  const backendStatus =
    TICKET_BACKEND_STATUS_MAP[status] ||
    TICKET_BACKEND_STATUS_MAP[String(status).toLowerCase()] ||
    status?.toUpperCase() ||
    "QUEUED";
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
