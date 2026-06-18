import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { FiArrowUpRight, FiMoreHorizontal } from "react-icons/fi";
import TimeFilter from "./shared/TimeFilter";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] rounded-xl px-3 py-2 text-[11px] text-white shadow-lg flex flex-col items-center">
        <span className="font-semibold">{label}</span>
        <span className="font-bold">{payload[0].value} Orders</span>
      </div>
    );
  }
  return null;
};

/**
 * Displays an overview of orders in a card with a bar chart visualization and time filter.
 * @param {Array<{orders: number, day: string}>} data - Array of order data points.
 */
function OrdersOverview({ data }) {
  const totalOrders = data.reduce((acc, d) => acc + d.orders, 0);

  return (
    <div className="bg-white rounded-3xl px-6 py-6 shadow-sm flex flex-col h-full border border-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-[14px] font-bold text-[#1a1a1a] m-0">Orders overview</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            <FiArrowUpRight className="text-orange-500 inline mr-1" />
            <span className="font-semibold text-[#1a1a1a]">{totalOrders}</span> in this period
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TimeFilter defaultValue="This Week" />
          <button className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0">
            <FiMoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar
              dataKey="orders"
              radius={[8, 8, 8, 8]}
              shape={(props) => {
                const { x, y, width, height, payload } = props;

                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    rx={8}
                    fill={payload.highlight ? "#F97316" : "#FDE68A"}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OrdersOverview;
