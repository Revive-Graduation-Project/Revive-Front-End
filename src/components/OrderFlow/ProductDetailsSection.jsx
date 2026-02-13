import { useState } from "react";
import { useOrderStore } from "../../store";
import ProductImage from "./ProductDetails/ProductImage";
import ProductInfo from "./ProductDetails/ProductInfo";
import ProductActions from "./ProductDetails/ProductActions";

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
        type="button"
        onClick={onClose}
        className="absolute top-14 right-6 md:top-6 md:right-6 z-5 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-gray-700 transition-all cursor-pointer border border-gray-100"
        aria-label="Close details"
      >
        <span className="text-2xl leading-none">&times;</span>
      </button>

      {/* Left Column: Image Area */}
      <ProductImage product={product} />

      {/* Right Column: Details Panel */}
      <div className="flex flex-col p-8 overflow-y-auto max-h-[85vh] md:max-h-full scrollbar-hide">
        <ProductInfo product={product} />

        {/* Price & Quantity Controls */}
        <ProductActions 
            product={product} 
            quantity={quantity} 
            setQuantity={setQuantity}
            error={error}
            clearError={clearError}
            onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
