import {
    useMenuStore,
    useAuthStore,
    useRecommendationStore,
} from "../../store";
import { useMenuItems, isMenuItemActive } from "../../hooks/dashboard/useMenuItems";
import { useMemo, useEffect } from "react";
import MenuFilter from "./Sections/MenuFilter";
import OffersSection from "./Sections/OffersSection";
import SuggestedMealsSection from "./Sections/SuggestedMealsSection";
import RegularFood from "../Home/Sections/RegularFood";

export default function Menu() {
    const { user } = useAuthStore();
    const {
        recommendations,
        fetchRecommendations,
    } = useRecommendationStore();
    const { data: meals = [], isLoading: mealsLoading, error: mealsErrorObj } = useMenuItems({});
    const mealsError = mealsErrorObj ? (mealsErrorObj.message || "Failed to load meals") : null;
    const { selectedCategory } = useMenuStore();

    const isGuest = !user;

    useEffect(() => {
        // If user is logged in, fetch personalized recommendations
        if (!isGuest) {
            fetchRecommendations(user?.id);
        }
    }, [user, isGuest, fetchRecommendations]);


    const filteredMeals = useMemo(() => {
        return meals.filter((item) => {
            if (!isMenuItemActive(item)) return false;
            return selectedCategory === "All" || item.category === selectedCategory;
        });
    }, [selectedCategory, meals]);

    const filteredRecommendations = useMemo(() => {
        return (recommendations || []).filter((item) => {
            if (!isMenuItemActive(item)) return false;
            return selectedCategory === "All" || item.category === selectedCategory;
        });
    }, [selectedCategory, recommendations]);

    return (
        <div className="bg-white min-h-screen px-4 md:px-10 lg:px-20 overflow-hidden">
            <div className="py-12 md:py-16 lg:py-20 space-y-5 md:space-y-2 lg:space-y-2">
                <MenuFilter />
                <OffersSection />

                {/* Suggested Meals Section (Displayed for logged-in users when recommendations exist) */}
                {!isGuest && (
                    <SuggestedMealsSection items={filteredRecommendations} />
                )}

                {/* Regular Food Section (Always displayed for everyone) */}
                {mealsLoading && meals.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg font-medium text-gray-600">Loading menu...</p>
                    </div>
                ) : mealsError && meals.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg font-medium text-red-500">{mealsError}</p>
                    </div>
                ) : filteredMeals.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg font-medium text-gray-500">No meals available in this category</p>
                    </div>
                ) : (
                    <RegularFood items={filteredMeals} />
                )}
            </div>
        </div>
    );
}
