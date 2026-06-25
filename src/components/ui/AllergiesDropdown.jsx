function AllergiesDropdown({ selected = [], onChange }) {
  const options = [
    "None",
    "Diabetes",
    "High blood pressure",
    "High cholesterol",
    "Kidney or liver condition",
    "Gluten intolerance / Celiac",
    "Lactose intolerance",
  ];

  const handleToggle = (option) => {
    if (option === "None") {
      onChange(["None"]);
      return;
    }

    const withoutNone = selected.filter((s) => s !== "None");

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
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-orange w-4 h-4"
                checked={selected.includes(option)}
                onChange={() => handleToggle(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllergiesDropdown;
