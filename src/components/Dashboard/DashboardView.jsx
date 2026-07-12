import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import MetricCards from "./MetricCards";
import RevenueChart from "./RevenueChart";
import TopCategories from "./TopCategories";
import OrdersOverviewChart from "./shared/OrdersOverviewChart";
import OrderTypes from "./OrderTypes";
import TrendingMenus from "./TrendingMenus";
import InventoryAlerts from "./InventoryAlerts";
import CustomerReviews from "./CustomerReviews";

import {
  useDashboardMetrics,
  useRevenueData,
  useTopCategories,
  useOrdersOverview,
  useOrderTypes,
  useTrendingMenus,
  useInventoryAlerts,
  useCustomerReviews,
} from "../../hooks/dashboard/useDashboard";

import { MetricCardSkeleton, ChartSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";

function DashboardView() {
  const [overviewPeriod, setOverviewPeriod] = useState("This Week");
  const [revenuePeriod, setRevenuePeriod] = useState("This Month");

  const { data: metrics,        isLoading: loadingMetrics, error: errMetrics } = useDashboardMetrics();
  const { data: revenue,        isLoading: loadingRev,     error: errRev     } = useRevenueData(revenuePeriod);
  const { data: categories,     isLoading: loadingCats,    error: errCats    } = useTopCategories();
  const { data: ordersOverview, isLoading: loadingOrdOv,   error: errOrdOv   } = useOrdersOverview(overviewPeriod);
  const { data: orderTypes,     isLoading: loadingTypes,   error: errTypes   } = useOrderTypes();
  const { data: trending,       isLoading: loadingTrend,   error: errTrend   } = useTrendingMenus();
  const { data: inventory,      isLoading: loadingInv,     error: errInv     } = useInventoryAlerts();
  const { data: reviews,        isLoading: loadingRevw,    error: errRevw    } = useCustomerReviews();

  const safeMetrics = errMetrics ? {} : (metrics || {});
  const safeRevenue = errRev ? [] : (revenue || []);
  const safeCategories = errCats ? [] : (categories || []);
  const safeOrdersOverview = errOrdOv ? [] : (ordersOverview || []);
  const safeOrderTypes = errTypes ? [] : (orderTypes || []);
  const safeTrending = errTrend ? [] : (trending || []);
  const safeInventory = errInv ? {} : (inventory || {});
  const safeReviews = errRevw ? [] : (reviews || []);

  return (
    <div>
      <DashboardHeader title="Dashboard" />

      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            {loadingMetrics ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </div>
            ) : (
              <MetricCards metrics={safeMetrics} />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              {loadingRev ? <ChartSkeleton height={320} /> : <RevenueChart data={safeRevenue} totalRevenue={safeMetrics?.totalRevenue?.value} period={revenuePeriod} onPeriodChange={setRevenuePeriod} />}
              {loadingCats ? <ChartSkeleton height={320} /> : <TopCategories data={safeCategories} />}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              {loadingOrdOv ? <ChartSkeleton height={280} /> : <OrdersOverviewChart data={safeOrdersOverview} period={overviewPeriod} onPeriodChange={setOverviewPeriod} />}
              {loadingTypes ? <ChartSkeleton height={280} /> : <OrderTypes data={safeOrderTypes} />}
            </div>
            
            {loadingInv ? <ChartSkeleton height={220} /> : <InventoryAlerts data={safeInventory} />}
          </div>

          {/* Right Column */}
          <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
            {loadingTrend ? <ChartSkeleton height={280} /> : <TrendingMenus data={safeTrending} />}
          </div>
        </div>

        {loadingRevw ? <ChartSkeleton height={200} /> : <CustomerReviews data={safeReviews} />}
      </div>
    </div>
  );
}

export default DashboardView;
