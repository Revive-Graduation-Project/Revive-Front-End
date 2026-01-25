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
      notifications: [], // [{id, type, message}]
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

        // Auto-generate ID if missing
        const newNotification = {
          ...notification,
          id: notification.id || Date.now() + Math.random(),
        };

        if (!newNotification.type) return;

        set((state) => ({
          // Cap at last 5 notifications
          notifications: [...state.notifications, newNotification].slice(-5),
        }));
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
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
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export default useUIStore;
