import { useNavigate } from "react-router";
import { useFavoritesStore } from "../../store";
import RegularFoodCard from "../UI/RegularFoodCard";

/**
 * FavoritesList Component
 * Displays the grid of favorite items or an empty state.
 */
export default function FavoritesList() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const navigate = useNavigate();

  return (
    <div className="mb-16 pt-20">
       <h2 className="text-left text-2xl md:text-3xl font-bold text-green-700 mb-8 border-b border-gray-100 pb-4">
            Favorite Meals
        </h2>

      {favorites.length === 0 ? (
          <div className="text-center py-12">
              <p className="text-gray-500 text-lg">You haven't added any favorites yet.</p>
              <button 
                 onClick={() => navigate("/")}
                 className="mt-4 text-orange-500 font-semibold hover:underline cursor-pointer"
              >
                 Browse Menu
              </button>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {favorites.map((item) => (
              <RegularFoodCard key={item.id} meal={item} />
          ))}
          </div>
      )}
    </div>
  );
}
