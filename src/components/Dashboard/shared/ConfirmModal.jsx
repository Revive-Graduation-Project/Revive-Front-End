import { FiAlertTriangle } from "react-icons/fi";

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel, confirmClassName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-in">
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2">
            <FiAlertTriangle size={32} />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900 leading-tight">
            {title || "Are you sure?"}
          </h2>
          <p className="text-[14px] font-medium text-gray-500 leading-relaxed">
            {message || "This action cannot be undone. Do you wish to proceed?"}
          </p>
          <div className="mt-4 flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${confirmClassName || "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30"}`}
            >
              {confirmLabel || "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
