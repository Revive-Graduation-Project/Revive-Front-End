import { create } from "zustand";

/*
  Order Store:
  - Manages shopping cart and order history
  - Extendable for order tracking, status updates, order filters
*/
const useOrderStore = create((set) => ({
  cart: [],
  orders: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
  placeOrder: (order) => set((state) => ({ orders: [...state.orders, order], cart: [] })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    })),
}));

export default useOrderStore;
