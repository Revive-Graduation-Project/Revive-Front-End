import { useState } from "react";
import { FiChevronDown, FiLock } from "react-icons/fi";
import { useNavigate } from "react-router";
import { formatCurrency } from "../../utils/formatters";

/**
 * OrderSummary Component
 * 
 * An essential sidebar component that provides a real-time price breakdown.
 * 
 * Features:
 * - Sticky Position: Remains visible as the user scrolls through categories or cart items.
 * - Collapsible Details: Optionally shows an expandable list of cart items.
 * - Dynamic Action: The primary button disables automatically if the cart is empty.
 */
export default function OrderSummary({ 
  items, 
  subtotal, 
  delivery, 
  total, 
  buttonText = "Checkout",
  buttonLink = "/checkout",
  showItems = false,
  onEdit
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Order summary</h2>
        {onEdit && (
          <button 
            type="button"
            onClick={onEdit}
            className="cursor-pointer text-green-600 hover:text-green-700 text-sm font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {/* Item count */}
      {items && items.length > 0 && (
        <p className="text-sm text-gray-500 mb-4">({items.length} items)</p>
      )}

      {/* Collapsible Items List */}
      {showItems && items && items.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            <span>Show {isExpanded ? "less" : "more"}</span>
            <FiChevronDown className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          
          {isExpanded && (
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-500 shrink-0">
                    <img 
                      src={item.imageUrl || item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-orange-500">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery</span>
          <span className="font-medium">{formatCurrency(delivery)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
          <span className="text-green-600">Total</span>
          <span className="text-orange-500">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Action Button */}
      {buttonLink && (
        <button
          type="button"
          onClick={() => items && items.length > 0 && navigate(buttonLink)}
          disabled={!items || items.length === 0}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            !items || items.length === 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
              : "cursor-pointer bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {buttonText}
        </button>
      )}

      {/* Secure Checkout Indicator */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <FiLock />
        <span>Secure checkout</span>
      </div>
    </div>
  );
}
