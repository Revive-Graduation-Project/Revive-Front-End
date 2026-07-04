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

// Poll order status until it's no longer AWAITING_PAYMENT
export const pollOrderStatus = async (orderId, maxAttempts = 30, interval = 2000) => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await getOrderById(orderId);
      const order = response.data;
      
      // If order is no longer AWAITING_PAYMENT, return it
      if (order.status !== 'AWAITING_PAYMENT') {
        return order;
      }
      
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

