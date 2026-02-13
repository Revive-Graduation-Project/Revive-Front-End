// src/store/useCustomizeStore.js
import { create } from "zustand";

export const useCustomizeStore = create((set, get) => ({
  selectedMeal: null,
  selectedBase: null,

  selectedSections: {},

  comment: "",

  // =========================
  // SET MEAL
  // =========================
  setMeal: (meal) =>
    set({
      selectedMeal: meal,
      selectedBase: null,
      selectedSections: {},
      comment: "",
    }),

  // =========================
  // SET BASE
  // =========================
  setBase: (base) =>
    set({
      selectedBase: base,
    }),

  // =========================
  // TOGGLE ITEM (ANY SECTION)
  // =========================
  toggleItem: (section, item) =>
    set((state) => {
      const current = state.selectedSections[section.type] || [];
      const exists = current.find((i) => i.id === item.id);

      let updated;

      if (exists) {
        updated = current.filter((i) => i.id !== item.id);
      } else {
        // Respect maxSelect
        if (section.maxSelect && current.length >= section.maxSelect) {
          return state;
        }
        updated = [...current, item];
      }

      return {
        selectedSections: {
          ...state.selectedSections,
          [section.type]: updated,
        },
      };
    }),

  // =========================
  // COMMENT
  // =========================
  setComment: (text) => set({ comment: text }),

  // =========================
  // TOTAL PRICE
  // =========================
  getTotalPrice: () => {
    const { selectedBase, selectedSections } = get();

    const basePrice = selectedBase?.basePrice || 0;

    const allItems = Object.values(selectedSections).flat();

    const itemsPrice = allItems.reduce(
      (total, item) => total + (item.price || 0),
      0,
    );

    return basePrice + itemsPrice;
  },

  // =========================
  // TOTAL NUTRITION
  // =========================
  getNutrition: () => {
    const { selectedSections } = get();

    const allItems = Object.values(selectedSections).flat();

    return allItems.reduce(
      (totals, item) => {
        totals.calories += item.calories || 0;
        totals.protein += item.protein || 0;
        totals.carbs += item.carbs || 0;
        totals.fat += item.fat || 0;
        totals.sugar += item.sugar || 0;
        return totals;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
      },
    );
  },

  // =========================
  // VALIDATION (IMPORTANT)
  // =========================
  isValidSelection: () => {
    const { selectedMeal, selectedBase, selectedSections } = get();

    if (!selectedMeal || !selectedBase) return false;

    // check required sections
    for (const section of selectedMeal.sections) {
      if (section.required) {
        const selected = selectedSections[section.type] || [];
        if (selected.length === 0) {
          return false;
        }
      }
    }

    return true;
  },

  // =========================
  // RESET
  // =========================
  resetCustomize: () =>
    set({
      selectedMeal: null,
      selectedBase: null,
      selectedSections: {},
      comment: "",
    }),
}));
