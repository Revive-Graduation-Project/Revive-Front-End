import {
    useMenuStore,
    useAuthStore,
    useRecommendationStore,
} from "../../store";
import { useMenuItems, isMenuItemActive } from "../../hooks/dashboard/useMenuItems";
import { useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import MenuFilter from "./Sections/MenuFilter";
import OffersSection from "./Sections/OffersSection";
import SuggestedMealsSection from "./Sections/SuggestedMealsSection";
import RegularFood from "../Home/Sections/RegularFood";
import DishSearchInput from "../../components/Menu/DishSearchInput";

export default function Menu() {
    const { user } = useAuthStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = (searchParams.get("search") || searchParams.get("q") || "").trim().toLowerCase();
    const targetDishId = searchParams.get("dishId") || searchParams.get("dish");

    const {
        recommendations,
        fetchRecommendations,
    } = useRecommendationStore();
    const { data: meals = [], isLoading: mealsLoading, error: mealsErrorObj } = useMenuItems({});
    const mealsError = mealsErrorObj ? (mealsErrorObj.message || "Failed to load meals") : null;
    const { selectedCategory, setSelectedCategory } = useMenuStore();

    const isGuest = !user;

    useEffect(() => {
        // If user is logged in, fetch personalized recommendations
        if (!isGuest) {
            fetchRecommendations(user?.id);
        }
    }, [user, isGuest, fetchRecommendations]);

    const activeMeals = useMemo(() => {
        return meals.filter(isMenuItemActive);
    }, [meals]);

    const highlightDishCard = useCallback((dishId, dishCategory) => {
        if (!dishId) return;

        if (dishCategory && selectedCategory !== "All" && dishCategory !== selectedCategory) {
            setSelectedCategory("All");
        }

        let attempts = 0;
        const interval = setInterval(() => {
            attempts += 1;
            const el = document.getElementById(`dish-card-${dishId}`);
            if (el) {
                clearInterval(interval);
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.classList.add(
                    "ring-4",
                    "ring-orange",
                    "shadow-2xl",
                    "scale-[1.03]",
                    "transition-all",
                    "duration-500"
                );
                setTimeout(() => {
                    el.classList.remove(
                        "ring-4",
                        "ring-orange",
                        "shadow-2xl",
                        "scale-[1.03]"
                    );
                }, 3000);
            } else if (attempts >= 15) {
                clearInterval(interval);
            }
        }, 100);
    }, [selectedCategory, setSelectedCategory]);

    // Handle navigation from Navbar searchbar (?dishId=... or ?search=...)
    useEffect(() => {
        if (!targetDishId || mealsLoading) return;
        const targetDish = activeMeals.find((m) => String(m.id) === String(targetDishId));
        highlightDishCard(targetDishId, targetDish?.category);
    }, [targetDishId, mealsLoading, activeMeals, highlightDishCard]);

    const handleSelectDish = useCallback((dish) => {
        if (!dish) return;
        highlightDishCard(dish.id, dish.category);
    }, [highlightDishCard]);

    const filteredMeals = useMemo(() => {
        return activeMeals.filter((item) => {
            if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
            if (searchQuery) {
                const nameMatch = (item.name || "").toLowerCase().includes(searchQuery);
                const descMatch = (item.description || "").toLowerCase().includes(searchQuery);
                const catMatch = (item.category || "").toLowerCase().includes(searchQuery);
                if (!nameMatch && !descMatch && !catMatch) return false;
            }
            return true;
        });
    }, [selectedCategory, activeMeals, searchQuery]);

    const filteredRecommendations = useMemo(() => {
        return (recommendations || []).filter((item) => {
            if (!isMenuItemActive(item)) return false;
            if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
            if (searchQuery) {
                const nameMatch = (item.name || "").toLowerCase().includes(searchQuery);
                const descMatch = (item.description || "").toLowerCase().includes(searchQuery);
                const catMatch = (item.category || "").toLowerCase().includes(searchQuery);
                if (!nameMatch && !descMatch && !catMatch) return false;
            }
            return true;
        });
    }, [selectedCategory, recommendations, searchQuery]);

    return (
        <div className="bg-white min-h-screen px-4 md:px-10 lg:px-20 overflow-hidden">
            <div className="py-16 md:py-16 lg:py-20 space-y-5 md:space-y-2 lg:space-y-2">
                <DishSearchInput meals={activeMeals} onSelectDish={handleSelectDish} />
                <MenuFilter />

                {searchQuery && (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 my-2">
                        <span className="text-sm text-green-800">
                            Showing dishes matching: <strong className="font-semibold">"{searchQuery}"</strong>
                        </span>
                        <button
                            onClick={() => setSearchParams({})}
                            className="text-xs text-green-700 hover:text-green-900 underline font-medium cursor-pointer"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

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
                        <p className="text-lg font-medium text-gray-500">No meals available matching your search</p>
                    </div>
                ) : (
                    <RegularFood items={filteredMeals} />
                )}
            </div>
        </div>
    );
}
