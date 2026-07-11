/**
 * Dashboard Response Mappers
 * ─────────────────────────────────────────────────────────────────
 * This layer maps raw backend API responses into the exact shape
 * expected by the UI components (the UI models).
 * This ensures that if the backend changes its DTO structure,
 * only these mappers need to be updated, keeping the UI safe.
 */
import { parseNutrients } from "../../utils/nutrients";
import { inferIngredientUnit } from "../../utils/stockUtils";

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

export const mapOrderTypes = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    name: item.name || "",
    percentage: item.percentage || 0,
    count: item.count || 0,
    color: item.color || "#000",
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
    salesCurrent: data.dailyGoal?.salesCurrent ?? data.salesCurrent ?? 0,
    salesTarget: data.dailyGoal?.salesTarget ?? data.salesTarget ?? 10000,
    ordersCurrent: data.dailyGoal?.ordersCurrent ?? data.ordersCurrent ?? 0,
    ordersTarget: data.dailyGoal?.ordersTarget ?? data.ordersTarget ?? 200,
  },
});

export const mapOrders = (data) => {
  // Spring Page<OrderResponse>: { content: [...] }
  // Plain array fallback, or legacy { orders: [...] }
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
    ? data.content
    : Array.isArray(data?.orders)
    ? data.orders
    : [];

  // Backend status enum → UI display label
  const STATUS_MAP = {
    PENDING:            "Pending",
    AWAITING_PAYMENT:   "Pending",
    PAID:               "Pending",
    CONFIRMED:          "Preparing",
    PREPARING:          "Preparing",
    CANCELLED:          "Cancelled",
    READY_FOR_PICKUP:   "Ready",
    READY:              "Ready",
    COMPLETED:          "Done",
    DELIVERED:          "Done",
  };

  return list.map((item) => {
    const rawStatus = (item.status || "PENDING").toUpperCase();
    const status = STATUS_MAP[rawStatus] || rawStatus;

    // Build display name from first item snapshot
    const firstItem = Array.isArray(item.items) ? item.items[0] : null;
    const displayName = firstItem?.snapshotName || item.name || "Order";

    // Count total item quantity across all order lines
    const totalItems = Array.isArray(item.items)
      ? item.items.reduce((s, i) => s + (i.quantity || 1), 0)
      : (typeof item.items === "number" ? item.items : 0);

    // Format display time from ISO createdAt
    const createdAt = item.createdAt || null;
    const displayTime = createdAt
      ? new Date(createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      : (item.time || "");

    return {
      id:         `#${item.id || item._id || ""}`,
      time:       displayTime,
      name:       displayName,
      items:      totalItems,
      total:      item.totalPrice ?? item.total ?? 0,
      customer:   item.clientId ? `Client #${item.clientId}` : (item.customer || (item.customerDetails ? `${item.customerDetails.firstName || ""} ${item.customerDetails.lastName || ""}`.trim() : "")),
      phone:      item.phone || item.phoneNumber || item.customerDetails?.phone || item.customerPhone || item.user?.phone || item.customerDetails?.phoneNumber || "",
      address:    item.address || (item.customerDetails ? `${item.customerDetails.address || ""}, ${item.customerDetails.city || ""}` : "") || item.deliveryAddress || "",
      status,
      createdAt,  // preserve ISO for Revenue Chart / Orders Overview / Daily Goal
      orderItems: Array.isArray(item.items)
        ? item.items.map(i => ({
            mealId:   i.mealId,
            name:     i.snapshotName   || "",
            price:    i.snapshotPrice  || 0,
            image:    i.snapshotImageUrl || "",
            quantity: i.quantity       || 1,
          }))
        : [],
    };
  });
};

// ── Live Kitchen Mappers ──────────────────────────────────────────

export const mapKitchenOrders = (data) => {
  const defaultBoards = { queue: [], preparing: [], ready: [], done: [] };
  if (!data) return defaultBoards;

  const mapOrder = (o) => ({
    id: o.id || o._id || "",
    orderId: o.orderId || o.id || o._id || "",
    time: o.time || "",
    items: Array.isArray(o.items) ? o.items : [],
    notes: o.notes || "",
    customer: o.customer || (o.customerDetails ? `${o.customerDetails.firstName || ""} ${o.customerDetails.lastName || ""}`.trim() : ""),
    phone: o.phone || o.phoneNumber || o.customerDetails?.phone || o.customerPhone || "",
    address: o.address || (o.customerDetails ? `${o.customerDetails.address || ""}, ${o.customerDetails.city || ""}` : ""),
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

export const mapKitchenTickets = (list) => {
  if (!Array.isArray(list)) return [];
  const STATUS_MAP = {
    QUEUED:    "Queue",
    PREPARING: "Preparing",
    READY:     "Ready",
    DONE:      "Done",
    CANCELED:  "Cancelled",
    CANCELLED: "Cancelled",
  };
  return list.map(ticket => ({
    ...ticket,
    id: ticket.id || ticket._id || "",
    orderId: ticket.orderId || ticket.id || "",
    status: STATUS_MAP[(ticket.status || "").toUpperCase()] || ticket.status || "Queue",
    assignedChefId: ticket.assignedChefId ?? null,
    createdAt: ticket.createdAt || null,
  }));
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
      const rawUnit = ing.unit || "g";
      const unit = inferIngredientUnit(name, rawUnit);
      const cleanAmt = String(rawAmt).replace(/[^\d.]/g, "") || "0";
      const amount = typeof rawAmt === "string" && rawAmt.endsWith(unit)
        ? rawAmt
        : (unit === "pieces" || unit === "pcs" ? `${cleanAmt} ${unit}` : `${cleanAmt}${unit}`);
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
  const name = item?.name || item?.ingredientName || "";
  if (item === null || item === undefined || typeof item !== "object") return inferIngredientUnit(name, "g");
  const raw = item.unit || item.unitName || item.stockUnit || item.measurementUnit || item.unitOfMeasure || "g";
  return inferIngredientUnit(name, raw);
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
