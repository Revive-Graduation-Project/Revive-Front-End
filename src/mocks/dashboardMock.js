/**
 * Dashboard Mock Data
 * --------------------------------------------------
 * Swap these out by updating dashboardService.js
 * to hit the real API instead of returning this data.
 */

// ── Dashboard Page ────────────────────────────────

export const mockMetrics = {
  totalOrders: { value: 48652, change: 1.58, trend: "up" },
  totalCustomers: { value: 1248, change: -0.48, trend: "down" },
  totalRevenue: { value: 215.86, change: 1.58, trend: "up" },
};

export const mockRevenueData = [
  { month: "Mar", income: 120, revenue: 90, expense: 60 },
  { month: "Apr", income: 140, revenue: 110, expense: 70 },
  { month: "May", income: 130, revenue: 100, expense: 65 },
  { month: "Jun", income: 160, revenue: 130, expense: 80 },
  { month: "Jul", income: 150, revenue: 115, expense: 75 },
  { month: "Aug", income: 175, revenue: 140, expense: 85 },
  { month: "Sep", income: 165, revenue: 135, expense: 78 },
  { month: "Oct", income: 190, revenue: 155, expense: 90 },
];

export const mockTopCategories = [
  { name: "Chicken", value: 40, color: "#F97316" },
  { name: "Seafood", value: 30, color: "#FB923C" },
  { name: "Meat", value: 24, color: "#FDBA74" },
  { name: "Mix Protein", value: 6, color: "#FED7AA" },
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
  { name: "Dine-In", percentage: 45, count: 900, color: "#F97316" },
  { name: "Takeaway", percentage: 30, count: 600, color: "#FB923C" },
  { name: "Online", percentage: 25, count: 550, color: "#FED7AA" },
];

export const mockTrendingMenus = [
  {
    id: 1,
    name: "Chicken Delight",
    rating: 4.9,
    orders: 425,
    revenue: 25400,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=120&h=120&fit=crop",
  },
  {
    id: 2,
    name: "Italian Pizza",
    rating: 4.7,
    orders: 325,
    revenue: 18400,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop",
  },
  {
    id: 3,
    name: "Classic Beef",
    rating: 3.9,
    orders: 425,
    revenue: 11500,
    image: "https://images.unsplash.com/photo-1546964124-0cce460ake76?w=120&h=120&fit=crop",
  },
];

export const mockInventoryAlerts = {
  lowStock: [
    { id: 1, name: "Potatoes", image: "🥔" },
    { id: 2, name: "Pepper", image: "🌶️" },
    { id: 3, name: "Onion", image: "🧅" },
  ],
  shelfLife: [
    { id: 4, name: "Fish", daysLeft: 1, image: "🐟" },
    { id: 5, name: "Tomato Sauce", daysLeft: 2, image: "🍅" },
  ],
  inSeason: [
    { id: 6, name: "Corn", image: "🌽" },
    { id: 7, name: "Avocado", image: "🥑" },
  ],
};

export const mockRecentActivity = [
  {
    id: 1,
    user: "Basmala mohamad",
    role: "Inventory Manager",
    action: 'Update Inventory: 15 units of "Organic Chicken Breast"',
    time: "11:20 AM",
    avatar: "BM",
  },
  {
    id: 2,
    user: "Omar mostafa",
    role: "Kitchen Admin",
    action: "Order #38/51C as Completed",
    time: "4:35 PM",
    avatar: "OM",
  },
  {
    id: 3,
    user: "Ahmed Raffat",
    role: "Receptionist",
    action: "Add new reservation for 4 guests at 7:00PM",
    time: "10:39 AM",
    avatar: "AR",
  },
];

export const mockCustomerReviews = [
  {
    id: 1,
    name: "Sarah Maher",
    rating: 5,
    date: "Oct 12 / 2026",
    text: "This pasta is my favourite dish I have ever tried. Highly recommended for pasta levels!",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Maher",
    rating: 5,
    date: "Oct 12 / 2026",
    text: "This pasta is my favourite dish I have ever tried. Highly recommended for pasta levels!",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Nour mahmoud",
    rating: 4,
    date: "Oct 12 / 2026",
    text: "This pasta is my favourite dish I have ever tried. Highly recommended for pasta levels!",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop",
  },
];

// ── Orders Page ───────────────────────────────────

export const mockOrdersMetrics = {
  totalOrders: 640,
  preparing: 12,
  completed: 628,
  dailyGoal: { current: 4250, target: 5000 },
};

