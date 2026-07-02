import { OrderStatus } from './enums';

/**
 * Mock Orders
 */

export const mockOrders = [
  {
    id: 1001,
    userId: 1,
    date: "Today",
    time: "5:45",
    status: OrderStatus.CANCELED,
    totalPrice: 199,
    quantity: 30,
    image: "/images/bowl.png",
    createdAt: "2024-03-10T12:30:00Z",
    items: [
      { mealId: 1, name: "Chicken Salad", quantity: 1, price: 199.0 }
    ]
  },
  {
    id: 1002,
    userId: 1,
    date: "Sunday",
    time: "6:35",
    status: OrderStatus.READY,
    totalPrice: 199,
    quantity: 30,
    image: "/images/bowl.png",
    createdAt: "2024-04-15T18:45:00Z",
    items: [
      { mealId: 2, name: "Chicken Salad", quantity: 1, price: 199.0 },
      { mealId: 2, name: "Chicken Salad", quantity: 1, price: 199.0 },
      { mealId: 2, name: "Chicken Salad", quantity: 1, price: 199.0 },
      { mealId: 2, name: "Chicken Salad", quantity: 1, price: 199.0 },
    ]
  },
  {
    id: 1003,
    userId: 1,
    date: "Sunday",
    time: "5:45",
    status: OrderStatus.PREPARING,
    totalPrice: 199,
    quantity: 40,
    image: "/images/bowl.png",
    createdAt: "2024-03-15T19:00:00Z",
    items: [
      { mealId: 2, name: "Chicken Salad", quantity: 1, price: 199.0 }
    ]
  },
  {
    id: 1003,
    userId: 1,
    date: "Monday",
    time: "5:45",
    status: OrderStatus.PREPARING,
    totalPrice: 199,
    quantity: 40,
    image: "/images/bowl.png",
    createdAt: "2024-05-15T19:00:00Z",
    items: [
      { mealId: 2, name: "Chicken Salad", quantity: 1, price: 199.0 }
    ]
  }
];
