/**
 * Mock Restaurants, Meals & Ingredients
 */

import {
  chickenColdCut,
  greenSalad,
  beefSteak,
  salmon,
  mixProtein
} from './meal-images';

export const mockRestaurants = [
  {
    id: 1,
    name: "Revive Kitchen",
    location: "Downtown",
    rating: 4.8,
  }
];

const INGREDIENTS = {
  Chicken: { name: "Chicken", icon: "🍗" },
  Rice: { name: "Rice", icon: "🍚" },
  Carrot: { name: "Carrot", icon: "🥕" },
  Lettuce: { name: "Lettuce", icon: "🥬" },
  Tomato: { name: "Tomato", icon: "🍅" },
  Cucumber: { name: "Cucumber", icon: "🥒" },
  Beef: { name: "Beef", icon: "🥩" },
  Potato: { name: "Potato", icon: "🥔" },
  Salmon: { name: "Salmon", icon: "🐟" },
  Lemon: { name: "Lemon", icon: "🍋" }
};

export const mockIngredients = Object.values(INGREDIENTS);

export const mockMeals = [
  {
    id: 1,
    name: "Chicken cold cut",
    category: "Chicken",
    description: "Hot chicken breasts with rice, served with fresh vegetables.",
    price: 120.0,
    restaurantId: 1,
    imageUrl: chickenColdCut,
    location: "Downtown",
    calories: 250,
    protein: 31,
    fat: 18,
    carbs: 25,
    sugar: 12,
    ingredients: [INGREDIENTS.Chicken, INGREDIENTS.Carrot],
    isAvailable: true,
  },
  {
    id: 2,
    name: "Green salad",
    category: "Vegetarian",
    description: "Fresh green salad with farm-fresh vegetables and vinaigrette.",
    price: 140.0,
    restaurantId: 1,
    imageUrl: greenSalad,
    location: "Downtown",
    calories: 78,
    protein: 2,
    fat: 5,
    carbs: 8,
    sugar: 4,
    ingredients: [INGREDIENTS.Lettuce, INGREDIENTS.Tomato, INGREDIENTS.Cucumber],
    isAvailable: true,
  },
  {
    id: 3,
    name: "Beef steak",
    category: "Beef",
    description: "Grilled beef steak with mashed potatoes and gravy.",
    price: 180.0,
    restaurantId: 1,
    imageUrl: beefSteak,
    location: "Downtown",
    calories: 350,
    protein: 45,
    fat: 25,
    carbs: 15,
    sugar: 2,
    ingredients: [INGREDIENTS.Beef, INGREDIENTS.Potato],
    isAvailable: true,
  },
  {
    id: 4,
    name: "Salmon fillet",
    category: "Salmon",
    description: "Fresh Atlantic salmon fillet with herbs and lemon.",
    price: 200.0,
    restaurantId: 1,
    imageUrl: salmon,
    location: "Downtown",
    calories: 280,
    protein: 34,
    fat: 15,
    carbs: 0,
    sugar: 1,
    ingredients: [INGREDIENTS.Salmon, INGREDIENTS.Lemon],
    isAvailable: true,
  },
  {
    id: 5,
    name: "Mix protein bowl",
    category: "Chicken",
    description: "The ultimate power bowl with chicken, beef, and rice.",
    price: 160.0,
    restaurantId: 1,
    imageUrl: mixProtein,
    location: "Downtown",
    calories: 450,
    protein: 55,
    fat: 20,
    carbs: 45,
    sugar: 8,
    ingredients: [INGREDIENTS.Chicken, INGREDIENTS.Beef, INGREDIENTS.Rice],
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
