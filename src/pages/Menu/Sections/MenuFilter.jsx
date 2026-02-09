// src/components/menu/MenuFilter.jsx
import { useState } from "react";

const meals = [
  { label: "All", value: "all", dataValue: "all" },
  { label: "Breakfast", value: "breakfast", dataValue: "Breakfast" },
  { label: "Lunch", value: "lunch", dataValue: "Lunch" },
  { label: "Dinner", value: "dinner", dataValue: "Dinner" },
];

const categories = ["All", "Beef", "Chicken", "Seafood", "mix Protein"];

const MenuFilter = ({ onFilterChange }) => {
  const [selectedMeal, setSelectedMeal] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleMealChange = (e) => {
    const uiValue = e.target.value;

    const mealObj = meals.find((m) => m.value === uiValue) || meals[0];
    const dataValue = mealObj.dataValue;

    setSelectedMeal(uiValue);
    onFilterChange({ meal: dataValue, category: activeCategory });
  };

  const handleCategoryChange = (cat) => {
    const mealObj = meals.find((m) => m.value === selectedMeal);
    const dataValue = mealObj.dataValue;

    setActiveCategory(cat);
    onFilterChange({ meal: dataValue, category: cat });
  };

  return (
    <div className="flex items-center gap-6  pt-40 md:pt-20 lg:pt-20 pb-10 ">
      <select
        value={selectedMeal}
        onChange={handleMealChange}
        className="bg-transparent font-medium cursor-pointer"
      >
        {meals.map((meal) => (
          <option key={meal.value} value={meal.value}>
            {meal.label} menu
          </option>
        ))}
      </select>

      <div className="text-gray-400">|</div>

      <div className="flex gap-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`pb-2 font-medium relative transition-all 
            ${
              activeCategory === cat
                ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500"
                : "text-gray-700 hover:text-gray-900"
            }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuFilter;
