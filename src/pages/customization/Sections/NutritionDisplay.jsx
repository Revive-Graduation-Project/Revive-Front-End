// src/pages/customization/Sections/NutritionDisplay.jsx
import React from "react";
import { motion } from "framer-motion";

const MACRO_CONFIGS = [
  {
    key: "calories",
    label: "Calories",
    icon: "🔥",
    unit: "kcal",
    target: 800,
    colorClass: "bg-orange-500",
    bgClass: "bg-orange-100"
  },
  {
    key: "protein",
    label: "Protein",
    icon: "💪",
    unit: "g",
    target: 50,
    colorClass: "bg-red-500",
    bgClass: "bg-red-100"
  },
  {
    key: "carbs",
    label: "Carbs",
    icon: "🌾",
    unit: "g",
    target: 90,
    colorClass: "bg-amber-500",
    bgClass: "bg-amber-100"
  },
  {
    key: "fat",
    label: "Fat",
    icon: "🥑",
    unit: "g",
    target: 35,
    colorClass: "bg-emerald-500",
    bgClass: "bg-emerald-100"
  }
];

const NutritionDisplay = ({ nutrition = { calories: 0, protein: 0, carbs: 0, fat: 0 } }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Nutrition Facts
        </h4>
        <span className="text-[11px] text-gray-400">Real-time Estimate</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {MACRO_CONFIGS.map((macro) => {
          const rawVal = nutrition[macro.key] || 0;
          const pct = Math.min(100, Math.round((rawVal / macro.target) * 100));

          return (
            <div
              key={macro.key}
              className="p-2.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <span>{macro.icon}</span>
                  <span>{macro.label}</span>
                </span>
                <motion.span
                  key={rawVal}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-sm font-bold text-gray-900"
                >
                  {rawVal}
                  <span className="text-[10px] font-normal text-gray-400 ml-0.5">
                    {macro.unit}
                  </span>
                </motion.span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full ${macro.colorClass}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionDisplay;
