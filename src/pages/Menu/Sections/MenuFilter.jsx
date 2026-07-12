import { useMemo } from "react";
import { useMenuStore } from "../../../store/menuStore";
import { useMenuItems, useMenuCategories, isMenuItemActive } from "../../../hooks/dashboard/useMenuItems";

const MenuFilter = () => {
  const { selectedCategory, setSelectedCategory } = useMenuStore();
  const { data: rawMeals = [] } = useMenuItems({});
  const { data: backendCategories = [] } = useMenuCategories();

  // Build categories strictly from backend data (no mock categories)
  const categories = useMemo(() => {
    const catSet = new Set(["All"]);

    // Add categories returned from backend categories endpoint
    if (Array.isArray(backendCategories)) {
      backendCategories.forEach((cat) => {
        const name = typeof cat === "object" ? cat?.name : cat;
        if (name && typeof name === "string" && name.trim()) {
          catSet.add(name.trim());
        }
      });
    }

    // Add categories present on active menu items fetched from backend
    const activeMeals = rawMeals.filter(isMenuItemActive);
    activeMeals.forEach((item) => {
      if (item.category && item.category.trim()) {
        catSet.add(item.category.trim());
      }
    });

    return Array.from(catSet);
  }, [backendCategories, rawMeals]);

  return (
    <div className="pt-6 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
          Explore by <span className="text-orange">Categories</span>
        </h3>
      </div>
      <div className="flex gap-2 md:gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer
              ${
                selectedCategory === cat
                  ? "bg-orange text-white shadow-md shadow-orange/30 scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
