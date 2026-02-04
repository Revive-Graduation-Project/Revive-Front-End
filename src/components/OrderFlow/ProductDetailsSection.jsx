import { useState } from "react";
import { useOrderStore } from "../../store";
import { formatCurrency } from "../../utils/formatters";
import { MAX_QUANTITY } from "../../constants";
import QuantityStepper from "./QuantityStepper";

/**
 * ProductDetailsSection Component
 * Displays full details of a selected product in a side panel next to the image.
 * Matches specific layout: Image on circular orange gradient background,
 * asymmetric grid, and bold nutrition/ingredients badges.
 */
export default function ProductDetailsSection({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useOrderStore((state) => state.addItem);
  const openCartDrawer = useOrderStore((state) => state.openCartDrawer);
  const error = useOrderStore((state) => state.error);
  const clearError = useOrderStore((state) => state.clearError);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[600px]">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl text-gray-400">?</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Product not found</h3>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <button 
          onClick={onClose}
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    // If there's an error in store (e.g. max qty), it will be shown via the 'error' state
    // We only close and open drawer if there's no error
    if (!useOrderStore.getState().error) {
      openCartDrawer();
      onClose();
    }
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-[1fr_1.2fr] h-full overflow-hidden bg-white rounded-3xl">
      {/* Close Button (Absolute Top Right for both) */}
      <button 
        onClick={onClose}
        className="absolute top-14 right-6 md:top-6 md:right-6 z-5 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-gray-700 transition-all cursor-pointer border border-gray-100"
        aria-label="Close details"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>

      {/* Left Column: Image Area */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-gray-50/50">
        {/* Circular Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-gray-100 rounded-full shadow-lg flex items-center justify-center overflow-hidden">
             {/* Product Image */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover z-10 hover:scale-105 transition-transform duration-500"
            />
        </div>
        
        {/* Product Name Below Image */}
        <div className="mt-80 md:mt-[420px] text-center z-10">
          <h2 className="text-2xl pt-10 font-bold text-gray-900 drop-shadow-sm">
            {product.name}
          </h2>
        </div>
      </div>

      {/* Right Column: Details Panel */}
      <div className="flex flex-col p-8 overflow-y-auto max-h-[85vh] md:max-h-full scrollbar-hide">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-[#0A2540] mb-6">
              Details
            </h1>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Nutrition Info - 2x2 Grid */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            {[
              { label: "Fat", value: product.fat + " g" },
              { label: "Pro", value: product.protein + " g" },
              { label: "Cal", value: product.calories + " kcal" },
              { label: "Sug", value: product.sugar + " g" },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center group">
                <span className="text-gray-900 font-extrabold text-sm uppercase">
                  {stat.label}
                </span>
                <span className="text-green-700 font-black text-base">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Ingredients Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">
                Ingredients
              </h3>
              <span className="text-xs text-gray-500">
                {product.ingredients?.length || 0} ingredients
              </span>
            </div>
            <div className="flex gap-4">
              {product.ingredients?.map((ing, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group cursor-help">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-full shadow-sm group-hover:bg-white group-hover:shadow-md group-hover:border-orange-200 transition-all font-bold text-xl">
                    {ing.icon || "🥗"}
                  </div>
                  <span className="text-xs text-gray-600">
                    {ing.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price & Quantity Controls */}
          <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-6">
            
            {/* Error Message */}
            {error && (
              <div className="p-2 bg-red-50 text-red-500 text-xs rounded border border-red-100 animate-pulse">
                {error}
              </div>
            )}

            <div className="flex justify-between items-center">
               <span className="text-lg font-bold text-gray-800">Price</span>
               <span className="text-xl font-bold text-black">
                 {formatCurrency(product.price)}
               </span>
            </div>

            <div className="flex justify-between items-center">
               <span className="text-lg font-bold text-gray-800">Quantity</span>
               <QuantityStepper
                 quantity={quantity}
                 onIncrease={() => {
                   if (quantity < MAX_QUANTITY) {
                     setQuantity(quantity + 1);
                     clearError();
                   }
                 }}
                 onDecrease={() => {
                   setQuantity(Math.max(1, quantity - 1));
                   clearError();
                 }}
               />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
