import { useState, useMemo, useCallback } from "react";
import { filterDishes } from "./dishSearchUtils";

/**
 * Custom hook providing dish-only search filtering, dropdown state,
 * and keyboard navigation for Menu dishes.
 */
export function useDishSearch(meals = [], { onSelectDish } = {}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(
    () => filterDishes(meals, query),
    [meals, query]
  );

  const handleQueryChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(val.trim().length > 0);
    setSelectedIndex(0);
  }, []);

  const handleSelect = useCallback(
    (dish) => {
      if (!dish) return;
      setQuery(dish.name || "");
      setIsOpen(false);
      setSelectedIndex(0);
      if (typeof onSelectDish === "function") {
        onSelectDish(dish);
      }
    },
    [onSelectDish]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        e.currentTarget.blur?.();
        return;
      }

      if (!isOpen || results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedDish = results[selectedIndex];
        if (selectedDish) {
          handleSelect(selectedDish);
        }
      }
    },
    [isOpen, results, selectedIndex, handleSelect]
  );

  const clearQuery = useCallback(() => {
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(0);
    if (typeof onSelectDish === "function") {
      onSelectDish(null);
    }
  }, [onSelectDish]);

  return {
    query,
    setQuery,
    results,
    isOpen,
    selectedIndex,
    setSelectedIndex,
    handleQueryChange,
    handleSelect,
    handleKeyDown,
    clearQuery,
    setIsOpen,
  };
}
