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
export const getOrdersOverview     = () => api.get("/dashboard/orders-overview").then(r => Mappers.mapOrdersOverview(r.data));
export const getOrderTypes         = () => api.get("/dashboard/order-types").then(r => Mappers.mapOrderTypes(r.data));
export const getTrendingMenus      = () => api.get("/dashboard/trending-menus").then(r => Mappers.mapTrendingMenus(r.data));
export const getInventoryAlerts    = () => api.get("/dashboard/inventory-alerts").then(r => r.data); // Untouched/Custom
export const getRecentActivity     = () => api.get("/dashboard/activity").then(r => Mappers.mapRecentActivity(r.data));
export const getCustomerReviews    = () => api.get("/dashboard/reviews").then(r => r.data);

// ── Orders ────────────────────────────────────────────────────────
export const getOrdersMetrics      = () => api.get("/dashboard/orders/metrics").then(r => Mappers.mapOrdersMetrics(r.data));
export const getOrders             = (params = {}) => api.get("/dashboard/orders", { params }).then(r => Mappers.mapOrders(r.data));
export const updateOrderStatus     = (orderId, status) => api.patch(`/dashboard/orders/${encodeURIComponent(orderId)}/status`, { status }).then(r => r.data);

// ── Kitchen ───────────────────────────────────────────────────────
export const getKitchenOrders = () =>
  api.get("/kitchen/orders").then(r => {
    const mapped = Mappers.mapKitchenOrders(r.data);
    return mapped;
  });
export const updateKitchenStatus   = (orderId, status) => api.patch(`/kitchen/orders/${encodeURIComponent(orderId)}/status`, { status }).then(r => r.data);

// ── Menu (Chef Menu page) ─────────────────────────────────────────
export const getMenuCategories     = () => api.get("/menu/categories").then(r => Mappers.mapMenuCategories(r.data));
export const getMenuItems          = (params = {}) => api.get("/api/menu", { params }).then(r => Mappers.mapMenuItems(r.data));
export const deleteMenuItem        = (id) => api.delete(`/api/menu/${id}`).then(r => r.data);
export const updateMenuItem        = (id, data) => api.put(`/api/menu/${id}`, data).then(r => r.data);
export const createMenuItem        = (data) => api.post("/api/menu", data).then(r => r.data);
export const updateMenuDiscount    = (id, data) => api.patch(`/api/menu/${id}/discount`, data).then(r => r.data);

// ── Recipe Builder ────────────────────────────────────────────────
export const getRecipeIngredients  = () => api.get("/recipes/ingredients").then(r => r.data);
export const saveRecipe            = (data) => api.post("/recipes", data).then(r => r.data);

// ── Menu Management ───────────────────────────────────────────────
export const getMenuUploads        = () => api.get("/menu/uploads").then(r => Mappers.mapMenuUploads(r.data));
export const uploadMenuFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/menu/upload", formData, {
    headers: { "X-File-Name": file.name },
  }).then((r) => r.data);
};

// ── Ingredients ───────────────────────────────────────────────────
export const getIngredientsMetrics = () => api.get("/ingredients/metrics").then(r => Mappers.mapIngredientsMetrics(r.data));
export const getIngredients        = (params = {}) => api.get("/api/ingredients", { params }).then(r => Mappers.mapIngredients(r.data));
export const createIngredient      = (data) => Promise.reject(new Error("POST /api/ingredients not implemented by backend"));
export const updateIngredient      = (id, data) => api.patch(`/api/ingredients/${id}/stock`, data).then(r => r.data);
export const deleteIngredient      = (id) => Promise.reject(new Error("DELETE /api/ingredients not implemented by backend"));
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
