import { useMenuStore } from "../../store/menuStore";
import { useMemo } from "react";
import MenuFilter from "./Sections/MenuFilter";

import { mockMeals } from "../../mocks/meals";
import OffersSection from "./Sections/OffersSection";
import SuggestedMealsSection from "./Sections/SuggestedMealsSection";

export default function Menu() {
  const { meal, category } = useMenuStore();

  const filteredMenu = useMemo(() => {
    return mockMeals.filter((item) => {
      const mealMatch = meal === "all" || item.mainCategory === meal;

      const categoryMatch = category === "All" || item.category === category;

      return mealMatch && categoryMatch;
    });
  }, [meal, category]);

  return (
    <div
      className="
       
        bg-white 
        min-h-screen
        px-4 md:px-10 lg:px-20
        overflow-hidden
      "
    >
      <div className="py-12 md:py-16 lg:py-20 space-y-5 md:space-y-2 lg:space-y-2">
        <MenuFilter />

        <OffersSection items={filteredMenu} />
        <SuggestedMealsSection items={filteredMenu} />
      </div>
    </div>
  );
}
