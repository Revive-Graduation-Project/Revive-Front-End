import { useState } from "react";
import RegularFoodCard from "../../../components/UI/RegularFoodCard";

const STATIC_OFFERS = [
  {
    id: "offer-1",
    name: "Caesar Salad",
    description: "Fresh romaine, parmesan & croutons",
    price: 9.0,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    category: "Starter",
    isActive: true,
    nutrients: [
      { nutrientName: "Energy", unitName: "KCAL", value: 362 },
      { nutrientName: "Protein", unitName: "G", value: 11.27 },
      { nutrientName: "Total lipid (fat)", unitName: "G", value: 22.35 },
      { nutrientName: "Total Sugars", unitName: "G", value: 2.14 },
    ],
  },
  {
    id: "offer-2",
    name: "Classic Burger",
    description: "Beef patty, lettuce, tomato & special sauce",
    price: 13.5,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    category: "Main",
    isActive: true,
    nutrients: [
      { nutrientName: "Energy", unitName: "KCAL", value: 897 },
      { nutrientName: "Protein", unitName: "G", value: 44.6 },
      { nutrientName: "Total lipid (fat)", unitName: "G", value: 55.4 },
      { nutrientName: "Total Sugars", unitName: "G", value: 24.2 },
    ],
  },
  {
    id: "offer-3",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet with asparagus",
    price: 19.0,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    category: "Main",
    isActive: true,
    nutrients: [
      { nutrientName: "Energy", unitName: "KCAL", value: 600 },
      { nutrientName: "Protein", unitName: "G", value: 48.2 },
      { nutrientName: "Total lipid (fat)", unitName: "G", value: 36.12 },
      { nutrientName: "Total Sugars", unitName: "G", value: 3.48 },
    ],
  },
];

const OffersSection = () => {
  const offersMeals = STATIC_OFFERS;
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
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide"
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
            <button
              onClick={goPrev}
              className="absolute md:-left-10 lg:-left-16 top-1/2 -translate-y-1/2 text-green-700 text-5xl font-bold hover:scale-110 transition"
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="flex items-end justify-center gap-8">
              <div className="w-[340px] lg:w-[360px] scale-95 opacity-80 translate-y-6 transition-all duration-300">
                <RegularFoodCard meal={offersMeals[prevIndex]} />
              </div>
              <div className="w-[380px] lg:w-[420px] scale-105 opacity-100 -translate-y-4 transition-all duration-300">
                <RegularFoodCard meal={offersMeals[current]} />
              </div>
              <div className="w-[340px] lg:w-[360px] scale-95 opacity-80 translate-y-6 transition-all duration-300">
                <RegularFoodCard meal={offersMeals[nextIndex]} />
              </div>
            </div>

            <button
              onClick={goNext}
              className="absolute md:-right-10 lg:-right-16 top-1/2 -translate-y-1/2 text-green-700 text-5xl font-bold hover:scale-110 transition"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
