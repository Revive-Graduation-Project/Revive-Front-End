import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * UI Store
 * ----------------------------------
 * Purpose:
 * - Centralize global UI behavior
 * - Control modals, loaders, toasts, theme
 */

const useUIStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      isLoading: false,
      globalError: null,

      // Modals
      activeModal: null, // "login" | "signup" | "checkout" | null
      modalData: null,

      // Notifications
      toasts: [], // [{ id, type, message }]

      // Theme
      theme: "light", // "light" | "dark"

      /* =====================
         ACTIONS
      ====================== */

      /* Loading */
      startLoading: () => set({ isLoading: true }),
      stopLoading: () => set({ isLoading: false }),

      /* Errors */
      setError: (message) => {
        if (!message) return;
        set({ globalError: message });
      },
      clearError: () => set({ globalError: null }),

      /* Modals */
      openModal: (name, data = null) =>
        set({ activeModal: name, modalData: data }),

      closeModal: () =>
        set({ activeModal: null, modalData: null }),

      /* Toasts */
      showToast: (message, type = "info") => {
        const id = Date.now();
        set((state) => ({
          toasts: [...state.toasts, { id, type, message }],
        }));

        // Auto remove toast
        setTimeout(() => {
          get().removeToast(id);
        }, 3000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      /* Theme */
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "revive-ui-store",
    }
  )
);

export default useUIStore;
