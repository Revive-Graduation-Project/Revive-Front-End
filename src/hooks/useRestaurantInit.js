import { useEffect } from "react";
import { useRestaurantStore } from "../store";

/**
 * Hook to initialize restaurant store with data
 * Call this in App.jsx on mount
 * 
 * Currently fetches from mock data via service layer
 * Later will fetch from real API (no changes needed here!)
 */
export const useRestaurantInit = () => {
    const { meals, fetchMeals, fetchRestaurants } = useRestaurantStore();

    useEffect(() => {
        // Only fetch if store is empty
        if (meals.length === 0) {
            console.log("🍽️ Fetching restaurant data...");
            fetchMeals();
            fetchRestaurants();
        }
    }, []);
};
