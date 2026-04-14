import { FiTrendingUp, FiTrendingDown, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";

const icons = {
  totalOrders: FiShoppingBag,
  totalCustomers: FiUsers,
  totalRevenue: FiDollarSign,
};

const labels = {
  totalOrders: "Total Orders",
  totalCustomers: "Total Customers",
  totalRevenue: "Total Revenue",
};

function formatValue(key, value) {
  if (key === "totalRevenue") return `$${value.toLocaleString()}`;
  return value.toLocaleString();
}

function MetricCards({ metrics }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, { value, change, trend }]) => {
        const Icon = icons[key];
        const isUp = trend === "up";
        const TrendIcon = isUp ? FiTrendingUp : FiTrendingDown;

        return (
          <div
            key={key}
            className="bg-white rounded-2xl p-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex items-start justify-between gap-3 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(249,115,22,0.12)] transition-all duration-200"
          >
            {/* Left: icon + label + value */}
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-orange-50 flex items-center justify-center mb-3">
                <Icon size={18} className="text-orange-500" />
              </div>
              <p className="text-[12px] text-gray-400 mb-1 font-medium">{labels[key]}</p>
              <p className="text-2xl font-bold text-[#1a1a1a] leading-tight">{formatValue(key, value)}</p>
            </div>

            {/* Right: trend badge */}
            <div
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
              }`}
            >
              <TrendIcon size={12} />
              {Math.abs(change)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MetricCards;
