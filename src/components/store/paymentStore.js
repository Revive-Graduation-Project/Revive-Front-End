import { create } from "zustand";

/*
  Payment Store:
  - Manages payment transactions and receipts
  - Extendable for online gateways, validation, payment history
*/
const usePaymentStore = create((set) => ({
  transactions: [],
  processPayment: (transaction) =>
    set((state) => ({ transactions: [...state.transactions, transaction] })),
}));

export default usePaymentStore;
