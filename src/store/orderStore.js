import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Order Store
 * ----------------------------------
 * Purpose:
 * - Manage cart items
 * - Handle quantities
 * - Calculate totals
 * - Persist cart state
 */

const useOrderStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */

      cart: [], // [{ id, name, price, quantity }]

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Add item to cart
       * - If item exists → increase quantity
       * - If new → add with quantity = 1
       */
      addToCart: (item) => {
        if (!item || !item.id || item.price <= 0) return;

        const cart = get().cart;
        const existingItem = cart.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            cart: cart.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            cart: [...cart, { ...item, quantity: 1 }],
          });
        }
      },

      /**
       * Remove one quantity of item
       * - If quantity becomes 0 → remove item
       */
      decreaseQuantity: (id) => {
        const cart = get().cart;

        set({
          cart: cart
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        });
      },

      /**
       * Remove item completely from cart
       */
      removeFromCart: (id) => {
        set({
          cart: get().cart.filter((item) => item.id !== id),
        });
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({ cart: [] });
      },

      /* =====================
         DERIVED DATA (GETTERS)
      ====================== */

      /**
       * Total number of items in cart
       */
      getItemCount: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),

      /**
       * Total cart price
       */
      getCartTotal: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "revive-order-store", // localStorage key
    }
  )
);

export default useOrderStore;
