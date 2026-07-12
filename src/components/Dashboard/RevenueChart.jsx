import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import TimeFilter from "./shared/TimeFilter";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = Number(payload[0].value || 0);
    return (
      <div className="bg-[#1a1a1a] rounded-xl px-3.5 py-2.5 text-xs text-white shadow-lg">
        <p className="mb-1 font-semibold text-gray-400">{label}</p>
        <p className="my-0" style={{ color: "#F97316" }}>
          Revenue: <strong>{val.toLocaleString()} EGP</strong>
        </p>
      </div>
    );
  }
  return null;
};

function RevenueChart({ data, totalRevenue = 0 }) {
  const formattedTotal = `${Number(totalRevenue || 0).toLocaleString()} EGP`;

  return (
    <div className="bg-white rounded-3xl px-6 py-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-1">
          <p className="text-[13px] text-gray-500 font-medium m-0">Total Revenue</p>
          <h3 className="text-[24px] font-bold text-[#1a1a1a] m-0">{formattedTotal}</h3>
        </div>
        <TimeFilter defaultValue="This Month" />
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#F97316" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(v % 1000 !== 0 ? 1 : 0)}k` : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#F97316"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            dot={false}
            activeDot={{ r: 5, fill: "#F97316", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;

