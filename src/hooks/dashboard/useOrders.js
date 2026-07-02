import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersMetrics, getOrders, updateOrderStatus, getTrendingMenus } from "../../services/dashboardService";

export const orderKeys = {
  all:     ["orders"],
  metrics: () => ["orders", "metrics"],
  list:    (filters) => ["orders", "list", filters],
  trending:() => ["orders", "trending"],
};

export function useOrdersMetrics() {
  return useQuery({ queryKey: orderKeys.metrics(), queryFn: getOrdersMetrics });
}

export function useOrders(filters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn:  () => getOrders(filters),
    refetchOnMount: 'always',
    staleTime: 0,
    refetchInterval: 30000, // optionally auto-poll every 30s
  });
}

export function useOrdersTrending() {
  return useQuery({ queryKey: orderKeys.trending(), queryFn: getTrendingMenus });
}

/** Mutation: update an order's status */
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    // Optimistic update
    onMutate: async ({ orderId, status }) => {
      await qc.cancelQueries({ queryKey: orderKeys.list({}) });
      const prev = qc.getQueriesData({ queryKey: orderKeys.all });
      qc.setQueriesData({ queryKey: orderKeys.all }, (old) => {
        if (!old?.orders) return old;
        return {
          ...old,
          orders: old.orders.map((o) => o.id === orderId ? { ...o, status } : o),
        };
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
