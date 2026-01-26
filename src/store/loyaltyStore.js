import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==============================
 * Loyalty Store (Production Ready)
 * ==============================
 * Responsibilities:
 * - Manage loyalty points
 * - Prevent negative balances
 * - Track earning & redemption history
 * - Persist data across refresh
 */

const isPositiveNumber = (value) =>
  typeof value === "number" && value > 0;

const MAX_HISTORY_LENGTH = 50;

const useLoyaltyStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      points: 0,
      history: [], // { type: "EARN" | "REDEEM", amount, date }

      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Earn loyalty points
       * @param {number} amount
       * @param {string} [transactionId] - Optional unique ID for idempotency
       */
      earnPoints: (amount, transactionId) => {
        if (!isPositiveNumber(amount)) {
          set({ error: "Points must be a positive number" });
          return;
        }

        const state = get();
        // Idempotency check
        if (transactionId && state.history.some((h) => h.transactionId === transactionId)) {
          return; // Already processed
        }

        const newEntry = {
          type: "EARN",
          amount,
          date: new Date().toISOString(),
          transactionId,
        };

        const newHistory = [...state.history, newEntry].slice(-MAX_HISTORY_LENGTH);

        set({
          points: state.points + amount,
          history: newHistory,
          error: null,
        });
      },

      /**
       * Redeem loyalty points
       * @param {number} amount
       * @param {string} [transactionId]
       */
      redeemPoints: (amount, transactionId) => {
        const { points, history } = get();

        if (!isPositiveNumber(amount)) {
          set({ error: "Redeem amount must be positive" });
          return;
        }

        if (amount > points) {
          set({ error: "Insufficient loyalty points" });
          return;
        }

        // Idempotency check
        if (transactionId && history.some((h) => h.transactionId === transactionId)) {
          return;
        }

        const newEntry = {
          type: "REDEEM",
          amount,
          date: new Date().toISOString(),
          transactionId,
        };

        const newHistory = [...history, newEntry].slice(-MAX_HISTORY_LENGTH);

        set({
          points: Math.max(0, points - amount),
          history: newHistory,
          error: null,
        });
      },

      /**
       * Reset loyalty data
       * Useful on logout
       */
      resetLoyalty: () => {
        set({
          points: 0,
          history: [],
          error: null,
        });
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "revive-loyalty-store",

      /**
       * Persist only business data
       */
      partialize: (state) => ({
        points: state.points,
        history: state.history,
      }),
    }
  )
);

export default useLoyaltyStore;
