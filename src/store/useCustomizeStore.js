import { create } from "zustand";

export const useCustomizeStore = create((set, get) => ({
  primaryItem: null,
  selectedSections: {},
  comment: "",

  // =========================
  // SET PRIMARY ITEM
  // =========================
  setPrimaryItem: (item) =>
    set({
      primaryItem: item,
      selectedSections: {},
      comment: "",
    }),

  // =========================
  // TOGGLE ITEM
  // =========================
  toggleItem: (section, item) =>
    set((state) => {
      const current = state.selectedSections[section.slotName] || [];
      const exists = current.find((i) => i.id === item.id);

      let updated;

      if (exists) {
        updated = current.filter((i) => i.id !== item.id);
      } else {
        if (section.maxSelect === 1) {
          updated = [{ ...item, grams: 50 }]; // Default 50g
        } else {
          if (section.maxSelect && current.length >= section.maxSelect) {
            return state;
          }
          updated = [...current, { ...item, grams: 50 }]; // Default 50g
        }
      }

      return {
        selectedSections: {
          ...state.selectedSections,
          [section.slotName]: updated,
        },
      };
    }),

  // =========================
  // UPDATE GRAMS
  // =========================
  updateItemGrams: (slotName, itemId, grams) =>
    set((state) => {
      const current = state.selectedSections[slotName] || [];
      const updated = current.map((i) => 
        i.id === itemId ? { ...i, grams: parseInt(grams) || 0 } : i
      );
      
      return {
        selectedSections: {
          ...state.selectedSections,
          [slotName]: updated,
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
    const { primaryItem, selectedSections } = get();

    if (!primaryItem) return 0;

    const allItems = Object.values(selectedSections).flat();
    
    // primary item base price + (ingredient price * grams)
    let total = primaryItem.price || 0;
    
    total += allItems.reduce(
      (sum, item) => sum + (item.price * (item.grams || 0)),
      0,
    );

    return Number(total.toFixed(2));
  },

  // =========================
  // TOTAL NUTRITION
  // =========================
  getNutrition: () => {
    const { primaryItem, selectedSections } = get();

    const allItems = Object.values(selectedSections).flat();

    const extractNutrient = (item, keywords) => {
      if (!item || !Array.isArray(item.nutrients)) return 0;
      const nutrient = item.nutrients.find(n => keywords.some(k => (n.name || '').toLowerCase().includes(k)));
      return nutrient ? (parseFloat(nutrient.amount) || 0) : 0;
    };

    const getNutrientsFor = (item) => ({
      calories: extractNutrient(item, ['energy', 'calories', 'kcal']),
      protein: extractNutrient(item, ['protein']),
      carbs: extractNutrient(item, ['carbohydrate', 'carbs']),
      fat: extractNutrient(item, ['fat', 'lipid']),
      sugar: extractNutrient(item, ['sugars', 'sugar'])
    });

    const primaryNutrients = getNutrientsFor(primaryItem);

    // Primary item represents 100g base for nutritional calculation or base portion
    // We'll treat the primaryItem as 100g portion for its base stats
    const totals = { 
      calories: primaryNutrients.calories, 
      protein: primaryNutrients.protein, 
      carbs: primaryNutrients.carbs, 
      fat: primaryNutrients.fat, 
      sugar: primaryNutrients.sugar 
    };

    allItems.forEach(item => {
      const itemNutrients = getNutrientsFor(item);
      const multiplier = (item.grams || 0) / 100.0;
      totals.calories += itemNutrients.calories * multiplier;
      totals.protein += itemNutrients.protein * multiplier;
      totals.carbs += itemNutrients.carbs * multiplier;
      totals.fat += itemNutrients.fat * multiplier;
      totals.sugar += itemNutrients.sugar * multiplier;
    });

    return {
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein),
      carbs: Math.round(totals.carbs),
      fat: Math.round(totals.fat),
      sugar: Math.round(totals.sugar)
    };
  },

  // =========================
  // VALIDATION
  // =========================
  isValidSelection: () => {
    const { primaryItem, selectedSections } = get();

    if (!primaryItem) return false;

    // Must have at least 2 additions across all sections
    const additionsCount = Object.values(selectedSections).flat().length;
    if (additionsCount < 2) return false;

    return true;
  },

  // =========================
  // RESET
  // =========================
  resetCustomize: () =>
    set({
      primaryItem: null,
      selectedSections: {},
      comment: "",
    }),
}));
