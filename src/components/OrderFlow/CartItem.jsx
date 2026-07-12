import { useState, useMemo } from "react";
import { FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "../../utils/formatters";
import QuantityStepper from "./QuantityStepper";
import { useMenuItems } from "../../hooks/dashboard/useMenuItems";
import DishDetailsModal from "../Dashboard/shared/DishDetailsModal";

/**
 * CartItem Component
 * 
 * A modular row component representing a single item in the shopping cart.
 * Designed for reuse in both the full `CartSection` and the `SideCartDrawer`.
 * 
 * UI Flexibility:
 * - Can hide/show the delete button and calorie info based on context.
 * - Handles subtotal price calculation internally for the display.
 * - Clickable image and title to open the full DishDetailsModal.
 */
export default function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  showDelete = true,
  showCalories = false 
}) {
  const [showDetails, setShowDetails] = useState(false);
  const { data: rawMeals = [] } = useMenuItems({});

  // Merge backend dish details with cart item so description, nutrients, ingredients show up in the modal
  const fullDish = useMemo(() => {
    const found = rawMeals.find((m) => String(m.id) === String(item.id));
    return found ? { ...found, ...item, ingredients: found.ingredients, description: found.description, nutrients: found.nutrients } : item;
  }, [rawMeals, item]);

  return (
    <>
      <div className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
        {/* Product Image */}
        <div 
          onClick={() => setShowDetails(true)}
          title="Click to view full dish details"
          className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-orange-100 shrink-0 cursor-pointer hover:scale-105 transition-transform shadow-sm"
        >
          <img 
            src={item.imageUrl || item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 
            onClick={() => setShowDetails(true)}
            title="Click to view full dish details"
            className="font-medium text-gray-800 truncate cursor-pointer hover:text-orange transition-colors"
          >
            {item.name}
          </h3>
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="text-xs text-orange hover:text-orange-600 underline font-medium mt-0.5 block cursor-pointer"
          >
            Click to view details →
          </button>
          {showCalories && item.calories && (
            <p className="text-sm text-gray-500 mt-0.5">
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
          <p className="font-bold text-orange text-lg whitespace-nowrap">
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

      {/* Full Dish Details Modal */}
      <DishDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        dish={fullDish}
      />
    </>
  );
}
