import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProfile, updateProfile, updateHealthProfile } from "../services/user.service";

/**
 * Profile Store
 * - Holds user profile/meta and health sub-object
 * - Contains actions that call services so components stay dumb
 */
const useProfileStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const res = await getProfile();
          const user = res?.data || null;
          if (!user) {
            set({ error: "Profile not found", loading: false });
            return null;
          }
          set({ user, loading: false, error: null });
          return user;
        } catch (error) {
          set({ error: error.message, loading: false });
          return null;
        }
      },

      updateUser: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await updateProfile(data);
          const user = res?.data || null;
          if (user) set({ user, loading: false, error: null });
          else set({ loading: false });
          return user;
        } catch (error) {
          set({ error: error.message, loading: false });
          return null;
        }
      },

      updateHealth: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await updateHealthProfile(data);
          const user = res?.data || null;
          if (user) set({ user, loading: false, error: null });
          return user;
        } catch (error) {
          set({ error: error.message, loading: false });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      addAllergy: (allergy) => {
        if (!allergy || typeof allergy !== "string") {
          set({ error: "Allergy cannot be empty" });
          return;
        }

        const normalized = allergy.trim().toLowerCase();
        const user = get().user;
        const current = user?.profile?.allergies || [];
        if (current.includes(normalized)) {
          set({ error: "Allergy already added" });
          return;
        }

        const updatedUser = {
          ...user,
          profile: {
            ...user?.profile,
            allergies: [...current, normalized],
          },
        };

        set({ user: updatedUser, error: null });
      },

      removeAllergy: (allergy) => {
        if (!allergy) return;
        const normalized = allergy.trim().toLowerCase();
        const user = get().user;
        const current = user?.profile?.allergies || [];
        if (!current.includes(normalized)) {
          set({ error: "Allergy not found" });
          return;
        }

        const updatedUser = {
          ...user,
          profile: {
            ...user?.profile,
            allergies: current.filter((a) => a !== normalized),
          },
        };

        set({ user: updatedUser, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-profile-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useProfileStore;
