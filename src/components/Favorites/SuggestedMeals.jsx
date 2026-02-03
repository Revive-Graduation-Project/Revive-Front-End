import { useFavoritesStore } from "../../store";
import { mockMeals } from "../../mocks/meals";
import FavoriteItem from "./FavoriteItem";

/**
 * SuggestedMeals Component
 * Displays random suggestions excluding current favorites.
 */
export default function SuggestedMeals() {
  const favorites = useFavoritesStore((state) => state.favorites);

  // Get 4 random items for suggestions (excluding favorites)
  // In a real app, this might come from a recommendation API
  const suggestions = mockMeals
    .filter(meal => !favorites.some(fav => fav.id === meal.id))
    .slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
      <div>
        <h2 className="text-left text-2xl md:text-3xl font-bold text-green-700 mb-8 border-b border-gray-100 pb-4">
            Suggested Meals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {suggestions.map((item) => (
                <FavoriteItem key={item.id} item={item} />
            ))}
        </div>
      </div>
  );
}
