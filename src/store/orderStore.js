import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==============================
 * Order Store (Cart Management)
 * ==============================
 * Responsibilities:
 * - Manage cart items
 * - Handle quantities correctly
 * - Centralize cart calculations
 * - Persist cart across refresh
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
       * Submit Order (Async Mock)
       * Simulates an API call to place the order.
       * @returns {Promise<boolean>} success
       */
      submitOrder: async () => {
        set({ loading: true, error: null });

        try {
          // Simulate API network delay
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Mock Success
          // In real app: const response = await api.post('/orders', { ...get().items, ...get().customerDetails });
          
          set({ loading: false });
          return true;
        } catch (err) {
          console.error("Order submission failed:", err);
          set({ 
            loading: false, 
            error: "Failed to place order. Please try again." 
          });
          return false;
        }
      },
    }),
    {
      name: "revive-order-store",

      /**
       * Persist items and note.
       * Totals are derived metadata.
       */
      partialize: (state) => ({
        items: state.items,
        note: state.note,
        customerDetails: state.customerDetails,
      }),

      /**
       * Hydrate logic: Recalculate totals from items
       * to ensure single source of truth.
       */
      merge: (persistedState, currentState) => {
        const items = persistedState?.items || [];
        const note = persistedState?.note || "";
        const customerDetails = persistedState?.customerDetails || {};
        const totals = calculateTotals(items);
        return {
          ...currentState,
          items,
          note,
          customerDetails,
          ...totals,
        };
      },
    }
  )
);

export default useOrderStore;
