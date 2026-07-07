/**
 * Dashboard Response Mappers
 * ─────────────────────────────────────────────────────────────────
 * This layer maps raw backend API responses into the exact shape
 * expected by the UI components (the UI models).
 * This ensures that if the backend changes its DTO structure,
 * only these mappers need to be updated, keeping the UI safe.
 */
import { parseNutrients } from "../../utils/nutrients";

// ── Dashboard Overview Mappers ─────────────────────────────────────

export const mapDashboardMetrics = (data) => ({
  totalOrders: {
    value: data.totalOrders?.value || 0,
    change: data.totalOrders?.change || 0,
    trend: data.totalOrders?.trend || "up",
  },
  totalCustomers: {
    value: data.totalCustomers?.value || 0,
    change: data.totalCustomers?.change || 0,
    trend: data.totalCustomers?.trend || "down",
  },
  totalRevenue: {
    value: data.totalRevenue?.value || 0,
    change: data.totalRevenue?.change || 0,
    trend: data.totalRevenue?.trend || "up",
  },
});

export const mapRevenueData = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    month: item.month || "",
    income: item.income || 0,
    revenue: item.revenue || 0,
    expense: item.expense || 0,
  }));
};

export const mapTopCategories = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    name: item.name || "",
    value: item.value || 0,
    color: item.color || "#000",
  }));
};

export const mapOrdersOverview = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    day: item.day || "",
    orders: item.orders || 0,
    highlight: !!item.highlight,
  }));
};

export const mapOrderTypes = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    name: item.name || "",
    percentage: item.percentage || 0,
    count: item.count || 0,
    color: item.color || "#000",
  }));
};

export const mapTrendingMenus = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id || item._id,
    name: item.name || "",
    rating: item.rating || 0,
    orders: item.orders || 0,
    revenue: item.revenue || 0,
    image: item.imageUrl || item.image || "",
    imageUrl: item.imageUrl || item.image || "",
  }));
};

export const mapRecentActivity = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id || item._id,
    user: item.user || "",
    role: item.role || "",
    action: item.action || "",
    time: item.time || "",
    avatar: item.avatar || "",
  }));
};

// ── Orders Mappers ────────────────────────────────────────────────

export const mapOrdersMetrics = (data) => ({
  totalOrders: data.totalOrders || 0,
  totalOrdersChange: data.totalOrdersChange ?? 0,
  preparing: data.preparing || 0,
  preparingChange: data.preparingChange ?? 0,
  completed: data.completed || 0,
  completedChange: data.completedChange ?? 0,
  dailyGoal: {
    salesCurrent: data.dailyGoal?.salesCurrent || 0,
    salesTarget: data.dailyGoal?.salesTarget || 5000,
    ordersCurrent: data.dailyGoal?.ordersCurrent || 0,
    ordersTarget: data.dailyGoal?.ordersTarget || 100,
  },
});

export const mapOrders = (data) => {
  // Handle both plain array and { orders, total, pages } shapes
  const list = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []);
  return list.map((item) => ({
    id: item.id || item._id || "",
    time: item.time || "",
    name: item.name || "",
    items: item.items || 0,
    total: item.total || 0,
    customer: item.customer || "",
    status: item.status || "Pending",
  }));
};

/**
 * mapOrderResponse
 * Maps the real OrderResponse from the Order Service (POST /api/order, GET /api/order/:id).
 *
 * Real status enum: PENDING | AWAITING_PAYMENT | PAID | CONFIRMED | CANCELLED | READY_FOR_PICKUP
 */
export const ORDER_STATUS_LABELS = {
  PENDING:            "Pending",
  AWAITING_PAYMENT:   "Awaiting Payment",
  PAID:               "Paid",
  CONFIRMED:          "Confirmed",
  CANCELLED:          "Cancelled",
  READY_FOR_PICKUP:   "Ready for Pickup",
};

export const mapOrderResponse = (data) => ({
  id:                 data.id,
  customerId:         data.customerId,
  status:             data.status || "PENDING",
  statusLabel:        ORDER_STATUS_LABELS[data.status || "PENDING"] ?? (data.status || "PENDING"),
  totalPrice:         data.totalPrice || 0,
  discount:           data.discount   || 0,
  createdAt:          data.createdAt  || null,
  // Stripe client secret — pass to Stripe.js to collect payment
  stripeClientSecret: data.stripeClientSecret || null,
  items: Array.isArray(data.items)
    ? data.items.map((item) => ({
        id:            item.id,
        mealId:        item.mealId,
        name:          item.snapshotName  || "",
        price:         item.snapshotPrice || 0,
        quantity:      item.quantity      || 1,
      }))
    : [],
});


