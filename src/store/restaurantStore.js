import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchRestaurants, fetchMeals } from "../services/restaurant.service";

/**
 * ==========================
 * Restaurant Store
 * ==========================
 * Responsibilities:
 * - Manage restaurants and meals
 * - Validate restaurant & meal structures
 * - Handle selection and error states
 * - Persist data
 * - Fetch data from service layer (mock now, API later)
 */

const isValidMeal = (meal) =>
  meal &&
  meal.id &&
  typeof meal.name === "string" &&
  typeof meal.price === "number" &&
  typeof meal.category === "string";

const isValidRestaurant = (restaurant) =>
  restaurant &&
  restaurant.id &&
  typeof restaurant.name === "string" &&
  Array.isArray(restaurant.meals);

const useRestaurantStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */
      restaurants: [],
      meals: [], // All meals across restaurants
      selectedRestaurantId: null, // Store ID only to prevent data desync
      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Fetch all restaurants from service
       * (Currently uses mock data, will use API later)
       */
      fetchRestaurants: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetchRestaurants();
          set({
            restaurants: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message || "Failed to fetch restaurants",
            loading: false,
          });
        }
      },

      /**
       * Fetch all meals from service
       * (Currently uses mock data, will use API later)
       */
      fetchMeals: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetchMeals();
          set({
            meals: response.data,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message || "Failed to fetch meals",
            loading: false,
          });
        }
      },

      /**
       * Select a restaurant by id
       */
      selectRestaurant: (id) => {
        const restaurant = get().restaurants.find((r) => r.id === id);
        if (!restaurant) {
          set({ error: "Restaurant not found" });
          return;
        }
        set({ selectedRestaurantId: id, error: null });
      },

      /**
       * Get current selected restaurant (Computed)
       */
      getSelectedRestaurant: () => {
        const state = get();
        return state.restaurants.find((r) => r.id === state.selectedRestaurantId) || null;
      },

      /**
       * Add a restaurant
       */
      addRestaurant: (restaurant) => {
        if (!isValidRestaurant(restaurant)) {
          set({ error: "Invalid restaurant data" });
          return;
        }
        set((state) => ({
          restaurants: [...state.restaurants, restaurant],
          error: null,
        }));
      },

      /**
       * Add a meal to selected restaurant
       */
      addMeal: (meal) => {
        if (!isValidMeal(meal)) {
          set({ error: "Invalid meal data" });
          return;
        }

        const state = get();
        const selectedId = state.selectedRestaurantId;

        if (!selectedId) {
          set({ error: "No restaurant selected" });
          return;
        }

        const restaurant = state.restaurants.find(r => r.id === selectedId);
        if (!restaurant) {
          set({ error: "Selected restaurant not found in list" });
          return;
        }

        if (restaurant.meals.find((m) => m.id === meal.id)) {
          set({ error: "Meal already exists" });
          return;
        }

        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === selectedId
              ? { ...r, meals: [...r.meals, meal] }
              : r
          ),
          error: null,
        }));
      },

      /**
       * Remove a meal from selected restaurant
       */
      removeMeal: (mealId) => {
        const state = get();
        const selectedId = state.selectedRestaurantId;

        if (!selectedId) {
          set({ error: "No restaurant selected" });
          return;
        }

        const restaurant = state.restaurants.find(r => r.id === selectedId);
        if (!restaurant) {
          set({ error: "Selected restaurant not found" });
          return;
        }

        if (!restaurant.meals.find((m) => m.id === mealId)) {
          set({ error: "Meal not found" });
          return;
        }

        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === selectedId
              ? {
                ...r,
                meals: r.meals.filter((m) => m.id !== mealId),
              }
              : r
          ),
          error: null,
        }));
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-restaurant-store",
      partialize: (state) => ({
        restaurants: state.restaurants,
        // Don't persist selectedRestaurantId -> force fresh selection on load
      }),
    }
  )
);

export default useRestaurantStore;
