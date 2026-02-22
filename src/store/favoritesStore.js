import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * ==========================
 * Favorites Store
 * ==========================
 * Responsibilities:
 * - Manage user's favorite items (wishlist).
 * - Persist favorites to local storage.
 */
const useFavoritesStore = create(
  persist(
    (set, get) => ({
      /* =====================
         STATE
      ====================== */
      favorites: [], // Array of full item objects

      /* =====================
         ACTIONS
      ====================== */

      /**
       * Toggle favorite status of an item
       * If exists -> remove, If not -> add
       * @param {Object} item 
       */
      toggleFavorite: (item) => {
        const { favorites } = get();
        const exists = favorites.some((fav) => fav.id === item.id);

        if (exists) {
          set({
            favorites: favorites.filter((fav) => fav.id !== item.id),
          });
        } else {
          set({
            favorites: [...favorites, item],
          });
        }
      },

      /**
       * Check if item is in favorites
       * @param {number|string} id 
       * @returns {boolean}
       */
      isFavorite: (id) => {
        return get().favorites.some((fav) => fav.id === id);
      },

      /**
       * Clear all favorites
       */
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "revive-favorites-store",
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);

export default useFavoritesStore;
