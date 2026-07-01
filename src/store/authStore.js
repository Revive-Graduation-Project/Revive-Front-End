import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginService,
  logoutService,
  restoreSessionService,
} from "../services/auth.service";
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

// const isValidUser = (user) => {
//   if (!user || typeof user !== "object") return false;

//   return (
//     (typeof user.id === "string" || typeof user.id === "number") &&
//     typeof user.email === "string" &&
//     user.email.includes("@") &&
//     (user.health === undefined || typeof user.health === "string") &&
//     (user.preferences === undefined || Array.isArray(user.preferences))
//   );
// };

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
      login: async (credentials) => {
        set({ error: null, loading: true });

        try {
          const response = await loginService(credentials);
          const data = response.data;

          const token = data.token;

          if (!isValidToken(token)) {
            set({ error: "Invalid authentication token", loading: false });
            return;
          }

          const rawUser = data.user ?? {
            id: data.userId,
            email: data.emailString,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
          };

          const user =
            rawUser?.id != null &&
            typeof rawUser.email === "string" &&
            rawUser.email.trim().length > 0
              ? {
                  id: rawUser.id,
                  email: rawUser.email,
                  role: rawUser.role,
                  firstName: rawUser.firstName,
                  lastName: rawUser.lastName,
                }
              : null;

          if (!user) {
            set({
              user: null,
              token: null,
              expiresAt: null,
              isAuthenticated: false,
              error: "Invalid user payload",
              loading: false,
            });
            return;
          }

          set({
            token,
            user,
            expiresAt: data.expiresAt ?? Date.now() + TOKEN_LIFETIME,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message ?? "Login failed",
            loading: false,
          });
        }
      },

      /**
       * Logout User
       * Clears all auth-related data
       */
      logout: async (manualLogout = false) => {
        // Reset previous errors
        set({ error: null, loading: true });

        // If manual logout, call logout service to invalidate token on server
        if (manualLogout) {
          try {
            await logoutService();
          } catch (error) {
            // Logout request failed , no return here as we want to clear client state anyway
            set({ error });
          }
        }

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
       * restore session validity
       * Called on app startup
       */
      restoreSession: async () => {
        // Get fresh state
        const { user, token, logout, expiresAt } = get();
        set({ error: null, loading: true });

        // If we have a user (persisted) but no token (lost in memory due to refresh)
        const expiredToken = expiresAt && Date.now() > expiresAt;
        if (user && (!token || expiredToken)) {
          try {
            // Attempt to get a new access token using the httpOnly cookie
            const { data } = await restoreSessionService();
            set({
              token: data.token,
              isAuthenticated: true,
              expiresAt: data.expiresAt,
            });
            return data.token;
          } catch (error) {
            // Refresh failed (cookie expired, invalid, etc.)
            set({ error });
            logout(); // Clear everything
          }
        }
        set({ loading: false });
        // user and token are valid, no action needed
        return null;
      },

      /**
       * Clear Auth Error
       * Useful for UI feedback reset
       */
      clearError: () => {
        set({ error: null });
      },

      // Accessor methods for token management
      setAccessToken: (token, expiresAt) => set({ token, expiresAt }),

      getAccessToken: () => get().token,
    }),
    {
      name: "revive-auth-store",

      /**
       * Persist only essential data
       * Avoid persisting UI states like loading/error
       *
       * SECURITY NOTE:
       * - token is NOT persisted to localStorage (XSS vulnerability)
       * - Access token lives in Zustand in-memory state only
       * - Refresh token is in httpOnly cookie (backend-managed)
       * - On page refresh, token will be null - call /auth/refresh to restore
       *
       * What IS persisted:
       * - user: Profile data (not sensitive)
       * - expiresAt: For UX (show session expiry warnings)
       */
      partialize: (state) => ({
        user: state.user,
        // token: deliberately excluded for security - in-memory only
        expiresAt: state.expiresAt,
      }),
    },
  ),
);

export default useAuthStore;
