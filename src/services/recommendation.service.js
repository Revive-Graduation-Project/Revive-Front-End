import { api } from './api';

/**
 * Fetch AI-suggested meals for the authenticated user.
 *
 * @param {string|number} userId - The authenticated user's ID
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const getSuggestedMeals = (userId) => {
  return api.get(`/menu/recommendations/${userId}`);
};
