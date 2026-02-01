/**
 * Mock Restaurants, Meals & Ingredients
 */

export const mockRestaurants = [
  {
    id: 1,
    name: "Revive Kitchen",
    location: "Downtown",
    rating: 4.8,
  }
];

export const mockIngredients = [
  { name: "Chicken", icon: "🍗" },
  { name: "Rice", icon: "🍚" },
  { name: "Carrot", icon: "🥕" },
  { name: "Lettuce", icon: "🥬" },
  { name: "Tomato", icon: "🍅" },
  { name: "Cucumber", icon: "🥒" },
  { name: "Beef", icon: "🥩" },
  { name: "Potato", icon: "🥔" },
  { name: "Salmon", icon: "🐟" },
  { name: "Lemon", icon: "🍋" }
];

export const mockMeals = [
  {
    id: 1,
    name: "Chicken cold cut",
    category: "Chicken",
    description: "Hot chicken breasts with rice, served with fresh vegetables.",
    price: 120.0,
    restaurantId: 1,
    imageUrl: "/meals images/chicken-cold-cut.jpg",
    location: "Downtown",
    calories: 250,
    protein: 31,
    fat: 18,
    carbs: 25,
    ingredients: [
      { name: "Chicken", icon: "🍗" },
      { name: "Carrot", icon: "🥕" }
    ],
    isAvailable: true,
  },
  {
    id: 2,
    name: "Green salad",
    category: "Vegetarian",
    description: "Fresh green salad with farm-fresh vegetables and vinaigrette.",
    price: 140.0,
    restaurantId: 1,
    imageUrl: "/meals images/green-salad.jpg",
    location: "Downtown",
    calories: 78,
    protein: 2,
    fat: 5,
    carbs: 8,
    ingredients: [
      { name: "Lettuce", icon: "🥬" },
      { name: "Tomato", icon: "🍅" },
      { name: "Cucumber", icon: "🥒" }
    ],
    isAvailable: true,
  },
  {
    id: 3,
    name: "Beef steak",
    category: "Beef",
    description: "Grilled beef steak with mashed potatoes and gravy.",
    price: 180.0,
    restaurantId: 1,
    imageUrl: "/meals images/beef-steak.jpg",
    location: "Downtown",
    calories: 350,
    protein: 45,
    fat: 25,
    carbs: 15,
    ingredients: [
      { name: "Beef", icon: "🥩" },
      { name: "Potato", icon: "🥔" }
    ],
    isAvailable: true,
  },
  {
    id: 4,
    name: "Salmon fillet",
    category: "Salmon",
    description: "Fresh Atlantic salmon fillet with herbs and lemon.",
    price: 200.0,
    restaurantId: 1,
    imageUrl: "/meals images/salmon.jpg",
    location: "Downtown",
    calories: 280,
    protein: 34,
    fat: 15,
    carbs: 0,
    ingredients: [
      { name: "Salmon", icon: "🐟" },
      { name: "Lemon", icon: "🍋" }
    ],
    isAvailable: true,
  },
  {
    id: 5,
    name: "Mix protein bowl",
    category: "Chicken",
    description: "The ultimate power bowl with chicken, beef, and rice.",
    price: 160.0,
    restaurantId: 1,
    imageUrl: "/meals images/mix-protein.jpg",
    location: "Downtown",
    calories: 450,
    protein: 55,
    fat: 20,
    carbs: 45,
    ingredients: [
      { name: "Chicken", icon: "🍗" },
      { name: "Beef", icon: "🥩" },
      { name: "Rice", icon: "🍚" }
    ],
    isAvailable: true,
  }
];

export const categories = [
  "All",
  "Chicken",
  "Beef",
  "Salmon",
  "Vegetarian"
];
