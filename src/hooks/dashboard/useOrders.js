import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersMetrics, getOrders, updateOrderStatus, getTrendingMenus } from "../../services/dashboardService";

export const orderKeys = {
  all:     ["orders"],
  metrics: () => ["orders", "metrics"],
  list:    (filters) => ["orders", "list", filters],
  trending:() => ["orders", "trending"],
};

/**
 * Fetches order metrics data.
 * @returns {Object} A React Query result object with order metrics in the `data` property.
 */
export function useOrdersMetrics() {
  return useQuery({ queryKey: orderKeys.metrics(), queryFn: getOrdersMetrics });
}

/**
 * Fetches a list of orders with optional filters and automatically polls for updates.
 * @param {Object} [filters={}] - Filters to apply to the orders query.
 * @returns {Object} The React Query result containing orders data and query state.
 */
export function useOrders(filters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn:  () => getOrders(filters),
    refetchOnMount: 'always',
    staleTime: 0,
    refetchInterval: 30000, // optionally auto-poll every 30s
  });
}

/**
 * Fetches the list of trending menus.
 * @returns {Object} A React Query query result for trending menus.
 */
export function useOrdersTrending() {
  return useQuery({ queryKey: orderKeys.trending(), queryFn: getTrendingMenus });
}

/**
 * Creates a mutation for updating an order's status.
 * @returns {Object} A mutation object. Call with `{ orderId, status }` to update an order's status.
 */
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    // Optimistic update
    onMutate: async ({ orderId, status }) => {
      await qc.cancelQueries({ queryKey: orderKeys.list({}) });
      const prev = qc.getQueriesData({ queryKey: orderKeys.all });
      qc.setQueriesData({ queryKey: orderKeys.all }, (old) => {
        if (Array.isArray(old)) {
          return old.map((o) => (o.id === orderId ? { ...o, status } : o));
        }
        if (old?.orders && Array.isArray(old.orders)) {
          return {
            ...old,
            orders: old.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
          };
        }
        return old;
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data));
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
}
