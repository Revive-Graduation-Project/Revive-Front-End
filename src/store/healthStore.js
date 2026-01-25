import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==========================
 * Health Store
 * ==========================
 * Responsibilities:
 * - Manage user health profile
 * - Validate profile fields
 * - Handle allergies safely
 * - Persist data across refresh
 */

const VALID_GENDERS = ["male", "female", "other"];

const isValidAge = (age) => !isNaN(age) && age > 0 && age < 150;
const isValidWeight = (weight) => !isNaN(weight) && weight > 0;
const isValidHeight = (height) => !isNaN(height) && height > 0;
const isValidGender = (gender) => VALID_GENDERS.includes(gender?.toLowerCase());

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
      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Update Health Profile
       */
      /**
       * Update Health Profile
       * Supports partial updates
       */
      updateProfile: (data) => {
        // 1. Partial Merge Calculation
        const current = get().profile;
        const next = { ...current, ...data };

        // 2. Normalization & Type Safety
        if (next.gender) next.gender = next.gender.toLowerCase();
        if (next.age !== undefined && next.age !== null) next.age = Number(next.age);
        if (next.weight !== undefined && next.weight !== null) next.weight = Number(next.weight);
        if (next.height !== undefined && next.height !== null) next.height = Number(next.height);

        // 3. Validation (Check only if value is present/non-null)
        if (next.age !== null && !isValidAge(next.age)) {
          set({ error: "Invalid age (must be 0-150)" });
          return;
        }
        if (next.weight !== null && !isValidWeight(next.weight)) {
          set({ error: "Invalid weight (must be positive)" });
          return;
        }
        if (next.height !== null && !isValidHeight(next.height)) {
          set({ error: "Invalid height (must be positive)" });
          return;
        }
        if (next.gender !== null && !isValidGender(next.gender)) {
          set({ error: "Invalid gender (male, female, other)" });
          return;
        }

        set({
          profile: next,
          error: null,
        });
      },

      /**
       * Add allergy safely
       */
      /**
       * Add allergy safely
       */
      addAllergy: (allergy) => {
        if (!allergy || typeof allergy !== 'string') {
          set({ error: "Allergy cannot be empty" });
          return;
        }

        const normalizedAllergy = allergy.trim().toLowerCase();

        set((state) => {
          if (state.allergies.includes(normalizedAllergy)) {
            return { error: "Allergy already added" };
          }

          return { allergies: [...state.allergies, normalizedAllergy], error: null };
        });
      },

      /**
       * Remove allergy
       */
      removeAllergy: (allergy) => {
        if (!allergy) return;
        const normalizedAllergy = allergy.trim().toLowerCase();
        
        set((state) => {
          if (!state.allergies.includes(normalizedAllergy)) {
            return { error: "Allergy not found" };
          }

          return {
            allergies: state.allergies.filter((a) => a !== normalizedAllergy),
            error: null,
          };
        });
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-health-store",
      partialize: (state) => ({
        profile: state.profile,
        allergies: state.allergies,
      }),
    }
  )
);

export default useHealthStore;
