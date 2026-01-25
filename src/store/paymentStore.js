import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Payment Store
 * ----------------------------------
 * Purpose:
 * - Handle payment lifecycle
 * - Track transactions
 * - Validate payments
 * - Support async payment flows
 */

const usePaymentStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      payments: [], // payment history
      currentPayment: null, // active transaction
      isProcessing: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Start a payment transaction
       * Used before redirecting to payment gateway
       */
      startPayment: ({ amount, method }) => {
        if (!amount || amount <= 0) {
          return set({ error: "Invalid payment amount" });
        }

        if (!method) {
          return set({ error: "Payment method is required" });
        }

        set({
          isProcessing: true,
          error: null,
          currentPayment: {
            id: Date.now(),
            amount,
            method,
            status: "pending",
            createdAt: new Date().toISOString(),
          },
        });
      },

      /**
       * Mark payment as successful
       * Called after gateway confirmation
       */
      completePayment: () => {
        const payment = get().currentPayment;
        if (!payment) return;

        const completedPayment = {
          ...payment,
          status: "success",
          completedAt: new Date().toISOString(),
        };

        set({
          payments: [...get().payments, completedPayment],
          currentPayment: null,
          isProcessing: false,
        });
      },

      /**
       * Mark payment as failed
       */
      failPayment: (reason = "Payment failed") => {
        const payment = get().currentPayment;
        if (!payment) return;

        const failedPayment = {
          ...payment,
          status: "failed",
          error: reason,
          failedAt: new Date().toISOString(),
        };

        set({
          payments: [...get().payments, failedPayment],
          currentPayment: null,
          isProcessing: false,
          error: reason,
        });
      },

      /**
       * Clear payment error manually
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-payment-store",
    }
  )
);

export default usePaymentStore;
