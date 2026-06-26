/**
 * useRealtimeKitchen
 * ─────────────────────────────────────────────────────────────────
 * Real-time abstraction layer for the Live Kitchen board.
 *
 * TODAY  → polls GET /kitchen/orders every 30 seconds via React Query
 * FUTURE → swap queryFn for a WebSocket message stream without
 *           touching any UI component code.
 *
 * The hook exposes: { boards, isConnected, refetch, error }
 * UI components never need to know the transport mechanism.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKitchenOrders, updateKitchenStatus } from "../../services/dashboardService";

const POLL_INTERVAL_MS = 30_000; // 30 s — swap for WS when ready

export const kitchenKeys = {
  all:    ["kitchen"],
  orders: () => ["kitchen", "orders"],
};

export function useRealtimeKitchen() {
  const { data: boards, error, refetch, isFetching } = useQuery({
    queryKey:        kitchenKeys.orders(),
    queryFn:         getKitchenOrders,
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnMount:  'always',
    staleTime:       0,
    placeholderData: { queue: [], preparing: [], ready: [], done: [] },
  });

  return {
    boards:      boards ?? { queue: [], preparing: [], ready: [], done: [] },
    isConnected: !error,
    isFetching,
    error,
    refetch,
  };
}

/** Mutation: move an order to the next kitchen status */
export function useUpdateKitchenStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, nextStatus }) => updateKitchenStatus(orderId, nextStatus),
    // Optimistic local board update — moves card between columns instantly
    onMutate: async ({ orderId, nextStatus }) => {
      await qc.cancelQueries({ queryKey: kitchenKeys.orders() });
      const prev = qc.getQueryData(kitchenKeys.orders());

      qc.setQueryData(kitchenKeys.orders(), (old) => {
        if (!old) return old;
        const next = { 
          queue: [...(old.queue || [])], 
          preparing: [...(old.preparing || [])], 
          ready: [...(old.ready || [])],
          done: [...(old.done || [])]
        };
        
        let foundCol = null;
        let idx = -1;
        
        // Find the column the order is currently in
        for (const col of ["queue", "preparing", "ready", "done"]) {
          idx = next[col].findIndex((o) => o.id === orderId);
          if (idx !== -1) {
            foundCol = col;
            break;
          }
        }
        
        if (!foundCol) return old;
        
        const [splicedOrder] = next[foundCol].splice(idx, 1);
        const order = { ...splicedOrder };
        
        if (nextStatus) {
          if (nextStatus === "preparing" && foundCol === "queue") order.startedAt = new Date().toISOString();
          if (nextStatus === "done") {
            next.done.unshift(order); // Add to the beginning of done list
          } else if (nextStatus === "cancelled") {
            // Do nothing, it drops off the kitchen board entirely
          } else {
            next[nextStatus].push(order);
          }
        }
        
        return next;
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(kitchenKeys.orders(), ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: kitchenKeys.orders() }),
  });
}
