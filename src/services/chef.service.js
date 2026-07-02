import { api } from './api';

// Get active orders
export const getActiveOrders = () => {
  return api.get('/chef/orders');
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
  return api.put(`/chef/orders/${orderId}`, { status });
};

// Update meal availability
export const updateMealAvailability = (mealId, quantity) => {
  return api.put(`/chef/meals/${mealId}/availability`, { quantity });
};
