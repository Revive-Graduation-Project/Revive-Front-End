// src/components/menu/MenuFilter.jsx
import { useMenuStore } from "../../../store/menuStore";

const meals = [
  { label: "All", value: "all", dataValue: "all" },
  { label: "Breakfast", value: "breakfast", dataValue: "Breakfast" },
  { label: "Lunch", value: "lunch", dataValue: "Lunch" },
  { label: "Dinner", value: "dinner", dataValue: "Dinner" },
];

const categories = ["All", "Beef", "Chicken", "Seafood", "mix Protein"];

const MenuFilter = () => {
  const { meal, category, setMeal, setCategory } = useMenuStore();

  const handleMealChange = (e) => {
    const uiValue = e.target.value;
    const mealObj = meals.find((m) => m.value === uiValue) || meals[0];
    setMeal(mealObj.dataValue);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };

  return (
    <div className="flex items-center gap-6 pt-40 md:pt-20 pb-10">
      <select
        value={meals.find((m) => m.dataValue === meal)?.value || "all"}
        onChange={handleMealChange}
        className="bg-transparent font-medium cursor-pointer"
      >
        {meals.map((mealItem) => (
          <option key={mealItem.value} value={mealItem.value}>
            {mealItem.label} menu
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
                category === cat
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
