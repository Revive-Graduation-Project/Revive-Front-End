// components/PopularMenus.jsx
import { mockMeals } from "../../../mocks/meals";
import PopularMenuCard from "../../../components/ui/PopularMenuCard";
const PopularMenus = () => {
  const popular = mockMeals.slice(0, 6);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Popular Menus
          </h2>
          <span className="text-3xl">🔥</span>
        </div>

        {/* scrollable container */}
        <div className="relative">
          <div className="flex gap-5 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {popular.map((meal) => (
              <PopularMenuCard
                key={meal.id}
                name={meal.name}
                imageUrl={meal.imageUrl}
                price={meal.price}
              />
            ))}

            {popular.length < 4 && (
              <div className="shrink-0 w-64 sm:w-72 md:w-80" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularMenus;
