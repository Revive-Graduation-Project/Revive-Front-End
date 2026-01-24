import { create } from "zustand";

/*
  Recommendation Store:
  - Manages AI-generated meal recommendations
  - Extendable to fetch from external AI APIs, rank meals, filter by health profile
*/
const useRecommendationStore = create((set) => ({
  recommendations: [],
  setRecommendations: (meals) => set({ recommendations: meals }),
}));

export default useRecommendationStore;
