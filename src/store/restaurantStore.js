import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getMenu, getIngredients } from "../services/menu.service";

const useRestaurantStore = create(
  persist(
    (set) => ({
      meals: [],
      ingredients: [],
      loading: false,
      error: null,

      fetchMeals: async () => {
        set({ loading: true, error: null });
        try {
          const [mealsRes, ingredientsRes] = await Promise.allSettled([
            getMenu(),
            getIngredients(),
          ]);

          if (mealsRes.status !== "fulfilled") {
            throw mealsRes.reason;
          }

          set({
            meals: mealsRes.value.data,
            ingredients:
              ingredientsRes.status === "fulfilled"
                ? ingredientsRes.value.data
                : [],
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
    }),
    {
      name: "revive-restaurant-store",
      partialize: (state) => ({
        meals: state.meals,
        ingredients: state.ingredients,
      }),
    },
  ),
);

export default useRestaurantStore;
