import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLayers, FiCheckCircle } from "react-icons/fi";
import { useBulkUpdateMenuDiscount } from "../../../hooks/dashboard/useMenuItems";
import { toast } from "../../../utils/toastUtils";
import ModalWrapper from "./ModalWrapper";

const BulkDiscountModal = ({ isOpen, onClose, selectedMeals, onClearSelection }) => {
  const [hasDiscount, setHasDiscount] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(10);

  const { mutate: bulkUpdate, isPending } = useBulkUpdateMenuDiscount();

  if (!isOpen || !selectedMeals || selectedMeals.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasDiscount && (discountPercentage <= 0 || discountPercentage > 100)) {
      return toast.error("Discount percentage must be between 1 and 100.");
    }

    const ids = selectedMeals.map(m => m.id);
    
    bulkUpdate(
      { ids, hasDiscount, discountPercentage: hasDiscount ? discountPercentage : 0 },
      { 
        onSuccess: () => {
          onClearSelection();
          onClose();
        } 
      }
    );
  };

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Bulk Discount" 
      icon={FiLayers}
      iconColorClass="text-purple-600"
      iconBgClass="bg-purple-100"
      headerBgClass="bg-purple-50/30"
      isPending={isPending}
    >
      <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 bg-purple-50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-purple-700 m-0 uppercase tracking-wide">Selected Items</p>
                  <p className="text-[20px] font-black text-purple-900 m-0">{selectedMeals.length} Meals</p>
                </div>
                <div className="flex -space-x-2">
                  {selectedMeals.slice(0, 3).map((m, i) => (
                    <img key={i} src={m.image || 'https://via.placeholder.com/40'} alt="meal" className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                  ))}
                  {selectedMeals.length > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shadow-sm z-10">
                      +{selectedMeals.length - 3}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[14px] font-bold text-gray-800 m-0">Apply Discount</p>
                  <p className="text-[11px] text-gray-500 m-0">Turn off to remove discounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={hasDiscount}
                    onChange={(e) => setHasDiscount(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <AnimatePresence>
                {hasDiscount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-6">
                      <label className="block text-[12px] font-bold text-gray-700 mb-2 uppercase">Discount Percentage (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={discountPercentage}
                          onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                          min="1"
                          max="100"
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 font-medium transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl text-gray-600 font-semibold text-[13px] hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[13px] flex items-center gap-2 shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? "Applying..." : <><FiCheckCircle size={16} /> Apply to All</>}
                </button>
              </div>
            </form>
    </ModalWrapper>
  );
};

export default BulkDiscountModal;
