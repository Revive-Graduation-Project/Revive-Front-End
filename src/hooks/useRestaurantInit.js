import { useEffect } from "react";
import { useRestaurantStore } from "../store";

/**
 * Hook to initialize meal data on app load.
 * Call this in App.jsx on mount.
 *
 * Single-restaurant system — only fetches meals, no restaurant selection.
 * Mock now → real API later (no changes needed here).
 */
export const useRestaurantInit = () => {
    const { meals, fetchMeals } = useRestaurantStore();

    useEffect(() => {
        // Only fetch if store is empty
        if (meals.length === 0) {
            console.log("🍽️ Fetching menu...");
            fetchMeals();
        }
    }, []);
};
