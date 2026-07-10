// src/pages/customization/Sections/IngredientCard.jsx
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import GramsCounter from "./GramsCounter";

const IngredientCard = ({
  item,
  isSelected = false,
  onSelect,
  showGramSelector = false,
  selectedGrams = 50,
  onUpdateGrams,
  priceSuffix = "/g"
}) => {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`group relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between select-none
        ${
          isSelected
            ? "border-orange-500 bg-orange-50/90 shadow-md shadow-orange-500/10 scale-[1.01]"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
        }`}
    >
      {/* Top Checkmark Badge when Selected */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm"
        >
          <Check size={14} strokeWidth={3} />
        </motion.div>
      )}

      {/* Card Image Container (Only shown if item actually has an imageUrl) */}
      {item.imageUrl && (
        <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-gray-100">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        </div>
      )}

      {/* Card Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between gap-2">
        <div>
          <h4 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-1">
            {item.name}
          </h4>
          <p className="text-xs font-medium text-orange-600 mt-0.5">
            +{Number(item.price || 0).toFixed(2)} EGP{priceSuffix}
          </p>
        </div>

        {/* Gram Selector when selected for slots */}
        {showGramSelector && isSelected && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2.5 pt-2.5 border-t border-orange-200/80 w-full"
          >
            <GramsCounter
              value={selectedGrams}
              onChange={onUpdateGrams}
              min={5}
              max={1000}
              step={5}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default IngredientCard;
