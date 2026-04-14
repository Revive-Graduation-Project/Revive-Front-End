import { useState, useEffect } from "react";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import MetricCards from "../../components/Dashboard/MetricCards";
import RevenueChart from "../../components/Dashboard/RevenueChart";
import TopCategories from "../../components/Dashboard/TopCategories";
import OrdersOverview from "../../components/Dashboard/OrdersOverview";
import OrderTypes from "../../components/Dashboard/OrderTypes";
import TrendingMenus from "../../components/Dashboard/TrendingMenus";
import InventoryAlerts from "../../components/Dashboard/InventoryAlerts";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import CustomerReviews from "../../components/Dashboard/CustomerReviews";
import {
  getDashboardMetrics, getRevenueData, getTopCategories,
  getOrdersOverview, getOrderTypes, getTrendingMenus,
  getInventoryAlerts, getRecentActivity, getCustomerReviews,
} from "../../services/dashboardService";

function SkeletonCard({ height = 200 }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden relative shadow-[0_1px_8px_rgba(0,0,0,0.05)]"
      style={{ height }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
    </div>
  );
}

function DashboardView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      getDashboardMetrics(), getRevenueData(), getTopCategories(),
      getOrdersOverview(), getOrderTypes(), getTrendingMenus(),
      getInventoryAlerts(), getRecentActivity(), getCustomerReviews(),
    ])
      .then(([metrics, revenue, categories, ordersOverview, orderTypes, trending, inventory, activity, reviews]) => {
        setData({ metrics, revenue, categories, ordersOverview, orderTypes, trending, inventory, activity, reviews });
      })
      .catch((err) => {
        console.error("[Dashboard] fetch failed:", err);
        setError("Failed to load dashboard data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="text-4xl">⚠️</span>
        <p className="text-base text-red-500 font-semibold">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white border-none rounded-lg px-5 py-2 cursor-pointer font-semibold hover:bg-orange-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>

      <DashboardHeader title="Dashboard" subtitle="Hello Basmala, Welcome back" />

      <div className="flex flex-col gap-5 p-8">
        {/* Row 1: Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            <SkeletonCard height={120} /><SkeletonCard height={120} /><SkeletonCard height={120} />
          </div>
        ) : (
          <MetricCards metrics={data.metrics} />
        )}

        {/* Row 2: Revenue Chart + Top Categories */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
          {loading ? <SkeletonCard height={280} /> : <RevenueChart data={data.revenue} />}
          {loading ? <SkeletonCard height={280} /> : <TopCategories data={data.categories} />}
        </div>

        {/* Row 3: Orders Overview + Order Types + Trending Menus */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "16px" }}>
          {loading ? <SkeletonCard height={260} /> : <OrdersOverview data={data.ordersOverview} />}
          {loading ? <SkeletonCard height={260} /> : <OrderTypes data={data.orderTypes} />}
          {loading ? <SkeletonCard height={260} /> : <TrendingMenus data={data.trending} />}
        </div>

        {/* Row 4: Inventory Alerts */}
        {loading ? <SkeletonCard height={150} /> : <InventoryAlerts data={data.inventory} />}

        {/* Row 5: Recent Activity + Customer Reviews */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
          {loading ? <SkeletonCard height={260} /> : <RecentActivity data={data.activity} />}
          <div>
            {loading ? <SkeletonCard height={260} /> : <CustomerReviews data={data.reviews} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
