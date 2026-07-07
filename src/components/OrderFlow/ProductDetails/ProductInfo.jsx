

const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A2540] mb-6">
          Details
        </h1>
        <p className="text-gray-600 leading-relaxed text-sm">
          {product.description}
        </p>
      </div>

      {/* Nutrition Info - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-12">
        {[
          { label: "Fat", value: product.fat + " g" },
          { label: "Pro", value: product.protein + " g" },
          { label: "Cal", value: product.calories + " kcal" },
          { label: "Sug", value: product.sugar + " g" },
        ].map((stat) => (
          <div key={stat.label} className="flex justify-between items-center group">
            <span className="text-gray-900 font-extrabold text-sm uppercase">
              {stat.label}
            </span>
            <span className="text-green-700 font-black text-base">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Ingredients Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">
            Ingredients
          </h3>
          <span className="text-xs text-gray-500">
            {product.ingredients?.length || 0} ingredients
          </span>
        </div>
        <div className="flex gap-4">
          {product.ingredients?.map((ing, idx) => {
            const name = typeof ing === "object" && ing !== null
              ? (ing.name || ing.ingredient?.name || ing.ingredientName || "Ingredient")
              : String(ing);
            const icon = typeof ing === "object" && ing !== null ? (ing.icon || ing.emoji || "🥗") : "🥗";
            return (
              <div key={idx} className="flex flex-col items-center gap-2 group cursor-help">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-full shadow-sm group-hover:bg-white group-hover:shadow-md group-hover:border-orange-200 transition-all font-bold text-xl">
                  {icon}
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
