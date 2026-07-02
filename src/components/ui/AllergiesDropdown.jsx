import { HEALTH_CONDITIONS } from "../../constants";
function AllergiesDropdown() {

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">
        Do you have any allergies or health conditions?
      </label>

      <div className="border border-orange rounded-2xl p-4 ">
        <div className="grid grid-cols-1 gap-2 text-sm">
          {HEALTH_CONDITIONS.map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input type="checkbox" className="accent-orange w-4 h-4" />
              {option}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllergiesDropdown;
