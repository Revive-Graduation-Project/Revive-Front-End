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

        const newNotification = {
          read: false,
          group: "Today",
          time: "Just now",
          ...notification,
          id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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
              updated[existingIdx] = { ...updated[existingIdx], ...notification, time: "Just now" };
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

export default useUIStore;
