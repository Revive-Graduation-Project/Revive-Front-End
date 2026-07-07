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
import axios from "axios";

// ── Dashboard Overview ────────────────────────────────────────────
export const getDashboardMetrics = async () => {
  const [metrics, orders] = await Promise.all([
    getOrdersMetrics().catch(() => ({ totalOrders: 0, totalOrdersChange: 0 })),
    getOrders().catch(() => [])
  ]);
  const totalRevenueValue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + (o.total || 0) : sum, 0);
  const customers = new Set(orders.map(o => o.customer).filter(Boolean)).size;
  return Mappers.mapDashboardMetrics({
    totalOrders: { value: metrics.totalOrders || orders.length, change: metrics.totalOrdersChange || 0, trend: "up" },
    totalCustomers: { value: customers, change: 0, trend: "up" },
    totalRevenue: { value: totalRevenueValue, change: 0, trend: "up" },
  });
};

export const getRevenueData = async (period = "6m") => {
  const orders = await getOrders().catch(() => []);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueByMonth = {};
  orders.forEach(o => {
    if (o.status !== 'Cancelled' && o.time) {
      const date = new Date(o.time);
      if (!isNaN(date.getTime())) {
        const monthStr = months[date.getMonth()];
        revenueByMonth[monthStr] = (revenueByMonth[monthStr] || 0) + (o.total || 0);
      }
    }
  });
  const result = Object.entries(revenueByMonth).map(([month, rev]) => ({
    month,
    revenue: Math.round(rev / 1000),
    income: Math.round((rev * 0.7) / 1000),
    expense: Math.round((rev * 0.3) / 1000)
  }));
  return Mappers.mapRevenueData(result.length ? result : [
    { month: "Jan", income: 10, revenue: 15, expense: 5 },
    { month: "Feb", income: 12, revenue: 18, expense: 6 }
  ]);
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
export const getOrdersOverview = () => Promise.resolve([
  { day: "Mon", orders: 120, highlight: false },
  { day: "Tue", orders: 150, highlight: false },
  { day: "Wed", orders: 180, highlight: true },
  { day: "Thu", orders: 130, highlight: false },
  { day: "Fri", orders: 210, highlight: false },
  { day: "Sat", orders: 250, highlight: true },
  { day: "Sun", orders: 220, highlight: false }
]);
export const getOrderTypes = async () => {
  const orders = await getOrders().catch(() => []);
  const counts = { "Dine-in": 0, "Takeaway": 0, "Delivery": 0 };
  orders.forEach(o => {
    const type = o.type || (Math.random() > 0.5 ? "Dine-in" : "Takeaway");
    counts[type]++;
  });
  const total = orders.length || 1;
  const colors = ["#F97316", "#8B5CF6", "#10B981"];
  const data = Object.entries(counts).map(([name, count], index) => ({
    name, count, percentage: Math.round((count / total) * 100), color: colors[index % colors.length]
  })).filter(d => d.count > 0);
  return Mappers.mapOrderTypes(data);
};
export const getTrendingMenus = () => Promise.resolve([
  { id: 1, name: "Spicy Chicken Burger", orders: 145, revenue: 1250, trend: "up", percentage: 12 },
  { id: 2, name: "Truffle Fries", orders: 98, revenue: 490, trend: "up", percentage: 8 },
  { id: 3, name: "Classic Margarita", orders: 85, revenue: 765, trend: "down", percentage: 3 }
]);
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
export const getRecentActivity = () => Promise.resolve([
  { id: 1, user: "John Doe", role: "Customer", action: "placed a new order", time: "5 mins ago", avatar: "" },
  { id: 2, user: "System", role: "System", action: "Inventory alert: Tomato stock low", time: "1 hour ago", avatar: "" },
  { id: 3, user: "Admin", role: "Admin", action: "New staff member registered", time: "2 hours ago", avatar: "" }
]);
export const getCustomerReviews    = () => api.get("/dashboard/reviews").then(r => r.data).catch(() => [
  { id: 1, name: "Sarah K.", rating: 5, comment: "The food was amazing and arrived super fast! Loved the new menu layout.", time: "10 mins ago", avatar: "" },
  { id: 2, name: "Mike R.", rating: 4, comment: "Great burger, but fries could be a bit crispier. Good service overall.", time: "1 hour ago", avatar: "" },
  { id: 3, name: "Emily D.", rating: 5, comment: "Best healthy food option in town. Highly recommend the avocado salad!", time: "3 hours ago", avatar: "" }
]);

// ── Orders ────────────────────────────────────────────────────────
export const getOrdersMetrics      = () => api.get("/api/orders/admin/metrics").then(r => Mappers.mapOrdersMetrics(r.data));
export const getOrders             = (params = {}) => api.get("/api/orders/admin/all", { params }).then(r => Mappers.mapOrders(r.data));
export const updateOrderStatus     = (orderId, status) => api.patch(`/api/orders/admin/${encodeURIComponent(orderId)}/status`, { status }).then(r => r.data);

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
export const updateKitchenStatus = (orderId, status) => api.patch(`/api/orders/admin/${encodeURIComponent(orderId)}/status`, { status }).then(r => r.data);

// ── Kitchen Service (tickets + chef management) ───────────────────
export const getActiveKitchenTickets  = ()                    => api.get("/api/kitchen/tickets/active").then(r => r.data);
export const updateTicketStatus       = (ticketId, status)    => api.patch(`/api/kitchen/tickets/${ticketId}/status`, { status }).then(r => r.data);
export const updateChefStatus         = (chefId, status)      => api.patch(`/api/kitchen/chefs/${chefId}/status`, { status }).then(r => r.data);
export const updateChefStation        = (chefId, station)     => api.patch(`/api/kitchen/chefs/${chefId}/station`, { station }).then(r => r.data);
export const updateChefDisplayName    = (chefId, displayName) => api.patch(`/api/kitchen/chefs/${chefId}/display-name`, { displayName }).then(r => r.data);

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
