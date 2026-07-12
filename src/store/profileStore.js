import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getProfile as getClientProfile,
  updateProfile as updateClientProfile,
  uploadProfilePicture as uploadClientProfilePicture,
  deleteProfilePicture as deleteClientProfilePicture,
  deleteProfile as deleteClientProfile,
} from "../services/clientProfileService";
import { deleteAuthUser } from "../services/auth.service";
import useAuthStore from "../store/authStore";

const useProfileStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      fetchProfile: async (force = false) => {
        const activeUserId = useAuthStore.getState().user?.id;
        const cachedUser = get().user;

        if (!force && cachedUser && cachedUser.id === activeUserId) {
          return cachedUser;
        }

        if (cachedUser && cachedUser.id != null && activeUserId != null && cachedUser.id !== activeUserId) {
          set({ user: null, loading: false, error: null });
        }

        set({ loading: true, error: null });
        try {
          const id = useAuthStore.getState().user?.id;
          if (!id) throw new Error("User ID not found");
          const res = await getClientProfile(id);
          const user = res?.data || null;
          if (!user) {
            set({ error: "Profile not found", loading: false });
            return null;
          }
          set({ user, loading: false, error: null });

          // Sync loyalty points with loyaltyStore if present on backend (> 0)
          if (typeof user.loyaltyPoints === "number" && user.loyaltyPoints > 0) {
            import("../store/loyaltyStore")
              .then((mod) => {
                mod.default?.setState({ points: user.loyaltyPoints });
              })
              .catch(() => {});
          }

          return user;
        } catch (error) {
          set({ error: error.message || "Failed to load profile", loading: false });
          return null;
        }
      },

      updateUser: async (data) => {
        set({ loading: true, error: null });
        try {
          const authUser = useAuthStore.getState().user || {};
          const id = authUser.id;
          if (!id) throw new Error("User ID not found");
          const existingUser = get().user || {};
          const mergedData = { ...existingUser, ...data };
          const res = await updateClientProfile(id, mergedData);
          const updated = {
            ...mergedData,
            ...(res?.data || {}),
            firstName: data.firstName || mergedData.firstName,
            lastName: data.lastName || mergedData.lastName,
            name: data.name || mergedData.name,
            fullName: data.fullName || mergedData.fullName,
          };
          if (data.firstName || data.lastName || data.name) {
            useAuthStore.setState({
              user: {
                ...authUser,
                ...data,
                name: updated.name,
                fullName: updated.fullName,
              },
            });
          }
          set({ user: updated, loading: false, error: null });
          return updated;
        } catch (error) {
          set({ error: error.message || "Failed to update profile", loading: false });
          throw error;
        }
      },

      updateHealth: async (data) => {
        return get().updateUser(data);
      },

      uploadProfilePicture: async (file) => {
        set({ loading: true, error: null });
        try {
          const id = useAuthStore.getState().user?.id;
          if (!id) throw new Error("User ID not found");
          const res = await uploadClientProfilePicture(id, file);
          const responseData = res?.data;

          let currentUser = get().user || {};
          if (typeof responseData === "string") {
            currentUser = { ...currentUser, profilePictureUrl: responseData, avatar: responseData };
            set({ user: currentUser, loading: false, error: null });
          } else if (responseData && typeof responseData === "object") {
            const newUrl = responseData.profilePictureUrl || responseData.url || responseData.avatar;
            currentUser = { ...currentUser, ...responseData, ...(newUrl ? { profilePictureUrl: newUrl, avatar: newUrl } : {}) };
            set({ user: currentUser, loading: false, error: null });
          }

          // Refresh profile safely
          try {
            await get().fetchProfile(true);
          } catch (e) {
            console.warn("Could not refetch profile immediately after picture upload:", e);
          }
          set({ loading: false });
          return get().user || currentUser;
        } catch (error) {
          set({ error: error.message || "Failed to upload profile picture", loading: false });
          throw error;
        }
      },

      deleteProfilePicture: async () => {
        set({ loading: true, error: null });
        try {
          const id = useAuthStore.getState().user?.id;
          if (!id) throw new Error("User ID not found");
          await deleteClientProfilePicture(id);
          const currentUser = get().user || {};
          const updatedUser = { ...currentUser, profilePictureUrl: null, avatar: null };
          set({ user: updatedUser, loading: false, error: null });
          return updatedUser;
        } catch (error) {
          set({ error: error.message || "Failed to delete profile picture", loading: false });
          throw error;
        }
      },

      deleteAccount: async () => {
        set({ loading: true, error: null });
        try {
          const id = useAuthStore.getState().user?.id;
          if (id) {
            await deleteClientProfile(id).catch((err) => {
              console.warn("Delete profile API response:", err);
            });
            await deleteAuthUser(id).catch((err) => {
              console.warn("Delete auth user API response:", err);
            });
          }
          set({ user: null, loading: false, error: null });
          try {
            localStorage.removeItem("revive-profile-store");
          } catch (e) {}
          await useAuthStore.getState().logout(false);
          return true;
        } catch (error) {
          set({ user: null, loading: false, error: null });
          try {
            localStorage.removeItem("revive-profile-store");
          } catch (e) {}
          await useAuthStore.getState().logout(false);
          return true;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "revive-profile-store",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

export default useProfileStore;
