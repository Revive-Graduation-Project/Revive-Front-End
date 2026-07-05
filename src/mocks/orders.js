import { OrderStatus } from "./enums";

/**
 * Mock Orders
 */

export const mockOrders = [
  {
    id: 9007199254740991,
    clientId: 9007199254740991,
    status: "PREPARING",
    totalPrice: 17.99,
    discount: 10,
    createdAt: "2026-07-03T00:00:00.000Z",
    stripeClientSecret: "string",
    stripePaymentIntentId: "string",
    items: [
      {
        id: 1,
        mealId: 1,
        snapshotName: "Chicken Salad",
        snapshotPrice: 19.99,
        imageUrl: "/images/bowl.png",
        quantity: 1,
      },
    ],
  },
  {
    id: 900719954740981,
    clientId: 9007199254740992,
    status: "READY",
    totalPrice: 19.99,
    discount: 0,
    createdAt: "2026-07-03T00:00:00.000Z",
    stripeClientSecret: "string",
    stripePaymentIntentId: "string",
    items: [
      {
        id: 1,
        mealId: 1,
        snapshotName: "Chicken Salad",
        snapshotPrice: 19.99,
        imageUrl: "/images/bowl.png",
        quantity: 1,
      },
    ],
  },
  {
    id: 900719925440991,
    clientId: 9007199254740991,
    status: "CANCELED",
    totalPrice: 19.99,
    discount: 0,
    createdAt: "2024-03-10T12:30:00Z",
    stripeClientSecret: "string",
    stripePaymentIntentId: "string",
    items: [
      {
        id: 1,
        mealId: 1,
        snapshotName: "Chicken Salad",
        snapshotPrice: 19.99,
        imageUrl: "/images/bowl.png",
        quantity: 1,
      },
    ],
  },
  {
    id: 90071994740991,
    clientId: 9007199254740991,
    status: "CANCELED",
    totalPrice: 19.99,
    discount: 0,
    createdAt: "2024-03-10T12:30:00Z",
    stripeClientSecret: "string",
    stripePaymentIntentId: "string",
    items: [
      {
        id: 1,
        mealId: 1,
        snapshotName: "Chicken Salad",
        snapshotPrice: 19.99,
        imageUrl: "/images/bowl.png",
        quantity: 1,
      },
    ],
  },

  {
    id: 90079254740992,
    clientId: 9007199254740993,
    status: "READY",
    totalPrice: 79.96,
    discount: 0,
    createdAt: "2024-04-15T18:45:00Z",
    stripeClientSecret: "string",
    stripePaymentIntentId: "string",
    items: [
      {
        id: 2,
        mealId: 2,
        snapshotName: "Chicken Salad",
        snapshotPrice: 19.99,
        imageUrl: "/images/bowl.png",
        quantity: 4,
      },
    ],
  },
  {
    id: 9009254740993,
    clientId: 9007199254740994,
    status: "PREPARING",
    totalPrice: 49.99,
    discount: 5,
    createdAt: "2024-03-15T19:00:00Z",
    stripeClientSecret: "string",
    stripePaymentIntentId: "string",
    items: [
      {
        id: 3,
        mealId: 3,
        snapshotName: "Beef Bowl",
        snapshotPrice: 24.99,
        imageUrl: "/images/bowl.png",
        quantity: 1,
      },
      {
        id: 4,
        mealId: 3,
        snapshotName: "Beef Bowl",
        snapshotPrice: 24.99,
        imageUrl: "/images/bowl.png",
        quantity: 1,
      },
    ],
  },
  {
    id: 9007254740994,
    clientId: 9007199254740995,
    status: "PENDING",
    totalPrice: 45.98,
    discount: 0,
    createdAt: "2024-05-15T19:00:00Z",
    stripeClientSecret: "string",
    stripePaymentIntentId: "string",
    items: [
      {
        id: 4,
        mealId: 4,
        snapshotName: "Salmon Bowl",
        snapshotPrice: 22.99,
        imageUrl: "/images/bowl.png",
        quantity: 2,
      },
    ],
  },
];
