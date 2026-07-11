/**
 * Utility functions for evaluating and formatting inventory stock levels
 * across different units of measurement (grams, kilograms, milliliters, count/pieces).
 */

/**
 * Smartly infers or normalizes the unit of measurement for an ingredient
 * based on its name and any existing unit.
 * Examples:
 *  - Egg / Eggs -> "pieces"
 *  - Oil / Olive Oil -> "ml"
 *  - Milk / Water / Vinegar / Juice -> "ml"
 *  - Otherwise preserves explicitUnit or falls back to "g"
 */
export const inferIngredientUnit = (name, explicitUnit) => {
  const nLower = String(name || "").toLowerCase().trim();
  const uLower = String(explicitUnit || "").toLowerCase().trim();

  // 1. Egg or count/piece items -> "pieces"
  if (/\b(egg|eggs)\b/i.test(nLower)) {
    return "pieces";
  }
  if (/\b(bun|buns|patty|patties|tortilla|tortillas|croissant|croissants)\b/i.test(nLower)) {
    return "pieces";
  }
  if (uLower === "pieces" || uLower === "piece" || uLower === "pcs" || uLower === "pc") {
    return "pieces";
  }

  // 2. Liquid or oil items -> "ml" (or keep L if already liter)
  if (/\b(oil|oils|milk|water|vinegar|juice|syrup|wine)\b/i.test(nLower)) {
    if (uLower === "l" || uLower === "liter" || uLower === "liters") {
      return "L";
    }
    return "ml";
  }

  // 3. Explicit valid unit or default "g"
  if (uLower && uLower !== "undefined" && uLower !== "null") {
    return explicitUnit;
  }
  return "g";
};

export const getStockThreshold = (unit = "g", name = "") => {
  const effectiveUnit = inferIngredientUnit(name, unit);
  const u = String(effectiveUnit || "g").toLowerCase().trim();

  // Weight in grams or volume in milliliters (threshold: 100g / 100ml)
  if (u === "g" || u === "gr" || u === "gram" || u === "grams" || u === "ml" || u === "milliliter" || u === "milliliters") {
    return 100;
  }

  // Weight in kilograms or volume in liters (threshold: 0.1 kg / 0.1 L = 100g / 100ml)
  if (u === "kg" || u === "kilo" || u === "kilogram" || u === "kilograms" || u === "l" || u === "liter" || u === "liters") {
    return 0.1;
  }
  
  // Count / pieces / cans / boxes (threshold: 15 units)
  return 15;
};

export const evaluateStock = (stock, unit = "g", name = "") => {
  const effectiveUnit = inferIngredientUnit(name, unit);
  const num = Number(stock);
  const validNum = isNaN(num) ? 0 : num;
  const threshold = getStockThreshold(effectiveUnit, name);

  const isOutOfStock = validNum === 0;
  const isLowStock = !isOutOfStock && validNum <= threshold;

  return {
    num: validNum,
    threshold,
    unit: effectiveUnit,
    isOutOfStock,
    isLowStock,
    isGoodStock: !isOutOfStock && !isLowStock,
  };
};

export const formatStockDisplay = (stock, unit = "g", name = "") => {
  const effectiveUnit = inferIngredientUnit(name, unit);
  const { num, isOutOfStock, isLowStock } = evaluateStock(stock, effectiveUnit, name);
  const u = String(effectiveUnit || "g").trim();
  const uLower = u.toLowerCase();

  let text = `${num} ${u}`;
  if (isOutOfStock) {
    if (uLower === "pieces" || uLower === "piece" || uLower === "pcs" || uLower === "pc") {
      text = "0 pieces";
    } else {
      text = u ? `0 ${u}` : "0g";
    }
  } else if (uLower === "g" || uLower === "gram" || uLower === "grams") {
    if (num >= 1000) {
      text = `${(num / 1000).toFixed(1)}kg`;
    } else {
      text = `${num}g`;
    }
  } else if (uLower === "ml" || uLower === "milliliter" || uLower === "milliliters") {
    if (num >= 1000) {
      text = `${(num / 1000).toFixed(1)}L`;
    } else {
      text = `${num}ml`;
    }
  } else if (uLower === "pieces" || uLower === "piece" || uLower === "pcs" || uLower === "pc") {
    text = num === 1 ? `1 piece` : `${num} pieces`;
  } else {
    text = `${num} ${u}`;
  }

  return {
    text,
    unit: effectiveUnit,
    isOut: isOutOfStock,
    isLow: isLowStock,
  };
};
