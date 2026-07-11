import { HEALTH_CONDITIONS } from "../../constants";
function AllergiesDropdown({ selected = [], onChange }) {

  const handleToggle = (option) => {
    if (selected.includes(option)) {
      // Removing a condition
      const next = selected.filter((s) => s !== option);
      // If array is empty after removing, default back to "NONE"
      onChange(next.length === 0 ? ["NONE"] : next);
    } else {
      // Adding a condition
      if (option === "NONE") {
        // If they select "NONE", clear everything else
        onChange(["NONE"]);
      } else {
        // If they select a real condition, remove "NONE" from the array
        onChange([...selected.filter((s) => s !== "NONE"), option]);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">
        Do you have any allergies or health conditions?
      </label>

      <div className="border border-orange rounded-2xl p-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          {HEALTH_CONDITIONS.map(({label , value}) => (
            <label
              key={value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-orange w-4 h-4"
                checked={selected.includes(value)}
                onChange={() => handleToggle(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllergiesDropdown;
