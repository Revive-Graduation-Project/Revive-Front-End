// components/customize/SectionsList.jsx

import SectionWrapper from "./SectionWrapper";
import ItemsRow from "./ItemsRow";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const IngredientsSection = () => {
  const { selectedMeal, selectedSections, toggleItem } = useCustomizeStore();

  if (!selectedMeal) return null;

  return (
    <SectionWrapper title="Customize Your Meal">
      {selectedMeal.sections.map((section) => {
        const selectedItems = selectedSections[section.type] || [];

        return (
          <div key={section.type} className="mb-8">
            <div className="flex items-center mb-1">
              <h4 className="text-sm font-medium mr-2">
                {section.title}
                {section.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h4>

              {section.maxSelect && (
                <span className="text-xs text-gray-400">
                  Max {section.maxSelect}
                </span>
              )}
            </div>

            <ItemsRow
              items={section.items}
              selectedItems={selectedItems}
              onToggle={(item) => toggleItem(section, item)}
            />
          </div>
        );
      })}
    </SectionWrapper>
  );
};

export default IngredientsSection;
