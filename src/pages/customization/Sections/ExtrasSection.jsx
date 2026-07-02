// components/customize/ExtrasSection.jsx

import SectionWrapper from "./SectionWrapper";
import ItemsRow from "./ItemsRow";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const ExtrasSection = () => {
  const { selectedMeal, selectedExtras, toggleExtra } = useCustomizeStore();

  if (!selectedMeal) return null;

  const extrasSection = selectedMeal.sections.find(
    (sec) => sec.type === "extras",
  );

  if (!extrasSection) return null;

  return (
    <SectionWrapper title="Choose Your Extra ?">
      <ItemsRow
        items={extrasSection.items}
        selectedItems={selectedExtras}
        onToggle={toggleExtra}
      />
    </SectionWrapper>
  );
};

export default ExtrasSection;
