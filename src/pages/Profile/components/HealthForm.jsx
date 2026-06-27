import React, { useState } from "react";
import {
  HEALTH_CONDITIONS,
  GENDER_OPTIONS,
  HEIGHT_UNITS,
  WEIGHT_UNITS,
  GOAL_OPTIONS,
} from "../../../constants";

const egyptianPhoneRegex = /^(\+20|0020|0)?1[0125]\d{8}$/;

export default function HealthForm({ initial = {}, onCancel, onSave, saving }) {
  const [form, setForm] = useState({
    age: initial.age ?? "",
    gender: initial.gender ?? "",
    exercisesRegularly: initial.exercisesRegularly ?? false,
    height: initial.height ?? "",
    heightUnit: initial.heightUnit ?? "cm",
    weight: initial.weight ?? "",
    weightUnit: initial.weightUnit ?? "kg",
    goal: initial.goal ?? "",
    healthConditions: initial.healthConditions ?? [],
    phoneNumber: initial.phoneNumber || "",
  });

  const [phoneError, setPhoneError] = useState("");

  const update = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((s) => ({ ...s, [field]: value }));
  };

  const submit = () => {
    if (form.phoneNumber && !egyptianPhoneRegex.test(form.phoneNumber.trim())) {
      setPhoneError(
        "Please enter a valid Egyptian phone number (e.g. 01012345678)",
      );
      return;
    }
    setPhoneError("");

    const payload = {
      age: form.age === "" ? null : Number(form.age),
      gender: form.gender || null,
      exercisesRegularly: !!form.exercisesRegularly,
      height: form.height === "" ? null : Number(form.height),
      heightUnit: form.heightUnit || null,
      weight: form.weight === "" ? null : Number(form.weight),
      weightUnit: form.weightUnit || null,
      goal: form.goal || null,
      healthConditions: form.healthConditions || [],
      phoneNumber: form.phoneNumber || null,
    };

    onSave(payload);
  };

  return (
    <div className="mt-2 bg-white rounded-lg p-3 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={update("age")}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Gender</label>
          <select
            value={form.gender}
            onChange={update("gender")}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>
              Select
            </option>
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g[0] + g.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">
            Phone number
          </label>
          <input
            value={form.phoneNumber}
            onChange={(e) => {
              update("phoneNumber")(e);
              setPhoneError("");
            }}
            placeholder="01012345678"
            className={`w-full mt-1 px-3 py-2 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 outline-none transition-all ${
              phoneError
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-gray-200 focus:border-green-400 focus:ring-green-100"
            }`}
          />
          {phoneError && (
            <p className="text-xs text-red-500 mt-1">{phoneError}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Height</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={form.height}
              onChange={update("height")}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            />
            <select
              value={form.heightUnit}
              onChange={update("heightUnit")}
              className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
            >
              {HEIGHT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Weight</label>
          <div className="flex gap-2 mt-1">
            <input
              type="number"
              value={form.weight}
              onChange={update("weight")}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            />
            <select
              value={form.weightUnit}
              onChange={update("weightUnit")}
              className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Goal</label>
          <select
            value={form.goal}
            onChange={update("goal")}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="" disabled hidden>
              Select
            </option>
            {GOAL_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g
                  .replace("_", " ")
                  .toLowerCase()
                  .replace(/(^|\s)\S/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-gray-500">Health Conditions</label>
          <div className="border border-orange-200 rounded-2xl p-4 mt-1 bg-orange-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HEALTH_CONDITIONS.map((option, index) => {
                const checked = form.healthConditions.includes(option);
                return (
                  <label
                    key={index}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const current = form.healthConditions || [];
                        const exists = current.includes(option);
                        const next = exists
                          ? current.filter((c) => c !== option)
                          : [...current, option];
                        setForm((s) => ({ ...s, healthConditions: next }));
                      }}
                      aria-pressed={checked}
                      className={`relative inline-flex h-6 w-11 items-center cursor-pointer rounded-full transition-colors ${
                        checked ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          checked ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setForm((s) => ({
                ...s,
                exercisesRegularly: !s.exercisesRegularly,
              }))
            }
            aria-pressed={!!form.exercisesRegularly}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              form.exercisesRegularly ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                form.exercisesRegularly ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <label
            className="text-sm text-gray-500 cursor-pointer"
            onClick={() =>
              setForm((s) => ({
                ...s,
                exercisesRegularly: !s.exercisesRegularly,
              }))
            }
          >
            Exercises regularly
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white border rounded cursor-pointer hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={saving}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
