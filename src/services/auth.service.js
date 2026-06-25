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

// Restore session
export const restoreSessionService = async () => {
  return api.post("/auth/refresh");
};
