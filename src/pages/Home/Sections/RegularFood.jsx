// src/pages/Home/Sections/RegularFood.jsx
import { useMenuItems, isMenuItemActive } from "../../../hooks/dashboard/useMenuItems";
import RegularFoodCard from "../../../components/ui/RegularFoodCard";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

const RegularFood = ({ items }) => {
  const { data: meals = [], isLoading: loading, error } = useMenuItems({}, {
    enabled: !items, // Don't fetch if items are passed via prop
  });

  if (loading && !items) return <LoadingSpinner />;
  if (error && !items) return <p>{error.message || "Error loading food items"}</p>;

  const displayMeals = (items ?? meals).filter(isMenuItemActive); 


  return (
    <section id="regular-food" className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green mb-3">
            OUR REGULAR FOOD
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-2">
            Here we will find all the best Quality, and pure food
          </p>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            your health is the first Priority for us
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
          {displayMeals.map((meal) => (
            <RegularFoodCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegularFood;
