import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Restaurant Store
 * ----------------------------------
 * Purpose:
 * - Manage restaurants & menus
 * - Provide safe meal data for orders & AI
 */

const useRestaurantStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      restaurants: [], // [{ id, name, isOpen, menu: [] }]
      selectedRestaurantId: null,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Add a new restaurant
       */
      addRestaurant: (restaurant) => {
        if (!restaurant?.id || !restaurant?.name) return;

        set((state) => ({
          restaurants: [...state.restaurants, { ...restaurant, menu: [] }],
        }));
      },

      /**
       * Select restaurant
       */
      selectRestaurant: (restaurantId) => {
        const exists = get().restaurants.some(r => r.id === restaurantId);
        if (!exists) return;

        set({ selectedRestaurantId: restaurantId });
      },

      /**
       * Add meal to restaurant menu
       */
      addMeal: (restaurantId, meal) => {
        if (!meal?.id || !meal?.name || meal.price <= 0) return;

        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === restaurantId
              ? { ...r, menu: [...r.menu, { ...meal, available: true }] }
              : r
          ),
        }));
      },

      /**
       * Update meal availability
       */
      toggleMealAvailability: (restaurantId, mealId) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === restaurantId
              ? {
                  ...r,
                  menu: r.menu.map((m) =>
                    m.id === mealId
                      ? { ...m, available: !m.available }
                      : m
                  ),
                }
              : r
          ),
        }));
      },

      /**
       * Remove meal safely
       */
      removeMeal: (restaurantId, mealId) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === restaurantId
              ? { ...r, menu: r.menu.filter((m) => m.id !== mealId) }
              : r
          ),
        }));
      },

      /**
       * Update restaurant status
       */
      toggleRestaurantStatus: (restaurantId) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === restaurantId
              ? { ...r, isOpen: !r.isOpen }
              : r
          ),
        }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-restaurant-store",
    }
  )
);

export default useRestaurantStore;
