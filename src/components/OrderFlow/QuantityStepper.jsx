import { FiMinus, FiPlus } from "react-icons/fi";

/**
 * QuantityStepper Component
 * Reusable input for incrementing/decrementing numbers.
 * @param {number} quantity - Current value
 * @param {Function} onIncrease - Increment handler
 * @param {Function} onDecrease - Decrement handler
 * @param {string} size - Size variant ('sm', 'md', 'lg')
 */
export default function QuantityStepper({ quantity, onIncrease, onDecrease, size = "md" }) {
  const sizeClasses = {
    sm: "text-sm px-2 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-lg px-4 py-2"
  };

  const buttonSize = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  };

  return (
    <div className="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden bg-white">
      <button
        onClick={onDecrease}
        className={`${buttonSize[size]} cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors active:bg-gray-200`}
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>
      
      <span className={`${sizeClasses[size]} font-medium min-w-8 text-center`}>
        {quantity}
      </span>
      
      <button
        onClick={onIncrease}
        className={`${buttonSize[size]} cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors active:bg-gray-200`}
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>
    </div>
  );
}
