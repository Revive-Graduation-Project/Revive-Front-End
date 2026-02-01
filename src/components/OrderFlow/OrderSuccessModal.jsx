import { FiCheckCircle } from "react-icons/fi";

/**
 * OrderSuccessModal Component
 * Simple success popup shown after successful order placement.
 * @param {boolean} isOpen - Controls visibility
 * @param {Function} onClose - Handler to close modal and reset flow
 */
export default function OrderSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 z-50 w-full max-w-sm text-center animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-5xl text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We've received it and will start preparing it right away.
        </p>

        <button
          onClick={onClose}
          className="cursor-pointer w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Continue Shopping
        </button>
      </div>
    </>
  );
}
