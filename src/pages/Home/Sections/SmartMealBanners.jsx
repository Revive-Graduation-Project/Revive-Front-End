import React from "react";
import { useNavigate } from "react-router-dom";

const SmartMealBanners = () => {
  const navigate = useNavigate();

  return (
    <section className="py-6 md:py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Card: Smart Meal Suggestions */}
          <div className="bg-[#F3F9F4] rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between border border-green-100/60 shadow-xs">
            {/* Top Left Sparkle Star Icon */}
            <div className="text-[#15803D] mb-4 z-10">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
              </svg>
            </div>

            {/* Main Content & Dish Layout */}
            <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-4 items-center">
              <div className="col-span-7 sm:col-span-6 lg:col-span-6 z-10 pr-2 sm:pr-0">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  Smart Meal <br />
                  <span className="text-[#15803D]">Suggestions</span>
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-2 sm:mt-3 max-w-sm leading-relaxed">
                  We recommend meals tailored to your health goals, dietary needs, and preferences.
                </p>

                {/* Checklist */}
                <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Personalized for your health
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Balanced nutrition
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Save time & eat smarter
                  </div>
                </div>
              </div>

              {/* Right Side Dish Image & Floating Badge */}
              <div className="col-span-5 sm:col-span-6 lg:col-span-6 relative flex justify-center items-center">
                {/* Floating High Protein Badge */}
                <div className="absolute -top-3 -right-2 sm:top-0 sm:right-0 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl px-2 sm:px-3 py-1 sm:py-1.5 z-20 border border-green-100 flex flex-col items-start scale-85 sm:scale-100">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#16A34A]"></span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#15803D] tracking-wider uppercase">HIGH PROTEIN</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium pl-3 sm:pl-3.5">520 kcal</span>
                </div>

                {/* Dish Image */}
                <div className="relative w-full flex justify-end items-center">
                  <img
                    src="/images/images-removebg-preview (1) 1.png"
                    onError={(e) => {
                      if (!e.target.dataset.triedAsset) {
                        e.target.dataset.triedAsset = "true";
                        e.target.src = "/assets/images-removebg-preview (1) 1.png";
                      } else if (!e.target.dataset.triedDist) {
                        e.target.dataset.triedDist = "true";
                        e.target.src = "dist/assets/images-removebg-preview (1) 1.png";
                      } else {
                        e.target.src = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
                      }
                    }}
                    alt="Smart Meal Suggestion Dish"
                    className="w-[155%] sm:w-[150%] md:w-[140%] lg:w-[460px] max-w-none h-auto object-contain drop-shadow-2xl transform translate-x-6 sm:translate-x-6 lg:translate-x-10 hover:scale-105 transition duration-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Recommended For You Banner */}
            <div className="relative z-10 bg-[#E2F2E5]/90 border border-green-200/60 rounded-2xl p-3.5 sm:p-5 mt-6 sm:mt-8 mb-6 max-w-md shadow-xs">
              <div className="text-[10px] sm:text-[11px] font-bold text-[#15803D] tracking-wider uppercase mb-2.5 sm:mb-3">
                RECOMMENDED FOR YOU
              </div>
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                {/* Weight Loss */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-1 text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-600">Weight Loss</span>
                </div>
                {/* Heart Health */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-1 text-red-500">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-600">Heart Health</span>
                </div>
                {/* Diabetes Friendly */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-1 text-red-500">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-600 leading-tight">Diabetes<br/>Friendly</span>
                </div>
                {/* High Protein */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl shadow-xs flex items-center justify-center mb-1 text-gray-700">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-600 leading-tight">High<br/>Protein</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="relative z-10 flex items-center justify-between mt-2">
              <button
                onClick={() => navigate("/menu")}
                className="bg-[#15803D] hover:bg-[#166534] text-white font-semibold text-xs sm:text-sm md:text-base px-5 sm:px-7 py-3 sm:py-3.5 rounded-full inline-flex items-center gap-2 sm:gap-3 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Get My Recommendations</span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-[#15803D] flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-xs">
                  ➔
                </span>
              </button>
            </div>

            {/* Decorative bottom right green leaf glow */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-green-200/40 rounded-full blur-2xl pointer-events-none"></div>
          </div>

          {/* Right Card: Build Your Own Meal */}
          <div className="bg-[#f0cd6b53] rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between border border-amber-100/60 shadow-xs">
            {/* Top Left Brush / Carrot Icon */}
            <div className="text-[#F97316] mb-4 z-10">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.36 2.64A1 1 0 0017 2.64l-1.41 1.41 2.83 2.83 1.41-1.41a1 1 0 000-1.41l-1.47-1.42zM14.17 5.46L4 15.63V20h4.37l10.17-10.17-4.37-4.37z" />
              </svg>
            </div>

            {/* Main Content & Dish Layout */}
            <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-4 items-center">
              <div className="col-span-7 sm:col-span-6 lg:col-span-6 z-10 pr-2 sm:pr-0">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  Build Your <br />
                  <span className="text-[#f99716d6]">Own Meal</span>
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-2 sm:mt-3 max-w-sm leading-relaxed">
                  Customize every ingredient, Portion and nutrition value to create your perfect meal.
                </p>

                {/* Checklist */}
                <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#f99716d6] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Choose your ingredients
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#f99716d6] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Adjust calories & macros
                  </div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-gray-700 font-medium text-xs sm:text-sm md:text-base">
                    <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-[#f99716d6] flex items-center justify-center text-white shrink-0 shadow-xs">
                      <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Full control, your way
                  </div>
                </div>
              </div>

              {/* Right Side Stacked Burger Image */}
              <div className="col-span-5 sm:col-span-6 lg:col-span-6 relative flex justify-center items-center">
                {/* Dish Image */}
                <div className="relative w-full flex justify-end items-center">
                  <img
                    src="/images/image-removebg-preview 1.png"
                    onError={(e) => {
                      if (!e.target.dataset.triedAsset) {
                        e.target.dataset.triedAsset = "true";
                        e.target.src = "/assets/image-removebg-preview 1.png";
                      } else if (!e.target.dataset.triedDist) {
                        e.target.dataset.triedDist = "true";
                        e.target.src = "dist/assets/image-removebg-preview 1.png";
                      } else {
                        e.target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80";
                      }
                    }}
                    alt="Build Your Own Meal Burger"
                    className="w-[175%] sm:w-[160%] md:w-[150%] lg:w-[480px] max-w-none h-auto object-contain drop-shadow-2xl transform translate-x-12 sm:translate-x-28 lg:translate-x-32 translate-y-4 sm:translate-y-6 lg:translate-y-8 hover:scale-105 transition duration-500 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Meal Summary Banner */}
            <div className="relative z-10 bg-white rounded-2xl p-3.5 sm:p-5 mt-6 sm:mt-8 mb-6 max-w-md shadow-xs border border-amber-100/60">
              <div className="text-[10px] sm:text-[11px] font-bold text-[#16A34A] tracking-wider mb-2.5 sm:mb-3">
                Meal Summary
              </div>
              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
                {/* Calories */}
                <div className="flex flex-col items-center">
                  <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#F97316]">250</span>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-500 mt-0.5">Calories</span>
                </div>
                {/* Protein */}
                <div className="flex flex-col items-center">
                  <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#16A34A]">35g</span>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-500 mt-0.5">Protein</span>
                </div>
                {/* Sug */}
                <div className="flex flex-col items-center">
                  <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-800">28g</span>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-500 mt-0.5">Sug</span>
                </div>
                {/* Fat */}
                <div className="flex flex-col items-center">
                  <span className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-800">18g</span>
                  <span className="text-[9px] sm:text-[11px] font-medium text-gray-500 mt-0.5">Fat</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="relative z-10 flex items-center justify-between mt-2">
              <button
                onClick={() => navigate("/customize")}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs sm:text-sm md:text-base px-5 sm:px-7 py-3 sm:py-3.5 rounded-full inline-flex items-center gap-2 sm:gap-3 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>Start Customizing</span>
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-[#F97316] flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-xs">
                  ➔
                </span>
              </button>
            </div>

            {/* Decorative bottom right amber glow */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-200/40 rounded-full blur-2xl pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SmartMealBanners;
