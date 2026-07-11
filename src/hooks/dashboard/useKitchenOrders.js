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
import { toast as sonnerToast } from "../../utils/toastUtils";
import {
  getKitchenOrders,
  updateKitchenStatus,
  getActiveKitchenTickets,
  updateTicketStatus,
  updateChefStatus,
  updateChefStation,
  updateChefDisplayName,
} from "../../services/dashboardService";
import { useUIStore } from "../../store";

const POLL_INTERVAL_MS = 30_000; // 30 s — swap for WS when ready

export const kitchenKeys = {
  all:     ["kitchen"],
  orders:  () => ["kitchen", "orders"],
  tickets: () => ["kitchen", "tickets"],
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
    mutationFn: async ({ orderId, nextStatus }) => {
      const toastId = sonnerToast.loading(`Moving order #${orderId} to ${String(nextStatus).toUpperCase()}...`, {
        description: "You can navigate away while this updates."
      });
      try {
        const res = await updateKitchenStatus(orderId, nextStatus);
        sonnerToast.success(`Order #${orderId} moved to ${String(nextStatus).toUpperCase()}!`, { id: toastId, description: "Kitchen board updated." });
        return res;
      } catch (err) {
        sonnerToast.error(`Failed to move order #${orderId}.`, { id: toastId, description: err?.response?.data?.message || err.message || "Please try again." });
        throw err;
      }
    },
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
    onSuccess: (_data, { orderId, nextStatus }) => {
      const typeMap = {
        preparing: "info",
        ready: "success",
        done: "success",
        cancelled: "critical",
        queue: "warning",
      };
      useUIStore.getState().addNotification({
        title: `Kitchen Order #${orderId}`,
        message: `Order moved to "${String(nextStatus).toUpperCase()}" on the Live Kitchen board.`,
        type: typeMap[String(nextStatus).toLowerCase()] || "info",
        category: "Orders",
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: kitchenKeys.all }),
  });
}

// ══════════════════════════════════════════════════════════════════
// Kitchen-Service hooks (tickets + chef management)
// ══════════════════════════════════════════════════════════════════

/** Fetch active kitchen tickets — polls every 30 s */
export function useActiveTickets() {
  return useQuery({
    queryKey:        kitchenKeys.tickets(),
    queryFn:         getActiveKitchenTickets,
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnMount:  "always",
    staleTime:       0,
    placeholderData: [],
  });
}

/** Mutation: update a kitchen ticket's status */
export function useUpdateTicketStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, status }) => updateTicketStatus(ticketId, status),

    // Optimistic update
    onMutate: async ({ ticketId, status }) => {
      await qc.cancelQueries({ queryKey: kitchenKeys.tickets() });
      const prev = qc.getQueryData(kitchenKeys.tickets());

      qc.setQueryData(kitchenKeys.tickets(), (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((t) => (t.id === ticketId ? { ...t, status } : t));
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(kitchenKeys.tickets(), ctx.prev);
      sonnerToast.error("Failed to update ticket status.");
    },
    onSuccess: (_data, { ticketId, status }) => {
      sonnerToast.success(`Ticket moved to ${status}.`);
      const typeMap = {
        preparing: "info",
        ready: "success",
        done: "success",
        cancelled: "critical",
      };
      useUIStore.getState().addNotification({
        title: `Ticket #${ticketId} Status`,
        message: `Kitchen ticket has been updated to "${String(status).toUpperCase()}".`,
        type: typeMap[String(status).toLowerCase()] || "info",
        category: "Orders",
      });
    },
    onSettled: () => qc.invalidateQueries({ queryKey: kitchenKeys.all }),
  });
}

/** Mutation: toggle chef active/inactive */
export function useUpdateChefStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ chefId, status }) => updateChefStatus(chefId, status),
    onError: () => sonnerToast.error("Failed to update chef status."),
    onSuccess: (_data, { status }) => sonnerToast.success(`Chef marked as ${status}.`),
    onSettled: () => qc.invalidateQueries({ queryKey: kitchenKeys.tickets() }),
  });
}

/** Mutation: change chef station */
export function useUpdateChefStation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ chefId, station }) => updateChefStation(chefId, station),
    onError: () => sonnerToast.error("Failed to update chef station."),
    onSuccess: (_data, { station }) => sonnerToast.success(`Chef station updated to ${station}.`),
    onSettled: () => qc.invalidateQueries({ queryKey: kitchenKeys.tickets() }),
  });
}

/** Mutation: edit chef display name */
export function useUpdateChefDisplayName() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ chefId, displayName }) => updateChefDisplayName(chefId, displayName),
    onError: () => sonnerToast.error("Failed to update chef display name."),
    onSuccess: () => sonnerToast.success("Chef display name updated."),
    onSettled: () => qc.invalidateQueries({ queryKey: kitchenKeys.tickets() }),
  });
}
