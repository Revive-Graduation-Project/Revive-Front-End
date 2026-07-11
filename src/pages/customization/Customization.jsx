import React, { useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomizeHero from "./Sections/CustomizeHero";
import MainIngredientSection from "./Sections/MainIngredientSection";
import CategorySection from "./Sections/CategorySection";
import SpecialInstructions from "./Sections/SpecialInstructions";
import MealSummaryCard from "./Sections/MealSummaryCard";
import MobileStickyBar from "./Sections/MobileStickyBar";
import { api } from "../../services/api";
import { useCustomizeStore } from "../../store/useCustomizeStore";
import { mapSlotsToFixedCategories } from "./utils/categoryGrouping";

const Customize = () => {
  const { primaryItem, selectedSections, toggleItem, updateItemGrams } = useCustomizeStore();
  const summaryRef = useRef(null);

  const { data: primaryItems = [], isLoading } = useQuery({
    queryKey: ["customization", "primaryItems"],
    queryFn: async () => {
      const response = await api.get('/api/ingredients');
      const allIngredients = response.data || [];
      return allIngredients.filter(ing => {
        const cat = (ing.category || "").toLowerCase();
        return cat.includes("chicken") || cat.includes("beef") || cat.includes("protein") || cat.includes("fish");
      });
    },
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  const { data: buildOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ["customization", "buildOptions", primaryItem?.category],
    queryFn: async () => {
      const response = await api.get(`/api/customizations/build-options?primaryCategory=${primaryItem.category}`);
      return response.data;
    },
    enabled: !!primaryItem,
    staleTime: 1000 * 60 * 5 // Cache for 5 minutes
  });

  // Map dynamic backend slots to strict static frontend order:
  // 1. Main Ingredient (handled separately via MainIngredientSection)
  // 2. Base -> 3. Vegetables -> 4. Sauces -> 5. Extras
  const fixedCategories = useMemo(() => {
    return mapSlotsToFixedCategories(buildOptions?.slots || []);
  }, [buildOptions]);

  const scrollToSummary = () => {
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 overflow-x-hidden">
      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <CustomizeHero />
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* LEFT COLUMN: CUSTOMIZATION CONTROLS */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Let&apos;s Craft Your Bowl
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select your favorite ingredients in each category below. Real-time nutrition and pricing update instantly.
            </p>
          </div>

          {/* Fixed Category 1: Main Ingredient */}
          <MainIngredientSection
            primaryItems={primaryItems}
            isLoading={isLoading}
          />

          {/* Fixed Categories 2-5: Base -> Vegetables -> Sauces -> Extras */}
          {!primaryItem ? (
            <div className="my-10 p-8 rounded-3xl bg-orange-50/50 border-2 border-dashed border-orange-200 text-center">
              <span className="text-3xl block mb-2">🥗</span>
              <h4 className="text-base font-bold text-gray-800">
                Choose a Main Ingredient First
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
                Once you select your primary protein or base bowl choice above, we&apos;ll load custom Bases, Vegetables, Sauces, and Extras suited for your meal.
              </p>
            </div>
          ) : optionsLoading ? (
            <div className="space-y-6 my-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse space-y-3">
                  <div className="h-6 w-48 bg-gray-200 rounded" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="h-32 bg-gray-100 rounded-2xl" />
                    <div className="h-32 bg-gray-100 rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            fixedCategories.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                selectedSections={selectedSections}
                onToggleItem={toggleItem}
                onUpdateGrams={updateItemGrams}
              />
            ))
          )}

          {/* Special Instructions */}
          <SpecialInstructions />
        </div>

        {/* RIGHT COLUMN: STICKY MEAL SUMMARY CARD */}
        <div ref={summaryRef} className="lg:col-span-4 w-full">
          <MealSummaryCard />
        </div>
      </div>

      {/* RESPONSIVE MOBILE FLOATING BAR */}
      <MobileStickyBar onScrollToSummary={scrollToSummary} />
    </div>
  );
};

export default Customize;
