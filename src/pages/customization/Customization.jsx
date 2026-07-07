import React, { useState, useEffect } from "react";
import CustomizeHero from "./Sections/CustomizeHero";
import BaseSelector from "./Sections/BaseSelector";
import IngredientsSection from "./Sections/IngredientsSection";
import CommentBox from "./Sections/CommentBox";
import SummaryBox from "./Sections/SummaryBox";
import { api } from "../../services/api";

const mapCategoryToSection = (categoryStr) => {
  if (!categoryStr) return "extras";
  const cat = categoryStr.toLowerCase();
  if (cat.includes("protein") || cat.includes("meat") || cat.includes("poultry") || cat.includes("finfish")) return "protein";
  if (cat.includes("vegetable")) return "veggies";
  if (cat.includes("dairy") || cat.includes("cheese")) return "cheese";
  if (cat.includes("fat") || cat.includes("oil") || cat.includes("sauce")) return "sauces";
  return "extras";
};

const sectionTitles = {
  protein: "Main (Meat/Chicken)",
  veggies: "Additions (Veggies)",
  cheese: "Cheese",
  sauces: "Extras (Sauces)",
  extras: "Other Extras"
};

const Customize = () => {
  const [customizeData, setCustomizeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, ingRes] = await Promise.all([
          api.get('/menu'),
          api.get('/ingredients')
        ]);
        
        const rawMeals = menuRes.data;
        const rawIngredients = ingRes.data;

        // Group ALL ingredients by mapped category for the global table
        const globalSectionsMap = {
          protein: [],
          veggies: [],
          cheese: [],
          sauces: [],
          extras: []
        };

        rawIngredients.forEach(ing => {
          const secType = mapCategoryToSection(ing.category);
          
          let calories = 0, protein = 0, carbs = 0, fat = 0;
          ing.nutrients?.forEach(n => {
            const name = (n.nutrientName || "").toLowerCase();
            if (name.includes("energy")) calories = n.value;
            else if (name.includes("protein")) protein = n.value;
            else if (name.includes("carbohydrate")) carbs = n.value;
            else if (name.includes("lipid") || name.includes("fat")) fat = n.value;
          });

          globalSectionsMap[secType].push({
            id: ing.id,
            name: ing.name,
            price: 0, // Could be adjusted based on logic
            calories,
            protein,
            carbs,
            fat
          });
        });

        // Convert map to array of sections for the table
        const globalSections = Object.keys(globalSectionsMap)
          .filter(key => globalSectionsMap[key].length > 0)
          .map(key => ({
            title: sectionTitles[key],
            type: key,
            maxSelect: key === "protein" ? 1 : null,
            required: false,
            items: globalSectionsMap[key]
          }));

        const mappedMeals = rawMeals.map(meal => {
          return {
            id: meal.id,
            name: meal.name,
            image: meal.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
            bases: [{ id: `base-${meal.id}`, name: "Regular", basePrice: meal.price }],
            // Use the global ingredients for every meal customization
            sections: globalSections
          };
        });

        setCustomizeData(mappedMeals);
      } catch (err) {
        console.error("Failed to fetch menu or ingredients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

          {loading ? (
             <p>Loading menu...</p>
          ) : (
             <>
               <BaseSelector meals={customizeData} />
               <IngredientsSection />
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
