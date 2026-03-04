// src/components/menu/MenuFilter.jsx
import { useState, useRef, useEffect } from "react";
import { useMenuStore } from "../../../store/menuStore";

const meals = [
  { label: "All", value: "all", dataValue: "all", emoji: "🍽️" },
  {
    label: "Breakfast",
    value: "breakfast",
    dataValue: "Breakfast",
    emoji: "🌅",
  },
  { label: "Lunch", value: "lunch", dataValue: "Lunch", emoji: "☀️" },
  { label: "Dinner", value: "dinner", dataValue: "Dinner", emoji: "🌙" },
];

const categories = ["All", "Beef", "Chicken", "Seafood", "mix Protein"];

const MenuFilter = () => {
  const { meal, category, setMeal, setCategory } = useMenuStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedMeal = meals.find((m) => m.dataValue === meal) || meals[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMealSelect = (mealItem) => {
    setMeal(mealItem.dataValue);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-6 pt-40 md:pt-20 pb-10">
      {/* Custom Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 font-semibold text-orange-600 hover:bg-orange-100 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <span>{selectedMeal.emoji}</span>
          <span>{selectedMeal.label} Menu</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
            {meals.map((mealItem) => (
              <button
                key={mealItem.value}
                onClick={() => handleMealSelect(mealItem)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150 cursor-pointer
                  ${
                    selectedMeal.value === mealItem.value
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="text-lg">{mealItem.emoji}</span>
                <span>{mealItem.label} Menu</span>
                {selectedMeal.value === mealItem.value && (
                  <span className="ml-auto text-orange-500">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="text-gray-300 text-xl">|</div>

      {/* Category Pills */}
      <div className="flex gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                category === cat
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuFilter;
