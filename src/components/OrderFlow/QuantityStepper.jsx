import { FiMinus, FiPlus } from "react-icons/fi";

/**
 * QuantityStepper Component
 * 
 * A minimal, pill-shaped control for managing numeric counts.
 * Strictly follows accessibility guidelines with dedicated ARIA labels 
 * for increment and decrement actions.
 */
export default function QuantityStepper({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="inline-flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
      <button
        type="button"
        onClick={onDecrease}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <FiMinus className="text-gray-600 text-sm" />
      </button>
      
      <span className="px-3 font-medium text-gray-800 text-sm min-w-8 text-center">
        {quantity}
      </span>
      
      <button
        type="button"
        onClick={onIncrease}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <FiPlus className="text-gray-600 text-sm" />
      </button>
    </div>
  );
}
