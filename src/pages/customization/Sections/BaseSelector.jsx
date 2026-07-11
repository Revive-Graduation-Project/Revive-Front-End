// components/customize/BaseSelector.jsx
import { useCustomizeStore } from "../../../store";
import SectionWrapper from "./SectionWrapper";

const BaseSelector = ({ primaryItems }) => {
  const { primaryItem, setPrimaryItem } = useCustomizeStore();

  return (
    <>
      <SectionWrapper title="Choose Your Main Ingredient">
        <div className="flex gap-4 flex-wrap">
          {primaryItems.map((item) => {
            const isSelected = primaryItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setPrimaryItem(item)}
                className={`cursor-pointer flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition w-[100px]
                  ${
                    isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                {/* Fallback image if ingredient doesn't have one */}
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl"
                />
                <span className="text-sm font-medium text-center">
                  {item.name}
                </span>
                <span className="text-xs text-orange-500">
                  {item.price ? `${item.price} EGP` : ''}
                </span>
              </div>
            );
          })}
        </div>
      </SectionWrapper>
    </>
  );
};

export default BaseSelector;
