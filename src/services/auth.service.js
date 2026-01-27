import { api } from './api';

// Register
export const register = (data) => {
  return api.post('/auth/register', data);
};

// Login
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

// Logout
export const logout = () => {
  return api.post('/auth/logout');
};