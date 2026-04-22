// components/customize/BaseSelector.jsx
// FIX: فصلنا اختيار الـ Meal عن الـ Base زي ما الـ UI بيعرض

import { useCustomizeStore } from "../../../store/useCustomizeStore";
import SectionWrapper from "./SectionWrapper";

const BaseSelector = ({ meals }) => {
  const { selectedMeal, selectedBase, setMeal, setBase } = useCustomizeStore();

  return (
    <>
      {/* STEP 1 — اختيار الـ Meal */}
      <SectionWrapper title="Choose Your Base ?">
        <div className="flex gap-4 flex-wrap">
          {meals.map((meal) => {
            const isSelected = selectedMeal?.id === meal.id;

            return (
              <div
                key={meal.id}
                onClick={() => setMeal(meal)}
                className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition w-[100px]
                  ${
                    isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                {meal.image && (
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className="w-14 h-14 object-cover rounded-xl"
                  />
                )}
                <span className="text-sm font-medium text-center">
                  {meal.name}
                </span>
              </div>
            );
          })}
        </div>
      </SectionWrapper>

      {/* STEP 2 — اختيار الـ Base (بتظهر بس لو في meal متحددة) */}
      {selectedMeal && (
        <SectionWrapper title="Choose Your Size">
          <div className="flex gap-3 flex-wrap">
            {selectedMeal.bases.map((base) => {
              const isSelected = selectedBase?.id === base.id;

              return (
                <div
                  key={base.id}
                  onClick={() => setBase(base)}
                  className={`cursor-pointer px-5 py-3 rounded-xl border-2 text-sm font-medium transition
                    ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 text-orange-600"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {base.name}
                  <span className="ml-2 text-xs text-gray-400">
                    {base.basePrice} EGP
                  </span>
                </div>
              );
            })}
          </div>
        </SectionWrapper>
      )}
    </>
  );
};

export default BaseSelector;
