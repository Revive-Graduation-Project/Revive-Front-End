import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth Store
 * ----------------------------------
 * Purpose:
 * - Manage authentication state
 * - Store user data & token
 * - Control login / logout
 * - Persist auth across refresh
 */

const useAuthStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      user: null,                 // Logged-in user object
      token: null,                // JWT / access token
      isAuthenticated: false,     // Auth flag
      loading: false,             // For async login later
      error: null,                // Auth errors

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Login user
       * This will be connected to backend later
       */
      login: ({ user, token }) => {
        if (!user || !token) return;

        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      /**
       * Logout user
       * Clears all auth data
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      /**
       * Check auth status
       * Useful when app starts
       */
      checkAuth: () => {
        const token = get().token;
        set({ isAuthenticated: !!token });
      },
    }),
    {
      name: "revive-auth-store", // localStorage key
    }
  )
);

export default useAuthStore;
