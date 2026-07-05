import { mockMeals } from "./meals";
import { mockOrders } from "./orders";
import { mockUsers, toClientProfileDto } from "./users";
import * as dash from "./dashboardMock";

/**
 * ============================================================
 * MOCK API HANDLERS
 * ============================================================
 */

const CURRENT_USER_ID = 1;
const currentUser = mockUsers.find((u) => u.id === CURRENT_USER_ID);
const MOCK_TOKEN = "mock-access-token-123";

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
      // auth response carries identity only — client-profile fields
      // belong to a different endpoint/service entirely
      const { age, gender, exercisesRegularly, height, heightUnit, weight,
        weightUnit, goal, healthConditions, phoneNumber, profilePictureUrl,
        loyaltyPoints, ...authUser } = user;
      return {
        status: 200,
        data: {
          token: MOCK_TOKEN,
          expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
          user: authUser,
        },
      };
    },
  },
  {
    method: "post",
    match: (url) => url.endsWith("/auth/signup"),
    handler: () => ({
      status: 200,
      data: { message: "User registered successfully." },
    }),
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
    handler: () => ({ status: 200, data: mockMeals.slice(0, 3) }),
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

  // ──────────────────────────────────────────────
  // ORDERS
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.endsWith("/api/client/history"),
    handler: () => ({
      status: 200,
      data: mockOrders,
    }),
  },
  {
    method: "get",
    match: (url) => url.match(/\/api\/order\/\d+/),
    handler: (config) => {
      const id = extractId(config.url);
      const order = mockOrders.find((o) => o.id === id);

      if (order) {
        if (order.status === "AWAITING_PAYMENT") {
          return {
            status: 200,
            data: { ...order, status: "CONFIRMED" }
          };
        }
        return { status: 200, data: order };
      }

      return { status: 404, data: { message: `Order ${id} not found` } };
    },
  },
  {
    method: "patch",
    match: (url) => url.match(/\/api\/order\/\d+/),
    handler: (config) => {
      const id = extractId(config.url);
      const order = mockOrders.find((o) => o.id === id);
      if (order) {
        order.status = "CANCELED";
        return { status: 200, data: order };
      }
      return { status: 404, data: { message: `Order ${id} not found` } };
    },
  },
  {
    method: "get",
    match: (url) => url.endsWith("/orders/my"),
    handler: () => ({
      status: 200,
      data: mockOrders.filter((o) => o.userId === CURRENT_USER_ID),
    }),
  },
  {
    method: "post",
    match: (url) => url.endsWith("/api/order"),
    handler: (config) => {
      const body = JSON.parse(config.data || "{}");
      const orderId = Date.now();

      if (body.paymentMethod === "credit_card") {
        return {
          status: 201,
          data: {
            id: orderId,
            clientId: CURRENT_USER_ID,
            status: "AWAITING_PAYMENT",
            stripeClientSecret: "pi_test_" + orderId + "_secret_" + orderId,
            stripePaymentIntentId: "pi_test_" + orderId,
            ...body,
          },
        };
      }

      return {
        status: 201,
        data: {
          id: orderId,
          clientId: CURRENT_USER_ID,
          status: "PENDING",
          ...body,
        },
      };
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
          ...body,
        },
      };
    },
  },

  // ──────────────────────────────────────────────
  // USERS / CLIENT PROFILE
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.endsWith("/users/me"),
    handler: () => ({ status: 200, data: currentUser }),
  },
  {
    // GET /api/clients/profile/{id} — matches ClientProfileController.getProfile(),
    // which returns ClientProfileDto DIRECTLY (no wrapper, no name fields).
    // End-anchored ($) so this doesn't also match .../picture requests.
    method: "get",
    match: (url) => url.match(/\/api\/clients\/profile\/\d+$/),
    handler: (config) => {
      const id = extractId(config.url);
      const user = mockUsers.find((u) => u.id === id);
      const dto = toClientProfileDto(user);
      return dto
        ? { status: 200, data: dto }
        : { status: 404, data: { message: `Profile ${id} not found` } };
    },
  },
  {
    // PUT /api/clients/profile/{id} — used by updateUserProfile()
    method: "put",
    match: (url) => url.match(/\/api\/clients\/profile\/\d+$/),
    handler: (config) => {
      const id = extractId(config.url);
      const user = mockUsers.find((u) => u.id === id);
      const body = JSON.parse(config.data || "{}");
      Object.assign(user, body);
      return { status: 200, data: toClientProfileDto(user) };
    },
  },
  {
    // PATCH /api/clients/profile/{id}/picture — matches
    // uploadProfilePicture(). Returns { profilePictureUrl } only,
    // exactly like the real controller.
    method: "patch",
    match: (url) => url.match(/\/api\/clients\/profile\/\d+\/picture$/),
    handler: (config) => {
      const id = extractId(config.url);
      const user = mockUsers.find((u) => u.id === id);
      const fakeUrl = `https://i.pravatar.cc/150?u=${id}-${Date.now()}`;
      if (user) user.profilePictureUrl = fakeUrl;
      return { status: 200, data: { profilePictureUrl: fakeUrl } };
    },
  },
  {
    // DELETE /api/clients/profile/{id}/picture
    method: "delete",
    match: (url) => url.match(/\/api\/clients\/profile\/\d+\/picture$/),
    handler: (config) => {
      const id = extractId(config.url);
      const user = mockUsers.find((u) => u.id === id);
      if (user) user.profilePictureUrl = null;
      return { status: 204, data: null };
    },
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
  // DASHBOARD & OTHER (Kept for compatibility)
  // ──────────────────────────────────────────────
  {
    method: "get",
    match: (url) => url.endsWith("/loyalty/points"),
    handler: () => ({ status: 200, data: { points: 420, tier: "Gold" } }),
  },
];

export const resolveMockHandler = (config) => {
  const method = config.method?.toLowerCase();
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