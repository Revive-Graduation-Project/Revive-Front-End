import { create } from "zustand";
import { getMenuItems, getRecipeIngredients } from "../services/dashboardService";

const useRestaurantStore = create((set) => ({
  meals: [],
  ingredients: [],
  loading: false,
  error: null,

  fetchMeals: async () => {
    set({ loading: true, error: null });
    try {
      const [mealsRes, ingredientsRes] = await Promise.allSettled([
        getMenuItems(),
        getRecipeIngredients(),
      ]);

      if (mealsRes.status !== "fulfilled") {
        throw mealsRes.reason;
      }

      const mealsData = Array.isArray(mealsRes.value)
        ? mealsRes.value
        : (mealsRes.value?.data || []);

      const ingData =
        ingredientsRes.status === "fulfilled"
          ? Array.isArray(ingredientsRes.value)
            ? ingredientsRes.value
            : (ingredientsRes.value?.data || [])
          : [];

      set({
        meals: mealsData,
        ingredients: ingData,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch meals",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useRestaurantStore;

