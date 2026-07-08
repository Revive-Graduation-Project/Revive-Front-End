import { api } from './api';

// 1. Create order
export const placeOrder = (data) => api.post('/orders', data);

// 2. Get user orders
export const getMyOrders = () => api.get('/orders/my');

// 3. Track order
export const getOrderById = (id) => api.get(`/orders/${id}`);

// 4. Cancel order
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);

