// src/pages/customization/Sections/CategorySection.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import IngredientCard from "./IngredientCard";

const CategorySection = ({
  category,
  selectedSections = {},
  onToggleItem,
  onUpdateGrams
}) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!category || !Array.isArray(category.items) || category.items.length === 0) {
    return null;
  }

  // Calculate total selected items in this category across all underlying backend slots
  const selectedCount = category.items.reduce((count, item) => {
    const origSec = item._originalSection;
    if (!origSec) return count;
    const slotList = selectedSections[origSec.slotName] || [];
    const found = slotList.find((s) => s.id === item.id);
    return count + (found ? 1 : 0);
  }, 0);

  return (
    <section className="mb-8 border-b border-gray-100 pb-8">
      {/* Category Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group py-2 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shadow-sm">
            {category.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">
                {category.label}
              </h3>
              {selectedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-sm">
                  {selectedCount} Selected
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {category.description}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          aria-label={isOpen ? "Collapse section" : "Expand section"}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Accordion Content Grid */}
      {isOpen && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {category.items.map((item) => {
            const origSec = item._originalSection;
            const slotList = (origSec && selectedSections[origSec.slotName]) || [];
            const activeItem = slotList.find((s) => s.id === item.id);
            const isSelected = !!activeItem;

            return (
              <IngredientCard
                key={`${category.id}-${item.id}`}
                item={item}
                isSelected={isSelected}
                showGramSelector={true}
                selectedGrams={activeItem?.grams || 50}
                priceSuffix="/g"
                onSelect={() => {
                  if (origSec && onToggleItem) {
                    onToggleItem(origSec, item);
                  }
                }}
                onUpdateGrams={(grams) => {
                  if (origSec && onUpdateGrams) {
                    onUpdateGrams(origSec.slotName, item.id, grams);
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CategorySection;
