import { Link } from "react-router-dom";
import RegularFoodCard from "../../../components/ui/RegularFoodCard";

const PLACEHOLDER_MEALS = [
  {
    id: 1,
    name: "Mystery Meal",
    price: 12.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
  {
    id: 2,
    name: "Mystery Meal",
    price: 9.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
  {
    id: 3,
    name: "Mystery Meal",
    price: 15.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
  {
    id: 4,
    name: "Mystery Meal",
    price: 11.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
];

const SuggestedMealsTeaser = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Suggested For You
          </h2>
          <span className="text-3xl">✨</span>
        </div>

        <div className="relative">
          {/* Cards with light blur */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8 blur-[2px] pointer-events-none select-none opacity-60">
            {PLACEHOLDER_MEALS.map((meal) => (
              <div key={meal.id} aria-hidden="true" inert className="w-full">
                <RegularFoodCard meal={meal} />
              </div>
            ))}
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 rounded-2xl">
            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 shadow-sm">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
              Meals tailored just for you!
            </h3>
            <p className="text-gray-500 text-sm md:text-base mb-6 text-center px-4">
              Sign in to get AI-powered meal recommendations based on your
              health goals
            </p>
            <div className="flex gap-3">
              <Link
                to="/auth/login"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2.5 rounded-full text-sm font-semibold transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuggestedMealsTeaser;
