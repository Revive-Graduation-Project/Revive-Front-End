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

        const isRevenue = key === "totalRevenue";

        return (
          <div
            key={key}
            className={`rounded-[20px] p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${
              isRevenue 
                ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100"
                : "bg-white shadow-sm border border-transparent"
            }`}
          >
            <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 ${
              isRevenue ? "bg-orange-50 text-orange-500" : "bg-[#F97316] text-white"
            }`}>
              <Icon size={24} className="currentColor" />
            </div>
            
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className={`text-[12px] font-medium m-0 mb-1.5 ${isRevenue ? "text-orange-500/80" : "text-gray-500"}`}>
                {labels[key]}
              </p>
              <div className="flex justify-between items-end gap-2">
                <p className="text-[22px] sm:text-[24px] font-bold m-0 leading-none tracking-tight truncate text-[#1a1a1a]" title={formatValue(key, value)}>
                  {formatValue(key, value)}
                </p>
                <div className="flex items-center gap-1 text-[11px] font-semibold shrink-0">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    isUp 
                      ? 'bg-orange-100 text-orange-500'
                      : 'bg-red-100 text-red-500'
                  }`}>
                    <TrendIcon size={9} strokeWidth={3} />
                  </div>
                  <span className="text-gray-400">{Math.abs(change)}%</span>
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
