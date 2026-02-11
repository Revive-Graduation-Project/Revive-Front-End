import { create } from "zustand";

export const useMenuStore = create((set) => ({
  meal: "all",
  category: "All",

  setMeal: (meal) => set({ meal }),
  setCategory: (category) => set({ category }),

  resetFilters: () => set({ meal: "all", category: "All" }),
}));
