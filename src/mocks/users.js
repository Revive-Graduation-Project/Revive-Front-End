import { UserRole, Gender, Goal } from "./enums";

/**
 * Mock Users
 *
 * Each entry carries:
 * - Identity fields (id, firstName, lastName, email, role) — used by
 *   auth mock handlers (login, etc.)
 * - ClientProfileDto fields, flattened directly on the same object
 *   (age, gender, exercisesRegularly, height, heightUnit, weight,
 *   weightUnit, goal, healthConditions, phoneNumber, profilePictureUrl,
 *   loyaltyPoints) — matching exactly what
 *   GET /api/clients/profile/{id} returns.
 *
 * NOTE: mock handlers must pick ONLY the profile fields when responding
 * to profile endpoints (see mockHandlers.js), so identity fields don't
 * leak into a response that the real backend would never include them in.
 */

export const mockUsers = [
  {
    // Identity
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: UserRole.CLIENT,

    // ClientProfileDto fields
    age: 28,
    gender: Gender.MALE,
    exercisesRegularly: true,
    height: 180,
    heightUnit: "cm",
    weight: 85,
    weightUnit: "kg",
    goal: Goal.GAIN_MUSCLE,
    healthConditions: ["NONE"],
    phoneNumber: "+201012345678",
    profilePictureUrl: null,
    loyaltyPoints: 420,
  },
  {
    // Identity
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: UserRole.CLIENT,

    // ClientProfileDto fields
    age: 34,
    gender: Gender.FEMALE,
    exercisesRegularly: true,
    height: 165,
    heightUnit: "cm",
    weight: 60,
    weightUnit: "kg",
    goal: Goal.LOSE_WEIGHT,
    healthConditions: ["ASTHMA"],
    phoneNumber: "+201098765432",
    profilePictureUrl: null,
    loyaltyPoints: 150,
  },
  {
    // Identity only — admin has no client profile
    id: 3,
    firstName: "Admin",
    lastName: "User",
    email: "admin@revive.com",
    role: UserRole.ADMIN,
  },
];

// Field names that belong to ClientProfileDto specifically — used by mock
// handlers to strip identity fields out of profile-endpoint responses,
// so the mock matches the real backend's response shape exactly.
export const CLIENT_PROFILE_FIELDS = [
  "age",
  "gender",
  "exercisesRegularly",
  "height",
  "heightUnit",
  "weight",
  "weightUnit",
  "goal",
  "healthConditions",
  "phoneNumber",
  "profilePictureUrl",
  "loyaltyPoints",
];

export const toClientProfileDto = (user) => {
  if (!user) return null;
  const dto = { id: user.id };
  CLIENT_PROFILE_FIELDS.forEach((key) => {
    dto[key] = user[key];
  });
  return dto;
};