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
import axios from "axios";

// ── Dashboard Overview ────────────────────────────────────────────
export const getDashboardMetrics   = () => api.get("/dashboard/metrics").then(r => Mappers.mapDashboardMetrics(r.data));
export const getRevenueData        = (period = "6m") => api.get(`/dashboard/revenue?period=${period}`).then(r => Mappers.mapRevenueData(r.data));
export const getTopCategories      = () => api.get("/dashboard/categories").then(r => Mappers.mapTopCategories(r.data));
export const getOrdersOverview = () => Promise.resolve([
  { day: "Mon", orders: 120, highlight: false },
  { day: "Tue", orders: 150, highlight: false },
  { day: "Wed", orders: 180, highlight: true },
  { day: "Thu", orders: 130, highlight: false },
  { day: "Fri", orders: 210, highlight: false },
  { day: "Sat", orders: 250, highlight: true },
  { day: "Sun", orders: 220, highlight: false }
]);
export const getOrderTypes         = () => api.get("/dashboard/order-types").then(r => Mappers.mapOrderTypes(r.data));
export const getTrendingMenus = () => Promise.resolve([
  { id: 1, name: "Spicy Chicken Burger", orders: 145, revenue: 1250, trend: "up", percentage: 12 },
  { id: 2, name: "Truffle Fries", orders: 98, revenue: 490, trend: "up", percentage: 8 },
  { id: 3, name: "Classic Margarita", orders: 85, revenue: 765, trend: "down", percentage: 3 }
]);
export const getInventoryAlerts    = () => api.get("/dashboard/inventory-alerts").then(r => r.data); // Untouched/Custom
export const getRecentActivity = () => Promise.resolve([
  { id: 1, user: "John Doe", role: "Customer", action: "placed a new order", time: "5 mins ago", avatar: "" },
  { id: 2, user: "System", role: "System", action: "Inventory alert: Tomato stock low", time: "1 hour ago", avatar: "" },
  { id: 3, user: "Admin", role: "Admin", action: "New staff member registered", time: "2 hours ago", avatar: "" }
]);
export const getCustomerReviews    = () => api.get("/dashboard/reviews").then(r => r.data);

// ── Orders ────────────────────────────────────────────────────────
export const getOrdersMetrics      = () => api.get("/api/orders/admin/metrics").then(r => Mappers.mapOrdersMetrics(r.data));
export const getOrders             = (params = {}) => api.get("/api/orders/admin/all", { params }).then(r => Mappers.mapOrders(r.data));
export const updateOrderStatus     = (orderId, status) => api.patch(`/api/orders/admin/${encodeURIComponent(orderId)}/status`, { status }).then(r => r.data);

// ── Kitchen ───────────────────────────────────────────────────────
export const getKitchenOrders = () =>
  api.get("/kitchen/orders").then(r => {
    const mapped = Mappers.mapKitchenOrders(r.data);
    return mapped;
  });
export const updateKitchenStatus   = (orderId, status) => api.patch(`/kitchen/orders/${encodeURIComponent(orderId)}/status`, { status }).then(r => r.data);

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
  return api.post(`/api/menu/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then(r => r.data);
};

// ── Recipe Builder ────────────────────────────────────────────────
export const getRecipeIngredients  = () => api.get("/recipes/ingredients").then(r => r.data);
export const saveRecipe            = (data) => api.post("/recipes", data).then(r => r.data);

// ── Menu Management ───────────────────────────────────────────────
export const getMenuUploads = () => {
  const uploads = JSON.parse(localStorage.getItem('menuUploads') || '[]');
  return Promise.resolve(Mappers.mapMenuUploads(uploads));
};

export const uploadMenuFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const headers = { "Content-Type": "multipart/form-data" };
  const user = useAuthStore.getState().user;
  if (user && user.role) {
    headers["X-User-Role"] = user.role;
  }

  const result = await api.post("/api/inventory/upload", formData, { headers }).then(r => r.data);

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

// ── Ingredients ───────────────────────────────────────────────────
export const getIngredientsMetrics = () => api.get("/ingredients/metrics").then(r => Mappers.mapIngredientsMetrics(r.data));
export const getIngredients        = (params = {}) => api.get("/api/ingredients", { params }).then(r => Mappers.mapIngredients(r.data));
export const createIngredient      = (data) => api.post("/api/ingredients", data).then(r => r.data);
export const updateIngredient      = (id, data) => api.patch(`/api/ingredients/${id}/stock`, data).then(r => r.data);
export const deleteIngredient      = (id) => api.delete(`/api/ingredients/${id}`).then(r => r.data);
export const bulkUpdateIngredientsStock = (data) => api.patch("/api/ingredients/bulk/stock", data).then(r => r.data);
export const reserveIngredientsStock    = (data) => api.post("/api/ingredients/reserve", data).then(r => r.data);
export const revertIngredientsStock     = (data) => api.post("/api/ingredients/revert", data).then(r => r.data);


export const uploadIngredientsFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const headers = {};
  const user = useAuthStore.getState().user;
  if (user && user.role) {
    headers["X-User-Role"] = user.role;
  }

  return api.post("/api/inventory/upload", formData, { headers }).then(r => r.data);
};
