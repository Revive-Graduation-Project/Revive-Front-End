import { create } from "zustand";
import { getMenu } from "../services/menu.service";

/**
 * ==========================
 * Menu Store
 * ==========================
 * Responsibilities:
 * - Fetch and hold all meals for the single Revive Kitchen restaurant
 * - Handle loading and error states
 *
 * This is a single-restaurant system.
 * There is no restaurant selection or multi-restaurant logic.
 */

const useRestaurantStore = create((set) => ({
  /* =====================
     STATE
  ====================== */
  meals: [],
  loading: false,
  error: null,

  /* =====================
     ACTIONS
  ====================== */

  /**
   * Fetch all meals from the service layer.
   */
  fetchMeals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getMenu();
      set({ meals: response.data, loading: false });
    } catch (error) {
      set({
        error: error.message || "Failed to fetch meals",
        loading: false,
      });
    }
  },

  /**
   * Clear error state
   */
  clearError: () => set({ error: null }),
}));

export default useRestaurantStore;
