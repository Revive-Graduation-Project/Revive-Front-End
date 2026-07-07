import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store";
import { getSuggestedMeals } from "../../../services/recommendation.service";
import RegularFoodCard from "../../../components/UI/RegularFoodCard";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
/**
 * SuggestedMeals
 * ---------------
 * Shown only when the user is authenticated (gated in Home.jsx).
 * Fetches personalised meal recommendations from the service layer.
 *
 * Mock mode: getSuggestedMeals returns local mock data — no backend needed.
 * API integration: when ready, just swap recommendation.service.js — no
 * changes needed here.
 */
const SuggestedMeals = () => {
  const { user } = useAuthStore();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.role) return;

    let cancelled = false;

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSuggestedMeals();
        if (!cancelled) {
          setMeals(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load suggestions");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  // Track scroll position so buttons hide/show at the edges

  // thoose three lines hide the suggested meals when no meal is suggested
  //if you want to test the suggested meals comment it it
  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (meals.length === 0) return null;
  //***********************************************************************/
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
          {meals.map((meal) => (
            <RegularFoodCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedMeals;
