import { mockRestaurants, mockMeals } from "../mocks/meals";

/**
 * ================================
 * Restaurant Service
 * ================================
 * This service abstracts data fetching for restaurants and meals.
 * 
 * CURRENT: Uses mock data
 * FUTURE: Replace with API calls (just change the implementation, not the interface)
 * 
 * When backend is ready:
 * 1. Replace mock imports with axios
 * 2. Change return statements to API calls
 * 3. Components and stores don't need to change!
 */

// ========================================
// MOCK DATA MODE (Current)
// ========================================

/**
 * Fetch all restaurants with their meals
 * @returns {Promise<Array>} Array of restaurants
 */
export const fetchRestaurants = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return mock data structured like API response
    return {
        data: mockRestaurants.map((restaurant) => ({
            ...restaurant,
            meals: mockMeals, // For now, all restaurants have all meals
        })),
    };

    // ========================================
    // FUTURE: Real API call (uncomment when backend is ready)
    // ========================================
    // import api from './api';
    // return await api.get('/restaurants');
};

/**
 * Fetch all meals (across all restaurants)
 * @returns {Promise<Array>} Array of meals
 */
export const fetchMeals = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
        data: mockMeals,
    };

    // ========================================
    // FUTURE: Real API call
    // ========================================
    // return await api.get('/meals');
};

/**
 * Fetch meals by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Filtered meals
 */
export const fetchMealsByCategory = async (category) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const filtered = category === "All"
        ? mockMeals
        : mockMeals.filter((meal) => meal.category === category);

    return {
        data: filtered,
    };

    // ========================================
    // FUTURE: Real API call
    // ========================================
    // return await api.get(`/meals?category=${category}`);
};

/**
 * Fetch a single meal by ID
 * @param {number} id - Meal ID
 * @returns {Promise<Object>} Meal object
 */
export const fetchMealById = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const meal = mockMeals.find((m) => m.id === id);

    if (!meal) {
        throw new Error(`Meal with id ${id} not found`);
    }

    return {
        data: meal,
    };

    // ========================================
    // FUTURE: Real API call
    // ========================================
    // return await api.get(`/meals/${id}`);
};

/**
 * Fetch a single restaurant by ID
 * @param {number} id - Restaurant ID
 * @returns {Promise<Object>} Restaurant object with meals
 */
export const fetchRestaurantById = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const restaurant = mockRestaurants.find((r) => r.id === id);

    if (!restaurant) {
        throw new Error(`Restaurant with id ${id} not found`);
    }

    return {
        data: {
            ...restaurant,
            meals: mockMeals,
        },
    };

    // ========================================
    // FUTURE: Real API call
    // ========================================
    // return await api.get(`/restaurants/${id}`);
};
