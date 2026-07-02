
import QuantityStepper from "../QuantityStepper";
import { formatCurrency } from "../../../utils/formatters";
import { MAX_QUANTITY } from "../../../constants";

const ProductActions = ({ product, quantity, setQuantity, error, clearError, onAddToCart }) => {
  return (
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
        type="button"
        onClick={onAddToCart}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductActions;
