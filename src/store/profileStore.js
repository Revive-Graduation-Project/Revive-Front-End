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
 * - Holds ClientProfileDto data exactly as the backend returns it —
 *   field names here (profilePictureUrl, etc.) match the real API,
 *   no renaming/remapping, to avoid frontend/backend field drift.
 */
const useProfileStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

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
          // Backend returns only { profilePictureUrl } — merge it into the
          // existing user, keeping the SAME field name as the real DTO
          // (no renaming to `profilePicture` — that mismatch was the bug).
          const profilePictureUrl = res?.data?.profilePictureUrl;
          const currentUser = get().user;
          const updatedUser = currentUser
            ? { ...currentUser, profilePictureUrl }
            : { profilePictureUrl };
          set({ user: updatedUser, loading: false, error: null });
          return updatedUser;
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
          const currentUser = get().user;
          const updatedUser = currentUser
            ? { ...currentUser, profilePictureUrl: null }
            : null;
          set({ user: updatedUser, loading: false, error: null });
          return true;
        } catch (error) {
          set({ error: error?.response?.data?.message || error.message, loading: false });
          return false;
        }
      },

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
      // Bump this any time the `user` shape changes, so stale
      // localStorage from an old shape gets discarded instead of
      // silently accumulating leftover fields (e.g. old `avatar` /
      // `profilePicture` keys sitting alongside the current
      // `profilePictureUrl` field).
      version: 1,
      migrate: (persistedState, version) => {
        if (version < 1) {
          return { user: null };
        }
        return persistedState;
      },
    }
  )
);

export default useProfileStore;