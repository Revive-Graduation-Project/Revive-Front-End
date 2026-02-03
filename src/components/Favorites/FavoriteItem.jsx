import { FiHeart, FiShoppingCart } from "react-icons/fi";
import useFavoritesStore from "../../store/favoritesStore";
import { useOrderStore } from "../../store";

/**
 * FavoriteItem Component
 * A card representing a saved product.
 * Features:
 * - Shows product image, name, price, calories.
 * - Button to remove from favorites.
 * - Button to move to cart.
 * 
 * @param {Object} props
 * @param {Object} props.item - Product object
 * @param {boolean} [props.showHeart=true] - Whether to show the favorite toggle button
 */
export default function FavoriteItem({ item, showHeart = true }) {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(item.id));
  const addItem = useOrderStore((state) => state.addItem);
  const openCartDrawer = useOrderStore((state) => state.openCartDrawer);

  const handleAddToCart = () => {
    addItem(item, 1);
    openCartDrawer();
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] p-5 relative flex flex-col items-center text-center hover:shadow-lg transition-shadow">
        
       {/* Heart Icon (Top Right) */}
       {showHeart && (
         <button
            onClick={() => toggleFavorite(item)}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors active:scale-95"
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FiHeart 
              className={`text-xl transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
              }`} 
            />
          </button>
       )}

      {/* Image (Circular & Centered) */}
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-sm mb-4">
           <img 
             src={item.imageUrl || item.image} 
             alt={item.name} 
             className="w-full h-full object-cover"
           />
      </div>

      {/* Content */}
      <h3 className="font-bold text-gray-800 text-lg mb-2">
        {item.name}
      </h3>
      
      <p className="text-xs text-gray-400 mb-6 line-clamp-2 px-2 min-h-[2.5em]">
        {item.description || "Fresh and healthy ingredients for a balanced diet."}
      </p>

      {/* Macros Grid */}
      <div className="w-full grid grid-cols-2 gap-y-2 gap-x-4 mb-6 px-2">
         {/* Row 1 */}
         <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-800">Fat</span>
            <span className="text-green-600 font-medium">{item.fat || 0}g</span>
         </div>
         <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-800">Pro</span>
            <span className="text-green-600 font-medium">{item.protein || 0}g</span>
         </div>
         
         {/* Row 2 */}
         <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-800">Cal</span>
            <span className="text-green-600 font-medium">{item.calories || 0}</span>
         </div>
         <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-800">Sug</span>
            <span className="text-green-600 font-medium">{item.sugar || 0}g</span>
         </div>
      </div>

      {/* Footer: Price & Button */}
      <div className="w-full flex items-center justify-between mt-auto">
        <span className="text-xl font-bold text-gray-900">
            {item.price.toFixed(0)}$
        </span>
        
        <button
          onClick={handleAddToCart}
          className="cursor-pointer bg-amber-400 hover:bg-amber-500 text-white text-xs font-bold py-2 px-6 rounded-full shadow-md shadow-amber-400/30 transition-all active:scale-95"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
