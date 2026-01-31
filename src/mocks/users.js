import { UserRole, Gender, Goal, ActivityLevel } from './enums';

/**
 * Mock Users & Profiles
 */

export const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: UserRole.CLIENT,
    profile: {
      id: 101,
      age: 28,
      gender: Gender.MALE,
      height: 180, // cm
      weight: 85, // kg
      goal: Goal.GAIN_MUSCLE,
      activityLevel: ActivityLevel.MEDIUM,
      dietaryPreferences: ["High Protein"],
      allergies: ["Peanuts"],
      medicalConditions: [],
    }
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: UserRole.CLIENT,
    profile: {
      id: 102,
      age: 34,
      gender: Gender.FEMALE,
      height: 165,
      weight: 60,
      goal: Goal.LOSE_WEIGHT,
      activityLevel: ActivityLevel.HIGH,
      dietaryPreferences: ["Vegan"],
      allergies: [],
      medicalConditions: ["Asthma"],
    }
  },
  {
    id: 3,
    firstName: "Admin",
    lastName: "User",
    email: "admin@revive.com",
    role: UserRole.ADMIN,
    profile: null
  }
];
