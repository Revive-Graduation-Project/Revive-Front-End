/**
 * Mock Restaurants, Meals & Ingredients
 */

export const mockRestaurants = [
  {
    id: 1,
    name: "Healthy Bites",
    location: "Downtown",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Green Bowl",
    location: "Uptown",
    rating: 4.5,
  },
];

export const mockIngredients = [
  {
    id: 1,
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
  },
  {
    id: 2,
    name: "Brown Rice",
    calories: 111,
    protein: 2.6,
    fat: 0.9,
    carbs: 23,
  },
  { id: 3, name: "Avocado", calories: 160, protein: 2, fat: 15, carbs: 9 },
  { id: 4, name: "Quinoa", calories: 120, protein: 4.1, fat: 1.9, carbs: 21 },
  { id: 5, name: "Salmon", calories: 208, protein: 20, fat: 13, carbs: 0 },
];

export const mockMeals = [
  {
    id: 1,
    name: "Fresh Veggie Salad Bowl",
    description: "fresh tomato, vegan eggs, carrot & special bread",
    price: 199,
    discountPercent: 30,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", // salad bowl متنوع
    calories: 250,
    protein: 25,
    carbs: 35,
    fat: 18,
    sugar: 64,
    isAvailable: true,
  },
  {
    id: 2,
    name: "Grilled Chicken Protein",
    description: "grilled chicken, brown rice, fresh veggies & sauce",
    price: 200,
    discountPercent: 30,
    imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092", // roasted chicken plate
    calories: 380,
    protein: 42,
    carbs: 30,
    fat: 22,
    sugar: 8,
    isAvailable: true,
  },
  {
    id: 3,
    name: "Salmon Quinoa Delight",
    description: "fresh salmon, quinoa, avocado & mixed greens",
    price: 199,
    discountPercent: 30,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2", // quinoa salmon example
    calories: 520,
    protein: 38,
    carbs: 40,
    fat: 22,
    sugar: 12,
    isAvailable: true,
  },
  {
    id: 4,
    name: "Vegan Power Bowl",
    description: "lentils, chickpeas, veggies & tahini dressing",
    price: 185,
    discountPercent: 25,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", // vegan bowl
    calories: 420,
    protein: 28,
    carbs: 55,
    fat: 15,
    sugar: 10,
    isAvailable: true,
  },
  {
    id: 5,
    name: "Roasted Veggie & Egg Salad",
    description: "roasted veggies, eggs, greens & light vinaigrette",
    price: 179,
    discountPercent: 0,
    imageUrl: "https://images.unsplash.com/photo-1593614681732-5f2a0e5c5e6f", // healthy salad variation
    calories: 310,
    protein: 22,
    carbs: 28,
    fat: 16,
    sugar: 18,
    isAvailable: true,
  },
  {
    id: 6,
    name: "Classic Chicken Salad",
    description: "grilled chicken strips, fresh greens & yogurt dressing",
    price: 210,
    discountPercent: 20,
    imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40", // chicken salad bowl
    calories: 390,
    protein: 40,
    carbs: 25,
    fat: 20,
    sugar: 6,
    isAvailable: true,
  },
  {
    id: 7,
    name: "Avocado Salmon Bowl",
    description: "salmon fillet, avocado, quinoa & cherry tomatoes",
    price: 225,
    discountPercent: 30,
    imageUrl: "https://images.unsplash.com/photo-1540189549-1a1c0b3d3c3e", // salmon quinoa
    calories: 480,
    protein: 35,
    carbs: 38,
    fat: 25,
    sugar: 9,
    isAvailable: true,
  },
  {
    id: 8,
    name: "Mediterranean Veggie Mix",
    description: "feta, olives, cucumber, tomato & olive oil",
    price: 169,
    discountPercent: 0,
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6", // mediterranean salad
    calories: 280,
    protein: 12,
    carbs: 22,
    fat: 18,
    sugar: 14,
    isAvailable: true,
  },
];
