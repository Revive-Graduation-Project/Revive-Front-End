import { create } from "zustand";

/*
  UI Store:
  - Handles UI states like modals, loaders, alerts
  - Extendable for dark mode, notifications, responsive UI flags
*/
const useUIStore = create((set) => ({
  loading: false,
  modalOpen: false,
  alert: null,
  setLoading: (val) => set({ loading: val }),
  setModalOpen: (val) => set({ modalOpen: val }),
  setAlert: (message) => set({ alert: message }),
}));

export default useUIStore;