// ── Live Kitchen Mappers ──────────────────────────────────────────

export const mapKitchenOrders = (data) => {
  const defaultBoards = { queue: [], preparing: [], ready: [], done: [] };
  if (!data) return defaultBoards;

  const mapOrder = (o) => ({
    id: o.id || o._id || "",
    time: o.time || "",
    items: Array.isArray(o.items) ? o.items : [],
    notes: o.notes || "",
    customer: o.customer || "",
    startedAt: o.startedAt || null,
    readyAt: o.readyAt || null,
  });

  return {
    queue: Array.isArray(data.queue) ? data.queue.map(mapOrder) : [],
    preparing: Array.isArray(data.preparing) ? data.preparing.map(mapOrder) : [],
    ready: Array.isArray(data.ready) ? data.ready.map(mapOrder) : [],
    done: Array.isArray(data.done) ? data.done.map(mapOrder) : [],
  };
};

// ── Menu / Chef Mappers ───────────────────────────────────────────

export const mapMenuCategories = (data) => {
  // Support both array (legacy) and { totalChange, items[] } (new shape)
  const items = Array.isArray(data) ? data : (data?.items || []);
  const totalChange = Array.isArray(data) ? 0 : (data?.totalChange ?? 0);
  const totalPercentage = Array.isArray(data) ? 100 : (data?.totalPercentage ?? 100);
  return {
    totalChange,
    totalPercentage,
    items: items.map((cat) => ({
      name: cat.name || "",
      percentage: cat.percentage || 0,
      count: cat.count || 0,
      color: cat.color || "#000",
      change: cat.change ?? 0,
    })),
  };
};

const formatGram = (val) => {
  if (val === undefined || val === null || val === "") return "0g";
  if (typeof val === "string") return val.endsWith("g") ? val : `${val}g`;
  return `${val}g`;
};

const getValidNutrient = (parsedVal, fallbackVal) => {
  if (parsedVal !== undefined && parsedVal !== null && parsedVal !== 0 && parsedVal !== "0" && parsedVal !== "0g" && parsedVal !== "") {
    return parsedVal;
  }
  return fallbackVal;
};

export const mapMenuItems = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const parsed = parseNutrients(item.nutrients || []);
    const calVal = getValidNutrient(parsed.calories, item.calories) || 0;
    const proVal = getValidNutrient(parsed.protein, item.protein);
    const fatVal = getValidNutrient(parsed.fat, item.fat);
    const sugVal = getValidNutrient(parsed.sugar, item.sugar);

    const rawIngs = Array.isArray(item.ingredients) ? item.ingredients : (item.mealIngredients || []);
    const normIngs = rawIngs.map((ing, idx) => {
      if (typeof ing !== "object" || ing === null) {
        return { id: idx + 1, name: String(ing), amount: "0g", unit: "g" };
      }
      const name = ing.name || ing.ingredient?.name || ing.ingredientName || ing.snapshotName || "Ingredient";
      const rawAmt = ing.amount !== undefined ? ing.amount : (ing.quantityGrams !== undefined ? ing.quantityGrams : (ing.quantity !== undefined ? ing.quantity : "0"));
      const unit = ing.unit || "g";
      const amount = typeof rawAmt === "string" && rawAmt.endsWith(unit) ? rawAmt : `${rawAmt}${unit}`;
      const idVal = ing.id || ing.ingredientId || ing.ingredient?.id || (idx + 1);
      const ingredientIdVal = ing.ingredientId || ing.ingredient?.id || (typeof ing.id === "number" && ing.id < 10000000000 ? ing.id : undefined);

      return {
        ...ing,
        id: idVal,
        ingredientId: ingredientIdVal,
        name: String(name).trim(),
        amount,
        quantity: parseFloat(rawAmt) || 0,
        unit,
      };
    });

    return {
      id: item.id || item._id,
      name: item.name || "",
      category: item.category || "",
      price: item.price || 0,
      calories: calVal,
      protein: formatGram(proVal),
      fat: formatGram(fatVal),
      sugar: formatGram(sugVal),
      rating: item.rating || 0,
      status: item.isActive !== undefined ? (item.isActive ? "Active" : "Inactive") : (item.status || "Active"),
      image: item.imageUrl || item.image || null,
      imageUrl: item.imageUrl || item.image || null,
      description: item.description || "",
      hasDiscount: item.hasDiscount || false,
      discountPercentage: item.discountPercentage || 0,
      nutrients: item.nutrients || [],
      mealIngredients: normIngs,
      ingredients: normIngs,
    };
  });
};

