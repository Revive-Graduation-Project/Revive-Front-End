/**
 * Dashboard Mock Data
 * ─────────────────────────────────────────────────────────────────
 * All data here mirrors the real backend response shape exactly.
 * Swap by setting VITE_USE_MOCK=false in .env — service files unchanged.
 */

// ── Dashboard Page ────────────────────────────────────────────────

const loadMock = (key, defaultData) => {
  const saved = localStorage.getItem(`mock_${key}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn(`[MOCK] Corrupted localStorage data for mock_${key}. Resetting.`);
      localStorage.removeItem(`mock_${key}`);
    }
  }
  localStorage.setItem(`mock_${key}`, JSON.stringify(defaultData));
  return defaultData;
};

export const saveMock = (key, data) => {
  localStorage.setItem(`mock_${key}`, JSON.stringify(data));
};

export const mockMetrics = loadMock("metrics", {
  totalOrders:    { value: 48652, change: 1.58,  trend: "up"   },
  totalCustomers: { value: 1248,  change: -0.48, trend: "down" },
  totalRevenue:   { value: 215.86,change: 1.58,  trend: "up"   },
});

export const mockRevenueData = [
  { month: "Mar", income: 120, revenue:  90, expense: 60 },
  { month: "Apr", income: 140, revenue: 110, expense: 70 },
  { month: "May", income: 130, revenue: 100, expense: 65 },
  { month: "Jun", income: 160, revenue: 130, expense: 80 },
  { month: "Jul", income: 150, revenue: 115, expense: 75 },
  { month: "Aug", income: 175, revenue: 140, expense: 85 },
  { month: "Sep", income: 165, revenue: 135, expense: 78 },
  { month: "Oct", income: 190, revenue: 155, expense: 90 },
];

export const mockTopCategories = [
  { name: "Chicken",     value: 40, color: "#F97316" },
  { name: "Seafood",     value: 30, color: "#FB923C" },
  { name: "Meat",        value: 24, color: "#FDBA74" },
  { name: "Mix Protein", value:  6, color: "#FED7AA" },
];

export const mockOrdersOverview = [
  { day: "Sat", orders: 180 },
  { day: "Sun", orders: 210 },
  { day: "Mon", orders: 160 },
  { day: "Tue", orders: 280, highlight: true },
  { day: "Wed", orders: 200 },
  { day: "Thu", orders: 190 },
  { day: "Fri", orders: 230 },
];

export const mockOrderTypes = [
  { name: "Dine-In",  percentage: 45, count:  900, color: "#F97316" },
  { name: "Takeaway", percentage: 30, count:  600, color: "#FB923C" },
  { name: "Online",   percentage: 25, count:  550, color: "#FED7AA" },
];

export const mockTrendingMenus = [
  { id: 1, name: "Chicken Delight", rating: 4.9, orders: 425, revenue: 25400, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=120&h=120&fit=crop" },
  { id: 2, name: "Italian Pizza",   rating: 4.7, orders: 325, revenue: 18400, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop" },
  { id: 3, name: "Classic Beef",    rating: 3.9, orders: 425, revenue: 11500, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop" },
];

export const mockInventoryAlerts = {
  lowStock:  [
    { id: 1, name: "Potatoes", image: "🥔" },
    { id: 2, name: "Pepper",   image: "🌶️" },
    { id: 3, name: "Onion",    image: "🧅" },
  ],
  shelfLife: [
    { id: 4, name: "Fish",         daysLeft: 1, image: "🐟" },
    { id: 5, name: "Tomato Sauce", daysLeft: 2, image: "🍅" },
  ],
  inSeason:  [
    { id: 6, name: "Corn",    image: "🌽" },
    { id: 7, name: "Avocado", image: "🥑" },
  ],
};

export const mockRecentActivity = [
  { id: 1, user: "Basmala Mohamad", role: "Inventory Manager", action: 'Updated Inventory: 15 units of "Organic Chicken Breast"', time: "11:20 AM", avatar: "BM" },
  { id: 2, user: "Omar Mostafa",    role: "Kitchen Admin",      action: "Marked Order #38/51C as Completed",                       time: "4:35 PM",  avatar: "OM" },
  { id: 3, user: "Ahmed Raffat",    role: "Receptionist",       action: "Added new reservation for 4 guests at 7:00 PM",           time: "10:39 AM", avatar: "AR" },
];

export const mockCustomerReviews = [
  { id: 1, name: "Sarah Maher",  rating: 5, date: "Oct 12 / 2026", text: "This pasta is my favourite dish I have ever tried. Highly recommended!", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop" },
  { id: 2, name: "Nour Mahmoud", rating: 4, date: "Oct 12 / 2026", text: "Amazing food and great atmosphere. Will definitely come back for more!",    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop" },
  { id: 3, name: "Ali Hassan",   rating: 5, date: "Oct 11 / 2026", text: "Best restaurant in the city. The Chicken Delight is absolutely divine.",   image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop" },
];

// ── Orders Page ───────────────────────────────────────────────────

export const mockOrdersMetrics = loadMock("ordersMetrics", {
  totalOrders: 640,
  totalOrdersChange: 1.58,
  preparing:   12,
  preparingChange: -0.48,
  completed:   628,
  completedChange: 1.58,
  dailyGoal:   { 
    salesCurrent: 4250, 
    salesTarget: 5000,
    ordersCurrent: 65,
    ordersTarget: 100
  },
});

export const mockOrders = loadMock("orders", [
  { id: "#58B1D", time: "4:20 PM", name: "Chicken Delight",    items: 3, total: 45.50,  customer: "Sara Ahmed",   status: "Preparing" },
  { id: "#58B1E", time: "4:35 PM", name: "Italian Pizza",      items: 2, total: 32.00,  customer: "Omar Ali",     status: "Ready"     },
  { id: "#58B1F", time: "4:50 PM", name: "Classic Beef",       items: 1, total: 28.99,  customer: "Lina Hassan",  status: "Done"      },
  { id: "#58B1G", time: "5:05 PM", name: "Avocado Glow Bowl",  items: 4, total: 62.00,  customer: "Ahmed Salem",  status: "Preparing" },
  { id: "#58B1H", time: "5:20 PM", name: "Grilled Salmon",     items: 2, total: 55.00,  customer: "Nour Khaled",  status: "Cancelled" },
  { id: "#58B1I", time: "5:35 PM", name: "Caesar Salad",       items: 1, total: 18.50,  customer: "Mona Sherif",  status: "Done"      },
  { id: "#58B1J", time: "5:50 PM", name: "Beef Burger",        items: 3, total: 41.00,  customer: "Karim Tarek",  status: "Ready"     },
  { id: "#58B1K", time: "6:05 PM", name: "Pasta Carbonara",    items: 2, total: 36.50,  customer: "Rana Youssef", status: "Preparing" },
]);

// ── Recipe Builder ────────────────────────────────────────────────

export const mockRecipeIngredients = [
  { id: 1, name: "Tomato",        amount: "240g", emoji: "🍅" },
  { id: 2, name: "Chicken Breast",amount: "350g", emoji: "🍗" },
  { id: 3, name: "Olive Oil",     amount: "30ml", emoji: "🫒" },
  { id: 4, name: "Garlic",        amount: "15g",  emoji: "🧄" },
];

// ── Chef Menu ─────────────────────────────────────────────────────

export const mockMenuCategories = {
  totalPercentage: 100,
  totalChange: 1.58,
  items: [
    { name: "Chicken",    percentage: 62, count: 28, color: "#F97316", change:  1.58 },
    { name: "Meat",       percentage: 48, count: 19, color: "#FB923C", change: -0.92 },
    { name: "Seafood",    percentage: 35, count: 14, color: "#FDBA74", change: -0.12 },
    { name: "Vegetarian", percentage: 72, count: 32, color: "#86EFAC", change: -0.92 },
    { name: "Desserts",   percentage: 55, count: 22, color: "#C084FC", change: -0.42 },
  ],
};

export const mockMenuItems = [
  { id: 1, name: "Chicken Delight",   image: "https://img.icons8.com/color/96/fried-chicken.png",      category: "Chicken",    price: 24.99, calories: "520g", protein: "38g", fat: "18g", sugar: "4g",  rating: 4.9, status: "Active" },
  { id: 2, name: "Italian Pizza",     image: "https://img.icons8.com/color/96/pizza.png",               category: "Mixed",      price: 19.99, calories: "680g", protein: "24g", fat: "28g", sugar: "8g",  rating: 4.7, status: "Active" },
  { id: 3, name: "Classic Beef",      image: "https://img.icons8.com/color/96/steak-rare.png",          category: "Meat",       price: 32.99, calories: "750g", protein: "52g", fat: "35g", sugar: "2g",  rating: 3.9, status: "Active" },
  { id: 4, name: "Avocado Glow Bowl", image: "https://img.icons8.com/color/96/avocado.png",             category: "Vegetarian", price: 18.99, calories: "420g", protein: "12g", fat: "22g", sugar: "6g",  rating: 4.8, status: "Active" },
  { id: 5, name: "Grilled Salmon",    image: "https://img.icons8.com/color/96/salmon.png",              category: "Seafood",    price: 38.99, calories: "580g", protein: "48g", fat: "20g", sugar: "0g",  rating: 4.6, status: "Active" },
  { id: 6, name: "Caesar Salad",      image: "https://img.icons8.com/color/96/salad.png",               category: "Vegetarian", price: 14.99, calories: "320g", protein: "8g",  fat: "24g", sugar: "3g",  rating: 4.4, status: "Active" },
  { id: 7, name: "Beef Burger",       image: "https://img.icons8.com/color/96/hamburger.png",           category: "Meat",       price: 22.99, calories: "820g", protein: "45g", fat: "42g", sugar: "12g", rating: 4.2, status: "Active" },
  { id: 8, name: "Pasta Carbonara",   image: "https://img.icons8.com/color/96/spaghetti.png",           category: "Mixed",      price: 21.99, calories: "720g", protein: "28g", fat: "32g", sugar: "5g",  rating: 4.5, status: "Active" },
];

// ── Live Kitchen ──────────────────────────────────────────────────

export const mockKitchenOrders = loadMock("kitchenOrders", {
  queue: [
    { id: "#58B1D", time: "4:20 PM", items: ["Chicken Delight x2", "Caesar Salad x1"], notes: "No onions or garlic",   customer: "Sara Ahmed"  },
    { id: "#58B2A", time: "4:45 PM", items: ["Grilled Salmon x1",  "Pasta Carbonara x2"], notes: "Extra sauce on the side", customer: "Omar Ali"    },
    { id: "#58B2B", time: "5:00 PM", items: ["Classic Beef x2"],   notes: "Well done please",       customer: "Lina Hassan" },
  ],
  preparing: [
    { id: "#58B1C", time: "4:05 PM", items: ["Italian Pizza x1", "Caesar Salad x2"], notes: "Gluten-free crust", customer: "Ahmed Salem", startedAt: "4:10 PM" },
    { id: "#58B1B", time: "3:55 PM", items: ["Beef Burger x3"],   notes: "",            customer: "Nour Khaled",  startedAt: "4:00 PM" },
  ],
  ready: [
    { id: "#58B1A", time: "3:40 PM", items: ["Avocado Glow Bowl x2"],                        notes: "",      customer: "Mona Sherif",  readyAt: "3:58 PM" },
    { id: "#58B0Z", time: "3:25 PM", items: ["Chicken Delight x1", "Grilled Salmon x1"],     notes: "Table 7", customer: "Karim Tarek", readyAt: "3:45 PM" },
  ],
});

export const mockKitchenIngredients = [
  { id: 1, name: "Chicken Breast",   checked: false },
  { id: 2, name: "Garlic (no)",      checked: true  },
  { id: 3, name: "Olive Oil",        checked: false },
  { id: 4, name: "Seasoning Mix",    checked: false },
  { id: 5, name: "Caesar Dressing",  checked: false },
];

export const mockKitchenTickets = [
  { id: 1, orderId: "#58B1D", status: "Preparing", assignedChef: "Chef John",   createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 2, orderId: "#58B2A", status: "Queue",     assignedChef: "Unassigned",  createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 3, orderId: "#58B2B", status: "Queue",     assignedChef: "Unassigned",  createdAt: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 4, orderId: "#58B1C", status: "Ready",     assignedChef: "Chef Sarah",  createdAt: new Date(Date.now() - 25 * 60000).toISOString() },
];

export const mockChefs = loadMock("kitchenChefs", [
  { id: 1, displayName: "Chef John",  status: "ACTIVE",   station: "Grill",    avatar: "CJ" },
  { id: 2, displayName: "Chef Sarah", status: "ACTIVE",   station: "Prep",     avatar: "CS" },
  { id: 3, displayName: "Chef Mike",  status: "INACTIVE", station: "Assembly", avatar: "CM" },
]);

// ── Menu Management ───────────────────────────────────────────────

export const mockMenuUploads = [
  { id: 1, filename: "Menu_2024.xlsx",          date: "1 Jan 2026",  time: "9:45 PM",  added: 48,  updated: 12, status: "Success" },
  { id: 2, filename: "Weekend_Special_v2.csv",  date: "7 Mar 2026",  time: "10:08 AM", added: 6,   updated: 3,  status: "Success" },
  { id: 3, filename: "Beverage_list_final.xls", date: "20 May 2026", time: "2:45 PM",  added: 0,   updated: 0,  status: "Failed"  },
];

// ── Ingredients ───────────────────────────────────────────────────

export const mockIngredientsMetrics = {
  total:      126,
  totalChange: 1.58,
  lowStock:   8,
  lowStockChange: -0.92,
  outOfStock: 3,
  outOfStockChange: -0.12,
};

export const mockIngredients = [
  { id: 1, name: "Tomatoes",      image: "https://img.icons8.com/color/48/tomato.png", category: "Vegetables", stock: 80000, unit: "kg",   costPerUnit: "40$", status: "In Stock", fat: "150g", calories: "47g", protein: "250g", sugar: "180g" },
  { id: 2, name: "Chicken",       image: "https://img.icons8.com/color/48/roast-chicken.png", category: "Protein",    stock: 10000, unit: "kg",   costPerUnit: "160$", status: "Low Stock", fat: "20g", calories: "97g", protein: "550g", sugar: "148g" },
  { id: 3, name: "Olive Oil",     image: "https://img.icons8.com/color/48/olive-oil.png", category: "Sauces",     stock: 5000,  unit: "L",    costPerUnit: "80$", status: "Low Stock", fat: "100g", calories: "884g", protein: "0g", sugar: "0g" },
  { id: 4, name: "Garlic",        image: "https://img.icons8.com/color/48/garlic.png", category: "Vegetables", stock: 30000, unit: "kg",   costPerUnit: "15$", status: "In Stock", fat: "5g", calories: "149g", protein: "6g", sugar: "1g" },
  { id: 5, name: "Salmon Fillet", image: "https://img.icons8.com/color/48/salmon.png", category: "Protein",    stock: 2000,  unit: "kg",   costPerUnit: "250$", status: "Low Stock", fat: "13g", calories: "208g", protein: "20g", sugar: "0g" },
  { id: 6, name: "Pasta",         image: "https://img.icons8.com/color/48/spaghetti.png", category: "Stock",      stock: 100000, unit: "kg",  costPerUnit: "25$", status: "In Stock", fat: "2g", calories: "131g", protein: "5g", sugar: "2g" },
  { id: 7, name: "Bell Pepper",   image: "https://img.icons8.com/color/48/paprika.png", category: "Vegetables", stock: 0,     unit: "kg",   costPerUnit: "20$", status: "Out of Stock", fat: "3g", calories: "20g", protein: "1g", sugar: "4g" },
  { id: 8, name: "Avocado",       image: "https://img.icons8.com/color/48/avocado.png", category: "Vegetables", stock: 8000,  unit: "units",costPerUnit: "55$", status: "Low Stock", fat: "15g", calories: "160g", protein: "2g", sugar: "1g" },
];
