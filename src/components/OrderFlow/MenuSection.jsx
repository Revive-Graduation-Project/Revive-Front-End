import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { mockMeals, categories } from "../../mocks/meals";
import { useFavoritesStore } from "../../store";

/**
 * MenuSection Component
 * Displays grid of products with category filtering.
 * @param {Function} onProductClick - Handler for when a product is clicked
 */
export default function MenuSection({ onProductClick }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Favorites Logic
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  const filteredProducts = selectedCategory === "All" 
    ? mockMeals 
    : mockMeals.filter(meal => meal.category === selectedCategory);

  const handleFavoriteClick = (e, product) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      {/* Category Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`cursor-pointer px-4 md:px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-sm md:text-base ${
              selectedCategory === category
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow relative"
          >
             {/* Favorite Button (Absolute Top Right) */}
             <button
                onClick={(e) => handleFavoriteClick(e, product)}
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all transform active:scale-90"
              >
                <FiHeart 
                  className={`text-xl transition-colors ${
                    isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                  }`} 
                />
              </button>

            {/* Product Image */}
            <div className="w-full aspect-square bg-orange-500 flex items-center justify-center relative overflow-hidden">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-orange-600 transition-transform group-hover:scale-110">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{product.calories} cal</span>
                <span className="text-orange-500 font-bold text-lg">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No products found in this category</p>
        </div>
      )}
    </div>
  );
}
