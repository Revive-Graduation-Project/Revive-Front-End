import { api } from "./api";

// Register
export const register = (data) => {
  return api.post("/auth/signup", data);
};

// Login
export const loginService = async (credentials) => {
  return api.post("/auth/login", credentials);
};

// Logout
export const logoutService = async () => {
  return api.post("/auth/logout");
};

// ============================================================
// Restore session — DEDUPED
// ============================================================
// Prevents two /auth/refresh calls from firing at the same time
// (e.g. one from authStore's restoreSession() on app mount, and
// one from api.js's 401 interceptor). Since the refresh token
// cookie rotates on every successful call, a second concurrent
// call would fail with 401 because the cookie was already
// replaced by the first call.
//
// All callers share the same in-flight promise until it settles.
// ============================================================
let refreshPromise = null;

export const restoreSessionService = () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = api.post("/auth/refresh").finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};
