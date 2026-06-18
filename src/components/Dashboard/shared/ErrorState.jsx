import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

/**
 * Renders an error state UI with an alert icon, message, and optional retry button.
 * @param {string} [message="Something went wrong."] - The error message to display.
 * @param {Function} [onRetry] - Callback invoked when the retry button is clicked. If provided, displays a "Try Again" button.
 * @return {JSX.Element} The error state component.
 */
export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <FiAlertCircle size={28} className="text-red-400" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-gray-700">Failed to load data</p>
        <p className="text-xs text-gray-400">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 mt-1 px-4 py-2 bg-white border border-gray-200 hover:border-orange-400 text-gray-600 hover:text-orange-500 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer"
        >
          <FiRefreshCw size={13} />
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
