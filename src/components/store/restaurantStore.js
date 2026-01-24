import { create } from "zustand";

/*
  Restaurant Store:
  - Manages menu items and chefs
  - Extendable for inventory, meal images, nutritional info
*/
const useRestaurantStore = create((set) => ({
  menu: [],
  chefs: [],
  addMeal: (meal) => set((state) => ({ menu: [...state.menu, meal] })),
  updateMeal: (updatedMeal) =>
    set((state) => ({
      menu: state.menu.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal)),
    })),
  removeMeal: (id) => set((state) => ({ menu: state.menu.filter((meal) => meal.id !== id) })),
  addChef: (chef) => set((state) => ({ chefs: [...state.chefs, chef] })),
  removeChef: (id) => set((state) => ({ chefs: state.chefs.filter((c) => c.id !== id) })),
}));

export default useRestaurantStore;
