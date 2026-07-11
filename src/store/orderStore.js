import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usePaymentStore, useUIStore } from "./index";
import {
  cancelOrder,
  getMyOrders,
  pollOrderStatus,
} from "../services/order.service";
import {
  groupOrdersByDate,
  isOrderCancellable,
  mergeOrdersWithLastOrder,
  pickTrackingOrder,
} from "../utils/orderHelpers";
import { MAX_QUANTITY, DELIVERY_FEE, SUBMIT_DELAY } from "../constants";
import { placeOrder } from "../services/order.service";
import queryClient from "../lib/queryClient";

const isValidItem = (item) =>
  item &&
  typeof item.id !== "undefined" &&
  typeof item.price === "number" &&
  item.price > 0;

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const roundedAmount = Math.round(totalAmount * 100) / 100;
  return { totalItems, totalAmount: roundedAmount };
};

const SUCCESS_STATUSES = ["PAID", "CONFIRMED", "PREPARING", "READY"];
const ERROR_STATUSES = ["CANCELED", "CANCELLATION_PENDING"];

const useOrderStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE (Properties)
      ====================== */
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isCartDrawerOpen: false,
      note: "",

      customerDetails: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        region: "",
        city: "",
        address: "",
        zipCode: "",
      },

      paymentMethod: "CASH",
      selectedDiscount: 0,
      pointsToRedeem: 0,
      stripeClientSecret: null,
      stripePaymentIntentId: null,
      pendingOrderId: null,
      lastOrder: null,

      myOrders: [],
      myOrdersLoading: false,
      myOrdersError: null,

      loading: false,
      error: null,

      /* =====================
         ACTIONS (Methods)
      ====================== */

      addItem: (item, quantity = 1) => {
        set({ error: null });
        if (!isValidItem(item)) {
          console.error("OrderStore: Invalid item data", item);
          set({ error: "Invalid item data" });
          return;
        }

        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        const currentQty = existing ? existing.quantity : 0;

        if (currentQty + quantity > MAX_QUANTITY) {
          set({
            error: `Cannot exceed ${MAX_QUANTITY} items for this product.`,
          });
          return;
        }

        set((state) => {
          let updatedItems;
          if (existing) {
            updatedItems = state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i,
            );
          } else {
            updatedItems = [...state.items, { ...item, quantity }];
          }

          return {
            ...calculateTotals(updatedItems),
            items: updatedItems,
            error: null,
          };
        });
      },

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
            i.id === id ? { ...i, quantity } : i,
          );
          return { ...calculateTotals(updatedItems), items: updatedItems };
        });
      },

      increaseQty: (id) => {
        set({ error: null });
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (item && item.quantity >= MAX_QUANTITY) {
            return { error: `Max quantity (${MAX_QUANTITY}) reached` };
          }
          const updatedItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          );
          return { ...calculateTotals(updatedItems), items: updatedItems };
        });
      },

      decreaseQty: (id) => {
        set({ error: null });
        set((state) => {
          const updatedItems = state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0);
          return { ...calculateTotals(updatedItems), items: updatedItems };
        });
      },

      removeItem: (id) => {
        set({ error: null });
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== id);
          return { ...calculateTotals(updatedItems), items: updatedItems };
        });
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
          note: "",
          error: null,
          selectedDiscount: 0,
          pointsToRedeem: 0,
        });
      },

      openCartDrawer: () => set({ isCartDrawerOpen: true }),
      closeCartDrawer: () => set({ isCartDrawerOpen: false }),
      setNote: (note) => set({ note }),
      setCustomerDetails: (details) =>
        set((state) => ({
          customerDetails: { ...state.customerDetails, ...details },
        })),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setDiscount: (discount, points) =>
        set({ selectedDiscount: discount, pointsToRedeem: points }),
      clearDiscount: () => set({ selectedDiscount: 0, pointsToRedeem: 0 }),
      saveCard: (cardDetails) => set({ error: null, savedCard: cardDetails }),
      getDeliveryFee: () => (get().items.length > 0 ? DELIVERY_FEE : 0),
      getTotalWithDelivery: () => get().totalAmount + get().getDeliveryFee(),
      clearError: () => set({ error: null }),
      clearMyOrdersError: () => set({ myOrdersError: null }),
      getMergedOrders: () =>
        mergeOrdersWithLastOrder(get().myOrders, get().lastOrder),
      getGroupedOrders: () => groupOrdersByDate(get().getMergedOrders()),
      getTrackingOrder: () =>
        pickTrackingOrder(get().getMergedOrders(), get().lastOrder),

      fetchMyOrders: async () => {
        set({ myOrdersLoading: true, myOrdersError: null });
        try {
          const res = await getMyOrders();
          set({ myOrders: res?.data || [], myOrdersLoading: false });
          return res?.data || [];
        } catch (error) {
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
        if (!orderToCancel) return { ok: false, message: "Order not found." };
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
          set({
            myOrdersLoading: false,
            myOrdersError: "An error occurred while cancelling your order.",
          });
          return {
            ok: false,
            message: "An error occurred while cancelling your order.",
          };
        }
      },

      /**
       * Submits the final order payload matching your precise structural design.
       */
      submitOrder: async () => {
        console.log("[orderStore] submitOrder initiated.");
        set({ loading: true, error: null });

        try {
          const state = get();
          if (state.items.length === 0) throw new Error("Cart is empty");

          const totalWithDelivery = state.getTotalWithDelivery();
          if (totalWithDelivery > 10000)
            throw new Error("Order total exceeds limit of 10,000$.");

          const currentHash = JSON.stringify(
            state.items.map((i) => `${i.id}-${i.quantity}`),
          );
          const lastOrderSucceeded =
            state.lastOrder &&
            SUCCESS_STATUSES.includes(state.lastOrder.status);
          const lastHash = lastOrderSucceeded
            ? JSON.stringify(
                state.lastOrder.items.map((i) => `${i.id}-${i.quantity}`),
              )
            : null;

          if (lastOrderSucceeded && currentHash === lastHash) {
            throw new Error("Wait! You just placed this exact order.");
          }

          // Exact payload expected by your backend specifications
          const orderPayload = {
            items: state.items.map((item) => {
              // Handle custom meals (from customization page)
              if (item.customizations) {
                return {
                  mealId: null, // Custom meals don't have a predefined mealId
                  customizations: item.customizations,
                  comment: item.comment || "",
                  quantity: item.quantity,
                };
              }
              // Handle regular menu items
              return {
                mealId: item.id,
                quantity: item.quantity,
              };
            }),
            points: state.pointsToRedeem || 0,
            paymentMethod: state.paymentMethod,
          };

          console.log(
            "[orderStore] Sending placeOrder request with payload:",
            orderPayload,
          );
          try {
            const response = await placeOrder(orderPayload);
            console.log("[orderStore] placeOrder response received:", response);
          } catch (error) {
            console.log(
              "[orderStore] placeOrder error received:",
              error?.response?.data?.message,
            );
          }

          // Extract properties from the structured response schema
          const orderData = response.data; // Includes: { id, status, stripeClientSecret, ... }
          const orderId = orderData.id;
          const clientSecret = orderData.stripeClientSecret;

          if (state.paymentMethod === "CREDIT_CARD") {
            if (!clientSecret) {
              throw new Error(
                "Payment could not be initialized. Missing client secret.",
              );
            }

            set({
              stripeClientSecret: clientSecret,
              stripePaymentIntentId: orderData.stripePaymentIntentId,
              pendingOrderId: orderId,
              loading: false,
            });

            // FIX: Return the raw backend response data block directly to the caller component
            // This contains response.status = "PENDING" and response.stripeClientSecret
            // which handles the "requiresPayment" conditional logic implicitly!
            return orderData;
          }

          // Cash handling path
          const finalOrder = await pollOrderStatus(orderId);
          const newOrder = {
            id: finalOrder.id,
            clientId: finalOrder.clientId,
            createdAt: finalOrder.createdAt || new Date().toISOString(),
            status: finalOrder.status,
            totalPrice: finalOrder.totalPrice || totalWithDelivery,
            discount: finalOrder.discount || 0,
            items:
              finalOrder.items ||
              state.items.map((item) => ({
                id: item.id,
                mealId: item.id,
                quantity: item.quantity,
                snapshotName: item.name,
                snapshotPrice: item.price,
                imageUrl: item.image,
              })),
            customerDetails: state.customerDetails,
            paymentMethod: state.paymentMethod,
            note: state.note,
            stripeClientSecret: finalOrder.stripeClientSecret || "",
            stripePaymentIntentId: finalOrder.stripePaymentIntentId || "",
          };

          const isSuccess = SUCCESS_STATUSES.includes(finalOrder.status);
          if (ERROR_STATUSES.includes(finalOrder.status)) {
            throw new Error(
              `Order ${finalOrder.status.toLowerCase()}. Please contact support.`,
            );
          }

          usePaymentStore.getState().addTransaction({
            id: newOrder.id,
            amount: totalWithDelivery,
            status: isSuccess ? "success" : "failed",
          });

          set({
            lastOrder: newOrder,
            loading: false,
            stripeClientSecret: null,
            stripePaymentIntentId: null,
            pendingOrderId: null,
          });

          if (isSuccess) get().clearCart();

          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["ingredients"] });
          queryClient.invalidateQueries({ queryKey: ["kitchen"] });

          useUIStore.getState().addNotification({
            title: `New Order #${newOrder.id}`,
            message: `Order received from ${state.customerDetails?.firstName || "Customer"} totaling ${totalWithDelivery.toFixed(2)} $. ${state.items.length} item(s) to prepare.`,
            type: "warning", // Orange warning badge for new incoming orders
            category: "Orders",
          });

          return newOrder; // Consistently return payload structure
        } catch (err) {
          console.error("[ORDER] submission failed error details:", err);
          set({
            loading: false,
            error: err.message || "Failed to place order. Please try again.",
          });
          return null;
        }
      },

      /**
       * Confirms payment securely using explicitly provided token keys.
       */
      confirmStripePayment: async (
        stripe,
        cardElement,
        clientSecretOverride,
      ) => {
        const state = get();
        const pendingOrderId = state.pendingOrderId;
        // Fallback to state token if override isn't supplied by call pattern
        const secretToUse = clientSecretOverride || state.stripeClientSecret;

        if (!secretToUse || !pendingOrderId) {
          throw new Error("No pending payment credentials found to authorize.");
        }

        set({ loading: true, error: null });

        try {
          const { error } = await stripe.confirmCardPayment(secretToUse, {
            payment_method: { card: cardElement },
          });

          if (error) throw new Error(error.message);

          const finalOrder = await pollOrderStatus(pendingOrderId);
          const totalWithDelivery = state.getTotalWithDelivery();
          const isSuccess = SUCCESS_STATUSES.includes(finalOrder.status);

          if (ERROR_STATUSES.includes(finalOrder.status)) {
            throw new Error(
              `Order ${finalOrder.status.toLowerCase()}. Please contact support.`,
            );
          }

          const newOrder = {
            id: finalOrder.id,
            clientId: finalOrder.clientId,
            createdAt: finalOrder.createdAt || new Date().toISOString(),
            status: finalOrder.status,
            totalPrice: finalOrder.totalPrice || totalWithDelivery,
            discount: finalOrder.discount || 0,
            items:
              finalOrder.items ||
              state.items.map((item) => ({
                id: item.id,
                mealId: item.id,
                quantity: item.quantity,
                snapshotName: item.name,
                snapshotPrice: item.price,
                imageUrl: item.image,
              })),
            customerDetails: state.customerDetails,
            paymentMethod: state.paymentMethod,
            note: state.note,
            stripeClientSecret: finalOrder.stripeClientSecret || "",
            stripePaymentIntentId: finalOrder.stripePaymentIntentId || "",
          };

          usePaymentStore.getState().addTransaction({
            id: newOrder.id,
            amount: totalWithDelivery,
            status: isSuccess ? "success" : "failed",
          });

          set({
            lastOrder: newOrder,
            loading: false,
            stripeClientSecret: null,
            stripePaymentIntentId: null,
            pendingOrderId: null,
          });

          if (isSuccess) get().clearCart();

          queryClient.invalidateQueries({ queryKey: ["kitchen"] });
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({ queryKey: ["ingredients"] });

          return isSuccess;
        } catch (err) {
          console.error("[ORDER] Stripe payment confirmation failed:", err);
          set({
            loading: false,
            error: err.message || "Payment verification failed.",
          });
          return false;
        }
      },
    }),
    {
      name: "revive-order-store",
      partialize: (state) => ({
        items: state.items,
        note: state.note,
        customerDetails: state.customerDetails,
        paymentMethod: state.paymentMethod,
        lastOrder: state.lastOrder,
        // Don't persist selectedDiscount and pointsToRedeem to avoid stale discounts
        // when user's loyalty points change
      }),
      merge: (persistedState, currentState) => {
        const items = persistedState?.items || [];
        const totals = calculateTotals(items);
        return { ...currentState, ...persistedState, ...totals };
      },
    },
  ),
);

export default useOrderStore;
