import { OrderStatus } from './enums';

/**
 * Mock Orders
 */

export const mockOrders = [
  {
    id: 1001,
    userId: 1,
    status: OrderStatus.DELIVERED,
    totalPrice: 15.99,
    createdAt: "2024-03-10T12:30:00Z",
    items: [
      { mealId: 1, quantity: 1, price: 15.99 }
    ]
  },
  {
    id: 1002,
    userId: 1,
    status: OrderStatus.PENDING,
    totalPrice: 18.50,
    createdAt: "2024-03-15T18:45:00Z",
    items: [
      { mealId: 2, quantity: 1, price: 18.50 }
    ]
  }
];
