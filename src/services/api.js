import axios from "axios";
import { restoreSessionService } from "./auth.service";

// ============================================================
// API CONFIGURATION
// ============================================================

// Determine baseURL based on VITE_ENV (local, dev, prod)
const getBaseURL = () => {
  const env = import.meta.env.VITE_ENV || "local";
  if (env === "prod") {
    if (!import.meta.env.VITE_API_URL_PROD) throw new Error("VITE_API_URL_PROD is not defined");
    return import.meta.env.VITE_API_URL_PROD;
  }
  if (env === "dev") {
    if (!import.meta.env.VITE_API_URL_DEV) throw new Error("VITE_API_URL_DEV is not defined");
    return import.meta.env.VITE_API_URL_DEV;
  }
  return import.meta.env.VITE_API_URL_LOCAL || "http://localhost:8080/";
};

// Create axios instance
export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // refresh token is sent in httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// INTERCEPTORS (active in both mock and real mode)
// ============================================================

let isRefreshing = false; // flag to indicate if token refresh is in progress
const refreshQueue = []; // queue to hold requests while token is being refreshed

// Attach access token to every outgoing request
api.interceptors.request.use(
  async (config) => {
    const useAuthStore = (await import("../store/authStore")).default;
    const { getAccessToken } = useAuthStore.getState();
    getAccessToken() &&
      (config.headers["Authorization"] = `Bearer ${getAccessToken()}`);
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 errors and automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const useAuthStore = (await import("../store/authStore")).default;
    const { getAccessToken, setAccessToken, logout } = useAuthStore.getState();

    // If refresh endpoint fails, refresh token expired — user must re-login
    if (originalRequest.url?.includes("/auth/refresh")) {
      isRefreshing = false;
      refreshQueue.forEach((p) => p.reject(new Error("Session expired")));
      refreshQueue.length = 0;
      logout();
      return Promise.reject(error);
    }

    // If any endpoint returns 401 (unauthorized), attempt to refresh the access token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      // If already refreshing, queue this request and wait
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Start token refresh process
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const res = await restoreSessionService();
        const token = res.data.token;
        
        let expiresAt = Date.now() + 1000 * 60 * 60 * 24; // fallback
        try {
          if (token && typeof token === 'string' && token.split('.').length === 3) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            if (payload.exp) {
              expiresAt = payload.exp * 1000;
            }
          }
        } catch (e) {
          console.warn("Failed to decode JWT payload", e);
        }

        setAccessToken(token, expiresAt);
        isRefreshing = false;

        refreshQueue.forEach((p) => p.resolve(token));
        refreshQueue.length = 0;

        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshQueue.forEach((p) => p.reject(err));
        refreshQueue.length = 0;
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);
