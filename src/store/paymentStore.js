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
  transaction.id &&
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
       * Add a payment transaction
       * @param {Object} transaction - { id, amount, status }
       */
      addTransaction: (transaction) => {
        if (!isValidTransaction(transaction)) {
          set({ error: "Invalid transaction data" });
          return;
        }

        const state = get();
        
        // Prevent duplicates
        if (state.transactions.some(t => t.id === transaction.id)) {
           return;
        }

        const newTransactions = [...state.transactions, transaction].slice(-MAX_HISTORY_LENGTH);

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
