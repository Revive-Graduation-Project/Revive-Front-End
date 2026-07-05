/**
 * Converts nutrients array from API to a flat object
 * Input:  [{ nutrientName: "Energy", unitName: "KCAL", value: 362 }]
 * Output: { calories: 362, protein: 11.27, fat: 22.35, sugar: 2.14 }
 */
export const parseNutrients = (nutrients = []) => {
  const safeNutrients = Array.isArray(nutrients) ? nutrients : [];
  const map = {};
  safeNutrients.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const name = (item.nutrientName || item.name || item.label || item.nutrient || "").toLowerCase().trim();
    const val = item.value !== undefined ? item.value : (item.amount !== undefined ? item.amount : (item.val !== undefined ? item.val : 0));
    map[name] = val;
  });

  const getVal = (...keys) => {
    for (const k of keys) {
      if (map[k] !== undefined && map[k] !== null && map[k] !== "") return map[k];
    }
    return 0;
  };

  return {
    calories: getVal("energy", "energy (kcal)", "calories", "cal", "kcal"),
    protein: getVal("protein", "pro", "proteins"),
    fat: getVal("total lipid (fat)", "fat", "lipids", "total fat"),
    sugar: getVal("total sugars", "sugars", "sugar", "total sugar"),
  };
};
