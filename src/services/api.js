import axios from "axios";
import { useAuthStore } from "../store";
import { restoreSessionService } from "./auth.service";
import { resolveMockHandler } from "../mocks/handlers";

// ============================================================
// MOCK MODE
// ============================================================
// When VITE_USE_MOCK=true, axios uses a custom adapter that
// intercepts every request and returns mock data from
// src/mocks/handlers.js instead of hitting the network.
//
// To switch to the real backend:
//   1. Set VITE_USE_MOCK=false in .env
//   2. Set VITE_API_BASE_URL to your real backend URL in .env
//   3. That's it — no service files need to change.
// ============================================================

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

const mockAdapter = async (config) => {
  // Simulate realistic network delay (100–350ms)
  const delay = Math.floor(Math.random() * 250) + 100;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const { status, data } = resolveMockHandler(config);

  // Axios expects a specific response shape from adapters
  const response = {
    data,
    status,
    statusText: status === 200 || status === 201 ? "OK" : "Error",
    headers: {},
    config,
    request: {},
  };

  // Reject 4xx/5xx so axios error interceptors still fire correctly
  if (status >= 400) {
    const error = new Error(`Mock error: ${status}`);
    error.response = response;
    error.config = config;
    return Promise.reject(error);
  }

  return response;
};

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
  withCredentials: true, // refresh token is sent in httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
  // Plug in mock adapter when VITE_USE_MOCK=true
  ...(USE_MOCK && { adapter: mockAdapter }),
});

if (USE_MOCK) {
  console.info(
    "[API] Running in MOCK mode. Set VITE_USE_MOCK=false to use the real backend.",
  );
}

// ============================================================
// INTERCEPTORS (active in both mock and real mode)
// ============================================================

let isRefreshing = false; // flag to indicate if token refresh is in progress
const refreshQueue = []; // queue to hold requests while token is being refreshed

// Attach access token to every outgoing request
api.interceptors.request.use(
  (config) => {
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request and wait
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

      // Start token refresh process
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
