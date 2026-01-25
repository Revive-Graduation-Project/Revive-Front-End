import { create } from "zustand";

/**
 * Recommendation Store
 * ----------------------------------
 * Purpose:
 * - Manage AI food recommendations
 * - Centralize AI results & states
 */

const useRecommendationStore = create((set, get) => ({
  /* =====================
     STATE
  ====================== */

  recommendations: [], // AI suggested meals
  isLoading: false,
  error: null,

  // Context used for AI decisions
  lastContext: null,

  /* =====================
     ACTIONS
  ====================== */

  /**
   * Fetch AI recommendations
   * @param {Object} context - health, preferences, history
   */
  fetchRecommendations: async (context) => {
    if (!context) {
      set({ error: "Missing recommendation context" });
      return;
    }

    set({
      isLoading: true,
      error: null,
      lastContext: context,
    });

    try {
      /**
       * ( Simulated AI call )
       * Later:
       * - Call backend
       * - Or OpenAI / ML service
       */
      const aiResponse = await fakeAI(context);

      set({
        recommendations: aiResponse,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: "Failed to fetch recommendations",
        isLoading: false,
      });
    }
  },

  /**
   * Clear recommendations
   * Useful on logout or profile reset
   */
  clearRecommendations: () =>
    set({
      recommendations: [],
      lastContext: null,
    }),
}));

export default useRecommendationStore;

/* =====================
   MOCK AI FUNCTION
   (Replace later with real API)
===================== */

async function fakeAI(context) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Grilled Chicken Salad",
          reason: "High protein & low calories",
        },
        {
          id: 2,
          name: "Quinoa Bowl",
          reason: "Balanced nutrients",
        },
      ]);
    }, 1200);
  });
}
