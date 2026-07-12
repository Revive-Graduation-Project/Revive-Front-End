import { api } from './api';

// 1. Create order
export const placeOrder = (data) => api.post('/api/orders', data);

// 2. Get user orders
export const getMyOrders = () => api.get('/api/orders/client/history');

// 3. Track order
export const getOrderById = (id) => api.get(`/api/orders/${id}`);

// 4. Cancel order  (PATCH /api/orders/{id}/status with status: CANCELED)
export const cancelOrder = (id) => api.patch(`/api/orders/${id}/status`, { status: "CANCELED" });

