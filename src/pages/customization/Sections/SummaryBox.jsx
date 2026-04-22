import { useCustomizeStore } from "../../../store/useCustomizeStore";
import { useOrderStore } from "../../../store";
import { ShoppingCart, Flame, Beef, Wheat, Droplet } from "lucide-react";

const NutritionItem = ({ icon: Icon, label, value, unit }) => (
  <div className="flex items-center gap-2">
    <div className="p-1.5 bg-orange-50 rounded-lg">
      <Icon size={14} className="text-orange-400" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold">
        {value}
        <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
      </p>
    </div>
  </div>
);

const SummaryBox = () => {
  const {
    selectedMeal,
    selectedBase,
    selectedSections,
    getTotalPrice,
    getNutrition,
    isValidSelection,
    comment,
    resetCustomize,
  } = useCustomizeStore();

  const { openCartDrawer, addItem } = useOrderStore();

  if (!selectedMeal) return null;

  const totalPrice = getTotalPrice();
  const nutrition = getNutrition();
  const isValid = isValidSelection();

  const handleAddToCart = () => {
    if (!isValid || !selectedBase) return;

    const ingredientIds = Object.values(selectedSections)
      .flat()
      .map((item) => item.id);

    const cartItem = {
      id: `${selectedMeal.id}-${selectedBase.id}-${Date.now()}`,
      name: `${selectedMeal.name} (${selectedBase.name})`,
      price: totalPrice,
      image: selectedMeal.image,
      mealId: selectedMeal.id,
      baseId: selectedBase.id,
      ingredientIds,
      comment,
    };

    addItem(cartItem, 1);
    openCartDrawer();
    resetCustomize();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6 w-full max-h-[90vh] overflow-y-auto border border-gray-100">
      <h3 className="text-xl font-semibold mb-1">Your Meal Summary</h3>
      <p className="text-sm text-gray-400 mb-4">{selectedMeal.name}</p>

      {/* Selected Base */}
      {selectedBase && (
        <div className="mb-3 px-3 py-2 bg-gray-50 rounded-xl text-sm">
          <span className="text-gray-400">Base: </span>
          <span className="font-medium">{selectedBase.name}</span>
          <span className="text-orange-500 ml-1">
            +{selectedBase.basePrice} EGP
          </span>
        </div>
      )}

      {/* Selected Items */}
      <div className="space-y-3 mb-4">
        {Object.entries(selectedSections).map(
          ([sectionType, items]) =>
            items.length > 0 && (
              <div key={sectionType}>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                  {sectionType}
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-orange-500">+{item.price} EGP</span>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </div>

      <div className="border-t pt-4 mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
          Nutrition Facts
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <NutritionItem
            icon={Flame}
            label="Calories"
            value={nutrition.calories}
            unit="kcal"
          />
          <NutritionItem
            icon={Beef}
            label="Protein"
            value={nutrition.protein}
            unit="g"
          />
          <NutritionItem
            icon={Wheat}
            label="Carbs"
            value={nutrition.carbs}
            unit="g"
          />
          <NutritionItem
            icon={Droplet}
            label="Fat"
            value={nutrition.fat}
            unit="g"
          />
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-4 mb-4 flex justify-between items-center">
        <span className="text-base font-semibold">Total</span>
        <span className="text-xl font-bold text-orange-500">
          {totalPrice} EGP
        </span>
      </div>

      {/* Add To Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!isValid}
        className={`w-full py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition cursor-pointer
          ${
            !isValid
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
      >
        <ShoppingCart size={18} />
        Add To Cart
      </button>

      {/* Validation Message */}
      {!isValid && (
        <p className="text-xs text-red-400 mt-2 text-center">
          {!selectedBase
            ? "Please choose a base first"
            : "Please complete all required selections"}
        </p>
      )}
    </div>
  );
};

export default SummaryBox;
