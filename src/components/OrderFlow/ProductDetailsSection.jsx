import { useState } from "react";
import { useOrderStore } from "../../store";
import QuantityStepper from "./QuantityStepper";

/**
 * ProductDetailsSection Component
 * Modal-like section showing full product info, nutrition, and ingredients.
 * Allows user to choose quantity and add to cart.
 * @param {Object} product - The product object to display
 * @param {Function} onClose - Handler to close the details view
 */
export default function ProductDetailsSection({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useOrderStore((state) => state.addItem);
  const openCartDrawer = useOrderStore((state) => state.openCartDrawer);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCartDrawer();
    onClose();
  };

  // Ingredients are directly embedded in the new data structure
  const productIngredients = product.ingredients || [];

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-orange-500 shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <button
              onClick={onClose}
              className="cursor-pointer self-end text-gray-400 hover:text-gray-600 text-2xl mb-4"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">Details</h2>

            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              {product.name}
            </h3>

            <p className="text-gray-600 mb-4">{product.description}</p>

            {/* Nutritional Info */}
            <div className="flex gap-6 mb-4">
              <div>
                <span className="text-gray-500 text-sm">Protein</span>
                <p className="font-semibold">{product.protein}g</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Carbs</span>
                <p className="font-semibold">{product.carbs}g</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Fat</span>
                <p className="font-semibold">{product.fat}g</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Calories</span>
                <p className="font-semibold">{product.calories}</p>
              </div>
            </div>

            {/* Ingredients */}
            {productIngredients.length > 0 && (
              <div className="mb-6">
                <h4 className="text-gray-700 font-medium mb-2">Ingredients</h4>
                <div className="flex gap-2 flex-wrap">
                  {productIngredients.map((ingredient) => (
                    <span key={ingredient.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                      {ingredient.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price and Quantity */}
            <div className="space-y-4">
              <div>
                <h4 className="text-gray-700 font-medium mb-2">Price</h4>
                <p className="text-orange-500 font-bold text-2xl">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              <div>
                <h4 className="text-gray-700 font-medium mb-2">Quantity</h4>
                <QuantityStepper
                  quantity={quantity}
                  onIncrease={() => setQuantity(quantity + 1)}
                  onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                  size="lg"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors mt-4"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
