import {
  useMenuStore,
  useAuthStore,
  useRecommendationStore,
} from "../../store";
import { useMemo, useEffect } from "react";
import MenuFilter from "./Sections/MenuFilter";

import OffersSection from "./Sections/OffersSection";
import SuggestedMealsSection from "./Sections/SuggestedMealsSection";

export default function Menu() {
  const { user } = useAuthStore();
  const { recommendations, fetchRecommendations, isLoading, error } =
    useRecommendationStore();
  const { meal, category } = useMenuStore();

  const filteredMenu = useMemo(() => {
    return recommendations.filter((item) => {
      const mealMatch = meal === "all" || item.mainCategory === meal;
      const categoryMatch = category === "All" || item.category === category;
      return mealMatch && categoryMatch;
    });
  }, [meal, category, recommendations]);

  useEffect(() => {
    fetchRecommendations({
      userHealth: user?.health ?? null,
      preferences: user?.preferences ?? [],
    });
  }, [user, fetchRecommendations]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading recommendations...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );

  if (recommendations.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">No recommendations available</p>
      </div>
    );

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
