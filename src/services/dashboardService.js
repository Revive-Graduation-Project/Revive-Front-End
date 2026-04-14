/**
 * Dashboard Service Layer
 * --------------------------------------------------
 * Currently returns mock data. To connect to a real API:
 *   1. Import axios (already in project)
 *   2. Replace each function body with an axios call
 *   3. Keep the same return shape so components don't need changes
 *
 * Example swap:
 *   // Mock:    return mockMetrics;
 *   // Real:    const { data } = await api.get('/dashboard/metrics');
 *               return data;
 */

import * as mock from "../mocks/dashboardMock";

// Simulated network delay (remove when using real API)
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

// ── Dashboard ─────────────────────────────────────

export async function getDashboardMetrics() {
  await delay();
  return mock.mockMetrics;
}

export async function getRevenueData() {
  await delay();
  return mock.mockRevenueData;
}

export async function getTopCategories() {
  await delay();
  return mock.mockTopCategories;
}

export async function getOrdersOverview() {
  await delay();
  return mock.mockOrdersOverview;
}

export async function getOrderTypes() {
  await delay();
  return mock.mockOrderTypes;
}

export async function getTrendingMenus() {
  await delay();
  return mock.mockTrendingMenus;
}

export async function getInventoryAlerts() {
  await delay();
  return mock.mockInventoryAlerts;
}

export async function getRecentActivity() {
  await delay();
  return mock.mockRecentActivity;
}

export async function getCustomerReviews() {
  await delay();
  return mock.mockCustomerReviews;
}

// ── Orders ────────────────────────────────────────

export async function getOrdersMetrics() {
  await delay();
  return mock.mockOrdersMetrics;
}

export async function getOrders() {
  await delay();
  return mock.mockOrders;
}

// ── Recipe Builder ────────────────────────────────

export async function getRecipeIngredients() {
  await delay();
  return mock.mockRecipeIngredients;
}

export async function saveRecipe(recipeData) {
  await delay(500);
  // TODO: POST /recipes with recipeData
  console.log("[dashboardService] saveRecipe →", recipeData);
  return { success: true, id: Date.now() };
}

// ── Chef Menu ─────────────────────────────────────

export async function getMenuCategories() {
  await delay();
  return mock.mockMenuCategories;
}

export async function getMenuItems() {
  await delay();
  return mock.mockMenuItems;
}

// ── Live Kitchen ──────────────────────────────────

export async function getKitchenOrders() {
  await delay();
  return mock.mockKitchenOrders;
}

export async function updateOrderStatus(orderId, newStatus) {
  await delay(400);
  // TODO: PATCH /kitchen/orders/:orderId { status: newStatus }
  console.log("[dashboardService] updateOrderStatus →", orderId, newStatus);
  return { success: true };
}
