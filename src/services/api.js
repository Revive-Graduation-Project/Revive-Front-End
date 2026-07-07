import axios from "axios";
import { useAuthStore } from "../store";
import { restoreSessionService } from "./auth.service";

// ============================================================
// API BASE URL
// ============================================================
const ENV = import.meta.env.VITE_ENV || "prod";

const BASE_URLS = {
  local: import.meta.env.VITE_API_URL_LOCAL,
  dev: import.meta.env.VITE_API_URL_DEV,
  prod: import.meta.env.VITE_API_URL_PROD,
};

const BASE_URL = BASE_URLS[ENV] || import.meta.env.VITE_API_URL_PROD;

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// INTERCEPTORS
// ============================================================

let isRefreshing = false;
const refreshQueue = [];

// Attach access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const { getAccessToken } = useAuthStore.getState();
    if (getAccessToken()) {
      config.headers["Authorization"] = `Bearer ${getAccessToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 errors and automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { getAccessToken, setAccessToken, logout } = useAuthStore.getState();

    // If refresh endpoint fails → session expired → logout
    if (originalRequest.url?.includes("/auth/refresh")) {
      isRefreshing = false;
      refreshQueue.forEach((p) => p.reject(new Error("Session expired")));
      refreshQueue.length = 0;
      logout();
      return Promise.reject(error);
    }

    // If 401 → attempt token refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const res = await restoreSessionService();
        const expiresAt = Date.now() + 1000 * 60 * 60 * 24;
        setAccessToken(res.data.token, expiresAt);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${getAccessToken()}`;

        refreshQueue.forEach((p) => p.resolve(getAccessToken()));
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
