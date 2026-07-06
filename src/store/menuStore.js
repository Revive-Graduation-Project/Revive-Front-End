import { create } from "zustand";

export const useMenuStore = create((set) => ({
  selectedCategory: "All",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  resetFilters: () => set({ selectedCategory: "All" }),
}));

export default useMenuStore;
