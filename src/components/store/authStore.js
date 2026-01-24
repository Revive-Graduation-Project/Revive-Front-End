import { create } from "zustand";

/*
  Auth Store:
  - Manages user login/logout state
  - Extendable to include token management, roles, etc.
*/
const useAuthStore = create((set) => ({
  user: null, // store the current logged-in user
  login: (userData) => set({ user: userData }), // set user on login
  logout: () => set({ user: null }), // clear user on logout
}));

export default useAuthStore;
