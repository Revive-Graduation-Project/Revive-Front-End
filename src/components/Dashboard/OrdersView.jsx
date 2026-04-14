import { useState, useEffect } from "react";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import TrendingMenus from "../../components/Dashboard/TrendingMenus";
import { getOrdersMetrics, getOrders, getTrendingMenus } from "../../services/dashboardService";
import { FiShoppingBag, FiClock, FiCheckCircle } from "react-icons/fi";

const STATUS_STYLES = {
  Preparing: "bg-orange-50 text-orange-500",
  Ready:     "bg-sky-50 text-sky-600",
  Done:      "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

const TABS = ["All", "Preparing", "Ready", "Done", "Cancelled"];

function CircularProgress({ current, target }) {
  const pct = Math.min((current / target) * 100, 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="128" height="128" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="#F3F4F6" strokeWidth="12" />
        <circle cx="64" cy="64" r={r} fill="none" stroke="#F97316" strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="-mt-[90px] text-center z-1">
        <p className="text-[22px] font-extrabold text-[#1a1a1a] m-0">{Math.round(pct)}%</p>
        <p className="text-[11px] text-gray-400 m-0">Daily Goal</p>
      </div>
      <div className="mt-14 text-center">
        <p className="text-[13px] font-bold text-orange-500 m-0">
          ${current.toLocaleString()} / ${target.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function OrdersView() {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [trending, setTrending] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrdersMetrics(), getOrders(), getTrendingMenus()])
      .then(([m, o, t]) => { setMetrics(m); setOrders(o); setTrending(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  const metricCards = metrics
    ? [
        { label: "Total Orders", value: metrics.totalOrders, icon: FiShoppingBag, color: "#F97316", bgClass: "bg-orange-50" },
        { label: "Preparing",    value: metrics.preparing,   icon: FiClock,        color: "#0284C7", bgClass: "bg-sky-50"    },
        { label: "Completed",    value: metrics.completed,   icon: FiCheckCircle,  color: "#16A34A", bgClass: "bg-green-50"  },
      ]
    : [];

  return (
    <div>
      <DashboardHeader title="Orders" subtitle="Hello Basmala, Welcome back" />

      <div className="p-8 grid gap-5" style={{ gridTemplateColumns: "1fr 240px" }}>
        {/* Main content */}
        <div className="flex flex-col gap-5">
          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3.5">
            {!loading && metricCards.map(({ label, value, icon: Icon, color, bgClass }) => (
              <div key={label} className="bg-white rounded-2xl px-5 py-4 shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center`}>
                  <Icon size={20} color={color} />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 mb-0.5 font-medium">{label}</p>
                  <p className="text-[22px] font-extrabold text-[#1a1a1a] m-0">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Goal */}
          {!loading && metrics && (
            <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex items-center gap-8">
              <CircularProgress current={metrics.dailyGoal.current} target={metrics.dailyGoal.target} />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1a1a1a] mb-1">Today's Revenue Progress</p>
                <p className="text-xs text-gray-400 m-0">
                  You're at {Math.round((metrics.dailyGoal.current / metrics.dailyGoal.target) * 100)}% of your daily goal. Keep it going!
                </p>
              </div>
            </div>
          )}

          {/* Tabs + Table */}
          <div>
            <div className="flex gap-1 mb-4 bg-white rounded-xl p-1 shadow-[0_1px_8px_rgba(0,0,0,0.05)] w-fit">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-orange-500 text-white font-semibold"
                      : "bg-transparent text-gray-500 font-normal hover:bg-orange-50 hover:text-orange-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl overflow-x-auto shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FFF8F0] border-b border-[#FFE8CC]">
                    {["Order ID", "Time", "Order Name", "Items", "Total", "Customer", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-400 text-sm">No orders found</td>
                    </tr>
                  )}
                  {filtered.map((order, i) => {
                    const statusClass = STATUS_STYLES[order.status] || "bg-gray-100 text-gray-500";
                    return (
                      <tr key={order.id} className={i < filtered.length - 1 ? "border-b border-gray-50" : ""}>
                        <td className="px-4 py-3.5 text-[13px] font-semibold text-orange-500">{order.id}</td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-500">{order.time}</td>
                        <td className="px-4 py-3.5 text-[13px] font-medium text-[#1a1a1a]">{order.name}</td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-500">{order.items}</td>
                        <td className="px-4 py-3.5 text-[13px] font-semibold text-[#1a1a1a]">${order.total.toFixed(2)}</td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-500">{order.customer}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 ${statusClass}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Trending Menus */}
        {!loading && <TrendingMenus data={trending} />}
      </div>
    </div>
  );
}

export default OrdersView;
