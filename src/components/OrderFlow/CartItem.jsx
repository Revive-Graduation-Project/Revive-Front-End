import { FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "../../utils/formatters";
import QuantityStepper from "./QuantityStepper";

/**
 * CartItem Component
 * 
 * A modular row component representing a single item in the shopping cart.
 * Designed for reuse in both the full `CartSection` and the `SideCartDrawer`.
 * 
 * UI Flexibility:
 * - Can hide/show the delete button and calorie info based on context.
 * - Handles subtotal price calculation internally for the display.
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
          />
        </div>
      </div>

      {/* Price and Delete */}
      <div className="flex flex-col items-end gap-2">
        <p className="font-bold text-orange-500 text-lg whitespace-nowrap">
          {formatCurrency(item.price * item.quantity)}
        </p>
        
        {showDelete && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="cursor-pointer text-red-500 hover:text-red-700 p-2 transition-colors focus:ring-2 focus:ring-red-500 rounded"
            aria-label={`Remove ${item.name} from cart`}
          >
            <FiTrash2 className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
}
