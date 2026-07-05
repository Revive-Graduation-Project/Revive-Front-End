import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getProfile,
  updateProfile,
  deleteProfile,
  uploadProfilePicture,
  deleteProfilePicture,
} from "../services/user.service";

/**
 * Profile Store
 * - Holds user profile data
 * - Actions now require a `userId` to match the backend endpoints
 */
const useProfileStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      // Fetch profile data
      fetchProfile: async (userId) => {
        if (!userId) return null;
        set({ loading: true, error: null });
        try {
          const res = await getProfile(userId);
          const user = res?.data || null;
          if (!user) {
            set({ error: "Profile not found", loading: false });
            return null;
          }
          set({ user, loading: false, error: null });
          return user;
        } catch (error) {
          set({ error: error?.response?.data?.message || error.message, loading: false });
          return null;
        }
      },

      // Update Profile (Handles the full payload directly from the form)
      updateUserProfile: async (userId, data) => {
        if (!userId) return null;
        set({ loading: true, error: null });
        try {
          const res = await updateProfile(userId, data);
          const user = res?.data || null;
          if (user) {
            set({ user, loading: false, error: null });
          } else {
            set({ loading: false });
          }
          return user;
        } catch (error) {
          set({ error: error?.response?.data?.message || error.message, loading: false });
          return null;
        }
      },

      // Upload Profile Picture
      uploadPicture: async (userId, file) => {
        if (!userId || !file) return null;
        set({ loading: true, error: null });
        try {
          const res = await uploadProfilePicture(userId, file);
          const user = res?.data || get().user; 
          set({ user, loading: false, error: null });
          return user;
        } catch (error) {
          set({ error: error?.response?.data?.message || error.message, loading: false });
          return null;
        }
      },

      // Delete Profile Picture
      deletePicture: async (userId) => {
        if (!userId) return null;
        set({ loading: true, error: null });
        try {
          await deleteProfilePicture(userId);
          // Clear profile image fields on success
          const currentUser = get().user;
          const updatedUser = currentUser ? { ...currentUser, profilePicture: null, avatar: null } : null;
          set({ user: updatedUser, loading: false, error: null });
          return true;
        } catch (error) {
          set({ error: error?.response?.data?.message || error.message, loading: false });
          return false;
        }
      },

      // Delete Entire Profile
      deleteUserProfile: async (userId) => {
        if (!userId) return false;
        set({ loading: true, error: null });
        try {
          await deleteProfile(userId);
          set({ user: null, loading: false, error: null }); 
          return true;
        } catch (error) {
          set({ error: error?.response?.data?.message || error.message, loading: false });
          return false;
        }
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