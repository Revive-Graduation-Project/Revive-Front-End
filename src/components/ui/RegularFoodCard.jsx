import { useOrderStore, useFavoritesStore } from "../../store";

const RegularFoodCard = ({ meal }) => {
  const addItem = useOrderStore((state) => state.addItem);
  const openCartDrawer = useOrderStore((state) => state.openCartDrawer);
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

  const priceColor = hasDiscount
    ? "text-[var(--color-orange)]"
    : "text-gray-900";

  return (
    <div className="group relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 w-full">
      {/* Favorite Heart */}
      <div className="relative pt-10 pb-2 px-6 flex justify-center">
      <button
        onClick={() => toggleFavorite(meal)}
        className={`absolute top-3 right-3 transition-all duration-300 cursor-pointer ${
          isFavorite
            ? "text-red-500 scale-110"
            : "text-gray-400 hover:text-red-500"
        }`}
      >
        <svg
          className="w-6 h-6"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      {/* image */}
        <div className="w-15 h-15 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-orange-100 shadow-lg group-hover:scale-105 transition-transform duration-300">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      {/* Content */}
      <div className="px-1 pb-2 flex flex-col items-center text-center">
        <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1.5 line-clamp-1 min-h-10">
          {name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 min-h-5">
          {description}
        </p>

        {/* Nutritional Info */}
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-700 mb-2">
          <div className="flex justify-center gap-1">
            <span className="font-semibold">Fat:</span>
            <span className="text-(--color-green)">{fat}g</span>
          </div>

          <div className="flex justify-center gap-1">
            <span className="font-semibold">Cal:</span>
            <span className="text-(--color-green)">{calories}</span>
          </div>

          <div className="flex justify-center gap-1">
            <span className="font-semibold">Pro:</span>
            <span className="text-(--color-green)">{protein}g</span>
          </div>

          <div className="flex justify-center gap-1">
            <span className="font-semibold">Sug:</span>
            <span className="text-(--color-green)">{sugar}g</span>
          </div>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex flex-col  sm:items-center sm:justify-center gap-2 w-full">
          <div className="flex items-baseline justify-center gap-2">
            {hasDiscount && (
              <span className="text-base text-gray-400 line-through">
                ${price}
              </span>
            )}

            <span className={`text-xl sm:text-xl font-extrabold ${priceColor}`}>
              ${finalPrice}
            </span>
          </div>
          <button
            onClick={() => {
              const itemToAdd = {
                id: meal.id,
                name,
                price: parseFloat(finalPrice ?? price),
                imageUrl,
              };
              console.log("Adding item to cart:", itemToAdd);
              addItem(itemToAdd);
            }}
            className="w-full  bg-(--color-orange) hover:bg-orange-600 active:bg-orange-700 text-white font-medium py-1 px-1 rounded-2xl transition-colors shadow-sm hover:shadow-md cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegularFoodCard;