export const mockOrders = [
  { id: "#58B1D", time: "4:20 PM", name: "Chicken Delight", items: 3, total: 45.5, customer: "Sara Ahmed", status: "Preparing" },
  { id: "#58B1E", time: "4:35 PM", name: "Italian Pizza", items: 2, total: 32.0, customer: "Omar Ali", status: "Ready" },
  { id: "#58B1F", time: "4:50 PM", name: "Classic Beef", items: 1, total: 28.99, customer: "Lina Hassan", status: "Done" },
  { id: "#58B1G", time: "5:05 PM", name: "Avocado Glow Bowl", items: 4, total: 62.0, customer: "Ahmed Salem", status: "Preparing" },
  { id: "#58B1H", time: "5:20 PM", name: "Grilled Salmon", items: 2, total: 55.0, customer: "Nour Khaled", status: "Cancelled" },
  { id: "#58B1I", time: "5:35 PM", name: "Caesar Salad", items: 1, total: 18.5, customer: "Mona Sherif", status: "Done" },
  { id: "#58B1J", time: "5:50 PM", name: "Beef Burger", items: 3, total: 41.0, customer: "Karim Tarek", status: "Ready" },
  { id: "#58B1K", time: "6:05 PM", name: "Pasta Carbonara", items: 2, total: 36.5, customer: "Rana Youssef", status: "Preparing" },
];

// ── Recipe Builder ────────────────────────────────

export const mockRecipeIngredients = [
  { id: 1, name: "Tomato", amount: "240g", emoji: "🍅" },
  { id: 2, name: "Chicken Breast", amount: "350g", emoji: "🍗" },
  { id: 3, name: "Olive Oil", amount: "30ml", emoji: "🫒" },
  { id: 4, name: "Garlic", amount: "15g", emoji: "🧄" },
];

// ── Chef Menu ─────────────────────────────────────

export const mockMenuCategories = [
  { name: "Chicken", percentage: 62, count: 28, color: "#F97316" },
  { name: "Meat", percentage: 48, count: 19, color: "#FB923C" },
  { name: "Seafood", percentage: 35, count: 14, color: "#FDBA74" },
  { name: "Vegetarian", percentage: 72, count: 32, color: "#86EFAC" },
  { name: "Desserts", percentage: 55, count: 22, color: "#C084FC" },
];

export const mockMenuItems = [
  { id: 1, name: "Chicken Delight", category: "Chicken", price: 24.99, calories: 520, protein: "38g", fat: "18g", sugar: "4g", rating: 4.9, status: "Active" },
  { id: 2, name: "Italian Pizza", category: "Mixed", price: 19.99, calories: 680, protein: "24g", fat: "28g", sugar: "8g", rating: 4.7, status: "Active" },
  { id: 3, name: "Classic Beef", category: "Meat", price: 32.99, calories: 750, protein: "52g", fat: "35g", sugar: "2g", rating: 3.9, status: "Active" },
  { id: 4, name: "Avocado Glow Bowl", category: "Vegetarian", price: 18.99, calories: 420, protein: "12g", fat: "22g", sugar: "6g", rating: 4.8, status: "Active" },
  { id: 5, name: "Grilled Salmon", category: "Seafood", price: 38.99, calories: 580, protein: "48g", fat: "20g", sugar: "0g", rating: 4.6, status: "Active" },
  { id: 6, name: "Caesar Salad", category: "Vegetarian", price: 14.99, calories: 320, protein: "8g", fat: "24g", sugar: "3g", rating: 4.4, status: "Active" },
  { id: 7, name: "Beef Burger", category: "Meat", price: 22.99, calories: 820, protein: "45g", fat: "42g", sugar: "12g", rating: 4.2, status: "Active" },
  { id: 8, name: "Pasta Carbonara", category: "Mixed", price: 21.99, calories: 720, protein: "28g", fat: "32g", sugar: "5g", rating: 4.5, status: "Active" },
];

// ── Live Kitchen ──────────────────────────────────

export const mockKitchenOrders = {
  queue: [
    { id: "#58B1D", time: "4:20 PM", items: ["Chicken Delight x2", "Caesar Salad x1"], notes: "No onions or garlic", customer: "Sara Ahmed" },
    { id: "#58B2A", time: "4:45 PM", items: ["Grilled Salmon x1", "Pasta Carbonara x2"], notes: "Extra sauce on the side", customer: "Omar Ali" },
    { id: "#58B2B", time: "5:00 PM", items: ["Classic Beef x2"], notes: "Well done please", customer: "Lina Hassan" },
  ],
  preparing: [
    { id: "#58B1C", time: "4:05 PM", items: ["Italian Pizza x1", "Caesar Salad x2"], notes: "Gluten-free crust", customer: "Ahmed Salem", startedAt: "4:10 PM" },
    { id: "#58B1B", time: "3:55 PM", items: ["Beef Burger x3"], notes: "", customer: "Nour Khaled", startedAt: "4:00 PM" },
  ],
  ready: [
    { id: "#58B1A", time: "3:40 PM", items: ["Avocado Glow Bowl x2"], notes: "", customer: "Mona Sherif", readyAt: "3:58 PM" },
    { id: "#58B0Z", time: "3:25 PM", items: ["Chicken Delight x1", "Grilled Salmon x1"], notes: "Table 7", customer: "Karim Tarek", readyAt: "3:45 PM" },
  ],
};

export const mockKitchenIngredients = [
  { id: 1, name: "Chicken Breast", checked: false },
  { id: 2, name: "Garlic (no)", checked: true },
  { id: 3, name: "Olive Oil", checked: false },
  { id: 4, name: "Seasoning Mix", checked: false },
  { id: 5, name: "Caesar Dressing", checked: false },
];
