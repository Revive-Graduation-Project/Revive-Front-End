import React from "react";
import SectionWrapper from "./SectionWrapper";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const IngredientsSection = () => {
  const { selectedMeal, selectedSections, toggleItem } = useCustomizeStore();

  if (!selectedMeal) return null;

  return (
    <SectionWrapper title="Customize Your Meal">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 text-sm">
              <th className="p-3 font-semibold">Ingredient</th>
              <th className="p-3 font-semibold text-center">Calories</th>
              <th className="p-3 font-semibold text-center">Protein</th>
              <th className="p-3 font-semibold text-center">Carbs</th>
              <th className="p-3 font-semibold text-center">Fat</th>
              <th className="p-3 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedMeal.sections.map((section) => {
              const selectedItems = selectedSections[section.type] || [];

              return (
                <React.Fragment key={section.type}>
                  {/* Category Header Row */}
                  <tr className="bg-gray-100">
                    <td colSpan="6" className="p-3 font-bold text-gray-800">
                      {section.title}
                      {section.required && <span className="text-red-500 ml-1">*</span>}
                      {section.maxSelect && (
                        <span className="text-xs text-gray-500 font-normal ml-3">
                          (Max {section.maxSelect})
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Ingredient Rows */}
                  {section.items.map((item) => {
                    const isSelected = selectedItems.some((i) => i.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium text-gray-700">{item.name}</td>
                        <td className="p-3 text-center text-sm text-gray-600">{item.calories || 0} kcal</td>
                        <td className="p-3 text-center text-sm text-gray-600">{item.protein || 0}g</td>
                        <td className="p-3 text-center text-sm text-gray-600">{item.carbs || 0}g</td>
                        <td className="p-3 text-center text-sm text-gray-600">{item.fat || 0}g</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => toggleItem(section, item)}
                            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                              isSelected 
                                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                            }`}
                          >
                            {isSelected ? 'Remove' : 'Add'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionWrapper>
  );
};

export default IngredientsSection;
