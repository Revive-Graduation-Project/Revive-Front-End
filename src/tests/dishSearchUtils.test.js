import { describe, it, expect } from "vitest";
import { filterDishes } from "../search/dishSearchUtils";

describe("Dish Search Utilities", () => {
  const mockMeals = [
    { id: 1, name: "Lava Cake", description: "Warm chocolate molten lava cake", category: "Dessert", price: 85 },
    { id: 2, name: "Grilled Chicken Bowl", description: "Healthy protein bowl with brown rice", category: "Main", price: 160 },
    { id: 3, name: "Avocado Salad", description: "Fresh greens and avocado slices", category: "Starter", price: 95 },
    { id: 4, name: "Orange Juice", description: "Freshly squeezed natural orange juice", category: "Drink", price: 45 },
  ];

  it("matches dish by exact name case-insensitively", () => {
    const results = filterDishes(mockMeals, "lava cake");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Lava Cake");
  });

  it("matches dish by partial name substring", () => {
    const results = filterDishes(mockMeals, "lava");
    expect(results[0].name).toBe("Lava Cake");
  });

  it("matches dish by description text", () => {
    const results = filterDishes(mockMeals, "molten");
    expect(results.some((m) => m.name === "Lava Cake")).toBe(true);
  });

  it("matches dish by category", () => {
    const results = filterDishes(mockMeals, "dessert");
    expect(results.some((m) => m.name === "Lava Cake")).toBe(true);
  });

  it("returns empty array for empty query or non-string query", () => {
    expect(filterDishes(mockMeals, "")).toEqual([]);
    expect(filterDishes(mockMeals, "   ")).toEqual([]);
    expect(filterDishes(mockMeals, null)).toEqual([]);
  });
});
