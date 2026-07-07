import { useState, useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";

// ── Helpers ───────────────────────────────────────────────────────────────────
const parseStock = (v) => v.replace(/[^\d.]/g, "").replace(/^(\d*\.?\d*).*/, "$1");

const validateStock = (v) => {
  const trimmed = v.trim();
  if (!trimmed) return "Stock is required";
  const num = parseFloat(trimmed);
  if (isNaN(num) || num < 0) return "Must be a valid positive number";
  return "";
};

// ── Component ─────────────────────────────────────────────────────────────────
/**
 * IngredientModal — Edit mode only.
 * Updates a single ingredient's stock via PATCH /api/ingredients/{id}/stock.
 * Calls onSubmit({ stock: number }) when the form is valid.
 */
function IngredientModal({ isOpen, onClose, onSubmit, initialData, isPending, isSuccess }) {
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  // Reset form whenever the modal opens
  useEffect(() => {
    if (isOpen && initialData) {
      setStock(String(initialData.stock ?? ""));
      setError("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const v = parseStock(e.target.value);
    setStock(v);
    if (error) setError(validateStock(v));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateStock(stock);
    if (err) { setError(err); return; }
    onSubmit({ stock: parseFloat(stock) });
  };

  const inputClass = error
    ? "border-red-400 focus:border-red-400"
    : "border-gray-200 focus:border-orange-400";

  const submitLabel = isPending ? "Saving..." : isSuccess ? "Saved!" : "Save Changes";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-[18px] font-bold text-[#1a1a1a]">Update Stock</h2>
            {initialData?.name && (
              <p className="text-[12px] text-gray-400 mt-0.5">{initialData.name}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5" noValidate>
          <div>
            <label htmlFor="stockInput" className="block text-[13px] font-bold text-gray-700 mb-1.5">
              Stock Amount (g)
            </label>
            <input
              id="stockInput"
              type="text"
              inputMode="decimal"
              value={stock}
              onChange={handleChange}
              placeholder="e.g. 5000"
              autoFocus
              className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none transition-colors ${inputClass}`}
            />
            {error && (
              <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={11} /> {error}
              </p>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || isSuccess}
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default IngredientModal;

