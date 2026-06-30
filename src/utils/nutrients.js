/**
 * Converts nutrients array from API to a flat object
 * Input:  [{ nutrientName: "Energy", unitName: "KCAL", value: 362 }]
 * Output: { calories: 362, protein: 11.27, fat: 22.35, sugar: 2.14 }
 */
export const parseNutrients = (nutrients = []) => {
  const safeNutrients = Array.isArray(nutrients) ? nutrients : [];
  const map = {};
  safeNutrients.forEach(({ nutrientName, value }) => {
    map[nutrientName] = value;
  });

  return {
    calories: map["Energy"] ?? 0,
    protein: map["Protein"] ?? 0,
    fat: map["Total lipid (fat)"] ?? 0,
    sugar: map["Total Sugars"] ?? 0,
  };
};
