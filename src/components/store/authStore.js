import { create } from "zustand";

/*
  Auth Store:
  - Manages user login/logout state
  - Extendable to include token management, roles, etc.
*/
 const useAuthStore = create((set) => ({
  user: null,                     
  isAuthenticated: false,        

  login: (data) =>
    set({ 
      user: data, 
      isAuthenticated: true      
    }),

  logout: () =>
    set({ 
      user: null, 
      isAuthenticated: false     
    }),
}));
export default useAuthStore;