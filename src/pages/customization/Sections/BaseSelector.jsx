// components/customize/BaseSelector.jsx

import SectionWrapper from "./SectionWrapper";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const BaseSelector = ({ meals }) => {
  const { selectedMeal, setMeal } = useCustomizeStore();

  return (
    <SectionWrapper title="Choose Your Base ?">
      <div className="flex gap-3">
        {meals.map((meal) => (
          <div
            key={meal.id}
            onClick={() => setMeal(meal)}
            className={`cursor-pointer text-center p-3 rounded-xl border transition
              ${
                selectedMeal?.id === meal.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200"
              }`}
          >
            <img
              src={meal.image}
              alt={meal.name}
              className="w-16 h-16 mx-auto mb-1 rounded-2xl"
            />
            <p className="text-sm">{meal.name}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default BaseSelector;
