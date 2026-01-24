import { create } from "zustand";

/*
  Health Store:
  - Manages user's health profile, dietary info, and goals
  - Extendable for calorie calculations, AI integration
*/
const useHealthStore = create((set) => ({
  age: null,
  weight: null,
  height: null,
  activityLevel: "low", // options: low, medium, high
  allergies: [],
  medicalConditions: [],
  setHealthData: (data) => set(data), // update all health info at once
  addAllergy: (allergy) => set((state) => ({ allergies: [...state.allergies, allergy] })),
  removeAllergy: (allergy) =>
    set((state) => ({ allergies: state.allergies.filter((a) => a !== allergy) })),
}));

export default useHealthStore;
