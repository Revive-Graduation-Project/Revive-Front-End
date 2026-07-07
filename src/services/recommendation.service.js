import { api } from "./api";
import { getMenu } from "./menu.service";
import { useAuthStore } from "../store";

/**
 * Fetch AI meal recommendations for the authenticated user.
 * 1. Fetches client profile + all meals in parallel
 * 2. Sends both to the AI recommendation engine
 * 3. Enriches the recommendations with imageUrl & nutrients from the original meals
 *
 * @param {string} [role] - The authenticated user's role (e.g. "CLIENT")
 * @returns {{ data: Array }} - Enriched recommended meals
 */
export const getSuggestedMeals = async (role) => {
  const [profileRes, mealsRes] = await Promise.allSettled([
    api.get(`/api/clients/profile/${useAuthStore.getState().user?.id}`),
    getMenu(),
  ]);

  if (profileRes.status !== "fulfilled") {
    throw new Error("Failed to fetch user profile");
  }
  if (mealsRes.status !== "fulfilled") {
    throw new Error("Failed to fetch meals");
  }

  const user = profileRes.value.data;
  const meals = mealsRes.value.data;

  const minimalProfile = {
    id: user?.id,
    age: user?.age,
    gender: user?.gender,
    goal: user?.goal,
    weight: user?.weight,
    height: user?.height,
    exercisesRegularly: user?.exercisesRegularly,
    healthConditions: user?.healthConditions,
    phoneNumber: user?.phoneNumber,
  };

  const minimalMeals = (Array.isArray(meals) ? meals : []).map((meal) => ({
    id: meal?.id,
    name: meal?.name,
    category: meal?.category,
    price: meal?.price,
    nutrients: meal?.nutrients,
    hasDiscount: meal?.hasDiscount,
    discountPercentage: meal?.discountPercentage,
  }));

  const aiResponse = await api.post("/api/recommendations", {
    user: minimalProfile,
    meals: minimalMeals,
    role,
    top_n: 5,
  });

  const aiPayload = aiResponse?.data;
  const recommendations = Array.isArray(aiPayload?.recommendations)
    ? aiPayload.recommendations
    : [];

  // Enrich recommendations with original meal data (imageUrl, nutrients, discount)
  const enrichedMeals = recommendations.map((rec) => {
    const originalMeal = meals.find((m) => m.id === rec.meal_id);
    return {
      id: rec.meal_id,
      name: rec.name,
      price: rec.price,
      category: rec.category,
      imageUrl: originalMeal?.imageUrl ?? null,
      nutrients: originalMeal?.nutrients ?? [],
      hasDiscount: originalMeal?.hasDiscount ?? false,
      discountPercentage: originalMeal?.discountPercentage ?? 0,
      score: rec.score_percentage,
      reasons: rec.reasons,
      isActive: originalMeal?.isActive ?? true,
    };
  });

  return { data: enrichedMeals };
};
