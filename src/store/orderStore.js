import { create } from "zustand";
import { persist } from "zustand/middleware";
import usePaymentStore from "./paymentStore";
import { cancelOrder, getMyOrders, pollOrderStatus } from "../services/order.service";
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
      
      /** @type {string | null} Stripe client secret for payment confirmation */
      stripeClientSecret: null,
      
      /** @type {string | null} Stripe payment intent ID */
      stripePaymentIntentId: null,
      
      /** @type {string | null} Pending order ID awaiting payment confirmation */
      pendingOrderId: null,
      
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
  
          set({
            myOrders: res?.data || [],
            myOrdersLoading: false,
            myOrdersError: null,
          });
          return res?.data || [];
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
       * Submits the final order with Stripe payment flow.
       * Flow:
       * 1. Validate cart and prevent duplicates
       * 2. POST /orders to create order (status: AWAITING_PAYMENT)
       * 3. Get clientSecret from response
       * 4. If credit card: confirm payment with Stripe using clientSecret
       * 5. Poll order status until no longer AWAITING_PAYMENT
       * 6. Update store with final order status
       * 
       * @async
       * @param {Object} stripePaymentMethod - Stripe payment method ID (for credit card)
       * @returns {Promise<boolean>} Success status
       */
      submitOrder: async (stripePaymentMethod = null) => {
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

          // Validation: Duplicate Order Prevention
          const currentHash = JSON.stringify(state.items.map(i => `${i.id}-${i.quantity}`));
          const lastHash = state.lastOrder ? JSON.stringify(state.lastOrder.items.map(i => `${i.id}-${i.quantity}`)) : null;
          
          if (currentHash === lastHash) {
            throw new Error("Wait! You just placed this exact order.");
          }

          // Step 1: Create order via API
          const response = await placeOrder({
             items: state.items.map(item => ({ mealId: item.id, quantity: item.quantity, snapshotName: item.name, snapshotPrice: item.price, imageUrl: item.image })),
             totalPrice: totalWithDelivery,
             discount: state.discount || 0,
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod,
             note: state.note,
          });

          const orderId = response.data.id;
          const clientSecret = response.data.stripeClientSecret;

          // Step 2: If credit card, confirm payment with Stripe
          if (state.paymentMethod === "credit_card" && clientSecret) {
            // This will be handled by the PaymentForm component
            // which has access to the Stripe instance
            set({ 
              stripeClientSecret: clientSecret,
              stripePaymentIntentId: response.data.stripePaymentIntentId,
              pendingOrderId: orderId,
            });
            
            // Return early - payment confirmation will be done by PaymentForm
            set({ loading: false });
            return { requiresPayment: true, clientSecret, orderId };
          }

          // Step 3: For cash orders or if no payment method needed, poll for status
          const finalOrder = await pollOrderStatus(orderId);

          const newOrder = {
             id: finalOrder.id,
             clientId: finalOrder.clientId,
             createdAt: finalOrder.createdAt || new Date().toISOString(),
             status: finalOrder.status,
             totalPrice: finalOrder.totalPrice || totalWithDelivery,
             discount: finalOrder.discount || 0,
             items: finalOrder.items || state.items.map(item => ({ 
               id: item.id, 
               mealId: item.id, 
               quantity: item.quantity, 
               snapshotName: item.name, 
               snapshotPrice: item.price, 
               imageUrl: item.image 
             })),
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod,
             note: state.note,
             stripeClientSecret: finalOrder.stripeClientSecret || "",
             stripePaymentIntentId: finalOrder.stripePaymentIntentId || "",
          };

          // Define success statuses
          const successStatuses = ['PAID', 'CONFIRMED', 'PREPARING', 'READY'];
          const errorStatuses = ['CANCELED', 'CANCELLATION_PENDING'];
          const isSuccess = successStatuses.includes(finalOrder.status);
          const isError = errorStatuses.includes(finalOrder.status);

          // Handle error statuses
          if (isError) {
            throw new Error(`Order ${finalOrder.status.toLowerCase()}. Please contact support.`);
          }

          // Log to Payment Store for transaction history (PRD requirement)
          usePaymentStore.getState().addTransaction({
             id: newOrder.id,
             amount: totalWithDelivery,
             status: isSuccess ? 'success' : 'failed'
          });

          // Transition to success state
          set({ 
             lastOrder: newOrder,
             loading: false,
             stripeClientSecret: null,
             stripePaymentIntentId: null,
             pendingOrderId: null,
          });
          
          // Cleanup cart on success
          if (isSuccess) {
            get().clearCart();
          }

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

          return isSuccess;
        } catch (err) {
          console.error("[ORDER] submission failed:", err);
          set({ 
            loading: false, 
            error: err.message || "Failed to place order. Please try again." 
          });
          return false;
        }
      },

      /**
       * Confirms Stripe payment and polls for final order status
       * Called after PaymentForm completes Stripe confirmation
       * 
       * Success statuses: PAID, CONFIRMED, PREPARING, READY
       * Error statuses: CANCELED, CANCELLATION_PENDING
       * 
       * @async
       * @param {Object} stripe - Stripe instance
       * @param {Object} cardElement - Stripe card element
       * @returns {Promise<boolean>} Success status
       */
      confirmStripePayment: async (stripe, cardElement) => {
        const state = get();
        const { stripeClientSecret, pendingOrderId } = state;

        if (!stripeClientSecret || !pendingOrderId) {
          throw new Error("No pending payment to confirm");
        }

        set({ loading: true, error: null });

        try {
          // Confirm payment with Stripe
          const { error } = await stripe.confirmCardPayment(
            stripeClientSecret,
            {
              payment_method: {
                card: cardElement,
              }
            }
          );

          if (error) {
            throw new Error(error.message);
          }

          // Poll for order status update
          const finalOrder = await pollOrderStatus(pendingOrderId);

          const totalWithDelivery = state.getTotalWithDelivery();

          // Define success statuses
          const successStatuses = ['PAID', 'CONFIRMED', 'PREPARING', 'READY'];
          const errorStatuses = ['CANCELED', 'CANCELLATION_PENDING'];
          const isSuccess = successStatuses.includes(finalOrder.status);
          const isError = errorStatuses.includes(finalOrder.status);

          // Handle error statuses
          if (isError) {
            throw new Error(`Order ${finalOrder.status.toLowerCase()}. Please contact support.`);
          }

          const newOrder = {
             id: finalOrder.id,
             clientId: finalOrder.clientId,
             createdAt: finalOrder.createdAt || new Date().toISOString(),
             status: finalOrder.status,
             totalPrice: finalOrder.totalPrice || totalWithDelivery,
             discount: finalOrder.discount || 0,
             items: finalOrder.items || state.items.map(item => ({ 
               id: item.id, 
               mealId: item.id, 
               quantity: item.quantity, 
               snapshotName: item.name, 
               snapshotPrice: item.price, 
               imageUrl: item.image 
             })),
             customerDetails: state.customerDetails,
             paymentMethod: state.paymentMethod,
             note: state.note,
             stripeClientSecret: finalOrder.stripeClientSecret || "",
             stripePaymentIntentId: finalOrder.stripePaymentIntentId || "",
          };

          // Log to Payment Store
          usePaymentStore.getState().addTransaction({
             id: newOrder.id,
             amount: totalWithDelivery,
             status: isSuccess ? 'success' : 'failed'
          });

          // Update store
          set({ 
             lastOrder: newOrder,
             loading: false,
             stripeClientSecret: null,
             stripePaymentIntentId: null,
             pendingOrderId: null,
          });
          
          // Cleanup cart on success
          if (isSuccess) {
            get().clearCart();
          }

          // Invalidate caches
          queryClient.invalidateQueries({ queryKey: ["kitchen"] });
          queryClient.invalidateQueries({ queryKey: ["orders"] });

          return isSuccess;
        } catch (err) {
          console.error("[ORDER] Stripe payment confirmation failed:", err);
          set({ 
            loading: false, 
            error: err.message || "Payment failed. Please try again." 
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
