import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import TimeFilter from "./shared/TimeFilter";

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

function RevenueChart({ data, totalRevenue = 0 }) {
  const formattedTotal = `$${totalRevenue.toLocaleString()}`;

  return (
    <div className="bg-white rounded-3xl px-6 py-6 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] text-gray-500 font-medium m-0">Total Revenue</p>
          <h3 className="text-[24px] font-bold text-[#1a1a1a] m-0">{formattedTotal}</h3>
        </div>
        <TimeFilter defaultValue="This Month" />
      </div>


      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", color: "#6B7280" }} iconType="circle" iconSize={6} />
          <Line type="monotone" dataKey="income" name="Income" stroke="#F97316" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#F97316" }} />
          <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#10B981" }} />
          <Line type="monotone" dataKey="expense" name="Expense" stroke="#111827" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#111827" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
