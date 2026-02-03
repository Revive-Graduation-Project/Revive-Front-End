import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePaymentStore from "./paymentStore";

/**
 * ==============================
 * Order Store (Cart Management)
 * ==============================
 * Responsibilities:
 * - Manage cart items
 * - Handle quantities correctly
 * - Centralize cart calculations
 * - Persist cart across refresh
 * - Handle Order Submission & Payment Integration
 */

const isValidItem = (item) =>
  item &&
  typeof item.id !== "undefined" &&
  typeof item.price === "number" &&
  item.price > 0;

const MAX_QUANTITY = 99;

/**
 * Calculates total items and total amount.
 * @param {Array} items - List of cart items
 * @returns {Object} { totalItems, totalAmount }
 */
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // Fix floating point precision (e.g. 19.99 * 3)
  // Round to 2 decimal places safe logic
  const roundedAmount = Math.round(totalAmount * 100) / 100;

  return { totalItems, totalAmount: roundedAmount };
};

const useOrderStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      items: [],
      totalItems: 0,
      totalAmount: 0,

      // Cart drawer state
      isCartDrawerOpen: false,
      
      // Order note
      note: "",
      
      // Customer Details
      customerDetails: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        region: "",
        city: "",
        address: "",
        zipCode: ""
      },

      // Payment Details
      paymentMethod: "cash", // 'credit_card' | 'cash'
      savedCard: null,       // Masked card details { cardNumber: '**** 1234', ... }
      
      // Last Confirmed Order (for Thanks Page)
      lastOrder: null,

      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Add item to cart
       * If exists → increase quantity (up to MAX)
       * @param {Object} item - Product to add
       * @param {number} quantity - Quantity to add
       */
      addItem: (item, quantity = 1) => {
        if (!isValidItem(item)) {
          set({ error: "Invalid item data" });
          return;
        }

        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          // Check limit if adding new item as duplicates
          if (existing && existing.quantity >= MAX_QUANTITY) {
             return { error: `Max quantity (${MAX_QUANTITY}) reached for this item` };
          }

          let updatedItems;

          if (existing) {
            updatedItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) }
                : i
            );
          } else {
            updatedItems = [
              ...state.items,
              { ...item, quantity },
            ];
          }

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
            error: null,
          };
        });
      },

      /**
       * Update item quantity directly
       */
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) } : i
          );

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
            error: null,
          };
        });
      },

      /**
       * Increase item quantity
       */
      increaseQty: (id) => {
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (item && item.quantity >= MAX_QUANTITY) {
             return { error: `Max quantity (${MAX_QUANTITY}) reached` };
          }

          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) } : i
          );

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
            error: null, // Clear error on success
          };
        });
      },

      /**
       * Decrease item quantity
       * Removes item if quantity becomes 0
       */
      decreaseQty: (id) => {
        set((state) => {
          const updatedItems = state.items
            .map((i) =>
              i.id === id
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0);

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
            error: null,
          };
        });
      },

      /**
       * Remove item completely
       */
      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id);

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
            error: null,
          };
        });
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
          note: "",
          error: null,
        });
      },

      /**
       * Cart drawer controls
       */
      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      /**
       * Order note
       */
      setNote: (note) => set({ note }),

      /**
       * Set Customer Details
       */
      setCustomerDetails: (details) => set((state) => ({
        customerDetails: { ...state.customerDetails, ...details }
      })),

      /**
       * Set Payment Method
       */
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      /**
       * Save Card Details (Masked)
       */
      saveCard: (cardDetails) => set({ savedCard: cardDetails }),

      /**
       * Get delivery fee (free if cart is empty, otherwise $5)
       * @returns {number} Delivery fee amount
       */
      getDeliveryFee: () => {
        const { items } = get();
        return items.length > 0 ? 5.00 : 0;
      },

      /**
       * Get total with delivery
       */
      getTotalWithDelivery: () => {
        const { totalAmount } = get();
        const deliveryFee = get().getDeliveryFee();
        return totalAmount + deliveryFee;
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),

      /**
       * Submit Order
       * Simulates API call, updates PaymentStore, and persists order.
       * @returns {Promise<boolean>} success
       */
      submitOrder: async () => {
        set({ loading: true, error: null });

        try {
          const state = get();
          
          if (state.items.length === 0) {
             throw new Error("Cart is empty");
          }

          // Simulate API network delay
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // 1. Generate Order Data
          const orderId = Math.floor(10000 + Math.random() * 90000).toString();
          const totalWithDelivery = state.getTotalWithDelivery();
          
          const newOrder = {
             id: orderId,
             date: new Date().toISOString(),
             items: state.items,
             totalAmount: state.totalAmount,
             deliveryFee: state.getDeliveryFee(),
             finalTotal: totalWithDelivery,
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod,
             cardDetails: state.savedCard
          };

          // 2. Log Transaction to PaymentStore
          usePaymentStore.getState().addTransaction({
             id: orderId, // Using Order ID as Transaction ID for simplicity
             amount: totalWithDelivery,
             status: 'success'
          });

          // 3. Save as Last Order & Clear Cart
          set({ 
             lastOrder: newOrder,
             loading: false 
          });
          
          get().clearCart();

          return true;
        } catch (err) {
          console.error("Order submission failed:", err);
          set({ 
            loading: false, 
            error: err.message || "Failed to place order. Please try again." 
          });
          return false;
        }
      },
    }),
    {
      name: "revive-order-store",

      /**
       * Persist items, note, customer, payment details, and lastOrder.
       */
      partialize: (state) => ({
        items: state.items,
        note: state.note,
        customerDetails: state.customerDetails,
        paymentMethod: state.paymentMethod,
        savedCard: state.savedCard,
        lastOrder: state.lastOrder,
      }),

      /**
       * Hydrate logic
       */
      merge: (persistedState, currentState) => {
        const items = persistedState?.items || [];
        const totals = calculateTotals(items);
        return {
          ...currentState,
          ...persistedState,
          ...totals,
        };
      },
    }
  )
);

export default useOrderStore;
