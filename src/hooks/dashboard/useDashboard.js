/**
 * Dashboard Overview Hooks
 * All hooks use React Query — stale time / cache config inherited from QueryClient
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDashboardMetrics, getRevenueData, getTopCategories,
  getOrdersOverview, getOrderTypes, getTrendingMenus,
  getInventoryAlerts, getRecentActivity, getCustomerReviews,
} from "../../services/dashboardService";

export const dashboardKeys = {
  all:            ["dashboard"],
  metrics:        () => ["dashboard", "metrics"],
  revenue:        (period) => ["dashboard", "revenue", period],
  categories:     () => ["dashboard", "categories"],
  ordersOverview: () => ["dashboard", "orders-overview"],
  orderTypes:     () => ["dashboard", "order-types"],
  trending:       () => ["dashboard", "trending"],
  inventory:      () => ["dashboard", "inventory"],
  activity:       () => ["dashboard", "activity"],
  reviews:        () => ["dashboard", "reviews"],
};

/**
 * Fetches dashboard metrics.
 * @return {UseQueryResult} The query result for dashboard metrics.
 */
export function useDashboardMetrics() {
  return useQuery({ queryKey: dashboardKeys.metrics(), queryFn: getDashboardMetrics });
}

/**
 * Fetches revenue data for a specified period.
 * @param {string} [period="6m"] - The time period to fetch revenue data for.
 * @returns {object} The query result containing revenue data.
 */
export function useRevenueData(period = "6m") {
  return useQuery({ queryKey: dashboardKeys.revenue(period), queryFn: () => getRevenueData(period) });
}

/**
 * Fetches the top categories data.
 * @returns {Object} The React Query result object containing the categories.
 */
export function useTopCategories() {
  return useQuery({ queryKey: dashboardKeys.categories(), queryFn: getTopCategories });
}

/**
 * Fetches the dashboard orders overview data.
 * @returns {UseQueryResult} The React Query result object with orders overview data.
 */
export function useOrdersOverview() {
  return useQuery({ queryKey: dashboardKeys.ordersOverview(), queryFn: getOrdersOverview });
}

/**
 * Fetches order type data for the dashboard.
 * @returns {Object} Query result containing the order types.
 */
export function useOrderTypes() {
  return useQuery({ queryKey: dashboardKeys.orderTypes(), queryFn: getOrderTypes });
}

/**
 * Fetches trending menu data.
 * @return {UseQueryResult} The React Query result object with trending menu data.
 */
export function useTrendingMenus() {
  return useQuery({ queryKey: dashboardKeys.trending(), queryFn: getTrendingMenus });
}

/**
 * Fetches inventory alerts.
 * @return {UseQueryResult} A React Query result object for inventory alerts.
 */
export function useInventoryAlerts() {
  return useQuery({ queryKey: dashboardKeys.inventory(), queryFn: getInventoryAlerts });
}

/**
 * Fetches recent activity data.
 * @return {import("@tanstack/react-query").UseQueryResult} A React Query result object containing recent activity data.
 */
export function useRecentActivity() {
  return useQuery({ queryKey: dashboardKeys.activity(), queryFn: getRecentActivity });
}

/**
 * Fetches customer review data for the dashboard.
 * @return {object} A React Query result object containing customer reviews.
 */
export function useCustomerReviews() {
  return useQuery({ queryKey: dashboardKeys.reviews(), queryFn: getCustomerReviews });
}

/**
 * Returns a function that prefetches core dashboard data.
 * @returns {Function} A function that, when invoked, prefetches dashboard metrics, revenue, trending, and activity data.
 */
export function usePrefetchDashboard() {
  const qc = useQueryClient();
  return () => {
    qc.prefetchQuery({ queryKey: dashboardKeys.metrics(),        queryFn: getDashboardMetrics });
    qc.prefetchQuery({ queryKey: dashboardKeys.revenue("6m"),    queryFn: () => getRevenueData("6m") });
    qc.prefetchQuery({ queryKey: dashboardKeys.trending(),       queryFn: getTrendingMenus });
    qc.prefetchQuery({ queryKey: dashboardKeys.activity(),       queryFn: getRecentActivity });
  };
}
