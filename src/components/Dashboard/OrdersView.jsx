import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import TrendingMenus from "./TrendingMenus";
import RecentActivity from "./RecentActivity";
import { useOrdersMetrics, useOrders, useOrdersTrending } from "../../hooks/dashboard/useOrders";
import { useRecentActivity, useOrdersOverview } from "../../hooks/dashboard/useDashboard";
import { FiShoppingBag, FiClock, FiCheckCircle } from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";
import StatusBadge from "./shared/StatusBadge";
import TimeFilter from "./shared/TimeFilter";
import OrdersOverviewChart from "./shared/OrdersOverviewChart";
import SortMenu from "./shared/SortMenu";

const TABS = ["All", "Preparing", "Ready", "Done", "Cancelled"];

function CircularProgress({ salesPct, orderPct, displayPct }) {
  const r1 = 36;
  const r2 = 28;
  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;

  return (
    <div className="relative w-[100px] h-[100px] flex items-center justify-center">
      <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }} className="absolute inset-0">
        {/* Sales track */}
        <circle cx="50" cy="50" r={r1} fill="none" stroke="#F3F4F6" strokeWidth="6" />
        {/* Sales progress */}
        <circle cx="50" cy="50" r={r1} fill="none" stroke="#F97316" strokeWidth="6"
          strokeDasharray={c1} strokeDashoffset={c1 - (salesPct / 100) * c1} strokeLinecap="round" />
        
        {/* Order track */}
        <circle cx="50" cy="50" r={r2} fill="none" stroke="#F3F4F6" strokeWidth="6" />
        {/* Order progress */}
        <circle cx="50" cy="50" r={r2} fill="none" stroke="#16A34A" strokeWidth="6"
          strokeDasharray={c2} strokeDashoffset={c2 - (orderPct / 100) * c2} strokeLinecap="round" />
      </svg>
      <div className="text-center z-10">
        <p className="text-[18px] font-bold text-[#1a1a1a] m-0 leading-none">{displayPct ?? Math.round(salesPct)}%</p>
      </div>
    </div>
  );
}

