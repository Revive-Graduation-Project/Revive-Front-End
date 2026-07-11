// components/customize/SaucesSection.jsx

import SectionWrapper from "./SectionWrapper";
import ItemsRow from "./ItemsRow";
import { useCustomizeStore } from "../../../store";

const SaucesSection = () => {
  const { selectedMeal, selectedSauces, toggleSauce } = useCustomizeStore();

  if (!selectedMeal) return null;

  const saucesSection = selectedMeal.sections.find(
    (sec) => sec.type === "sauces",
  );

  if (!saucesSection) return null;

  return (
    <SectionWrapper title="Choose Your Sauces ?">
      <ItemsRow
        items={saucesSection.items}
        selectedItems={selectedSauces}
        onToggle={toggleSauce}
      />
    </SectionWrapper>
  );
};

export default SaucesSection;
