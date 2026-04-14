import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl px-3.5 py-2.5 text-xs text-white shadow-lg">
        <p className="mb-1.5 font-semibold text-gray-400">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} className="my-0.5" style={{ color: entry.color }}>
            {entry.name}: <strong>${entry.value}k</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function RevenueChart({ data }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Total Revenue</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 8 months</p>
        </div>
        <select className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white cursor-pointer outline-none">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} iconType="circle" iconSize={8} />
          <Line type="monotone" dataKey="income" name="Income" stroke="#F97316" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#F97316" }} />
          <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8B5CF6" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#8B5CF6" }} strokeDasharray="6 3" />
          <Line type="monotone" dataKey="expense" name="Expense" stroke="#94A3B8" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "#94A3B8" }} strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