// ── Ingredients Mappers ───────────────────────────────────────────

/**
 * Maps real IngredientDTO from GET /api/ingredients.
 * Only maps fields that actually exist in the backend response.
 */
const extractStock = (item) => {
  if (item === null || item === undefined || typeof item !== "object") return 0;

  // List of candidate keys in priority order
  const candidateKeys = [
    "quantity", "quantityGrams", "stockQuantity", "currentStock", "stockGrams", 
    "amount", "availableStock", "totalStock", "inStock", "stockAmount", 
    "inventory", "stock", "count", "onHand", "total", "balance", "weight", "units", "value", "stock"
  ];

  // First, look for any candidate key that has a non-zero valid value!
  for (const key of candidateKeys) {
    const val = item[key];
    if (val !== undefined && val !== null && val !== "" && val !== 0 && val !== "0" && val !== "0g") {
      const num = Number(String(val).replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num) && num !== 0) return num;
    }
  }

  // Next, if all standard keys were 0 or missing, dynamically check any non-ID, non-string metadata key that is non-zero
  for (const key of Object.keys(item)) {
    const lk = key.toLowerCase();
    if (lk === "id" || lk === "_id" || lk.includes("name") || lk.includes("desc") || lk.includes("cat") || lk.includes("url") || lk.includes("img") || lk.includes("unit") || lk === "nutrients" || lk === "price" || lk === "cost") continue;
    const val = item[key];
    if (val !== undefined && val !== null && val !== "" && val !== 0 && val !== "0" && val !== "0g") {
      const num = Number(String(val).replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num) && num !== 0) return num;
    }
  }

  // Finally, fallback to item.stock if it was explicitly 0
  if (item.stock !== undefined && item.stock !== null) return Number(item.stock) || 0;
  return 0;
};

const extractUnit = (item) => {
  if (item === null || item === undefined || typeof item !== "object") return "g";
  return item.unit || item.unitName || item.stockUnit || item.measurementUnit || item.unitOfMeasure || "g";
};

export const mapIngredients = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const parsed = parseNutrients(Array.isArray(item.nutrients) ? item.nutrients : []);
    const calVal = getValidNutrient(parsed.calories, item.calories) || 0;
    const proVal = getValidNutrient(parsed.protein, item.protein);
    const fatVal = getValidNutrient(parsed.fat, item.fat);
    const sugVal = getValidNutrient(parsed.sugar, item.sugar);

    return {
      id:          item.id || item._id,
      name:        item.name        || item.ingredientName || "",
      category:    item.category || item.categoryName || "-",
      description: item.description || "",
      calories:    calVal,
      protein:     formatGram(proVal),
      fat:         formatGram(fatVal),
      sugar:       formatGram(sugVal),
      nutrients:   Array.isArray(item.nutrients) ? item.nutrients : [],
      stock:       extractStock(item),
      unit:        extractUnit(item),
      daysLeft:    item.daysLeft !== undefined ? Number(item.daysLeft) : (item.shelfLife !== undefined ? Number(item.shelfLife) : undefined),
      inSeason:    item.inSeason !== undefined ? Boolean(item.inSeason) : undefined,
    };
  });
};

export const mapIngredientsMetrics = (data) => ({
  total: data?.total || 0,
  totalChange: data?.totalChange ?? 0,
  lowStock: data?.lowStock || 0,
  lowStockChange: data?.lowStockChange ?? 0,
  outOfStock: data?.outOfStock || 0,
  outOfStockChange: data?.outOfStockChange ?? 0,
});

// ── Menu Uploads Mappers ──────────────────────────────────────────

export const mapMenuUploads = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((upload) => ({
    id: upload.id || upload._id,
    filename: upload.filename || "",
    date: upload.date || "",
    time: upload.time || "",
    added: upload.added || 0,
    updated: upload.updated || 0,
    status: upload.status || "Unknown",
  }));
};
