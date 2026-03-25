import { mockMeals } from "./meals";
import { mockOrders } from "./orders";
import { mockUsers } from "./users";

/**
 * ============================================================
 * MOCK API HANDLERS
 * ============================================================
 * Maps URL patterns + HTTP methods to mock responses.
 *
 * Each handler receives the axios request config and returns:
 *   { status, data }
 *
 * HOW TO ADD A NEW MOCK:
 *   1. Add a new entry to MOCK_HANDLERS below
 *   2. Match the method + url pattern your service calls
 *   3. Return { status: 200, data: yourMockData }
 *
 * SWITCHING TO REAL API:
 *   Set VITE_USE_MOCK=false in .env — no service files need to change.
 * ============================================================
 */

// Simulated logged-in user (user id 1 from mockUsers)
const CURRENT_USER_ID = 1;
const currentUser = mockUsers.find((u) => u.id === CURRENT_USER_ID);

// Simulated auth tokens
const MOCK_TOKEN = "mock-access-token-123";

// Helper: find by id from URL e.g. /menu/3 -> id = 3
const extractId = (url) => {
  const parts = url.split("/");
  return parseInt(parts[parts.length - 1], 10);
};

export const MOCK_HANDLERS = [
  // ──────────────────────────────────────────────
  // AUTH
  // ──────────────────────────────────────────────
  {
    method: "post",
    match: (url) => url.endsWith("/auth/login"),
    handler: (config) => {
      const { email, password } = JSON.parse(config.data || "{}");
      const user = mockUsers.find((u) => u.email === email);
      if (!user || password !== "password123") {
        return { status: 401, data: { message: "Invalid credentials" } };
      }
      return {
        status: 200,
        data: {
          token: MOCK_TOKEN,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
          user,
        },
      };
    },
  },
  {
    method: "post",
    match: (url) => url.endsWith("/auth/register"),
    handler: (config) => {
      const body = JSON.parse(config.data || "{}");
      return {
        status: 201,
        data: {
          token: MOCK_TOKEN,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
          user: { id: 99, ...body, role: "CLIENT" },
        },
      };
    },
  },
  {
    method: "post",
    match: (url) => url.endsWith("/auth/logout"),
    handler: () => ({ status: 200, data: { message: "Logged out" } }),
  },
  {
    method: "post",
    match: (url) => url.endsWith("/auth/refresh"),
    handler: () => ({
      status: 200,
      data: {
        token: MOCK_TOKEN,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      },
    }),
  },

  // ──────────────────────────────────────────────
  // MENU
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.match(/\/menu\/recommendations\/\d+/),
    handler: () => ({
      status: 200,
      data: mockMeals.slice(0, 3), // first 3 meals as recommendations
    }),
  },
  {
    method: "get",
    match: (url) => url.match(/\/menu\/\d+/),
    handler: (config) => {
      const id = extractId(config.url);
      const meal = mockMeals.find((m) => m.id === id);
      return meal
        ? { status: 200, data: meal }
        : { status: 404, data: { message: `Meal ${id} not found` } };
    },
  },
  {
    method: "get",
    match: (url) => url.endsWith("/menu"),
    handler: () => ({
      status: 200,
      data: mockMeals.map((meal) => ({
        ...meal,
        finalPrice:
          meal.discountPercent > 0
            ? meal.price * (1 - meal.discountPercent / 100)
            : meal.price,
      })),
    }),
  },
  {
    method: "post",
    match: (url) => url.endsWith("/menu"),
    handler: (config) => {
      const body = JSON.parse(config.data || "{}");
      return { status: 201, data: { id: Date.now(), ...body } };
    },
  },
  {
    method: "put",
    match: (url) => url.match(/\/menu\/\d+/),
    handler: (config) => {
      const id = extractId(config.url);
      const body = JSON.parse(config.data || "{}");
      const meal = mockMeals.find((m) => m.id === id);
      return meal
        ? { status: 200, data: { ...meal, ...body } }
        : { status: 404, data: { message: `Meal ${id} not found` } };
    },
  },
  {
    method: "delete",
    match: (url) => url.match(/\/menu\/\d+/),
    handler: () => ({ status: 200, data: { message: "Meal deleted" } }),
  },

  // Note: No /restaurants endpoints — this is a single-restaurant system.

  // ──────────────────────────────────────────────
  // ORDERS
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.endsWith("/orders/my"),
    handler: () => ({
      status: 200,
      data: mockOrders.filter((o) => o.userId === CURRENT_USER_ID),
    }),
  },
  {
    method: "get",
    match: (url) => url.match(/\/orders\/\d+/),
    handler: (config) => {
      const id = extractId(config.url);
      const order = mockOrders.find((o) => o.id === id);
      return order
        ? { status: 200, data: order }
        : { status: 404, data: { message: `Order ${id} not found` } };
    },
  },
  {
    method: "post",
    match: (url) => url.endsWith("/orders"),
    handler: (config) => {
      const body = JSON.parse(config.data || "{}");
      return {
        status: 201,
        data: {
          id: Date.now(),
          userId: CURRENT_USER_ID,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          ...body,
        },
      };
    },
  },
  {
    method: "patch",
    match: (url) => url.match(/\/orders\/\d+\/cancel/),
    handler: (config) => {
      const id = parseInt(config.url.split("/")[2], 10);
      const order = mockOrders.find((o) => o.id === id);
      return order
        ? { status: 200, data: { ...order, status: "CANCELED" } }
        : { status: 404, data: { message: `Order ${id} not found` } };
    },
  },

  // ──────────────────────────────────────────────
  // USERS
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.endsWith("/users/me/orders"),
    handler: () => ({
      status: 200,
      data: mockOrders.filter((o) => o.userId === CURRENT_USER_ID),
    }),
  },
  {
    method: "get",
    match: (url) => url.endsWith("/users/me"),
    handler: () => ({ status: 200, data: currentUser }),
  },
  {
    method: "put",
    match: (url) => url.endsWith("/users/me/health"),
    handler: (config) => {
      const body = JSON.parse(config.data || "{}");
      return {
        status: 200,
        data: { ...currentUser, profile: { ...currentUser?.profile, ...body } },
      };
    },
  },
  {
    method: "put",
    match: (url) => url.endsWith("/users/me"),
    handler: (config) => {
      const body = JSON.parse(config.data || "{}");
      return { status: 200, data: { ...currentUser, ...body } };
    },
  },

  // ──────────────────────────────────────────────
  // CHEF
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.endsWith("/chef/orders"),
    handler: () => ({
      status: 200,
      data: mockOrders.filter((o) => o.status === "PENDING"),
    }),
  },
  {
    method: "put",
    match: (url) => url.match(/\/chef\/orders\/\d+/),
    handler: (config) => {
      const id = extractId(config.url);
      const body = JSON.parse(config.data || "{}");
      const order = mockOrders.find((o) => o.id === id);
      return order
        ? { status: 200, data: { ...order, ...body } }
        : { status: 404, data: { message: `Order ${id} not found` } };
    },
  },
  {
    method: "put",
    match: (url) => url.match(/\/chef\/meals\/\d+\/availability/),
    handler: (config) => {
      const id = parseInt(config.url.split("/")[3], 10);
      const body = JSON.parse(config.data || "{}");
      const meal = mockMeals.find((m) => m.id === id);
      return meal
        ? { status: 200, data: { ...meal, ...body } }
        : { status: 404, data: { message: `Meal ${id} not found` } };
    },
  },

  // ──────────────────────────────────────────────
  // LOYALTY
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.endsWith("/loyalty/points"),
    handler: () => ({ status: 200, data: { points: 420, tier: "Gold" } }),
  },
  {
    method: "post",
    match: (url) => url.match(/\/loyalty\/redeem\//),
    handler: () => ({
      status: 200,
      data: { message: "Reward redeemed", pointsRemaining: 320 },
    }),
  },
];

/**
 * Find the right handler for an axios request config.
 * @param {object} config - Axios request config
 * @returns {{ status, data } | null}
 */
export const resolveMockHandler = (config) => {
  const method = config.method?.toLowerCase();
  // Extract the path portion only (strip base URL)
  const url = config.url?.replace(/^https?:\/\/[^/]+/, "") || "";

  const handler = MOCK_HANDLERS.find(
    (h) => h.method === method && h.match(url),
  );

  if (!handler) {
    console.warn(`[MOCK] No handler found for ${method?.toUpperCase()} ${url}`);
    return {
      status: 404,
      data: {
        message: `Mock not implemented: ${method?.toUpperCase()} ${url}`,
      },
    };
  }

  return handler.handler({ ...config, url });
};
