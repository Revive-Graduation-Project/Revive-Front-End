import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==============================
 * Auth Store (Production Ready)
 * ==============================
 * Responsibilities:
 * - Manage user authentication state
 * - Store user & token securely
 * - Handle login / logout
 * - Validate auth data
 * - Persist session across refresh
 */

const TOKEN_LIFETIME = 1000 * 60 * 60 * 24; // 24 hours

const isValidUser = (user) => {
  if (!user || typeof user !== "object") return false;

  // Minimal required structure
  return (
    (typeof user.id === "string" || typeof user.id === "number") &&
    typeof user.email === "string" &&
    user.email.includes("@")
  );
};

const isValidToken = (token) => {
  return typeof token === "string" && token.trim().length > 0;
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      user: null,
      token: null,
      expiresAt: null,

      isAuthenticated: false,
      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Login User
       * @param {Object} payload
       * @param {Object} payload.user
       * @param {String} payload.token
       * @param {Number} [payload.expiresAt] - Optional absolute timestamp
       */
      login: ({ user, token, expiresAt }) => {
        // Reset previous errors
        set({ error: null });

        // Validation
        if (!isValidUser(user)) {
          set({ error: "Invalid user object" });
          return;
        }

        if (!isValidToken(token)) {
          set({ error: "Invalid authentication token" });
          return;
        }

        // Use provided expiration or default to 24h
        const sessionExpiry = expiresAt || (Date.now() + TOKEN_LIFETIME);

        set({
          user,
          token,
          expiresAt: sessionExpiry,
          isAuthenticated: true,
          loading: false,
        });
      },

      /**
       * Logout User
       * Clears all auth-related data
       */
      logout: () => {
        set({
          user: null,
          token: null,
          expiresAt: null,
          isAuthenticated: false,
          error: null,
          loading: false,
        });
      },

      /**
       * Check Authentication Status
       * Called on app startup
       */
      checkAuth: () => {
        const { token, expiresAt } = get();

        if (!token || !expiresAt) {
          set({ isAuthenticated: false });
          return;
        }

        // Token expired
        if (Date.now() > expiresAt) {
          get().logout();
          return;
        }

        set({ isAuthenticated: true });
      },

      /**
       * Clear Auth Error
       * Useful for UI feedback reset
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "revive-auth-store",

      /**
       * Persist only essential data
       * Avoid persisting UI states like loading/error
       * isAuthenticated should be derived from token validity on load
       */
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        expiresAt: state.expiresAt,
      }),
    }
  )
);

export default useAuthStore;
