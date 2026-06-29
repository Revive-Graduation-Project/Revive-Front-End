/**
 * Dashboard Response Mappers
 * ─────────────────────────────────────────────────────────────────
 * This layer maps raw backend API responses into the exact shape
 * expected by the UI components (the UI models).
 * This ensures that if the backend changes its DTO structure,
 * only these mappers need to be updated, keeping the UI safe.
 */

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
    image: item.image || "",
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

export const mapMenuItems = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id || item._id,
    name: item.name || "",
    category: item.category || "",
    price: item.price || 0,
    calories: item.calories || 0,
    protein: item.protein || "0g",
    fat: item.fat || "0g",
    sugar: item.sugar || "0g",
    rating: item.rating || 0,
    status: item.status || "Active",
    image: item.image || null,
  }));
};

// ── Ingredients Mappers ───────────────────────────────────────────

export const mapIngredientsMetrics = (data) => ({
  total: data.total || 0,
  totalChange: data.totalChange ?? 0,
  lowStock: data.lowStock || 0,
  lowStockChange: data.lowStockChange ?? 0,
  outOfStock: data.outOfStock || 0,
  outOfStockChange: data.outOfStockChange ?? 0,
});

export const mapIngredients = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id || item._id,
    name: item.name || "",
    emoji: item.emoji || "🥦",
    image: item.image || "",
    category: item.category || "",
    fat: item.fat || "",
    calories: item.calories || "",
    protein: item.protein || "",
    sugar: item.sugar || "",
    stock: item.stock || 0,
    unit: item.unit || "unit",
    costPerUnit: item.costPerUnit || "$0.00",
    status: item.status || "In Stock",
  }));
};

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
