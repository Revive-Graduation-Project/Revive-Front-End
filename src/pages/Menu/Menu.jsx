import { useMemo, useState } from "react";
import MenuFilter from "./Sections/MenuFilter";

import { mockMeals } from "../../mocks/meals";
import OffersSection from "./Sections/OffersSection";
import SuggestedMealsSection from "./Sections/SuggestedMealsSection";

export default function Menu() {
  const [filters, setFilters] = useState({
    meal: "all",
    category: "All",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredMenu = useMemo(() => {
    return mockMeals.filter((item) => {
      const mealMatch =
        filters.meal === "all" || item.mainCategory === filters.meal;

      const categoryMatch =
        filters.category === "All" || item.category === filters.category;

      return mealMatch && categoryMatch;
    });
  }, [filters]);

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
        <MenuFilter onFilterChange={handleFilterChange} />
        <OffersSection items={filteredMenu} />
        <SuggestedMealsSection items={filteredMenu} />
      </div>
    </div>
  );
}
