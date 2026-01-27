import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==========================
 * Payment Store
 * ==========================
 * Responsibilities:
 * - Manage payment transactions
 * - Validate transaction data
 * - Track status (pending, success, failed)
 * - Persist data
 */

const isValidPayment = (payment) =>
  payment &&
  payment.id &&
  typeof payment.amount === "number" &&
  payment.amount > 0 &&
  ["pending", "success", "failed"].includes(payment.status);

const MAX_HISTORY_LENGTH = 20;

const usePaymentStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */
      payments: [],
      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Add a payment transaction
       */
      addPayment: (payment) => {
        if (!isValidPayment(payment)) {
          set({ error: "Invalid payment data" });
          return;
        }

        const state = get();
        
        // Idempotency: Duplicate check
        if (state.payments.some(p => p.id === payment.id)) {
           // Optionally update existing or just ignore. 
           // Ignoring to prevent duplicate entries for same ID.
           return;
        }

        const newPayments = [...state.payments, payment].slice(-MAX_HISTORY_LENGTH);

        set({
          payments: newPayments,
          error: null,
        });
      },

      /**
       * Update payment status
       */
      updatePaymentStatus: (id, status) => {
        if (!["pending", "success", "failed"].includes(status)) {
          set({ error: "Invalid status" });
          return;
        }

        const paymentExists = get().payments.find((p) => p.id === id);
        if (!paymentExists) {
          set({ error: "Payment not found" });
          return;
        }

        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
          error: null,
        }));
      },

      /**
       * Remove a payment transaction
       */
      removePayment: (id) => {
        const paymentExists = get().payments.find((p) => p.id === id);
        if (!paymentExists) {
          set({ error: "Payment not found" });
          return;
        }
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== id),
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
      partialize: (state) => ({ payments: state.payments }),
    }
  )
);

export default usePaymentStore;
