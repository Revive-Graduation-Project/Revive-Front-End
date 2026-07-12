import { FiTrendingUp, FiTrendingDown, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";

const icons = {
  totalOrders: FiShoppingBag,
  totalCustomers: FiUsers,
  totalRevenue: FiDollarSign,
};

const labels = {
  totalOrders: "Total Orders",
  totalCustomers: "Total Customer",
  totalRevenue: "Total Revenue",
};

function formatValue(key, value) {
  if (key === "totalRevenue") return `${value.toLocaleString()} EGP`;
  return value.toLocaleString();
}

function MetricCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(metrics).map(([key, { value, change, trend }]) => {
        const Icon = icons[key];
        const isUp = trend === "up";
        const TrendIcon = isUp ? FiTrendingUp : FiTrendingDown;

        return (
          <div
            key={key}
            className="bg-white rounded-[20px] p-5 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <div className="w-[52px] h-[52px] rounded-2xl bg-[#F97316] flex items-center justify-center shrink-0">
              <Icon size={24} className="text-white" />
            </div>
            
            <div className="flex-1">
              <p className="text-[12px] text-gray-500 font-medium m-0 mb-1.5">{labels[key]}</p>
              <div className="flex justify-between items-end">
                <p className="text-[26px] font-bold text-[#1a1a1a] m-0 leading-none tracking-tight">
                  {formatValue(key, value)}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isUp ? 'bg-orange-100 text-orange-500' : 'bg-red-100 text-red-500'}`}>
                    <TrendIcon size={9} strokeWidth={3} />
                  </div>
                  {Math.abs(change)}%
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MetricCards;