function OrdersView() {
  const [activeTab, setActiveTab] = useState("All");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const ORDER_SORT_COLS = [
    { key: "id",       label: "Order ID"      },
    { key: "time",     label: "Time"          },
    { key: "name",     label: "Order"         },
    { key: "items",    label: "Items"         },
    { key: "total",    label: "Total"         },
    { key: "customer", label: "Customer Name" },
    { key: "status",   label: "Status"        },
  ];

  const { data: metrics,        isLoading: loadMetrics,  error: errMetrics  } = useOrdersMetrics();
  const { data: ordersResponse, isLoading: loadOrders,   error: errOrders   } = useOrders();
  const { data: trending,       isLoading: loadTrending, error: errTrending } = useOrdersTrending();
  const { data: activity,       isLoading: loadAct,      error: errAct      } = useRecentActivity();
  const { data: ordersOverview, isLoading: loadOrdOv,    error: errOrdOv    } = useOrdersOverview();

  const isLoading = loadMetrics || loadOrders || loadTrending || loadAct || loadOrdOv;
  const hasError  = errMetrics || errOrders || errTrending || errAct || errOrdOv;

  if (isLoading) {
    return (
      <div>
        <DashboardHeader title="Orders" />
        <DashboardPageSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div>
        <DashboardHeader title="Orders" />
        <ErrorState message="Failed to load orders data." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  // ordersResponse is directly an array from mapOrders
  const allOrders = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse?.orders || []);
  let filtered = activeTab === "All" ? [...allOrders] : allOrders.filter((o) => o.status === activeTab);

  // Multi-column sorting
  if (sortKey) {
    filtered.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = typeof av === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  const totalCount = allOrders.length;
  
  const countsByStatus = allOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const metricCards = metrics
    ? [
        { label: "Total Orders",  value: metrics.totalOrders, icon: FiShoppingBag, bgBox: "bg-[#FFF7ED]", iconColor: "#F97316", pct: Math.abs(metrics.totalOrdersChange),  up: metrics.totalOrdersChange >= 0  },
        { label: "Order Preparing", value: metrics.preparing,  icon: FiClock,       bgBox: "bg-[#FFF7ED]", iconColor: "#F97316", pct: Math.abs(metrics.preparingChange),  up: metrics.preparingChange >= 0 },
        { label: "Total Completed", value: metrics.completed,  icon: FiCheckCircle, bgBox: "bg-green-50", iconColor: "#16A34A",  pct: Math.abs(metrics.completedChange),  up: metrics.completedChange >= 0  },
      ]
    : [];

  const handleSortChange = (key, dir) => { setSortKey(key); setSortDir(dir); };
  const salesTarget = metrics?.dailyGoal?.salesTarget ?? 0;
  const ordersTarget = metrics?.dailyGoal?.ordersTarget ?? 0;
  const salesPct = salesTarget > 0 ? (metrics.dailyGoal.salesCurrent / salesTarget) * 100 : 0;
  const orderPct = ordersTarget > 0 ? (metrics.dailyGoal.ordersCurrent / ordersTarget) * 100 : 0;

  return (
    <div>
      <DashboardHeader title="Orders" subtitle="" />

      <div className="flex flex-col xl:flex-row gap-6 p-4 md:p-8 items-start">
        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col gap-6 w-full min-w-0">

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metricCards.map(({ label, value, icon: Icon, bgBox, iconColor, pct, up }) => (
              <div key={label} className="bg-white rounded-3xl px-6 py-5 shadow-sm flex flex-col justify-between border border-gray-50 h-[100px]">
                <div className="flex justify-between items-start w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-[44px] h-[44px] rounded-xl ${bgBox} flex items-center justify-center shrink-0`}>
                      <Icon size={20} color={iconColor} />
                    </div>
                    <div>
                      <p className="text-[12px] text-gray-500 font-medium mb-1">{label}</p>
                      <p className="text-[24px] font-extrabold text-[#1a1a1a] m-0 leading-none">{value}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className={`text-[11px] font-bold ${up ? "text-orange-500" : "text-gray-400"}`}>
                      {up ? "↗" : "↙"} {pct}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Orders Overview Chart area + Daily Goal */}
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
              <OrdersOverviewChart data={ordersOverview} />

              {/* Daily Goal */}
              <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between border border-gray-50 relative h-[240px]">
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0 mb-4">Daily Goal</h3>
                    <div className="flex flex-col gap-2.5">
                      <p className="text-[11px] text-gray-500 font-medium m-0 flex items-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F97316] mr-2" />Sales Goal
                      </p>
                      <p className="text-[11px] text-gray-500 font-medium m-0 flex items-center">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#16A34A] mr-2" />Order Goal
                      </p>
                    </div>
                  </div>
                  <TimeFilter defaultValue="This Day" />
                </div>
                
                <div className="absolute right-6 top-1/2 -translate-y-[40%]">
                  <CircularProgress 
                    salesPct={salesPct} 
                    orderPct={orderPct}
                    displayPct={Math.round(salesPct)}
                  />
                </div>

                <div className="flex justify-between items-end w-full mt-auto">
                  <p className="text-[11px] font-bold text-[#1a1a1a] m-0">Today Sales</p>
                  <p className="text-[11px] font-semibold text-gray-400 m-0">(${metrics.dailyGoal.salesCurrent.toLocaleString()} / ${metrics.dailyGoal.salesTarget.toLocaleString()})</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs + Table */}
          <div className="bg-white rounded-3xl shadow-sm py-4 px-2">
            {/* Tab bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 pb-4 border-b border-gray-100 gap-4 sm:gap-0">
              <div className="flex items-center gap-6 overflow-x-auto w-full">
                {TABS.map((tab) => {
                  const count = tab === "All" ? totalCount : (countsByStatus[tab] || 0);
                  const isActive = activeTab === tab;
                  const label = tab === "All" ? "All Orders" : tab;
                  return (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-full cursor-pointer text-[13px] font-semibold transition-all duration-200 whitespace-nowrap border ${
                        isActive
                          ? "border-orange-500 text-[#1a1a1a] bg-white"
                          : "border-transparent text-gray-500 hover:text-gray-700 bg-transparent"
                      }`}
                    >
                      {label} <span className={isActive ? "text-orange-500" : "text-orange-400"}>({count})</span>
                    </button>
                  );
                })}
              </div>
              <SortMenu columns={ORDER_SORT_COLS} sortKey={sortKey} sortDir={sortDir} onChange={handleSortChange} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Order ID", "Time", "Order", "Items", "Total", "Customer Name", "Status"].map((h) => (
                      <th key={h} className="px-5 pt-4 pb-3 text-left text-[12px] font-bold text-gray-500 tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7}><EmptyState title="No orders found" description={`No orders match "${activeTab}".`} /></td></tr>
                  )}
                  {filtered.map((order, i) => (
                    <tr key={order.id} className="transition-colors border-b border-gray-100 last:border-none">
                      <td className="px-5 py-4 text-[13px] font-mono font-medium text-gray-500">{order.id.replace("#", "")}</td>
                      <td className="px-5 py-4 text-[13px] text-[#1a1a1a] font-medium">{order.time.replace(/ (AM|PM)/, "")}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1a1a1a] max-w-[180px] truncate">{order.name}</td>
                      <td className="px-5 py-4 text-[13px] text-[#1a1a1a] font-medium">{order.items}</td>
                      <td className="px-5 py-4 text-[13px] font-bold text-orange-500">${order.total.toFixed(0)}</td>
                      <td className="px-5 py-4 text-[13px] text-[#1a1a1a] font-medium">{order.customer}</td>
                      <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right sidebar: Trending Menus & Recent Activity ── */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          <TrendingMenus data={trending} />
          <RecentActivity data={activity} />
        </div>
      </div>
    </div>
  );
}

export default OrdersView;
