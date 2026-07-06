import { useCallback, useEffect, useRef, useState } from "react";
import { useMenuItems } from "../../../hooks/dashboard/useMenuItems";
import PopularMenuCard from "../../../components/UI/PopularMenuCard";
import LoadingSpinner from "../../../components/UI/LoadingSpinner";
import ScrollArrows from "../../../components/UI/ScrollArrows";

const SCROLL_AMOUNT = 340; // px per button click

const PopularMenus = () => {
  const { data: meals = [], isLoading: loading, error } = useMenuItems({});
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);


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

  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  const popular = meals.slice(0, 6);

  return (
    <section id="popular-meals" className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header row with title */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Popular Meals
          </h2>
          <span className="text-3xl">🔥</span>
        </div>

        {/* Scrollable card row */}
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
