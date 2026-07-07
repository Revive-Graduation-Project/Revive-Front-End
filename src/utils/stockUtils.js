/**
 * Utility functions for evaluating and formatting inventory stock levels
 * across different units of measurement (grams, kilograms, milliliters, count/pieces).
 */

export const getStockThreshold = (unit = "g") => {
  const u = String(unit || "g").toLowerCase().trim();
  
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

export const evaluateStock = (stock, unit = "g") => {
  const num = Number(stock);
  const validNum = isNaN(num) ? 0 : num;
  const threshold = getStockThreshold(unit);

  const isOutOfStock = validNum === 0;
  const isLowStock = !isOutOfStock && validNum <= threshold;

  return {
    num: validNum,
    threshold,
    isOutOfStock,
    isLowStock,
    isGoodStock: !isOutOfStock && !isLowStock,
  };
};

export const formatStockDisplay = (stock, unit = "g") => {
  const { num, isOutOfStock, isLowStock } = evaluateStock(stock, unit);
  const u = String(unit || "g").trim();
  const uLower = u.toLowerCase();

  let text = `${num} ${u}`;
  if (isOutOfStock) {
    text = u ? `0 ${u}` : "0g";
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
  }

  return {
    text,
    isOut: isOutOfStock,
    isLow: isLowStock,
  };
};
