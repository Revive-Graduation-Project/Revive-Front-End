import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePaymentStore from "./paymentStore";
import useLoyaltyStore from "./loyaltyStore";
import { cancelOrder, getMyOrders } from "../services/order.service";
import {
  groupOrdersByDate,
  isOrderCancellable,
  mergeOrdersWithLastOrder,
  pickTrackingOrder,
} from "../utils/orderHelpers";
import { MAX_QUANTITY, DELIVERY_FEE, SUBMIT_DELAY } from "../constants";
import { placeOrder } from "../services/order.service";
import queryClient from "../lib/queryClient";
import useUIStore from "./uiStore";
import { useToastStore } from "./toastStore";

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
      /** @type {number} Points user wants to redeem */
      pointsToRedeem: 0,
      
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

      /** @type {Array} Orders fetched for profile/history views */
      myOrders: [],
      /** @type {boolean} Loading state for profile order history */
      myOrdersLoading: false,
      /** @type {string | null} Error for profile order history */
      myOrdersError: null,

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
          pointsToRedeem: 0,
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
       * Sets points to redeem
       * @param {number} points 
       */
      setPointsToRedeem: (points) => set({ pointsToRedeem: points }),

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
       * Returns price + delivery minus points discount.
       * @returns {number} 
       */
      getTotalWithDelivery: () => {
        const { totalAmount, pointsToRedeem } = get();
        const deliveryFee = get().getDeliveryFee();
        const discount = pointsToRedeem === 100 ? 10 : pointsToRedeem === 200 ? 20 : pointsToRedeem === 300 ? 30 : 0;
        return totalAmount + deliveryFee - discount;
      },

      /** Manually clear the global error state */
      clearError: () => set({ error: null }),
      setError: (error) => set({ error }),

      clearMyOrdersError: () => set({ myOrdersError: null }),

      getMergedOrders: () => {
        const { myOrders, lastOrder } = get();
        return mergeOrdersWithLastOrder(myOrders, lastOrder);
      },

      getGroupedOrders: () => groupOrdersByDate(get().getMergedOrders()),

      getTrackingOrder: () => {
        const { lastOrder } = get();
        return pickTrackingOrder(get().getMergedOrders(), lastOrder);
      },

      fetchMyOrders: async () => {
        set({ myOrdersLoading: true, myOrdersError: null });

        try {
          const res = await getMyOrders();
          const ordersData = res?.data || [];
          useLoyaltyStore.getState().syncFromOrders(ordersData);
          set({
            myOrders: ordersData,
            myOrdersLoading: false,
            myOrdersError: null,
          });
          return ordersData;
        } catch (error) {
          console.error("Failed to fetch user orders:", error);
          set({
            myOrdersLoading: false,
            myOrdersError: "Could not load your recent orders.",
          });
          return null;
        }
      },

      cancelMyOrder: async (orderId) => {
        const orderToCancel = get()
          .getMergedOrders()
          .find((order) => String(order.id) === String(orderId));

        if (!orderToCancel) {
          return {
            ok: false,
            message: "Order not found.",
          };
        }

        if (!isOrderCancellable(orderToCancel)) {
          return {
            ok: false,
            message:
              "This order can no longer be cancelled because preparation has already started.",
          };
        }

        set({ myOrdersLoading: true, myOrdersError: null });

        try {
          await cancelOrder(orderId);
          if (get().lastOrder && String(get().lastOrder.id) === String(orderId)) {
            set({ lastOrder: { ...get().lastOrder, status: "CANCELED" } });
          }
          const orders = await get().fetchMyOrders();
          return {
            ok: true,
            message: `Order #${orderId} has been successfully cancelled.`,
            orders,
          };
        } catch (error) {
          console.error("Failed to cancel order:", error);
          set({
            myOrdersLoading: false,
            myOrdersError:
              "An error occurred while cancelling your order. Please try again.",
          });
          return {
            ok: false,
            message:
              "An error occurred while cancelling your order. Please try again.",
          };
        }
      },

      /**
       * Submits the final order.
       * Includes logic for:
       * 1. Empty cart validation
       * 2. Max order total cap ($10,000)
       * 3. API request submission
       * 
       * @async
       * @returns {Promise<boolean>} Success status
       */
      submitOrder: async () => {
        set({ loading: true, error: null });

        try {
          const state = get();
          
          if (state.items.length === 0) {
             throw new Error("Cart is empty");
          }

          // Validation: Max Total ($10,000 for safety)
          const totalWithDelivery = state.getTotalWithDelivery();
          if (totalWithDelivery > 10000) {
            throw new Error("Order total exceeds limit of 10,000$.");
          }

          // Make real API request to place the order
          const response = await placeOrder({
             items: state.items.map(i => ({
               mealId: Number(i.id),
               quantity: i.quantity,
               ...(i.customizations && Object.keys(i.customizations).length > 0 ? { customizations: i.customizations } : {})
             })),
             totalAmount: state.totalAmount,
             deliveryFee: state.getDeliveryFee(),
             finalTotal: totalWithDelivery,
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod === 'credit_card' ? 'CREDIT_CARD' : 'CASH',
             points: state.pointsToRedeem || 0,
             note: state.note
          });

          const discount = state.pointsToRedeem === 100 ? 10 : state.pointsToRedeem === 200 ? 20 : state.pointsToRedeem === 300 ? 30 : 0;
          const pointsEarned = Math.floor(totalWithDelivery / 5);

          const newOrder = {
             id: response.data?.id || Math.floor(10000 + Math.random() * 90000).toString(),
             date: response.data?.createdAt || new Date().toISOString(),
             items: [...state.items],
             totalAmount: state.totalAmount,
             deliveryFee: state.getDeliveryFee(),
             discount,
             finalTotal: totalWithDelivery,
             pointsEarned,
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod,
             cardDetails: state.savedCard,
             note: state.note
          };

          // Loyalty Rewards integration: Redeem used points & earn new points
          if (state.pointsToRedeem > 0) {
            useLoyaltyStore.getState().redeemPoints(state.pointsToRedeem, "redeem-" + newOrder.id);
          }
          if (pointsEarned > 0) {
            useLoyaltyStore.getState().earnPoints(pointsEarned, "earn-" + newOrder.id);
          }

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
          queryClient.invalidateQueries({ queryKey: ["kitchen"] });
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["ingredients"] });

          // Trigger dynamic notification for dashboard admin
          useUIStore.getState().addNotification({
            title: `New Order #${newOrder.id}`,
            message: `Order received from ${state.customerDetails?.name || "Customer"} totaling ${totalWithDelivery.toFixed(2)} EGP. ${state.items.length} item(s) to prepare.`,
            type: "warning", // Orange warning badge for new incoming orders
            category: "Orders",
          });

          return { success: true, clientSecret: response.data?.stripeClientSecret, orderId: newOrder.id };
        } catch (err) {
          console.error("[ORDER] submission failed:", err);
          
          const errorMsg = err.response?.data?.message || err.message;
          if (errorMsg && errorMsg.toLowerCase().includes("stock")) {
             useToastStore.getState().addToast({
                 type: 'error',
                 message: 'Some items in your cart are no longer available. Please return to your cart to adjust your order.'
             });
          }

          set({ 
            loading: false, 
            error: errorMsg || "Failed to place order. Please try again." 
          });
          return { success: false, error: errorMsg };
        }
      },
    }),
    {
      name: "revive-order-store",
      /** List of state properties to persist across browser reloads */
      partialize: (state) => ({
        items: state.items,
        note: state.note,
        pointsToRedeem: state.pointsToRedeem,
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
