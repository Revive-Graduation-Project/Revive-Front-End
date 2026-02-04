import { useMemo } from "react";
import { useFavoritesStore } from "../../store";
import { mockMeals } from "../../mocks/meals";
import FavoriteItem from "./FavoriteItem";

/**
 * SuggestedMeals Component
 * Displays random suggestions that stay stable even if favorited.
 */
export default function SuggestedMeals() {
  // We still subscribe to favorites to update the heart icons
  const favorites = useFavoritesStore((state) => state.favorites);

  /**
   * Stable Suggestions Logic
   * We want to pick items that the user doesn't CURRENTLY have in favorites,
   * but we don't want the list to change or items to "disappear" after they
   * click favorite (the 'move' behavior).
   * 
   * By using an empty dependency array [], we calculate these suggestions
   * once when the component mounts and keep them stable.
   */
  const suggestions = useMemo(() => {
    const currentFavorites = useFavoritesStore.getState().favorites;
    return mockMeals
      .filter(meal => !currentFavorites.some(fav => fav.id === meal.id))
      .slice(0, 4);
  }, []); 

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
