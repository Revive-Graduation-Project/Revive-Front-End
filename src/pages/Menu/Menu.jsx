import { useMenuStore, useAuthStore } from "../../store";
import { useMenuItems } from "../../hooks/dashboard/useMenuItems";
import { useMemo } from "react";
import MenuFilter from "./Sections/MenuFilter";
import OffersSection from "./Sections/OffersSection";
import RegularFood from "../Home/Sections/RegularFood";
import SuggestedMeals from "../Home/Sections/SuggestedMeals";
import SuggestedMealsTeaser from "../Home/Sections/SuggestedMealsTeaser";

export default function Menu() {
  const { isAuthenticated } = useAuthStore();
  const {
    data: meals = [],
    isLoading: mealsLoading,
    error: mealsErrorObj,
  } = useMenuItems({});
  const mealsError = mealsErrorObj
    ? mealsErrorObj.message || "Failed to load meals"
    : null;
  const { selectedCategory } = useMenuStore();

  const filteredMeals = useMemo(() => {
    return meals.filter((item) => {
      return selectedCategory === "All" || item.category === selectedCategory;
    });
  }, [selectedCategory, meals]);

  return (
    <div className="bg-white min-h-screen px-4 md:px-10 lg:px-20 overflow-hidden">
      <div className="py-12 md:py-16 lg:py-20 space-y-5 md:space-y-2 lg:space-y-2">
        <MenuFilter />
        <OffersSection />

        {isAuthenticated ? (
          <SuggestedMeals selectedCategory={selectedCategory} />
        ) : (
          <SuggestedMealsTeaser />
        )}

        {mealsLoading && meals.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg font-medium text-gray-600">Loading menu...</p>
          </div>
        ) : mealsError && meals.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg font-medium text-red-500">{mealsError}</p>
          </div>
        ) : filteredMeals.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg font-medium text-gray-500">
              No meals available in this category
            </p>
          </div>
        ) : (
          <RegularFood items={filteredMeals} />
        )}
      </div>
    </div>
  );
}
