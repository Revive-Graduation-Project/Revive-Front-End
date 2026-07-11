import { api } from './api';

// Create order
export const placeOrder = (data) => {
  return api.post('/api/orders', data);
};

// Get user orders
export const getMyOrders = () => {
  return api.get(`/api/orders/client/history`);
};

// Track order
export const getOrderById = (id) => {
  return api.get(`/api/orders/${id}`);
};

// Cancel order
export const cancelOrder = (id) => {
  return api.patch(`/api/orders/${id}`);
};

// Poll order status until it reaches CONFIRMED or an error status
export const pollOrderStatus = async (orderId, maxAttempts = 30, interval = 2000) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await getOrderById(orderId);
      const order = response.data;

      // Return if order reaches CONFIRMED
      if (order.status === 'CONFIRMED') {
        return order;
      }

      // Return if order reaches an error status
      const errorStatuses = ['CANCELED', 'CANCELLATION_PENDING'];
      if (errorStatuses.includes(order.status)) {
        return order;
      }

      // Continue polling for other statuses (PAID, PREPARING, etc.)
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    } catch (error) {
      console.error('Error polling order status:', error);
      throw error;
    }
  }

  throw new Error('Order status polling timeout');
};

