import { api } from './api';

// Create order
export const placeOrder = (data) => {
  return api.post('/orders', data);
};

// Get user orders
export const getMyOrders = () => {
  return api.get('/orders/my');
};

// Track order
export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

// Cancel order
export const cancelOrder = (id) => {
  return api.patch(`/orders/${id}/cancel`);
};

