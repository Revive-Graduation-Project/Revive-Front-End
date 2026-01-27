import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Recommendation Store
 * ----------------------------------
 * Purpose:
 * - Manage AI food recommendations
 * - Centralize AI results & states
 * - Persist last recommendations for refresh
 */

const useRecommendationStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */
      recommendations: [], // AI suggested meals
      isLoading: false,
      error: null,
      lastContext: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Fetch AI recommendations
       * @param {Object} context - health, preferences, history
       */
      fetchRecommendations: async (context) => {
        if (!context || typeof context !== "object") {
          set({ error: "Invalid recommendation context" });
          return;
        }

        set({ isLoading: true, error: null, lastContext: context });

        try {
          const aiResponse = await fakeAI(context);

          // Validate structure of recommendations
          const validRecommendations = Array.isArray(aiResponse)
            ? aiResponse.filter(
                (r) =>
                  r &&
                  (typeof r.id === "number" || typeof r.id === "string") &&
                  typeof r.name === "string" &&
                  typeof r.reason === "string"
              )
            : [];

          set({
            recommendations: validRecommendations,
            isLoading: false,
          });
        } catch (err) {
          set({ error: "Failed to fetch recommendations", isLoading: false });
        }
      },

      /**
       * Clear recommendations
       */
      clearRecommendations: () =>
        set({ recommendations: [], lastContext: null }),
    }),
    {
      name: "revive-recommendation-store", // persist last recommendations
      partialize: (state) => ({
        recommendations: state.recommendations,
        // Privacy: Do NOT persist lastContext (contains health data)
      }),
    }
  )
);

export default useRecommendationStore;

/* =====================
   MOCK AI FUNCTION
   (replace with actual AI)
  ===================== */
async function fakeAI(context) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Grilled Chicken Salad", reason: "High protein & low calories" },
        { id: 2, name: "Quinoa Bowl", reason: "Balanced nutrients" },
      ]);
    }, 1200);
  });
}
