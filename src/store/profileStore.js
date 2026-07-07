import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProfileById, updateProfile } from "../services/user.service";
import useAuthStore from "../store/authStore";
const useProfileStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      fetchProfile: async () => {
        const activeUserId = useAuthStore.getState().user?.id;
        const cachedUser = get().user;

        if (cachedUser && cachedUser.id === activeUserId) {
          return cachedUser;
        }

        if (cachedUser && cachedUser.id != null && activeUserId != null) {
          set({ user: null, loading: false, error: null });
        }

        set({ loading: true, error: null });
        try {
          const id = useAuthStore.getState().user?.id;
          if (!id) throw new Error("User ID not found");
          const res = await getProfileById(id);
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
          const id = useAuthStore.getState().user?.id;
          if (!id) throw new Error("User ID not found");
          const res = await updateProfile(id, data);
          const user = res?.data || null;
          if (user) set({ user, loading: false, error: null });
          else set({ loading: false });
          return user;
        } catch (error) {
          set({ error: error.message, loading: false });
          return null;
        }
      },

      // updateHealth بقى نفس updateUser لأن مفيش endpoint منفصل للـ health
      updateHealth: async (data) => {
        return get().updateUser(data);
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
