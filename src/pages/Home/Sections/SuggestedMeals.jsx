import { useEffect } from "react";
import { useAuthStore } from "../../../store";
import useRecommendationStore from "../../../store/recommendationStore";
import RegularFoodCard from "../../../components/UI/RegularFoodCard";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";

const SuggestedMeals = ({ selectedCategory = "All" }) => {
  const { user } = useAuthStore();
  const { recommendations, isLoading, error, fetchRecommendations } =
    useRecommendationStore();

  useEffect(() => {
    if (user?.role && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [user?.role]);

  const filteredMeals =
    selectedCategory === "All"
      ? recommendations
      : recommendations.filter(
          (meal) =>
            meal.category?.toLowerCase() === selectedCategory?.toLowerCase(),
        );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (filteredMeals.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Suggested For You
          </h2>
          <span className="text-3xl">✨</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
          {filteredMeals.map((meal) => (
            <RegularFoodCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedMeals;
