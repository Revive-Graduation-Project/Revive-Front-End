import { FiMonitor, FiShoppingBag, FiTruck } from "react-icons/fi";
import TimeFilter from "./shared/TimeFilter";

/**
 * Renders a card displaying order type metrics with counts, percentages, and progress bars.
 * @param {Array<{name: string, percentage: number, count: number}>} data - Order type metrics.
 */
function OrderTypes({ data }) {
  // Use stroke icons instead of emojis to match design
  const icons = { 
    "Dine-In": <FiMonitor size={14} className="text-[#F97316]" />, 
    Takeaway: <FiShoppingBag size={14} className="text-[#F97316]" />, 
    Online: <FiTruck size={14} className="text-[#F97316]" /> 
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col h-full border border-gray-50">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Order Types</h3>
        <TimeFilter defaultValue="This Month" />
      </div>

      <div className="flex flex-col gap-5 justify-center flex-1">
        {data.map(({ name, percentage, count }) => (
          <div key={name}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-[30px] h-[30px] rounded-lg bg-[#FFF7ED] flex items-center justify-center shrink-0">
                  {icons[name]}
                </div>
                <span className="text-[12px] font-bold text-[#1a1a1a]">{name} <span className="text-gray-400 font-medium ml-1">{percentage}%</span></span>
              </div>
              <span className="text-[13px] font-bold text-[#1a1a1a]">{count}</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden ml-[42px]">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-in-out"
                style={{ width: `${percentage}%`, background: "#1a1a1a" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderTypes;
