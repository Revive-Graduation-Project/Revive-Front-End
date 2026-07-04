import React from "react";
import {
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  HEALTH_CONDITIONS,
} from "../../../constants";

export default function InfoGrid({ user = {} }) {
  // Now reading directly from the flat user object
  const age = user.age ?? "-";

  const gender = user.gender
    ? (GENDER_OPTIONS.find((g) => g.value === user.gender)?.label ??
      user.gender)
    : "-";

  const exercises =
    user.exercisesRegularly == null
      ? "-"
      : user.exercisesRegularly
        ? "Yes"
        : "No";

  const height = user.height
    ? `${user.height} ${user.heightUnit || "cm"}`
    : "-";

  const weight = user.weight
    ? `${user.weight} ${user.weightUnit || "kg"}`
    : "-";

  const goal = user.goal
    ? (GOAL_OPTIONS.find((g) => g.value === user.goal)?.label ??
      user.goal)
    : "-";

  const conditions =
    Array.isArray(user.healthConditions) &&
    user.healthConditions.length > 0
      ? user.healthConditions
      : [];

  const phone = user.phoneNumber || "-";

  return (
    <div>
      <h4 className="text-lg font-bold text-gray-800 tracking-tight relative inline-block after:absolute after:left-0 after:-bottom-1 after:h-1 after:w-12 after:rounded-full after:bg-orange">
        Your Information
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
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
            {conditions.map((condition) => {
              const label =
                HEALTH_CONDITIONS.find((c) => c.value === condition)?.label ??
                condition;

              return (
                <span
                  key={condition}
                  className="px-3 py-1.5 rounded-full text-sm bg-white border border-orange-200 text-orange-700 shadow-sm"
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}