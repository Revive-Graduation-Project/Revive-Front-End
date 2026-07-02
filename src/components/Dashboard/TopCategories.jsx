import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import TimeFilter from "./shared/TimeFilter";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl px-3 py-2 text-white text-[11px] font-bold shadow-lg">
        {`${payload[0].name}: ${payload[0].value}%`}
      </div>
    );
  }
  return null;
};

function TopCategories({ data }) {
  // Override colors for the donut chart to match screenshot (Orange, Red, Green, Black)
  const categoryColors = {
    Seafood: "#F87171", // Red
    Meat: "#10B981",    // Green
    Chicken: "#F97316", // Orange
    "Mix Protein": "#1a1a1a" // Black
  };

  const formattedData = data.map(item => ({
    ...item,
    color: categoryColors[item.name] || item.color
  }));

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col h-full border border-gray-50">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Top Categories</h3>
        <TimeFilter defaultValue="This Month" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={formattedData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Custom robust HTML legend */}
        <ul className="grid grid-cols-2 gap-x-2 gap-y-3 m-0 p-0 list-none mt-4">
          {formattedData.map((entry, index) => (
            <li key={`item-${index}`} className="flex items-center text-[11px] text-gray-500 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full mr-2 shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="truncate">{entry.name}</span>
              <strong className="text-[#1a1a1a] ml-1.5 shrink-0">{entry.value}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TopCategories;
