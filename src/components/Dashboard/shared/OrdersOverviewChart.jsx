import { useState } from "react";
import TimeFilter from "./TimeFilter";

const DAY_MAP = {
  Sat: "Saturday",
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
};

/**
 * Displays an interactive bar chart of orders grouped by day.
 * @param {Object} props
 * @param {Array} props.data - Array of order entries. Each entry should contain a `day` property (3-letter abbreviation) and either an `orders` or `value` property for the bar height.
 * @returns {React.ReactNode} A chart component.
 */
function OrdersOverviewChart({ data = [] }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const chartData = data.map((d) => ({
    h: d.orders || d.value || 0,
    day: d.day || "",
    fullDay: DAY_MAP[d.day] || d.day || "Day",
  }));

  const MAX = Math.max(...chartData.map(d => d.h), 200);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-gray-50 h-[240px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Orders Overview</h3>
        <TimeFilter defaultValue="This Week" />
      </div>

      {/* Chart area */}
      <div className="flex-1 relative w-full mt-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-gray-400 py-1 font-medium z-10 w-6">
          <span>{MAX}</span>
          <span>{Math.round(MAX * 0.75)}</span>
          <span>{Math.round(MAX * 0.5)}</span>
          <span>{Math.round(MAX * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-8 right-0 top-2 bottom-6 flex flex-col justify-between z-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-dashed border-gray-200 w-full" />
          ))}
        </div>

        {/* Bars */}
        <div className="absolute left-8 right-0 top-2 bottom-6 flex items-end justify-between z-10 pr-2">
          {chartData.map(({ h, fullDay }, i) => {
            const isActive = hoveredIndex === i;
            return (
              <div
                key={`bar-${i}`}
                className="w-[34px] relative h-full flex flex-col justify-end cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {isActive && (
                  <div className="absolute -top-[42px] bg-[#1a1a1a] text-white py-1.5 px-3 rounded-lg whitespace-nowrap z-20 flex flex-col items-center shadow-md left-1/2 -translate-x-1/2">
                    <span className="block text-gray-300 text-[9px] mb-0.5">{fullDay}</span>
                    <strong className="text-[11px]">{h} Orders</strong>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1a1a] rotate-45" />
                  </div>
                )}
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${isActive ? "bg-[#F97316]" : "bg-[#FED7AA] hover:bg-orange-300"}`}
                  style={{ height: `${(h / MAX) * 100}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-8 right-0 bottom-0 h-6 flex items-end justify-between z-10 pr-2">
          {chartData.map(({ day }, i) => (
            <div key={`day-${i}`} className="w-[34px] flex justify-center text-[10px] text-gray-400 font-medium">
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersOverviewChart;
