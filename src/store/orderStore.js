import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePaymentStore from "./paymentStore";
import { MAX_QUANTITY, DELIVERY_FEE, SUBMIT_DELAY } from "../constants";
import { placeOrder } from "../services/order.service";
import queryClient from "../lib/queryClient";

/**
 * ============================================================================
 * Order Store (Cart & Checkout Management)
 * ============================================================================
 * This store manages the entire shopping lifecycle:
 * 1. Cart Management: Adding, removing, and updating item quantities.
 * 2. Persistence: LocalStorage sync for cart items and customer details.
 * 3. Validation: Enforcing per-item limits and total order caps.
 * 4. Checkout: Orchestrating order submission and duplicate prevention.
 * 5. Security: Handling masked payment data for safe storage.
 */

/**
 * Validates if an item object contains required fields for the cart.
 * @param {Object} item - Product object to validate
 * @returns {boolean} True if item is valid
 */
const isValidItem = (item) =>
  item &&
  typeof item.id !== "undefined" &&
  typeof item.price === "number" &&
  item.price > 0;

/**
 * Calculates total items count and total currency amount for a list of items.
 * Rounds to 2 decimal places to avoid floating point issues.
 * 
 * @param {Array} items - List of cart items
 * @returns {{ totalItems: number, totalAmount: number }}
 */
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const roundedAmount = Math.round(totalAmount * 100) / 100;

  return { totalItems, totalAmount: roundedAmount };
};

/**
 * Main Order Store Hook
 */
const useOrderStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE (Properties)
      ====================== */

      /** @type {Array} Current items in shopping cart */
      items: [],
      /** @type {number} Total count of all items in cart */
      totalItems: 0,
      /** @type {number} Subtotal currency amount */
      totalAmount: 0,
      /** @type {boolean} UI state for the side cart drawer */
      isCartDrawerOpen: false,
      /** @type {string} Optional user-provided order note/instruction */
      note: "",
      
      /** 
       * Customer shipping and contact information.
       * Synchronized with Checkout forms.
       */
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

      /** @type {'cash' | 'credit_card'} Currently selected payment method */
      paymentMethod: "cash", 
      /** @type {Object | null} Masked card data (Never contains full credentials) */
      savedCard: null,       
      
      /** @type {Object | null} Mirror of the most recently successful order */
      lastOrder: null,
      /** @type {boolean} Global loading state for async operations */
      loading: false,
      /** @type {string | null} Global error message for validation or API failures */
      error: null,

      /* =====================
         ACTIONS (Methods)
      ====================== */

      /**
       * Adds a new item or increments quantity if it exists.
       * Enforces MAX_QUANTITY per product.
       * @param {Object} item - Product details
       * @param {number} [quantity=1] - Number of items to add
       */
      addItem: (item, quantity = 1) => {
        set({ error: null }); // Clear error on action start
        
        if (!isValidItem(item)) {
          console.error("OrderStore: Invalid item data", item);
          set({ error: "Invalid item data" });
          return;
        }

        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        const currentQty = existing ? existing.quantity : 0;

        // Validation: Limit per product
        if (currentQty + quantity > MAX_QUANTITY) {
          set({ error: `Cannot exceed ${MAX_QUANTITY} items for this product.` });
          return;
        }

        set((state) => {
          let updatedItems;
          if (existing) {
            updatedItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + quantity }
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
       * Sets an exact quantity for a specific item.
       * Removes the item if quantity hits 0.
       * @param {string|number} id - Item ID
       * @param {number} quantity - Target quantity value
       */
      updateQuantity: (id, quantity) => {
        set({ error: null }); 
        
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        if (quantity > MAX_QUANTITY) {
          set({ error: `Maximum quantity is ${MAX_QUANTITY}.` });
          return;
        }

        set((state) => {
          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
          };
        });
      },

      /**
       * Quick increment for a specific item.
       * @param {string|number} id - Item ID
       */
      increaseQty: (id) => {
        set({ error: null }); 
        
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (item && item.quantity >= MAX_QUANTITY) {
             return { error: `Max quantity (${MAX_QUANTITY}) reached` };
          }

          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          );

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
          };
        });
      },

      /**
       * Quick decrement for a specific item.
       * @param {string|number} id - Item ID
       */
      decreaseQty: (id) => {
        set({ error: null }); 
        
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
          };
        });
      },

      /**
       * Completely removes an item regardless of quantity.
       * @param {string|number} id - Item ID
       */
      removeItem: (id) => {
        set({ error: null }); 
        
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id);

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
          };
        });
      },

      /**
       * Resets the entire cart and transient order state.
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

      /** Open the side-drawer UI */
      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      /** Close the side-drawer UI */
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),

      /** 
       * Sets the order note. 
       * @param {string} note - User instructions
       */
      setNote: (note) => set({ note }),

      /**
       * Bulk updates customer delivery information.
       * @param {Partial<Object>} details - Specific fields to update
       */
      setCustomerDetails: (details) => set((state) => ({
        customerDetails: { ...state.customerDetails, ...details }
      })),

      /** @param {'cash' | 'credit_card'} method */
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      /** 
       * Saves MASKED card details.
       * @param {Object} cardDetails - Object containing masked name/number/expiry
       */
      saveCard: (cardDetails) => {
        set({ error: null });
        set({ savedCard: cardDetails });
      },

      /** 
       * Returns delivery fee if cart isn't empty.
       * @returns {number} 
       */
      getDeliveryFee: () => {
        const { items } = get();
        return items.length > 0 ? DELIVERY_FEE : 0;
      },

      /** 
       * Returns price + delivery.
       * @returns {number} 
       */
      getTotalWithDelivery: () => {
        const { totalAmount } = get();
        const deliveryFee = get().getDeliveryFee();
        return totalAmount + deliveryFee;
      },

      /** Manually clear the global error state */
      clearError: () => set({ error: null }),

      /**
       * Submits the final order.
       * Includes logic for:
       * 1. Empty cart validation
       * 2. Max order total cap ($10,000)
       * 3. Duplicate order prevention (shash comparison of items/qty)
       * 4. API Simulation delay
       * 5. Transaction logging
       * 
       * @async
       * @returns {Promise<boolean>} Success status
       */
      submitOrder: async () => {
        set({ loading: true, error: null });
        console.log('[ORDER] submitOrder started');

        try {
          const state = get();
          console.log('[ORDER] cart items:', state.items);
          
          if (state.items.length === 0) {
             throw new Error("Cart is empty");
          }

          // Validation: Max Total ($10,000 for safety)
          const totalWithDelivery = state.getTotalWithDelivery();
          if (totalWithDelivery > 10000) {
            throw new Error("Order total exceeds limit of 10,000$.");
          }

          // Validation: Duplicate Order Prevention
          const currentHash = JSON.stringify(state.items.map(i => `${i.id}-${i.quantity}`));
          const lastHash = state.lastOrder ? JSON.stringify(state.lastOrder.items.map(i => `${i.id}-${i.quantity}`)) : null;
          
          if (currentHash === lastHash) {
            throw new Error("Wait! You just placed this exact order.");
          }

          // Make real API request to place the order
          console.log('[ORDER] calling placeOrder API...');
          const response = await placeOrder({
             items: [...state.items],
             totalAmount: state.totalAmount,
             deliveryFee: state.getDeliveryFee(),
             finalTotal: totalWithDelivery,
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod,
             note: state.note
          });
          console.log('[ORDER] placeOrder response:', response.data);

          const newOrder = {
             id: response.data.id || Math.floor(10000 + Math.random() * 90000).toString(),
             date: response.data.createdAt || new Date().toISOString(),
             items: [...state.items],
             totalAmount: state.totalAmount,
             deliveryFee: state.getDeliveryFee(),
             finalTotal: totalWithDelivery,
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod,
             cardDetails: state.savedCard,
             note: state.note
          };

          // Log to Payment Store for transaction history (PRD requirement)
          usePaymentStore.getState().addTransaction({
             id: newOrder.id,
             amount: totalWithDelivery,
             status: 'success'
          });

          // Transition to success state
          set({ 
             lastOrder: newOrder,
             loading: false 
          });
          
          // Cleanup cart on success
          get().clearCart();

          // Invalidate dashboard caches so the new order appears immediately
          console.log('[ORDER] invalidating kitchen + orders cache...');
          queryClient.invalidateQueries({ queryKey: ["kitchen"] });
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          console.log('[ORDER] done — order placed successfully:', newOrder.id);

          return true;
        } catch (err) {
          console.error("[ORDER] submission failed:", err);
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
      /** List of state properties to persist across browser reloads */
      partialize: (state) => ({
        items: state.items,
        note: state.note,
        customerDetails: state.customerDetails,
        paymentMethod: state.paymentMethod,
        savedCard: state.savedCard,
        lastOrder: state.lastOrder,
      }),
      /** Custom merge logic to ensure totals are recalculated from persisted items */
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
