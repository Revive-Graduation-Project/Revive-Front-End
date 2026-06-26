import { FiX, FiInfo } from "react-icons/fi";

export default function DishDetailsModal({ isOpen, onClose, dish }) {
  if (!isOpen || !dish) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-in relative">
        
        {/* Close Button Overlay */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors"
        >
          <FiX size={20} />
        </button>

        {/* Header Image */}
        <div className="w-full h-48 bg-orange-100 flex items-center justify-center relative">
          {dish.image ? (
            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-orange-300 font-bold text-lg">No Image</span>
          )}
          {/* Category Badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold text-orange-600 shadow-sm">
            {dish.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-[24px] font-extrabold text-[#1a1a1a] leading-tight">{dish.name}</h2>
              <p className="text-[14px] text-gray-500 mt-1 font-medium flex items-center gap-1.5">
                <FiInfo size={14} className="text-orange-400" />
                {dish.description || "A deliciously crafted meal prepared with the finest ingredients and our signature touch."}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="block text-[22px] font-black text-[#38761d]">${dish.price}</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-orange-50 rounded-xl p-2">
              <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Calories</span>
              <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{dish.calories || "-"}</span>
            </div>
            <div className="bg-orange-50 rounded-xl p-2">
              <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Protein</span>
              <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{dish.protein || "-"}</span>
            </div>
            <div className="bg-orange-50 rounded-xl p-2">
              <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Fat</span>
              <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{dish.fat || "-"}</span>
            </div>
            <div className="bg-orange-50 rounded-xl p-2">
              <span className="block text-[10px] uppercase font-bold text-orange-400 tracking-wider">Sugar</span>
              <span className="block text-[13px] font-bold text-[#1a1a1a] mt-0.5">{dish.sugar || "-"}</span>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-2">Key Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients && dish.ingredients.length > 0 ? (
                dish.ingredients.map((ing, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">
                    {ing}
                  </span>
                ))
              ) : (
                <>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">Premium Protein</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">Fresh Vegetables</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">House Spices</span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-medium">Secret Sauce</span>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
