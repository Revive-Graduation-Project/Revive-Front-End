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
import { useUIStore } from "../../store";

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
      qc.invalidateQueries({ queryKey: orderKeys.list({}) });
      qc.invalidateQueries({ queryKey: kitchenKeys.orders() });
      useUIStore.getState().addNotification({
        title: `New Order #${newOrder?.id || "Received"}`,
        message: `An incoming order totalling $${newOrder?.totalAmount || "0.00"} has arrived in the queue.`,
        type: "warning",
        category: "Orders",
      });
    });

    // 2. Kitchen Status Updates
    socket.on("kitchen:status_update", ({ orderId, nextStatus }) => {
      qc.invalidateQueries({ queryKey: kitchenKeys.orders() });
      const typeMap = { preparing: "info", ready: "success", done: "success", cancelled: "critical" };
      useUIStore.getState().addNotification({
        title: `Kitchen Order #${orderId}`,
        message: `Order status changed to "${String(nextStatus).toUpperCase()}".`,
        type: typeMap[String(nextStatus).toLowerCase()] || "info",
        category: "Orders",
      });
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
      useUIStore.getState().addNotification({
        title: alert?.title || "Low Stock Alert",
        message: alert?.message || "An ingredient is below the critical threshold.",
        type: "critical",
        category: "Inventory",
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [qc]);

  return { isConnected: !!socketRef.current };
}
