import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTag, FiCheckCircle } from "react-icons/fi";
import { useUpdateMenuDiscount } from "../../../hooks/dashboard/useMenuItems";
import { toast } from "../../../utils/toastUtils";
import ModalWrapper from "./ModalWrapper";
import { calculateDiscountedPrice } from "../../../utils/discountUtils";

const DiscountModal = ({ isOpen, onClose, meal }) => {
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const { mutate: updateDiscount, isPending } = useUpdateMenuDiscount();

  useEffect(() => {
    if (meal && isOpen) {
      setHasDiscount(meal.hasDiscount || false);
      setDiscountPercentage(meal.discountPercentage || 0);
    }
  }, [meal, isOpen]);

  if (!isOpen || !meal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasDiscount && (discountPercentage <= 0 || discountPercentage > 100)) {
      return toast.error("Discount percentage must be between 1 and 100.");
    }

    updateDiscount(
      { id: meal.id, hasDiscount, discountPercentage: hasDiscount ? discountPercentage : 0 },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Apply Discount" 
      icon={FiTag}
      iconColorClass="text-orange-500"
      iconBgClass="bg-orange-100"
      headerBgClass="bg-orange-50/30"
      isPending={isPending}
    >
      <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                {meal.image ? (
                  <img src={meal.image} alt={meal.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200" />
                )}
                <div>
                  <h3 className="text-[14px] font-bold text-gray-900 m-0">{meal.name}</h3>
                  <p className="text-[12px] text-gray-500 font-medium m-0">Current Price: ${meal.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[14px] font-bold text-gray-800 m-0">Enable Discount</p>
                  <p className="text-[11px] text-gray-500 m-0">Apply a promotional discount to this item</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={hasDiscount}
                    onChange={(e) => setHasDiscount(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
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
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 font-medium transition-colors"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                      </div>
                      
                      {/* Price Preview */}
                      {meal.price > 0 && discountPercentage > 0 && discountPercentage <= 100 && (
                        <div className="mt-4 bg-green-50 rounded-xl p-3 border border-green-100 flex items-center justify-between">
                          <span className="text-[12px] font-bold text-green-700">New Price:</span>
                          <span className="text-[15px] font-bold text-green-700">
                            ${calculateDiscountedPrice(meal.price, discountPercentage)}
                          </span>
                        </div>
                      )}
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
                  className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-[13px] flex items-center gap-2 shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPending ? "Applying..." : <><FiCheckCircle size={16} /> Apply Discount</>}
                </button>
              </div>
            </form>
    </ModalWrapper>
  );
};

export default DiscountModal;
