import { describe, it, expect } from "vitest";
import {
  inferIngredientUnit,
  getStockThreshold,
  evaluateStock,
  formatStockDisplay,
} from "../utils/stockUtils";

describe("stockUtils unit inference & display", () => {
  it("correctly infers 'pieces' for egg ingredients", () => {
    expect(inferIngredientUnit("Egg", "g")).toBe("pieces");
    expect(inferIngredientUnit("Eggs", undefined)).toBe("pieces");
    expect(inferIngredientUnit("Egg Yolk", "g")).toBe("pieces");
  });

  it("correctly infers 'ml' for oil and liquid ingredients", () => {
    expect(inferIngredientUnit("Olive Oil", "g")).toBe("ml");
    expect(inferIngredientUnit("Vegetable Oil", "")).toBe("ml");
    expect(inferIngredientUnit("Whole Milk", "g")).toBe("ml");
  });

  it("falls back to explicit unit or 'g' for standard ingredients", () => {
    expect(inferIngredientUnit("Flour", "g")).toBe("g");
    expect(inferIngredientUnit("Flour", "kg")).toBe("kg");
  });

  it("formats stock display correctly for pieces, ml, and grams", () => {
    const eggStock = formatStockDisplay(24, "g", "Eggs");
    expect(eggStock.text).toBe("24 pieces");
    expect(eggStock.unit).toBe("pieces");

    const oilStock = formatStockDisplay(500, "g", "Olive Oil");
    expect(oilStock.text).toBe("500ml");
    expect(oilStock.unit).toBe("ml");

    const flourStock = formatStockDisplay(250, "g", "Flour");
    expect(flourStock.text).toBe("250g");
    expect(flourStock.unit).toBe("g");
  });
});
