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
                  typeof r.reason === "string",
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
    },
  ),
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
        {
          id: 1,
          name: "Beef Protein Bowl",
          reason:
            "High-protein beef meal ideal for muscle building and recovery",
          description: "Grilled beef with brown rice, veggies & special sauce",
          price: 199,
          discountPercent: 30,
          category: "Beef",
          mainCategory: "Dinner",
          imageUrl:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
          calories: 250,
          protein: 25,
          carbs: 35,
          fat: 18,
          sugar: 10,
          isAvailable: true,
        },
        {
          id: 2,
          name: "Grilled Chicken Protein",
          reason: "Lean chicken option perfect for high-protein dinner",
          description:
            "Grilled chicken, brown rice, fresh veggies & yogurt sauce",
          price: 200,
          discountPercent: 30,
          category: "Chicken",
          mainCategory: "Dinner",
          imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
          calories: 380,
          protein: 42,
          carbs: 30,
          fat: 22,
          sugar: 8,
          isAvailable: true,
        },
        {
          id: 3,
          name: "Salmon Quinoa Delight",
          reason: "Rich in omega-3 and balanced nutrients",
          description: "Fresh salmon fillet, quinoa, avocado & mixed greens",
          price: 199,
          discountPercent: 0,
          category: "Seafood",
          mainCategory: "Dinner",
          imageUrl:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
          calories: 520,
          protein: 38,
          carbs: 40,
          fat: 22,
          sugar: 12,
          isAvailable: true,
        },
        {
          id: 4,
          name: "Vegan Power Bowl",
          reason: "Plant-based protein option for healthy lifestyle",
          description: "Lentils, chickpeas, veggies & tahini dressing",
          price: 185,
          discountPercent: 25,
          category: "mix Protein",
          mainCategory: "Lunch",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          calories: 420,
          protein: 28,
          carbs: 55,
          fat: 15,
          sugar: 10,
          isAvailable: true,
        },
        {
          id: 5,
          name: "Roasted Veggie & Egg Salad",
          reason: "Light breakfast rich in vitamins and protein",
          description:
            "Roasted veggies, boiled eggs, greens & light vinaigrette",
          price: 179,
          discountPercent: 0,
          category: "mix Protein",
          mainCategory: "Breakfast",
          imageUrl:
            "https://images.unsplash.com/photo-1593614681732-5f2a0e5c5e6f",
          calories: 310,
          protein: 22,
          carbs: 28,
          fat: 16,
          sugar: 18,
          isAvailable: true,
        },
        {
          id: 6,
          name: "Classic Chicken Salad",
          reason: "Low-carb high-protein lunch option",
          description: "Grilled chicken strips, fresh greens & yogurt dressing",
          price: 210,
          discountPercent: 0,
          category: "Chicken",
          mainCategory: "Lunch",
          imageUrl:
            "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
          calories: 390,
          protein: 40,
          carbs: 25,
          fat: 20,
          sugar: 6,
          isAvailable: true,
        },
        {
          id: 7,
          name: "Avocado Salmon Bowl",
          reason: "Healthy fats and protein for balanced energy",
          description: "Salmon fillet, avocado, quinoa & cherry tomatoes",
          price: 225,
          discountPercent: 30,
          category: "Seafood",
          mainCategory: "Dinner",
          imageUrl: "https://images.unsplash.com/photo-1540189549-1a1c0b3d3c3e",
          calories: 480,
          protein: 35,
          carbs: 38,
          fat: 25,
          sugar: 9,
          isAvailable: true,
        },
        {
          id: 8,
          name: "Mediterranean Veggie Mix",
          reason: "Mediterranean-style light and heart-friendly meal",
          description: "Feta cheese, olives, cucumber, tomato & olive oil",
          price: 169,
          discountPercent: 0,
          category: "mix Protein",
          mainCategory: "Lunch",
          imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6",
          calories: 280,
          protein: 12,
          carbs: 22,
          fat: 18,
          sugar: 14,
          isAvailable: true,
        },
        {
          id: 9,
          name: "Lunch Chicken Wrap",
          reason: "Quick and balanced lunch choice",
          description: "Chicken wrap with veggies & light sauce",
          price: 150,
          discountPercent: 15,
          category: "Chicken",
          mainCategory: "Lunch",
          imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
          calories: 420,
          protein: 35,
          carbs: 45,
          fat: 16,
          sugar: 7,
          isAvailable: true,
        },
        {
          id: 10,
          name: "Beef Protein Bowl",
          reason: "Protein-rich beef meal for strength and recovery",
          description: "Grilled beef with brown rice, veggies & special sauce",
          price: 199,
          discountPercent: 0,
          category: "Beef",
          mainCategory: "Dinner",
          imageUrl:
            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
          calories: 450,
          protein: 45,
          carbs: 35,
          fat: 18,
          sugar: 10,
          isAvailable: true,
        },
        {
          id: 11,
          name: "Grilled Chicken Protein",
          reason:
            "High-protein grilled chicken perfect for muscle recovery and dinner meals",
          description:
            "Grilled chicken, brown rice, fresh veggies & yogurt sauce",
          price: 200,
          discountPercent: 30,
          category: "Chicken",
          mainCategory: "Dinner",
          imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
          calories: 380,
          protein: 42,
          carbs: 30,
          fat: 22,
          sugar: 8,
          isAvailable: true,
        },
        {
          id: 12,
          name: "Salmon Quinoa Delight",
          reason:
            "Omega-3 rich salmon meal with balanced macros for heart health",
          description: "Fresh salmon fillet, quinoa, avocado & mixed greens",
          price: 199,
          discountPercent: 0,
          category: "Seafood",
          mainCategory: "Dinner",
          imageUrl:
            "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
          calories: 520,
          protein: 38,
          carbs: 40,
          fat: 22,
          sugar: 12,
          isAvailable: true,
        },
        {
          id: 13,
          name: "Vegan Power Bowl",
          reason:
            "Plant-based protein bowl ideal for vegetarians and clean eating",
          description: "Lentils, chickpeas, veggies & tahini dressing",
          price: 185,
          discountPercent: 25,
          category: "mix Protein",
          mainCategory: "Lunch",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          calories: 420,
          protein: 28,
          carbs: 55,
          fat: 15,
          sugar: 10,
          isAvailable: true,
        },
        {
          id: 14,
          name: "Roasted Veggie & Egg Salad",
          reason:
            "Light breakfast option rich in vitamins and moderate protein",
          description:
            "Roasted veggies, boiled eggs, greens & light vinaigrette",
          price: 179,
          discountPercent: 0,
          category: "mix Protein",
          mainCategory: "Breakfast",
          imageUrl:
            "https://images.unsplash.com/photo-1593614681732-5f2a0e5c5e6f",
          calories: 310,
          protein: 22,
          carbs: 28,
          fat: 16,
          sugar: 18,
          isAvailable: true,
        },
        {
          id: 15,
          name: "Classic Chicken Salad",
          reason: "Low-carb chicken salad great for weight management",
          description: "Grilled chicken strips, fresh greens & yogurt dressing",
          price: 210,
          discountPercent: 0,
          category: "Chicken",
          mainCategory: "Lunch",
          imageUrl:
            "https://images.unsplash.com/photo-1505253758473-96b7015fcd40",
          calories: 390,
          protein: 40,
          carbs: 25,
          fat: 20,
          sugar: 6,
          isAvailable: true,
        },
        {
          id: 16,
          name: "Avocado Salmon Bowl",
          reason: "Healthy fats and quality protein for sustained energy",
          description: "Salmon fillet, avocado, quinoa & cherry tomatoes",
          price: 225,
          discountPercent: 30,
          category: "Seafood",
          mainCategory: "Dinner",
          imageUrl: "https://images.unsplash.com/photo-1540189549-1a1c0b3d3c3e",
          calories: 480,
          protein: 35,
          carbs: 38,
          fat: 25,
          sugar: 9,
          isAvailable: true,
        },
        {
          id: 17,
          name: "Mediterranean Veggie Mix",
          reason:
            "Mediterranean-style meal supporting heart-friendly nutrition",
          description: "Feta cheese, olives, cucumber, tomato & olive oil",
          price: 169,
          discountPercent: 0,
          category: "mix Protein",
          mainCategory: "Lunch",
          imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6",
          calories: 280,
          protein: 12,
          carbs: 22,
          fat: 18,
          sugar: 14,
          isAvailable: true,
        },
        {
          id: 18,
          name: "Lunch Chicken Wrap",
          reason: "Quick balanced wrap suitable for busy lunch time",
          description: "Chicken wrap with veggies & light sauce",
          price: 150,
          discountPercent: 0,
          category: "Chicken",
          mainCategory: "Lunch",
          imageUrl:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
          calories: 420,
          protein: 35,
          carbs: 45,
          fat: 16,
          sugar: 7,
          isAvailable: true,
        },
      ]);
    }, 1200);
  });
}
