import { api } from "./api";

/**
 * Fetch AI-suggested meals for the authenticated user from the backend recommendation engine.
 *
 * @param {string|number} userId - The authenticated user's ID
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getSuggestedMeals = (userId) => {
  return api.get(`/api/menu/recommendations/${userId}`);
};
