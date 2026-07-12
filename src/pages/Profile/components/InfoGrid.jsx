import React from "react";
import useAuthStore from "../../../store/authStore";

const pretty = {
  LOSE_WEIGHT: "Lose Weight",
  GAIN_WEIGHT: "Gain Weight",
  BUILD_MUSCLE: "Build Muscle",
  MAINTAIN_SHAPE: "Maintain Shape",
  MAINTAIN: "Maintain",
  GAIN_MUSCLE: "Gain Muscle",
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  NONE: "None",
  DIABETES: "Diabetes",
  HIGH_BLOOD_PRESSURE: "High blood pressure",
  HIGH_CHOLESTEROL: "High cholesterol",
  GLUTEN_INTOLERANCE: "Gluten intolerance / Celiac",
  LACTOSE_INTOLERANCE: "Lactose intolerance",
  THYROID_DISORDER: "Thyroid disorder",
  KIDNEY_OR_LIVER_CONDITION: "Kidney or liver condition",
};

export default function InfoGrid({ user = {}, profile = {} }) {
  const age = profile.age ?? "-";
  const gender = profile.gender
    ? pretty[profile.gender] || profile.gender
    : "-";
  const exercises = profile.exercisesRegularly ? "Yes" : "No";
  const height = profile.height
    ? `${profile.height} ${profile.heightUnit || "cm"}`
    : "-";
  const weight = profile.weight
    ? `${profile.weight} ${profile.weightUnit || "kg"}`
    : "-";
  const goal = profile.goal ? pretty[profile.goal] || profile.goal : "-";
  const conditions =
    Array.isArray(profile.healthConditions) &&
    profile.healthConditions.length > 0
      ? profile.healthConditions
      : [];
  const phone = profile.phoneNumber || "-";
  const loyaltyPoints = profile.loyaltyPoints ?? 0;
  const authUser = useAuthStore((s) => s.user) || {};
  const displayName =
    authUser?.fullName ||
    authUser?.name ||
    [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") ||
    user?.fullName ||
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    profile?.fullName ||
    profile?.name ||
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "-";
  const displayEmail =
    authUser?.emailString ||
    authUser?.email ||
    user?.emailString ||
    user?.email ||
    profile?.emailString ||
    profile?.email ||
    "-";

  return (
    <div>
      <h4 className="text-lg font-bold text-gray-800 tracking-tight relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-12 after:rounded-full after:bg-orange">
        Your Information
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Name</span>
          <span className="text-sm font-medium">{displayName}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Email</span>
          <span className="text-sm">{displayEmail}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Age</span>
          <span className="text-sm">{age}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Gender</span>
          <span className="text-sm">{gender}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Exercises regularly</span>
          <span className="text-sm">{exercises}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Phone</span>
          <span className="text-sm">{phone}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Height</span>
          <span className="text-sm">{height}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Weight</span>
          <span className="text-sm">{weight}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Goal</span>
          <span className="text-sm">{goal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Loyalty points</span>
          <span className="text-sm font-semibold text-green-700">{loyaltyPoints} pts</span>
        </div>
      </div>

      <hr className="w-1/3 mt-6 mb-3 text-gray-400" />

      <div className="sm:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg mb-2 font-bold text-gray-800 tracking-tight relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-12 after:rounded-full after:bg-orange">
            Health conditions
          </span>
          <span className="text-md text-gray-400">
            {conditions.length > 0
              ? `${conditions.length} conditions`
              : "No health conditions"}
          </span>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 min-h-20">
          <div className="flex flex-wrap gap-2">
            {conditions.map((condition, index) => (
              <span
                key={condition}
                className="px-3 py-1.5 rounded-full text-sm bg-white border border-orange-200 text-orange-700 shadow-sm"
              >
                {pretty[condition] || condition}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
