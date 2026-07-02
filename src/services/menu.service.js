import { api } from './api';

// Get all meals
export const getMenu = () => {
  return api.get('/api/menu');
};

// Get single meal
export const getMealById = (id) => {
  return api.get(`/menu/${id}`);
};

// Admin: create meal
export const createMeal = (data) => {
  return api.post('/menu', data);
};

// Admin: update meal
export const updateMeal = (id, data) => {
  return api.put(`/menu/${id}`, data);
};

// Admin: delete meal
export const deleteMeal = (id) => {
  return api.delete(`/menu/${id}`);
};

// Get meals recommended for a user
export const getRecommendedMeals = (userId) => {
  return api.get(`/menu/recommendations/${userId}`);
};