import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Loyalty Store
 * ----------------------------------
 * Purpose:
 * - Manage loyalty points
 * - Handle reward redemption
 * - Prevent invalid point usage
 */

const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      points: 0,
      rewardsHistory: [],
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Add loyalty points
       * Called after successful orders
       */
      addPoints: (amount) => {
        if (!Number.isInteger(amount) || amount <= 0) {
          return set({ error: "Invalid points amount" });
        }

        set((state) => ({
          points: state.points + amount,
          error: null,
        }));
      },

      /**
       * Redeem loyalty points
       */
      redeemPoints: (amount, rewardName = "Reward") => {
        const currentPoints = get().points;

        if (!Number.isInteger(amount) || amount <= 0) {
          return set({ error: "Invalid redemption amount" });
        }

        if (amount > currentPoints) {
          return set({ error: "Not enough loyalty points" });
        }

        set((state) => ({
          points: state.points - amount,
          rewardsHistory: [
            ...state.rewardsHistory,
            {
              id: Date.now(),
              name: rewardName,
              pointsUsed: amount,
              redeemedAt: new Date().toISOString(),
            },
          ],
          error: null,
        }));
      },

      /**
       * Reset loyalty (admin / logout use-case)
       */
      resetLoyalty: () =>
        set({
          points: 0,
          rewardsHistory: [],
          error: null,
        }),

      /**
       * Clear error message
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-loyalty-store",
    }
  )
);

export default useLoyaltyStore;
