import { FiX, FiInfo, FiPackage, FiActivity } from "react-icons/fi";

export default function IngredientNutrientsModal({ isOpen, onClose, ingredient }) {
  if (!isOpen || !ingredient) return null;

  // Extract all nutrients from the array or object
  const getAllNutrientsList = (nutrients = []) => {
    if (!Array.isArray(nutrients) || nutrients.length === 0) return [];
    const list = [];
    nutrients.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const name = item.nutrientName || item.name || item.label || item.nutrient || "";
      const val = item.value !== undefined ? item.value : (item.amount !== undefined ? item.amount : (item.val !== undefined ? item.val : ""));
      const unit = item.unitName || item.unit || item.u || "";
      if (name && val !== "" && val !== null && val !== undefined) {
        list.push({ name: String(name), value: val, unit: String(unit || "").toLowerCase() });
      }
    });
    return list;
  };

  const allNutrients = getAllNutrientsList(ingredient.nutrients);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up relative max-h-[90vh] flex flex-col">
        
        {/* Header Overlay */}
        <div className="bg-linear-to-r from-orange-500 to-amber-500 p-6 text-white relative shrink-0">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-center gap-2 text-orange-100 text-[12px] font-bold uppercase tracking-wider mb-1">
            <FiActivity size={14} /> Complete Nutritional Profile
          </div>
          <h2 className="text-[26px] font-black leading-tight">{ingredient.name}</h2>
          {ingredient.category && ingredient.category !== "-" && (
            <span className="inline-block mt-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-extrabold text-white">
              {ingredient.category}
            </span>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
          
          {/* Description & Stock */}
          <div className="flex items-start justify-between gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex-1">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</span>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                {ingredient.description || "Fresh, high-quality ingredient sourced for optimal nutritional value and taste."}
              </p>
            </div>
            <div className="text-right shrink-0 border-l border-gray-200 pl-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Stock</span>
              <span className="inline-flex items-center gap-1.5 text-[16px] font-black text-[#1a1a1a]">
                <FiPackage className="text-orange-500" />
                {ingredient.stock} {ingredient.unit || "g"}
              </span>
            </div>
          </div>

          {/* Key Macros (4 Column Grid) */}
          <div>
            <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-3">Key Macronutrients</h3>
            <div className="grid grid-cols-4 gap-2.5 text-center">
              <div className="bg-orange-50/80 border border-orange-100 rounded-2xl p-3">
                <span className="block text-[10px] uppercase font-bold text-orange-500 tracking-wider">Calories</span>
                <span className="block text-[16px] font-black text-[#1a1a1a] mt-1">{ingredient.calories ?? "0"}</span>
              </div>
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3">
                <span className="block text-[10px] uppercase font-bold text-blue-500 tracking-wider">Protein</span>
                <span className="block text-[16px] font-black text-[#1a1a1a] mt-1">{ingredient.protein ?? "0g"}</span>
              </div>
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3">
                <span className="block text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Fat</span>
                <span className="block text-[16px] font-black text-[#1a1a1a] mt-1">{ingredient.fat ?? "0g"}</span>
              </div>
              <div className="bg-amber-50/80 border border-amber-100 rounded-2xl p-3">
                <span className="block text-[10px] uppercase font-bold text-amber-600 tracking-wider">Sugar</span>
                <span className="block text-[16px] font-black text-[#1a1a1a] mt-1">{ingredient.sugar ?? "0g"}</span>
              </div>
            </div>
          </div>

          {/* Complete Nutritional List */}
          <div>
            <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-3">All Nutrients & Micronutrients</h3>
            {allNutrients.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                {allNutrients.map((n, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#F8F9FB] border border-gray-100/80 hover:border-orange-200 hover:bg-orange-50/20 transition-all"
                  >
                    <span className="text-[13px] font-bold text-gray-700 capitalize truncate pr-2">
                      {n.name}
                    </span>
                    <span className="text-[12px] font-black text-[#1a1a1a] bg-white px-2 py-0.5 rounded-md border border-gray-200/60 shadow-2xs shrink-0">
                      {n.value} {n.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[13px] font-medium text-gray-400">
                  No additional micronutrient data available for this ingredient.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#1a1a1a] hover:bg-gray-800 text-white rounded-xl text-[13px] font-bold transition-all cursor-pointer shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
