import { mockMeals } from "./meals";
import { mockOrders } from "./orders";
import { mockUsers } from "./users";
import * as dash from "./dashboardMock";

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
      const newOrderId = Date.now();
      const newOrder = {
        id: newOrderId,
        userId: CURRENT_USER_ID,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        ...body,
      };

      // Push to Live Kitchen Queue mock
      if (!dash.mockKitchenOrders.queue) dash.mockKitchenOrders.queue = [];
      const shortId = `#${newOrderId.toString().slice(-5)}`;
      const kitchenEntry = {
        id: shortId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: body.items?.map(i => `${i.name} x${i.quantity}`) || [],
        notes: body.note || "",
        customer: currentUser?.name || "Guest"
      };
      dash.mockKitchenOrders.queue.push(kitchenEntry);
      dash.saveMock("kitchenOrders", dash.mockKitchenOrders);
      console.log('[MOCK] POST /orders — pushed to kitchen queue:', kitchenEntry);
      console.log('[MOCK] kitchen queue is now:', dash.mockKitchenOrders.queue.length, 'items');

      // Push to Dashboard Orders mock
      if (dash.mockOrders) {
        dash.mockOrders.unshift({
          id: shortId,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: body.items?.map(i => i.quantity > 1 ? `${i.name} (x${i.quantity})` : i.name).join(', ') || "Custom Order",
          items: body.items?.length || 0,
          total: body.finalTotal || body.totalAmount,
          customer: currentUser?.name || "Guest",
          status: "Preparing"
        });
        dash.saveMock("orders", dash.mockOrders);
      }

      return {
        status: 201,
        data: newOrder,
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

  // ──────────────────────────────────────────────
  // DASHBOARD OVERVIEW
  // ──────────────────────────────────────────────
  { method: "get", match: (url) => url.endsWith("/dashboard/metrics"),         handler: () => ({ status: 200, data: dash.mockMetrics          }) },
  { method: "get", match: (url) => url.includes("/dashboard/revenue"),         handler: () => ({ status: 200, data: dash.mockRevenueData       }) },
  { method: "get", match: (url) => url.endsWith("/dashboard/categories"),      handler: () => ({ status: 200, data: dash.mockTopCategories     }) },
  { method: "get", match: (url) => url.includes("/dashboard/orders-overview"), handler: () => ({ status: 200, data: dash.mockOrdersOverview    }) },
  { method: "get", match: (url) => url.endsWith("/dashboard/order-types"),     handler: () => ({ status: 200, data: dash.mockOrderTypes        }) },
  { method: "get", match: (url) => url.endsWith("/dashboard/trending-menus"),  handler: () => ({ status: 200, data: dash.mockTrendingMenus     }) },
  { method: "get", match: (url) => url.endsWith("/dashboard/inventory-alerts"),handler: () => ({ status: 200, data: dash.mockInventoryAlerts   }) },
  { method: "get", match: (url) => url.endsWith("/dashboard/activity"),        handler: () => ({ status: 200, data: dash.mockRecentActivity    }) },
  { method: "get", match: (url) => url.endsWith("/dashboard/reviews"),         handler: () => ({ status: 200, data: dash.mockCustomerReviews   }) },

  // ──────────────────────────────────────────────
  // DASHBOARD ORDERS
  // ──────────────────────────────────────────────
  { method: "get",   match: (url) => url.endsWith("/dashboard/orders/metrics"), handler: () => ({ status: 200, data: dash.mockOrdersMetrics }) },
  { method: "get",   match: (url) => url.includes("/dashboard/orders") && !url.includes("metrics"), handler: () => {
    // Read directly from localStorage to ensure cross-tab sync
    const saved = localStorage.getItem("mock_orders");
    const orders = saved ? JSON.parse(saved) : dash.mockOrders;
    return { status: 200, data: { orders, total: orders.length, pages: 1 } };
  }},
  { method: "patch", match: (url) => url.match(/\/dashboard\/orders\/.+\/status/), handler: (config) => {
    const body = JSON.parse(config.data || "{}");
    return { status: 200, data: { success: true, status: body.status } };
  }},

  // ──────────────────────────────────────────────
  // KITCHEN
  // ──────────────────────────────────────────────
  { method: "get",   match: (url) => url.endsWith("/kitchen/orders"), handler: () => {
    const saved = localStorage.getItem("mock_kitchenOrders");
    const kitchenOrders = saved ? JSON.parse(saved) : dash.mockKitchenOrders;
    return { status: 200, data: kitchenOrders };
  }},
  { method: "patch", match: (url) => url.match(/\/kitchen\/orders\/.+\/status/), handler: (config) => {
    const parts = config.url.split("/");
    const orderId = decodeURIComponent(parts[parts.length - 2]);
    const { status } = JSON.parse(config.data || "{}");
    
    // Load fresh from localStorage
    const saved = localStorage.getItem("mock_kitchenOrders");
    const kitchenOrders = saved ? JSON.parse(saved) : dash.mockKitchenOrders;
    
    let orderToMove = null;
    ["queue", "preparing", "ready", "done"].forEach((col) => {
      if (!kitchenOrders[col]) kitchenOrders[col] = [];
      const idx = kitchenOrders[col].findIndex((o) => o.id === orderId || o.id === `#${orderId}` || `#${o.id}` === orderId);
      if (idx !== -1) {
        orderToMove = kitchenOrders[col].splice(idx, 1)[0];
      }
    });

    if (orderToMove && status) {
      if (!kitchenOrders[status]) kitchenOrders[status] = [];
      if (status === "done") {
        kitchenOrders[status].unshift(orderToMove);
      } else {
        kitchenOrders[status].push(orderToMove);
      }
    }
    
    // Save back to localStorage so it persists
    dash.saveMock("kitchenOrders", kitchenOrders);
    
    // Synchronize with Dashboard Orders list
    const savedOrders = localStorage.getItem("mock_orders");
    if (savedOrders) {
      const ordersArray = JSON.parse(savedOrders);
      // Kitchen ID might have a '#' prefix, strip it if necessary to match Orders list ID
      const targetId = orderId.startsWith('#') ? orderId : `#${orderId}`;
      const orderInList = ordersArray.find(o => o.id === targetId || o.id === orderId);
      
      if (orderInList) {
        // Map kitchen status (queue, preparing, ready, done) to Title Case (Preparing, Ready, Done)
        const mappedStatus = status.charAt(0).toUpperCase() + status.slice(1);
        orderInList.status = mappedStatus === "Queue" ? "Pending" : mappedStatus;
        dash.saveMock("orders", ordersArray);
      }
    }
    
    return { status: 200, data: { success: true } };
  } },

  // ──────────────────────────────────────────────
  // MENU MANAGEMENT (uploads)
  // ──────────────────────────────────────────────
  { method: "get",  match: (url) => url.endsWith("/menu/uploads"), handler: () => ({ status: 200, data: dash.mockMenuUploads }) },
  { method: "post", match: (url) => url.endsWith("/menu/upload"),  handler: (config) => {
    const now = new Date();
    const dateStr = `${now.getDate()} ${now.toLocaleString("en", { month: "short" })} ${now.getFullYear()}`;
    const timeStr = now.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
    const newUpload = {
      id: Date.now(),
      filename: config.headers?.["X-File-Name"] || "Uploaded_file.xlsx",
      date: dateStr,
      time: timeStr,
      added: Math.floor(Math.random() * 30) + 1,
      updated: Math.floor(Math.random() * 10),
      status: "Success",
    };
    dash.mockMenuUploads.unshift(newUpload);
    return { status: 201, data: newUpload };
  }},

  // ──────────────────────────────────────────────
  // MENU (Chef Menu page)
  // ──────────────────────────────────────────────
  { method: "get",    match: (url) => url.endsWith("/menu/categories"),       handler: () => ({ status: 200, data: dash.mockMenuCategories }) },
  { method: "get",    match: (url) => url.includes("/menu/items") && !url.match(/\/menu\/items\/\d+/), handler: () => ({ status: 200, data: dash.mockMenuItems }) },
  { method: "post",   match: (url) => url.endsWith("/menu/items"),            handler: (config) => {
    const body = JSON.parse(config.data || "{}");
    const newItem = {
      id: Date.now(),
      name: body.name || "Unnamed Meal",
      image: body.image || "",
      category: body.category || "Mixed",
      price: parseFloat(body.price) || 0,
      calories: body.calories || "0g",
      protein: body.protein || "0g",
      fat: body.fat || "0g",
      sugar: body.sugar || "0g",
      rating: 0,
      status: "Active"
    };
    dash.mockMenuItems.push(newItem);
    return { status: 201, data: newItem };
  }},
  { method: "patch",  match: (url) => url.match(/\/menu\/items\/\d+/),        handler: (config) => {
    const body = JSON.parse(config.data || "{}");
    const id = parseInt(config.url?.match(/\/menu\/items\/(\d+)/)?.[1]);
    const idx = dash.mockMenuItems.findIndex(i => i.id === id);
    if (idx !== -1) dash.mockMenuItems[idx] = { ...dash.mockMenuItems[idx], ...body };
    return { status: 200, data: idx !== -1 ? dash.mockMenuItems[idx] : body };
  }},
  { method: "delete", match: (url) => url.match(/\/menu\/items\/\d+/),        handler: (config) => {
    const id = parseInt(config.url?.match(/\/menu\/items\/(\d+)/)?.[1]);
    const idx = dash.mockMenuItems.findIndex(i => i.id === id);
    if (idx !== -1) dash.mockMenuItems.splice(idx, 1);
    return { status: 200, data: { message: "Deleted" } };
  }},

  // ──────────────────────────────────────────────
  // RECIPE BUILDER
  // ──────────────────────────────────────────────
  { method: "get",  match: (url) => url.endsWith("/recipes/ingredients"), handler: () => ({ status: 200, data: dash.mockRecipeIngredients }) },
  { method: "post", match: (url) => url.endsWith("/recipes"),             handler: (config) => {
    const body = JSON.parse(config.data || "{}");
    const newItem = {
      id: Date.now(),
      name: body.name || "Unnamed Meal",
      category: body.category || "Mixed",
      price: parseFloat(body.price) || 0,
      calories: parseInt(body.calories) || 0,
      protein: body.protein || "0g",
      fat: body.fat || "0g",
      sugar: body.sugar || "0g",
      rating: 0,
      status: "Active"
    };
    dash.mockMenuItems.push(newItem);
    return { status: 201, data: newItem };
  }},

  // ──────────────────────────────────────────────
  // MENU MANAGEMENT
  // ──────────────────────────────────────────────
  { method: "get",  match: (url) => url.endsWith("/menu/uploads"), handler: () => ({ status: 200, data: dash.mockMenuUploads }) },
  { method: "post", match: (url) => url.endsWith("/menu/upload"),  handler: () => ({ status: 200, data: { success: true, itemsImported: 42 } }) },

  // ──────────────────────────────────────────────
  // INGREDIENTS
  // ──────────────────────────────────────────────
  { method: "get",    match: (url) => url.endsWith("/ingredients/metrics"),             handler: () => ({ status: 200, data: dash.mockIngredientsMetrics }) },
  { method: "get",    match: (url) => url.includes("/ingredients") && !url.includes("metrics") && !url.match(/\/ingredients\/\d+/), handler: () => ({ status: 200, data: dash.mockIngredients }) },
  { method: "post",   match: (url) => url.endsWith("/ingredients"),                     handler: (config) => {
    const body = JSON.parse(config.data || "{}");
    const newIngredient = { id: Date.now(), ...body };
    dash.mockIngredients.push(newIngredient);
    return { status: 201, data: newIngredient };
  }},
  { method: "patch",  match: (url) => url.match(/\/ingredients\/\d+/),                 handler: (config) => {
    const body = JSON.parse(config.data || "{}");
    const id = parseInt(config.url?.match(/\/ingredients\/(\d+)/)?.[1]);
    const idx = dash.mockIngredients.findIndex(i => i.id === id);
    if (idx !== -1) dash.mockIngredients[idx] = { ...dash.mockIngredients[idx], ...body };
    return { status: 200, data: idx !== -1 ? dash.mockIngredients[idx] : body };
  }},
  { method: "delete", match: (url) => url.match(/\/ingredients\/\d+/),                 handler: (config) => {
    const id = parseInt(config.url?.match(/\/ingredients\/(\d+)/)?.[1]);
    const idx = dash.mockIngredients.findIndex(i => i.id === id);
    if (idx !== -1) dash.mockIngredients.splice(idx, 1);
    return { status: 200, data: { message: "Deleted" } };
  }},
  { method: "post",   match: (url) => url.endsWith("/ingredients/upload"),              handler: () => ({ status: 200, data: { success: true, count: 15 } }) },
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
