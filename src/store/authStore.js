import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginService,
  logoutService,
  registerService,
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
      loading: true,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Register User
       */
      register: async (credentials) => {
        if (get().loading) return null;

        set({ loading: true, error: null });

        try {
          const response = await registerService(credentials);
          return response.data;
        } catch (error) {
          set({
            error:
              error.response?.data?.message ??
              error.message ??
              "Registration failed",
          });

          return null;
        } finally {
          set({ loading: false });
        }
      },

      /**
       * Login User
       */
      login: async (credentials) => {
        // Guard against double-submit: if a login is already in
        // progress, ignore this call. We check get().loading
        // (synchronous zustand state) instead of relying on the
        // button's disabled attribute, which only takes effect
        // after React re-renders — too late to stop a fast
        // double-click / double form submit.
        if (get().loading) return;

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
       */
      logout: async (manualLogout = false) => {
        set({ error: null, loading: true });

        if (manualLogout) {
          try {
            await logoutService();
          } catch (error) {
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
       * Restore session on app startup
       */
      restoreSession: async () => {
        const { user, token, expiresAt } = get();
        set({ error: null, loading: true });

        const expiredToken = expiresAt && Date.now() > expiresAt;

        if (user && (!token || expiredToken)) {
          try {
            const { data } = await restoreSessionService();

            const rawUser = {
              id: data.userId,
              email: data.emailString,
              role: data.role,
              firstName: data.firstName,
              lastName: data.lastName,
            };

            set({
              token: data.token,
              user: rawUser.id != null && rawUser.email ? rawUser : get().user,
              isAuthenticated: true,
              expiresAt: data.expiresAt ?? Date.now() + TOKEN_LIFETIME,
              loading: false,
            });

            return data.token;
          } catch (error) {
            set({ error });
            get().logout();
          }
        }

        set({ loading: false });
        return null;
      },

      /**
       * Clear Auth Error
       */
      clearError: () => set({ error: null }),

      // Token accessors
      setAccessToken: (token, expiresAt) => set({ token, expiresAt }),
      getAccessToken: () => get().token,
    }),
    {
      name: "revive-auth-store",

      /**
       * Persist only essential data
       *
       * SECURITY NOTE:
       * - token is NOT persisted to localStorage (XSS vulnerability)
       * - Access token lives in Zustand in-memory state only
       * - Refresh token is in httpOnly cookie (backend-managed)
       * - On page refresh, token will be null → call /auth/refresh to restore
       *
       * What IS persisted:
       * - user: Whitelisted profile fields only (id, email, role, firstName, lastName)
       * - expiresAt: For UX session expiry detection
       */
      partialize: (state) => ({
        user: state.user,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);

export default useAuthStore;
