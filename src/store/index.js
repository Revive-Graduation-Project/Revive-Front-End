/*
  Central export for all stores.
  Team can import any store from one file.
*/
export { default as useAuthStore } from "./authStore";
export { default as useHealthStore } from "./healthStore";
export { default as useRestaurantStore } from "./restaurantStore";
export { default as useOrderStore } from "./orderStore";
export { default as useUIStore } from "./uiStore";
export { default as usePaymentStore } from "./paymentStore";
export { default as useLoyaltyStore } from "./loyaltyStore";
export { default as useRecommendationStore } from "./recommendationStore";
export { default as useFavoritesStore } from "./favoritesStore";
//NOTE:
// the import must be like : import useAuthStore from "../../store";

