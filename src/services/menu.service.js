import { api } from "./api";

// Get all meals
export const getMenu = () => {
  return api.get("/api/menu");
};

// Get single meal
export const getMealById = (id) => {
  return api.get(`/api/menu/${id}`);
};

// Get all ingredients
export const getIngredients = () => {
  return api.get("/api/ingredients");
};

// Get single ingredient
export const getIngredientById = (id) => {
  return api.get(`/api/ingredients/${id}`);
};

// // Admin: create meal
// export const createMeal = (data) => {
//   return api.post("/api/menu", data);
// };

// // Admin: update meal
// export const updateMeal = (id, data) => {
//   return api.put(`/api/menu/${id}`, data);
// };

// // Admin: delete meal
// export const deleteMeal = (id) => {
//   return api.delete(`/api/menu/${id}`);
// };

// // Get meals recommended for a user
// export const getRecommendedMeals = (userId) => {
//   return api.get(`/api/menu/recommendations/${userId}`);
// };
