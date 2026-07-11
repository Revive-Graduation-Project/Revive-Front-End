// src/pages/customization/Sections/MobileStickyBar.jsx
import React from "react";
import { ShoppingCart, Flame } from "lucide-react";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const MobileStickyBar = ({ onScrollToSummary }) => {
  const { primaryItem, getTotalPrice, getNutrition, isValidSelection } = useCustomizeStore();

  const totalPrice = getTotalPrice();
  const nutrition = getNutrition();
  const isValid = isValidSelection();

  if (!primaryItem) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-2xl flex items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Flame size={13} className="text-orange-500" />
          <span>{nutrition.calories || 0} kcal</span>
        </div>
        <div className="text-lg font-black text-gray-900">
          {totalPrice} EGP
        </div>
      </div>

      <button
        type="button"
        onClick={onScrollToSummary}
        className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition
          ${
            isValid
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
              : "bg-gray-800 text-white"
          }`}
      >
        <ShoppingCart size={16} />
        <span>View Summary</span>
      </button>
    </div>
  );
};

export default MobileStickyBar;
