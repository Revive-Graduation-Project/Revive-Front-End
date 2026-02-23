// src/pages/Home/Sections/RegularFood.jsx
import { useEffect } from "react";
import useRestaurantStore from "../../../store/restaurantStore";
import RegularFoodCard from "../../../components/ui/RegularFoodCard";

const RegularFood = () => {
  const { meals, fetchMeals, loading, error } = useRestaurantStore();

  useEffect(() => {
    if (meals.length === 0) fetchMeals();
  }, [meals.length, fetchMeals]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-(--color-green) mb-3">
            OUR REGULAR FOOD
          </h2>
          <p className="text-gray-600  text-lg md:text-xl mb-2">
            Here we will find all the best Quality, and pure food
          </p>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            your health is the first Priority for us
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {meals.map((meal) => (
            <RegularFoodCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegularFood;
