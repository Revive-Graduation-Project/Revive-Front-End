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

      loading: false,
      error: null,

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Add item to cart
       * If exists → increase quantity (up to MAX)
       */
      addItem: (item) => {
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
                ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
                : i
            );
          } else {
            updatedItems = [
              ...state.items,
              { ...item, quantity: 1 },
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
          error: null,
        });
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-order-store",

      /**
       * Persist items only.
       * Totals are derived metadata.
       */
      partialize: (state) => ({
        items: state.items,
      }),

      /**
       * Hydrate logic: Recalculate totals from items
       * to ensure single source of truth.
       */
      merge: (persistedState, currentState) => {
        const items = persistedState?.items || [];
        const totals = calculateTotals(items);
        return {
          ...currentState,
          items,
          ...totals,
        };
      },
    }
  )
);

export default useOrderStore;
