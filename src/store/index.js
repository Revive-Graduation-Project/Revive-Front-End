export { default as useAuthStore } from "./authStore";
export { default as useProfileStore } from "./profileStore";
// Backwards-compatible alias (temporary) — prefer `useProfileStore`
export { default as useHealthStore } from "./profileStore";
export { default as useRestaurantStore } from "./restaurantStore";
export { default as useOrderStore } from "./orderStore";
export { default as useUIStore } from "./uiStore";
export { default as usePaymentStore } from "./paymentStore";
export { default as useRecommendationStore } from "./recommendationStore";
export { default as useFavoritesStore } from "./favoritesStore";
export { default as useMenuStore } from "./menuStore";

//NOTE:
// the import must be like : import {useAuthStore} from "../../store";
