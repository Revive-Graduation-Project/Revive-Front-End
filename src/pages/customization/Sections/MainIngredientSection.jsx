// src/pages/customization/Sections/MainIngredientSection.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import IngredientCard from "./IngredientCard";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const MainIngredientSection = ({ primaryItems = [], isLoading = false }) => {
  const { primaryItem, setPrimaryItem } = useCustomizeStore();
  const [isOpen, setIsOpen] = useState(true);

  if (!isLoading && (!Array.isArray(primaryItems) || primaryItems.length === 0)) {
    return null;
  }

  return (
    <section className="mb-8 border-b border-gray-100 pb-8">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group py-2 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shadow-sm">
            🥩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition">
                Main Ingredient
              </h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white shadow-sm">
                Required
              </span>
              {primaryItem && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-sm">
                  1 Selected
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Select your primary protein or base bowl choice
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          aria-label={isOpen ? "Collapse Main Ingredient" : "Expand Main Ingredient"}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Grid */}
      {isOpen && (
        <div className="mt-5">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-44 rounded-2xl bg-gray-100 border border-gray-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {primaryItems.map((item) => {
                const isSelected = primaryItem?.id === item.id;
                return (
                  <IngredientCard
                    key={item.id}
                    item={item}
                    isSelected={isSelected}
                    showGramSelector={false}
                    priceSuffix=""
                    onSelect={() => setPrimaryItem(item)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default MainIngredientSection;
