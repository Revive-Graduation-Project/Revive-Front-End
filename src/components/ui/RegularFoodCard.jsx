import { useOrderStore, useFavoritesStore } from "../../store";

// Max 2 decimal places, strips trailing zeros: 140.9888 → 140.99 | 140.00 → 140
const formatPrice = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return val;
  return parseFloat(num.toFixed(2)).toString();
};

const RegularFoodCard = ({ meal }) => {
  const addItem = useOrderStore((state) => state.addItem);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(meal.id));

  const {
    name,
    description,
    price,
    finalPrice,
    imageUrl,
    calories,
    protein,
    fat,
    sugar = 0,
  } = meal;

  const hasDiscount = finalPrice < price;
  const displayPrice = finalPrice ?? price;

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-full flex flex-col overflow-hidden border border-gray-100">

      {/* ── Top: circular image + heart ── */}
      <div className="relative flex justify-center pt-5 sm:pt-7 md:pt-8 pb-2 sm:pb-3 px-3 sm:px-4">

        {/* Heart button */}
        <button
          onClick={() => toggleFavorite(meal)}
          aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 transition-all duration-200 cursor-pointer z-5 ${
            isFavorite
              ? "text-red-500 scale-110"
              : "text-gray-300 hover:text-red-400"
          }`}
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Circular food image — scales with breakpoints */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 sm:border-4 border-orange-50 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-2 sm:px-3 md:px-4 pb-3 sm:pb-4 flex flex-col flex-1 gap-1 sm:gap-1.5">

        {/* Name */}
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 text-center line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-[10px] sm:text-xs text-gray-400 text-left line-clamp-2 leading-snug min-h-8 sm:min-h-10">
          {description}
        </p>

        {/* ── Nutrition grid: Fat/Pro | Cal/Sug ── */}
        <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-0.5 text-[10px] sm:text-xs mt-0.5">
          {/* Fat */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="font-semibold text-gray-700">Fat</span>
            <span className="text-(--color-green) font-semibold ml-auto">{fat}g</span>
          </div>
          {/* Pro */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="font-semibold text-gray-700">Pro</span>
            <span className="text-(--color-green) font-semibold ml-auto">{protein}g</span>
          </div>
          {/* Cal */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="font-semibold text-gray-700">Cal</span>
            <span className="text-(--color-green) font-semibold ml-auto">{calories}</span>
          </div>
          {/* Sug */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <span className="font-semibold text-gray-700">Sug</span>
            <span className="text-(--color-green) font-semibold ml-auto">{sugar}g</span>
          </div>
        </div>

        {/* ── Price + Add to cart ── */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 mt-auto pt-2">

          {/* Price block */}
          <div className="flex flex-col xs:flex-row items-start xs:items-baseline gap-0.5 xs:gap-1.5 shrink-0">
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                ${formatPrice(price)}
              </span>
            )}
            <span
              className={`text-sm sm:text-base md:text-lg lg:text-xl font-extrabold leading-none ${
                hasDiscount ? "text-(--color-orange)" : "text-gray-900"
              }`}
            >
              ${formatPrice(displayPrice)}
            </span>
          </div>

          {/* Add to cart — fixed 50% width */}
          <button
            onClick={() =>
              addItem({
                id: meal.id,
                name,
                price: displayPrice,
                imageUrl,
              })
            }
            className="w-1/2 bg-(--color-orange) hover:bg-orange-500 active:bg-orange-600 text-white text-[10px] sm:text-xs md:text-sm font-semibold py-1.5 sm:py-2 px-1 sm:px-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-center"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegularFoodCard;
