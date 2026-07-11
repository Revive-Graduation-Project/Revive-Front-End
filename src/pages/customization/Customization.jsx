import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomizeHero from "./Sections/CustomizeHero";
import BaseSelector from "./Sections/BaseSelector";
import IngredientsSection from "./Sections/IngredientsSection";
import CommentBox from "./Sections/CommentBox";
import SummaryBox from "./Sections/SummaryBox";
import { api } from "../../services/api";
import { useCustomizeStore } from "../../store";

const Customize = () => {
  const { primaryItem, setPrimaryItem } = useCustomizeStore();

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

  return (
    <div className="bg-white min-h-screen px-20">
      {/* HERO */}
      <div className="container mx-auto  pt-32">
        <CustomizeHero />
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-16 grid lg:grid-cols-3 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">🍳 Let's Start Cooking..</h2>

          {isLoading ? (
             <p>Loading bases...</p>
          ) : (
             <>
               <BaseSelector primaryItems={primaryItems} />
               {optionsLoading ? (
                 <p className="mt-4">Loading options for your base...</p>
               ) : (
                 buildOptions && <IngredientsSection buildOptions={buildOptions} />
               )}
             </>
          )}
          <CommentBox />
        </div>

        {/* RIGHT SIDE */}
        <div>
          <SummaryBox />
        </div>
      </div>
    </div>
  );
};

export default Customize;
