/**
 * Dashboard Real-Time Abstraction
 * ─────────────────────────────────────────────────────────────────
 * This provides the foundational architecture for WebSocket integration
 * to push live updates (orders, metrics, notifications, inventory) 
 * directly into the React Query cache.
 * 
 * When the backend WebSocket is ready:
 * 1. Replace the `MockSocket` with `io("wss://your-api.com")`
 * 2. The event listeners will automatically update UI state.
 */

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { orderKeys } from "./useOrders";
import { kitchenKeys } from "./useKitchenOrders";
import { dashboardKeys } from "./useDashboard";

// Fake MockSocket for architecture prep
class MockSocket {
  listeners = {};
  on(event, cb) { this.listeners[event] = cb; }
  off(event) { delete this.listeners[event]; }
  disconnect() {}
}

export function useDashboardRealtime() {
  const qc = useQueryClient();
  const socketRef = useRef(null);

  useEffect(() => {
    // TODO: Replace with real socket connection when backend is ready
    // socketRef.current = io(import.meta.env.VITE_WS_URL || "wss://localhost:3000");
    const socket = new MockSocket();
    socketRef.current = socket;

    // 1. Live Orders (New incoming order)
    socket.on("orders:new", (newOrder) => {
      // Invalidate orders list or optimistic update
      qc.invalidateQueries({ queryKey: orderKeys.list({}) });
      qc.invalidateQueries({ queryKey: kitchenKeys.orders() });
    });

    // 2. Kitchen Status Updates
    socket.on("kitchen:status_update", ({ orderId, nextStatus }) => {
      // Refresh the board to fetch latest state
      qc.invalidateQueries({ queryKey: kitchenKeys.orders() });
    });

    // 3. Analytics & Metrics Updates
    socket.on("metrics:update", (metricsUpdate) => {
      qc.setQueryData(dashboardKeys.metrics(), (old) => {
        if (!old) return old;
        return { ...old, ...metricsUpdate };
      });
    });

    // 4. Activity Feed
    socket.on("activity:new", (activity) => {
      qc.setQueryData(dashboardKeys.activity(), (old) => {
        if (!Array.isArray(old)) return old;
        return [activity, ...old].slice(0, 10); // Keep top 10
      });
    });

    // 5. Inventory & Notifications
    socket.on("inventory:alert", (alert) => {
      qc.invalidateQueries({ queryKey: ["ingredients"] });
      // Here you could also trigger a global toast notification if desired
    });

    return () => {
      socket.disconnect();
    };
  }, [qc]);

  return { isConnected: !!socketRef.current };
}
