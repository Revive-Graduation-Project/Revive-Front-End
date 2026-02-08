const PopularMenuCard = ({ name, imageUrl, price, rating = 5 }) => {
  return (
    <div
      className="
      shrink-0 w-64 sm:w-80 md:w-96 
    bg-white rounded-2xl shadow-md 
      hover:shadow-xl 
      transition-shadow duration-300
      relative
      border border-gray-600 
    "
    >
      <div className="flex items-center px-5 py-6 sm:px-6 sm:py-7 gap-4 md:gap-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 truncate">
            {name}
          </h3>

          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg sm:text-xl">
                ★
              </span>
            ))}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-medium text-gray-600">
              Starting
            </span>
            <span className="text-lg sm:text-xl font-bold text-(--color-orange)">
              {price.toFixed(2)}$
            </span>
          </div>
        </div>

        <div
          className="
          relative 
          -mr-4 sm:-mr-6 md:-mr-8 
          -mt-4 sm:-mt-6 md:-mt-8 
          shrink-0
        "
        >
          <div
            className="
            w-24 h-24 sm:w-28 sm:h-28 md:w-34 md:h-32 
            rounded-full 
            overflow-hidden 
            shadow-lg
            
          "
          >
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover "
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularMenuCard;
