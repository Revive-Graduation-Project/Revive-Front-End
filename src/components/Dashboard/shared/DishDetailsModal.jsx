import { useState } from "react";
import { FiX, FiInfo, FiZoomIn } from "react-icons/fi";
import { parseNutrients } from "../../../utils/nutrients";

export default function DishDetailsModal({ isOpen, onClose, dish }) {
  const [showFullImage, setShowFullImage] = useState(false);

  if (!isOpen || !dish) return null;

  const imageUrl = dish.image || dish.imageUrl;
  const parsed = parseNutrients(dish.nutrients || []);
  const calories = dish.calories ?? (parsed.calories !== "0" ? parsed.calories : "-");
  const protein = dish.protein ?? (parsed.protein !== "0" ? `${parsed.protein}g` : "-");
  const fat = dish.fat ?? (parsed.fat !== "0" ? `${parsed.fat}g` : "-");
  const sugar = dish.sugar ?? (parsed.sugar !== "0" ? `${parsed.sugar}g` : "-");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-in relative">
          
          {/* Close Button Overlay */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 p-2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors cursor-pointer"
          >
            <FiX size={20} />
          </button>

          {/* Header Image */}
          <div className="w-full h-48 bg-orange-100 flex items-center justify-center relative group">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                {/* Full Image Preview Trigger */}
                <button
                  type="button"
                  onClick={() => setShowFullImage(true)}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Click to see full picture"
                >
                  <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-[13px] font-bold flex items-center gap-2 shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
                    <FiZoomIn size={16} className="text-[#F97316]" />
                    View Full Picture
                  </span>
                </button>
              </>
            ) : (
              <span className="text-orange-300 font-bold text-lg">No Image</span>
            )}
            {/* Category Badge */}
            {dish.category && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold text-orange-600 shadow-sm pointer-events-none">
                {dish.category}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col gap-6 max-h-[65vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-[24px] font-extrabold text-[#1a1a1a] leading-tight">{dish.name}</h2>
                <p className="text-[14px] text-gray-500 mt-1 font-medium flex items-center gap-1.5">
                  <FiInfo size={14} className="text-orange-400 shrink-0" />
                  {dish.description || "A deliciously crafted meal prepared with the finest ingredients and our signature touch."}
                </p>
              </div>
              {dish.price !== undefined && (
                <div className="text-right shrink-0">
                  <span className="block text-[22px] font-black text-[#38761d]">{dish.price} EGP</span>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Nutrition Info */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-orange-50 rounded-xl p-2">
                <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Calories</span>
                <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{calories}</span>
              </div>
              <div className="bg-orange-50 rounded-xl p-2">
                <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Protein</span>
                <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{protein}</span>
              </div>
              <div className="bg-orange-50 rounded-xl p-2">
                <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Fat</span>
                <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{fat}</span>
              </div>
              <div className="bg-orange-50 rounded-xl p-2">
                <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Sugar</span>
                <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{sugar}</span>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-2">Key Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients && dish.ingredients.length > 0 ? (
                  dish.ingredients.map((ing, idx) => {
                    const name = typeof ing === "object" && ing !== null
                      ? (ing.name || ing.ingredient?.name || ing.ingredientName || "Ingredient")
                      : String(ing);
                    const amount = typeof ing === "object" && ing !== null
                      ? (ing.amount || ing.quantityGrams || ing.quantity || "")
                      : "";
                    const displayStr = amount ? `${name} (${amount}${typeof amount === "number" ? "g" : ""})` : name;
                    return (
                      <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                        {displayStr}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[13px] text-gray-400 italic">No ingredients listed for this dish.</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Full Picture Lightbox Modal ── */}
      {showFullImage && imageUrl && (
        <div
          onClick={() => setShowFullImage(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Close Full Picture"
            >
              <FiX size={24} />
            </button>
            <img
              src={imageUrl}
              alt={dish.name}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <span className="mt-3 text-white/80 text-[14px] font-semibold tracking-wide">
              {dish.name}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
