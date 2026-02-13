import { useCustomizeStore } from "../../../store/useCustomizeStore";
import { motion } from "framer-motion";
import { ShoppingCart, Flame, Beef, Wheat, Droplet } from "lucide-react";

const SummaryBox = () => {
  const {
    selectedMeal,
    selectedBase,
    selectedSections,
    getTotalPrice,
    getNutrition,
    isValidSelection,
  } = useCustomizeStore();

  if (!selectedMeal) return null;

  const totalPrice = getTotalPrice();
  const nutrition = getNutrition();
  const isValid = isValidSelection();

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 sticky  w-full max-h-[90vh] overflow-y-auto border border-gray-100">
      {/* Header */}
      <h3 className="text-2xl font-semibold mb-2">Your Meal Summary</h3>

      {/* Meal + Base */}
      <div className="mb-2 space-y-2">
        <p className="text-gray-700">
          <span className="font-medium">Meal:</span> {selectedMeal.name}
        </p>
      </div>

      {/* Selected Items */}
      <div className="space-y-4 mb-2">
        {Object.entries(selectedSections).map(
          ([sectionType, items]) =>
            items.length > 0 && (
              <div key={sectionType}>
                <p className="text-sm font-semibold capitalize mb-1">
                  {sectionType}
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>+{item.price} EGP</span>
                    </li>
                  ))}
                </ul>
              </div>
            ),
        )}
      </div>

      {/* Nutrition */}
      <div className="border-t pt-4 mb-6">
        <h4 className="text-sm font-semibold mb-3">Nutrition Facts</h4>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-500" />
            <span>{nutrition.calories} kcal</span>
          </div>

          <div className="flex items-center gap-2">
            <Beef size={16} className="text-red-500" />
            <span>{nutrition.protein} g protein</span>
          </div>

          <div className="flex items-center gap-2">
            <Wheat size={16} className="text-yellow-500" />
            <span>{nutrition.carbs} g carbs</span>
          </div>

          <div className="flex items-center gap-2">
            <Droplet size={16} className="text-blue-500" />
            <span>{nutrition.fat} g fat</span>
          </div>
        </div>
      </div>

      {/* Total with Animation */}
      <div className="border-t pt-4 mb-6 flex justify-between items-center">
        <span className="text-lg font-semibold">Total</span>

        <motion.span
          key={totalPrice}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold text-orange-500"
        >
          {totalPrice} EGP
        </motion.span>
      </div>

      {/* Add To Cart */}
      <button
        disabled={!isValid}
        className="w-full py-3 rounded-2xl font-medium flex items-center justify-center gap-2 transition
          bg-orange-500 hover:bg-orange-600 text-white shadow-md"
      >
        <ShoppingCart size={18} />
        Add To Cart
      </button>

      {/* {!isValid && (
        <p className="text-xs text-red-500 mt-2 text-center">
          Please complete required selections
        </p>
      )} */}
    </div>
  );
};

export default SummaryBox;
