import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==========================
 * UI Store
 * ==========================
 * Responsibilities:
 * - Global UI state management
 * - Theme (light/dark)
 * - Notifications queue
 * - Modal control
 * - Loading & error state
 * - Persist theme
 */

const useUIStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */
      theme: "light", // light / dark
      notifications: [],
      modal: { isOpen: false, type: null, data: null },
      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      // Theme management
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme) => {
        if (["light", "dark"].includes(theme)) set({ theme });
      },

      // Notifications queue
      addNotification: (notification) => {
        if (!notification) return;

        const now = Date.now();
        const newNotification = {
          read: false,
          group: "Today",
          time: "Just now",
          createdAt: notification.createdAt || now,
          ...notification,
          id: notification.id || `notif-${now}-${Math.random().toString(36).substr(2, 4)}`,
        };

        if (!newNotification.type) return;

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 20),
        }));
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),
      addUniqueNotification: (notification) => {
        if (!notification) return;
        const id = notification.id;
        const existingIdx = get().notifications.findIndex((n) => n.id === id);
        if (existingIdx !== -1) {
          // Update in place if message changed, otherwise skip
          if (get().notifications[existingIdx].message !== notification.message) {
            set((state) => {
              const updated = [...state.notifications];
              updated[existingIdx] = { ...updated[existingIdx], ...notification, time: "Just now", createdAt: Date.now() };
              return { notifications: updated };
            });
          }
          return;
        }
        get().addNotification(notification);
      },
      removeNotificationsByPrefix: (prefix) => {
        if (!prefix) return;
        set((state) => ({
          notifications: state.notifications.filter((n) => !String(n.id || "").startsWith(prefix)),
        }));
      },

      // Modal control
      openModal: (type, data = null) =>
        set({ modal: { isOpen: true, type, data } }),
      closeModal: () =>
        set({ modal: { isOpen: false, type: null, data: null } }),

      // Loading & error
      setLoading: (val) => set({ loading: !!val }),
      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-ui-store", // persist theme & UI preferences
      partialize: (state) => ({
        theme: state.theme,
        notifications: state.notifications,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.notifications)) {
          // Remove any legacy mock notifications stored in previous sessions
          state.notifications = state.notifications.filter(
            (n) => !["notif-1", "notif-2", "notif-3", "notif-4"].includes(n.id)
          );
        }
      },
    }
  )
);

export function formatNotificationTime(notif) {
  const timestamp = notif?.createdAt || notif?.timestamp;
  if (!timestamp || isNaN(new Date(timestamp).getTime())) {
    return notif?.time || "Just now";
  }

  const now = Date.now();
  const diffMs = Math.max(0, now - new Date(timestamp).getTime());
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(timestamp).toLocaleDateString();
}

export function getNotificationGroup(notif) {
  const timestamp = notif?.createdAt || notif?.timestamp;
  if (!timestamp || isNaN(new Date(timestamp).getTime())) {
    return notif?.group || "Today";
  }
  const now = new Date();
  const notifDate = new Date(timestamp);

  if (now.toDateString() === notifDate.toDateString()) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === notifDate.toDateString()) return "Yesterday";

  return "Earlier";
}

export default useUIStore;
