import { useState, useMemo } from "react";
import RegularFoodCard from "../../../components/UI/RegularFoodCard";
import ScrollArrows from "../../../components/UI/ScrollArrows";

const OffersSection = ({ items = [] }) => {
  const offersMeals = useMemo(
    () => items.filter((meal) => meal.discountPercent > 0),
    [items],
  );

  const [current, setCurrent] = useState(0);

  if (offersMeals.length === 0) {
    return (
      <section className="py-5 md:py-8 lg:py-10 bg-white">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 text-gray-900">
          Offers
        </h2>
        <p className="text-center text-gray-600 py-10 w-full">
          No offers available right now
        </p>
      </section>
    );
  }

  const prevIndex = (current - 1 + offersMeals.length) % offersMeals.length;
  const nextIndex = (current + 1) % offersMeals.length;

  const goPrev = () => setCurrent(prevIndex);
  const goNext = () => setCurrent(nextIndex);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-14 text-gray-900">
          Offers
        </h2>

        {/* ===== MOBILE: Horizontal Scroll ===== */}
        <div className="md:hidden">
          <div
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth
                       scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {offersMeals.map((meal) => (
              <div key={meal.id} className="min-w-[280px] snap-center shrink-0">
                <RegularFoodCard meal={meal} />
              </div>
            ))}
          </div>
        </div>

        {/* ===== DESKTOP: Carousel ===== */}
        <div className="hidden md:block">
          <div className="relative flex items-center justify-center">
            <ScrollArrows onScrollLeft={goPrev} onScrollRight={goNext} />

            {/* Cards Wrapper */}
            <div className="flex items-end justify-center gap-8">
              {/* Left Card */}
              <div className="w-[340px] lg:w-[360px] scale-95 opacity-80 translate-y-6 transition-all duration-300">
                <RegularFoodCard meal={offersMeals[prevIndex]} />
              </div>

              {/* Center Card */}
              <div className="w-[380px] lg:w-[420px] scale-105 opacity-100 -translate-y-4 transition-all duration-300">
                <RegularFoodCard meal={offersMeals[current]} />
              </div>

              {/* Right Card */}
              <div className="w-[340px] lg:w-[360px] scale-95 opacity-80 translate-y-6 transition-all duration-300">
                <RegularFoodCard meal={offersMeals[nextIndex]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
