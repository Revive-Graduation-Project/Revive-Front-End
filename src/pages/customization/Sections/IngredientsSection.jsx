import SectionWrapper from "./SectionWrapper";
import ItemsRow from "./ItemsRow";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const IngredientsSection = ({ buildOptions }) => {
  const { primaryItem, selectedSections, toggleItem } = useCustomizeStore();

  if (!primaryItem || !buildOptions || !buildOptions.slots) return null;

  return (
    <SectionWrapper title="Customize Your Meal">
      {buildOptions.slots.map((section) => {
        const selectedItems = selectedSections[section.slotName] || [];

        return (
          <div key={section.slotName} className="mb-8">
            <div className="flex items-center mb-1">
              <h4 className="text-sm font-medium mr-2">
                {section.slotName}
                {section.isRequired && (
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
              section={section}
              items={section.ingredients}
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
