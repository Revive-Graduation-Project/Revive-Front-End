import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Health Store
 * ----------------------------------
 * Purpose:
 * - Manage user health profile
 * - Support AI-based food recommendations
 * - Prevent unsafe food selections
 */

const useHealthStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      profile: {
        age: null,
        weight: null,
        height: null,
        gender: null,
      },

      allergies: [],
      dietaryPreferences: [], // vegetarian, keto, vegan...
      healthGoals: [], // weight-loss, muscle-gain, diabetes-control

      riskLevel: "unknown", // low | medium | high
      lastUpdated: null,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Update health profile
       */
      updateProfile: (data) => {
        set((state) => ({
          profile: { ...state.profile, ...data },
          lastUpdated: new Date().toISOString(),
          error: null,
        }));
      },

      /**
       * Add allergy
       */
      addAllergy: (allergy) => {
        if (!allergy || get().allergies.includes(allergy)) return;

        set((state) => ({
          allergies: [...state.allergies, allergy],
          lastUpdated: new Date().toISOString(),
        }));
      },

      /**
       * Remove allergy
       */
      removeAllergy: (allergy) => {
        set((state) => ({
          allergies: state.allergies.filter((a) => a !== allergy),
          lastUpdated: new Date().toISOString(),
        }));
      },

      /**
       * Set dietary preferences
       */
      setDietaryPreferences: (preferences) => {
        set({
          dietaryPreferences: preferences,
          lastUpdated: new Date().toISOString(),
        });
      },

      /**
       * Set health goals
       */
      setHealthGoals: (goals) => {
        set({
          healthGoals: goals,
          lastUpdated: new Date().toISOString(),
        });
      },

      /**
       * Calculate health risk level
       * (Can be replaced by AI Model *Youseff* later)
       */
      calculateRiskLevel: () => {
        const { allergies, healthGoals } = get();

        let risk = "low";

        if (allergies.length > 2) risk = "medium";
        if (healthGoals.includes("diabetes-control")) risk = "high";

        set({ riskLevel: risk });
      },

      /**
       * Reset health data (logout case)
       */
      resetHealth: () => {
        set({
          profile: {
            age: null,
            weight: null,
            height: null,
            gender: null,
          },
          allergies: [],
          dietaryPreferences: [],
          healthGoals: [],
          riskLevel: "unknown",
          lastUpdated: null,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-health-store",
    }
  )
);

export default useHealthStore;
