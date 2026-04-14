import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl px-3 py-2 text-xs text-white">
        <p className="m-0">
          {payload[0].name}: <strong>{payload[0].value}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

function TopCategories({ data }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1">Top Categories</h3>
      <p className="text-xs text-gray-400 mb-4">This Month</p>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            formatter={(value, entry) => (
              <span className="text-gray-500">
                {value} <strong className="text-[#1a1a1a]">{entry.payload.value}%</strong>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TopCategories;
