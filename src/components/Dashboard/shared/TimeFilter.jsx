import { FiChevronDown } from "react-icons/fi";

function TimeFilter({ defaultValue = "This Week", onChange }) {
  return (
    <div className="relative flex items-center group">
      <select 
        defaultValue={defaultValue}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="appearance-none pr-4 pl-1 py-0.5 text-[11px] font-medium text-gray-400 bg-transparent border-none cursor-pointer outline-none group-hover:text-gray-600 transition-colors z-10"
      >
        <option>This Day</option>
        <option>This Week</option>
        <option>This Month</option>
        <option>This Year</option>
      </select>
      <FiChevronDown 
        className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors pointer-events-none z-0" 
        size={12} 
      />
    </div>
  );
}

export default TimeFilter;
