import { api } from './api';

// Get current user profile
export const getProfile = () => {
  return api.get('/users/me');
};

// Update profile
export const updateProfile = (data) => {
  return api.put('/users/me', data);
};

// Update health profile
export const updateHealthProfile = (data) => {
  return api.put('/users/me/health', data);
};

// Get order history
export const getOrderHistory = () => {
  return api.get('/users/me/orders');
};
