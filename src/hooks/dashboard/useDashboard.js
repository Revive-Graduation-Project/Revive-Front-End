/**
 * Dashboard Overview Hooks
 * All hooks use React Query — stale time / cache config inherited from QueryClient in main.jsx
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
  ordersOverview: (period) => ["dashboard", "orders-overview", period],
  orderTypes:     () => ["dashboard", "order-types"],
  trending:       () => ["dashboard", "trending"],
  inventory:      () => ["dashboard", "inventory"],
  activity:       () => ["dashboard", "activity"],
  reviews:        () => ["dashboard", "reviews"],
};

export function useDashboardMetrics() {
  return useQuery({ queryKey: dashboardKeys.metrics(), queryFn: getDashboardMetrics });
}

export function useRevenueData(period = "6m") {
  return useQuery({ queryKey: dashboardKeys.revenue(period), queryFn: () => getRevenueData(period) });
}

export function useTopCategories() {
  return useQuery({ queryKey: dashboardKeys.categories(), queryFn: getTopCategories });
}

export function useOrdersOverview(period = "This Week") {
  return useQuery({ queryKey: dashboardKeys.ordersOverview(period), queryFn: () => getOrdersOverview(period) });
}

export function useOrderTypes() {
  return useQuery({ queryKey: dashboardKeys.orderTypes(), queryFn: getOrderTypes });
}

export function useTrendingMenus() {
  return useQuery({ queryKey: dashboardKeys.trending(), queryFn: getTrendingMenus });
}

export function useInventoryAlerts() {
  return useQuery({ queryKey: dashboardKeys.inventory(), queryFn: getInventoryAlerts });
}

export function useRecentActivity() {
  return useQuery({ queryKey: dashboardKeys.activity(), queryFn: getRecentActivity });
}

export function useCustomerReviews() {
  return useQuery({ queryKey: dashboardKeys.reviews(), queryFn: getCustomerReviews });
}

/** Prefetch all dashboard data at once */
export function usePrefetchDashboard() {
  const qc = useQueryClient();
  return () => {
    qc.prefetchQuery({ queryKey: dashboardKeys.metrics(),        queryFn: getDashboardMetrics });
    qc.prefetchQuery({ queryKey: dashboardKeys.revenue("6m"),    queryFn: () => getRevenueData("6m") });
    qc.prefetchQuery({ queryKey: dashboardKeys.trending(),       queryFn: getTrendingMenus });
    qc.prefetchQuery({ queryKey: dashboardKeys.activity(),       queryFn: getRecentActivity });
  };
}
