import { useMemo, useState } from "react";
import RegularFoodCard from "../../../components/UI/RegularFoodCard";

const SuggestedMealsSection = ({ items = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const normalMeals = useMemo(
    () => items.filter((meal) => !meal.hasDiscount),
    [items],
  );

  if (normalMeals.length === 0) return null;

  const visibleMeals = showAll ? normalMeals : normalMeals.slice(0, 8);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-green-700 mb-10">
          Suggested Meals
        </h2>

        {/* Grid */}
        <div
          className="
            grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8
          "
        >
          {visibleMeals.map((meal) => (
            <RegularFoodCard key={meal.id} meal={meal} />
          ))}
        </div>

        {/* See More */}
        {normalMeals.length > 8 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="
                flex items-center gap-2 text-gray-500 font-medium
                hover:text-gray-800 transition
              "
            >
              {showAll ? "See less" : "See more"}
              <span className={`transition ${showAll ? "rotate-180" : ""}`}>
                ⌄
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SuggestedMealsSection;
