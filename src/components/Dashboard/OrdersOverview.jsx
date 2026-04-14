import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl px-3 py-2 text-xs text-white">
        <p className="m-0">{label}: <strong>{payload[0].value} orders</strong></p>
      </div>
    );
  }
  return null;
};

function OrdersOverview({ data }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Orders Overview</h3>
          <p className="text-xs text-gray-400 mt-0.5">This Week</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={28}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249,115,22,0.05)" }} />
          <Bar dataKey="orders" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.highlight ? "#F97316" : "#FED7AA"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Highlight label */}
      {data.find((d) => d.highlight) && (
        <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-1 text-[11px] text-orange-500 font-semibold mt-2">
          📈 Peak: {data.find((d) => d.highlight)?.day} — {data.find((d) => d.highlight)?.orders} orders
        </div>
      )}
    </div>
  );
}

export default OrdersOverview;
