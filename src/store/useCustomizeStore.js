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
  // TOGGLE ITEM
  // =========================
  toggleItem: (section, item) =>
    set((state) => {
      const current = state.selectedSections[section.type] || [];
      const exists = current.find((i) => i.id === item.id);

      let updated;

      if (exists) {
        updated = current.filter((i) => i.id !== item.id);
      } else {
        if (section.maxSelect === 1) {
          updated = [item];
        } else {
          if (section.maxSelect && current.length >= section.maxSelect) {
            return state;
          }
          updated = [...current, item];
        }
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
  // TOTAL PRICE — BUG FIX ✅
  // لو مفيش selectedBase نرجع 0 بدل ما نعمل fallback
  // =========================
  getTotalPrice: () => {
    const { selectedBase, selectedSections } = get();

    if (!selectedBase) return 0;

    const allItems = [selectedBase, ...Object.values(selectedSections).flat()];

    return allItems.reduce(
      (total, item) => total + (item.price || item.basePrice || 0),
      0,
    );
  },

  // =========================
  // TOTAL NUTRITION — BUG FIX ✅
  // نفس المنطق، بدون fallback على bases[0]
  // =========================
  getNutrition: () => {
    const { selectedBase, selectedSections } = get();

    const allItems = [
      ...(selectedBase ? [selectedBase] : []),
      ...Object.values(selectedSections).flat(),
    ];

    return allItems.reduce(
      (totals, item) => {
        totals.calories += item.calories || 0;
        totals.protein += item.protein || 0;
        totals.carbs += item.carbs || 0;
        totals.fat += item.fat || 0;
        totals.sugar += item.sugar || 0;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 },
    );
  },

  // =========================
  // VALIDATION
  // =========================
  isValidSelection: () => {
    const { selectedMeal, selectedBase, selectedSections } = get();

    if (!selectedMeal || !selectedBase) return false;

    for (const section of selectedMeal.sections) {
      if (section.required) {
        const selected = selectedSections[section.type] || [];
        if (selected.length === 0) return false;
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
