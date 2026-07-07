import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../../store";
import { getSuggestedMeals } from "../../../services/recommendation.service";
import PopularMenuCard from "../../../components/ui/PopularMenuCard";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ScrollArrows from "../../../components/ui/ScrollArrows";
const SCROLL_AMOUNT = 340; // px per button click

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

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    // Do not fetch until we have a real user ID — the API endpoint requires it
    if (!user?.id) return;

    let cancelled = false;

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSuggestedMeals(user.id);
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

    // Cleanup: prevent state updates after unmount
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Track scroll position so buttons hide/show at the edges
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Run once on mount to set initial state
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    return () => el.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState, meals]);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
  }, []);

  // thoose three lines hide the suggested meals when no meal is suggested
  //if you want to test the suggested meals comment it it
  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (meals.length === 0) return null;
  //***********************************************************************/
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header row with title */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Suggested For You
          </h2>
          <span className="text-3xl">✨</span>
        </div>

        {/* Horizontally scrollable card row */}
        <div className="relative">
          <ScrollArrows
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
          />

          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {meals.map((meal) => (
              <PopularMenuCard
                key={meal.id}
                name={meal.name}
                imageUrl={meal.imageUrl}
                price={meal.price}
              />
            ))}

            {/* Spacer so short lists don't look broken on wide screens */}
            {meals.length < 4 && (
              <div className="shrink-0 w-64 sm:w-72 md:w-80" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuggestedMeals;
