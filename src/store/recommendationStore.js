import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getSuggestedMeals } from "../services/recommendation.service";
import { useAuthStore } from "./index";

/**
 * Recommendation Store (Production Ready)
 * ---------------------------------------
 * Responsibilities:
 * - Manage AI food recommendations / suggested meals
 * - Integrate with real backend recommendation API
 * - Persist recommendations across refreshes for smooth UX
 */
const useRecommendationStore = create(
  persist(
    (set) => ({
      /* =====================
         STATE
      ====================== */
      recommendations: [], // AI suggested meals from backend
      isLoading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */
      /**
       * Fetch AI recommendations / suggested meals from backend.
       * Can be passed a userId directly, an object containing userId/id,
       * or will fallback to the currently authenticated user in authStore.
       *
       * @param {string|number|Object} [param] - userId or context object
       */
      fetchRecommendations: async (param) => {
        const userId =
          typeof param === "number" || typeof param === "string"
            ? param
            : param?.userId || param?.id || useAuthStore.getState().user?.id || "guest";

        set({ isLoading: true, error: null });

        try {
          const response = await getSuggestedMeals(userId);
          const data = response.data;
          const validRecommendations = Array.isArray(data) ? data : [];

          set({
            recommendations: validRecommendations,
            isLoading: false,
          });
        } catch (err) {
          set({
            recommendations: [],
            error:
              err.response?.data?.message ||
              err.message ||
              "Failed to fetch recommendations",
            isLoading: false,
          });
        }
      },

      /**
       * Clear recommendations (e.g. on logout)
       */
      clearRecommendations: () => set({ recommendations: [], error: null }),
    }),
    {
      name: "revive-recommendation-store",
      partialize: (state) => ({
        recommendations: state.recommendations,
      }),
    },
  ),
);

export default useRecommendationStore;


