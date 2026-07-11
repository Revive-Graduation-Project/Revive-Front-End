import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==========================
 * Payment Store
 * ==========================
 * Responsibilities:
 * - Manage user payments and transactions.
 * - Track transaction history.
 */

const isValidTransaction = (transaction) =>
  transaction &&
  // FIX: `transaction.id &&` would incorrectly reject a valid id of 0.
  // Order IDs shouldn't realistically be 0, but checking for
  // null/undefined explicitly is safer than relying on truthiness.
  transaction.id !== null &&
  transaction.id !== undefined &&
  typeof transaction.amount === "number" &&
  transaction.amount > 0;

const MAX_HISTORY_LENGTH = 20;

const usePaymentStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */
      transactions: [],
      status: null, // Tracks last transaction status
      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Add a payment transaction. If a transaction with this id already
       * exists, its status is updated in place instead of being ignored.
       *
       * FIX: Previously, a duplicate id was silently dropped entirely —
       * meaning a failed payment attempt followed by a successful retry
       * on the SAME order (same id, reusing the same PaymentIntent) never
       * got its outcome recorded. The stale "failed" entry from the first
       * attempt stuck around permanently even after the order actually
       * succeeded. This is a real, expected scenario in your flow: e.g.
       * a declined test card retried with a valid one on the same order.
       *
       * @param {Object} transaction - { id, amount, status }
       */
      addTransaction: (transaction) => {
        if (!isValidTransaction(transaction)) {
          set({ error: "Invalid transaction data" });
          return;
        }

        const state = get();
        const existingIndex = state.transactions.findIndex(t => t.id === transaction.id);

        let newTransactions;
        if (existingIndex !== -1) {
          // Update the existing record's status/amount rather than
          // ignoring this call outright.
          newTransactions = state.transactions.map((t, i) =>
            i === existingIndex ? { ...t, ...transaction } : t
          );
        } else {
          newTransactions = [...state.transactions, transaction].slice(-MAX_HISTORY_LENGTH);
        }

        set({
          transactions: newTransactions,
          status: transaction.status, // Update current status
          error: null,
        });
      },

      /**
       * Update transaction status
       * @param {string} id 
       * @param {string} status 
       */
      updateStatus: (id, status) => {
        const transactionExists = get().transactions.find((t) => t.id === id);
        if (!transactionExists) {
          set({ error: "Transaction not found" });
          return;
        }

        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, status } : t
          ),
          status: status, // Update current status tracking
          error: null,
        }));
      },

      /**
       * Remove a transaction
       * @param {string} id 
       */
      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          error: null,
        }));
      },

      /**
       * Clear error state
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-payment-store",
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);

export default usePaymentStore;