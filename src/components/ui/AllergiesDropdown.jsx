import { HEALTH_CONDITIONS } from "../../constants";
function AllergiesDropdown({ selected = [], onChange }) {

  const handleToggle = (option) => {
    if (option === "NONE" || option === "None") {
      onChange(["NONE"]);
      return;
    }

    const withoutNone = selected.filter((s) => s !== "NONE" && s !== "None");

    if (withoutNone.includes(option)) {
      onChange(withoutNone.filter((s) => s !== option));
    } else {
      onChange([...withoutNone, option]);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">
        Do you have any allergies or health conditions?
      </label>

      <div className="border border-orange rounded-2xl p-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          {HEALTH_CONDITIONS.map((option, index) => {
            const val = typeof option === "object" ? option.value : option;
            const lbl = typeof option === "object" ? option.label : option;
            return (
              <label
                key={val || index}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="accent-orange w-4 h-4"
                  checked={selected.includes(val)}
                  onChange={() => handleToggle(val)}
                />
                {lbl}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllergiesDropdown;
