import {
  useMenuStore,
  useAuthStore,
  useRecommendationStore,
} from "../../store";
import useRestaurantStore from "../../store/restaurantStore";
import { useMemo, useEffect } from "react";
import MenuFilter from "./Sections/MenuFilter";
import OffersSection from "./Sections/OffersSection";
import SuggestedMealsSection from "./Sections/SuggestedMealsSection";
import RegularFood from "../Home/Sections/RegularFood";

export default function Menu() {
  const { user } = useAuthStore();
  const {
    recommendations,
    fetchRecommendations,
    isLoading: recLoading,
    error: recError,
  } = useRecommendationStore();
  const {
    meals,
    fetchMeals,
    loading: mealsLoading,
    error: mealsError,
  } = useRestaurantStore();
  const { selectedCategory } = useMenuStore();

  const isGuest = !user;

  useEffect(() => {
    if (isGuest) {
      if (meals.length === 0) fetchMeals();
    } else {
      fetchRecommendations({
        userHealth: user?.health ?? null,
        preferences: user?.preferences ?? [],
      });
    }
  }, [user, isGuest]);

  const sourceItems = isGuest ? meals : recommendations;
  const isLoading = isGuest ? mealsLoading : recLoading;
  const error = isGuest ? mealsError : recError;

  const filteredMenu = useMemo(() => {
    return sourceItems.filter((item) => {
      return selectedCategory === "All" || item.category === selectedCategory;
    });
  }, [selectedCategory, sourceItems]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );

  if (sourceItems.length === 0)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium">No meals available</p>
      </div>
    );

  return (
    <div className="bg-white min-h-screen px-4 md:px-10 lg:px-20 overflow-hidden">
      <div className="py-12 md:py-16 lg:py-20 space-y-5 md:space-y-2 lg:space-y-2">
        <MenuFilter />
        <OffersSection />
        {isGuest ? (
          <RegularFood items={filteredMenu} />
        ) : (
          <SuggestedMealsSection items={filteredMenu} />
        )}
      </div>
    </div>
  );
}
