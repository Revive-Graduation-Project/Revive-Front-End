import { FiTrash2 } from "react-icons/fi";
import QuantityStepper from "./QuantityStepper";

/**
 * CartItem Component
 * Single row representation of an item in the cart.
 * Used in both main CartPage and SideCartDrawer.
 * @param {Object} item - Cart item object
 * @param {Function} onUpdateQuantity - Handler to update qty
 * @param {Function} onRemove - Handler to remove item
 * @param {boolean} showDelete - Whether to show delete button
 * @param {boolean} showCalories - Whether to show calorie info
 */
export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  showDelete = true,
  showCalories = false 
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-orange-500 shrink-0">
        <img 
          src={item.imageUrl || item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
        {showCalories && item.calories && (
          <p className="text-sm text-gray-500">
            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-xs">
              {item.calories} cal
            </span>
          </p>
        )}
        
        {/* Quantity Stepper */}
        <div className="mt-2">
          <QuantityStepper
            quantity={item.quantity}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
            size="sm"
          />
        </div>
      </div>

      {/* Price and Delete */}
      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-orange-500 text-lg whitespace-nowrap">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        
        {showDelete && (
          <button
            onClick={() => onRemove(item.id)}
            className="cursor-pointer text-red-500 hover:text-red-700 p-2 transition-colors"
            aria-label="Remove item"
          >
            <FiTrash2 className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
}
