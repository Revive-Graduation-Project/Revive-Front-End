// src/pages/customization/Sections/MealSummaryCard.jsx
import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, X, AlertCircle } from "lucide-react";
import { useCustomizeStore } from "../../../store/useCustomizeStore";
import { useOrderStore } from "../../../store";
import NutritionDisplay from "./NutritionDisplay";

const MealSummaryCard = () => {
  const {
    primaryItem,
    selectedSections,
    getTotalPrice,
    getNutrition,
    isValidSelection,
    toggleItem,
    comment,
    resetCustomize
  } = useCustomizeStore();

  const { openCartDrawer, addItem } = useOrderStore();
  const [quantity, setQuantity] = useState(1);

  const totalPricePerBowl = getTotalPrice();
  const nutrition = getNutrition();
  const isValid = isValidSelection();
  const grandTotal = Number((totalPricePerBowl * quantity).toFixed(2));

  const allAdditions = Object.values(selectedSections).flat();

  const handleAddToCart = () => {
    if (!isValid || !primaryItem) return;

    const customizations = {
      primary: { id: primaryItem.id, grams: 100 },
      additions: allAdditions.map(item => ({
        id: item.id,
        grams: parseInt(item.grams) || 50
      }))
    };

    const cartItem = {
      id: `custom-${primaryItem.id}-${Date.now()}`,
      name: `Custom ${primaryItem.name} Bowl`,
      price: totalPricePerBowl,
      image: "/images/custom-bowl.png",
      mealId: null,
      customizations,
      comment,
      nutrients: Object.entries(nutrition).map(([key, val]) => ({
        nutrientName: key.charAt(0).toUpperCase() + key.slice(1),
        value: val,
        unitName: key === 'calories' ? 'kcal' : 'G'
      })),
      ingredients: [primaryItem, ...allAdditions]
    };

    addItem(cartItem, quantity);
    openCartDrawer();
    resetCustomize();
    setQuantity(1);
  };

  const adjustQty = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-28 w-full flex flex-col gap-5">
      {/* Title */}
      <div className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Your Meal Summary</h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full">
            Made Fresh
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {primaryItem ? `Custom ${primaryItem.name} Bowl` : "Custom Craft Bowl"}
        </p>
      </div>

      {/* Selected Ingredients Breakdown */}
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Selected Ingredients
        </h4>

        {!primaryItem && allAdditions.length === 0 ? (
          <div className="py-6 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Your bowl is empty. Select a main ingredient and additions to start!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Main Ingredient Row */}
            {primaryItem && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/70 border border-orange-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    🥩 {primaryItem.name}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 bg-orange-200 text-orange-800 rounded">
                    Main
                  </span>
                </div>
                <span className="text-xs font-bold text-orange-600">
                  +{Number(primaryItem.price || 0).toFixed(2)} EGP
                </span>
              </div>
            )}

            {/* Additions Rows */}
            {allAdditions.map((item) => {
              const itemCost = Number((item.price * (item.grams || 50)).toFixed(2));
              const origSec = item._originalSection;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-gray-400 flex-shrink-0">
                      ({item.grams || 50}g)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold text-orange-600">
                      +{itemCost} EGP
                    </span>
                    {origSec && (
                      <button
                        type="button"
                        onClick={() => toggleItem(origSec, item)}
                        className="w-5 h-5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition"
                        title="Remove item"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visual Nutrition Display */}
      <div className="border-t border-gray-100 pt-4">
        <NutritionDisplay nutrition={nutrition} />
      </div>

      {/* Quantity Selector & Price Summary */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Quantity</span>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <button
              type="button"
              onClick={() => adjustQty(-1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center font-bold text-sm text-gray-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => adjustQty(1)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Total Price</span>
            {quantity > 1 && (
              <span className="text-[11px] text-gray-400">
                ({totalPricePerBowl} EGP × {quantity})
              </span>
            )}
          </div>
          <span className="text-2xl font-black text-orange-600">
            {grandTotal} EGP
          </span>
        </div>
      </div>

      {/* Add To Cart CTA */}
      <div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isValid}
          className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition shadow-lg
            ${
              isValid
                ? "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 cursor-pointer active:scale-[0.99]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
        >
          <ShoppingCart size={19} />
          <span>Add To Cart</span>
        </button>

        {/* Validation Explanatory Message */}
        {!isValid && (
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-red-500 font-medium text-center">
            <AlertCircle size={13} />
            <span>
              {!primaryItem
                ? "Please choose a main ingredient first"
                : "Please choose at least 2 additions across any section"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealSummaryCard;
