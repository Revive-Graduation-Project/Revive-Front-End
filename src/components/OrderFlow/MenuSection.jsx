import { useState } from "react";
import { useNavigate } from "react-router";
import { mockMeals, categories } from "../../mocks/meals";

/**
 * MenuSection Component
 * Displays grid of products with category filtering.
 * @param {Function} onProductClick - Handler for when a product is clicked
 */
export default function MenuSection({ onProductClick }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All" 
    ? mockMeals 
    : mockMeals.filter(meal => meal.category === selectedCategory);

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
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            {/* Product Image */}
            <div className="w-full aspect-square bg-orange-500 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-orange-600">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">
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
