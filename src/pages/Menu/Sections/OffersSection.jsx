import { useState, useMemo } from "react";
import RegularFoodCard from "../../../components/ui/RegularFoodCard";

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

        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="
              absolute left-0 md:-left-10 lg:-left-16 top-1/2 -translate-y-1/2
              text-green-700 text-5xl font-bold
              hover:scale-110 transition
            "
            aria-label="Previous"
          >
            ‹
          </button>

          {/* Cards Wrapper */}
          <div className="flex items-end justify-center gap-8">
            {/* Left Card */}
            <div
              className="w-[320px] md:w-[340px] lg:w-[360px] 
                            scale-95 opacity-80 translate-y-6 transition-all duration-300"
            >
              <RegularFoodCard meal={offersMeals[prevIndex]} />
            </div>

            {/* Center Card */}
            <div
              className="w-[340px] md:w-[380px] lg:w-[420px]
                            scale-105 opacity-100 -translate-y-4 transition-all duration-300"
            >
              <RegularFoodCard meal={offersMeals[current]} />
            </div>

            {/* Right Card */}
            <div
              className="w-[320px] md:w-[340px] lg:w-[360px]
                            scale-95 opacity-80 translate-y-6 transition-all duration-300"
            >
              <RegularFoodCard meal={offersMeals[nextIndex]} />
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="
              absolute right-0 md:-right-10 lg:-right-16 top-1/2 -translate-y-1/2
              text-green-700 text-5xl font-bold
              hover:scale-110 transition
            "
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
