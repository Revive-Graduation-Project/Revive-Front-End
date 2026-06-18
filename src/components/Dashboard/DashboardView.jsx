import DashboardHeader from "./DashboardHeader";
import MetricCards from "./MetricCards";
import RevenueChart from "./RevenueChart";
import TopCategories from "./TopCategories";
import OrdersOverviewChart from "./shared/OrdersOverviewChart";
import OrderTypes from "./OrderTypes";
import TrendingMenus from "./TrendingMenus";
import InventoryAlerts from "./InventoryAlerts";
import RecentActivity from "./RecentActivity";
import CustomerReviews from "./CustomerReviews";

import {
  useDashboardMetrics,
  useRevenueData,
  useTopCategories,
  useOrdersOverview,

  useOrderTypes,
  useTrendingMenus,
  useInventoryAlerts,
  useRecentActivity,
  useCustomerReviews,
} from "../../hooks/dashboard/useDashboard";

import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";

/**
 * Renders the dashboard with business metrics, revenue analysis, inventory alerts, trending items, recent activity, and customer reviews.
 * Displays a skeleton loader while fetching data, and an error screen with a retry option if data fetching fails.
 */
function DashboardView() {
  const { data: metrics,        isLoading: loadingMetrics, error: errMetrics } = useDashboardMetrics();
  const { data: revenue,        isLoading: loadingRev,     error: errRev     } = useRevenueData();
  const { data: categories,     isLoading: loadingCats,    error: errCats    } = useTopCategories();
  const { data: ordersOverview, isLoading: loadingOrdOv,   error: errOrdOv   } = useOrdersOverview();
  const { data: orderTypes,     isLoading: loadingTypes,   error: errTypes   } = useOrderTypes();
  const { data: trending,       isLoading: loadingTrend,   error: errTrend   } = useTrendingMenus();
  const { data: inventory,      isLoading: loadingInv,     error: errInv     } = useInventoryAlerts();
  const { data: activity,       isLoading: loadingAct,     error: errAct     } = useRecentActivity();
  const { data: reviews,        isLoading: loadingRevw,    error: errRevw    } = useCustomerReviews();

  const isLoading =
    loadingMetrics || loadingRev || loadingCats || loadingOrdOv ||
    loadingTypes || loadingTrend || loadingInv || loadingAct || loadingRevw;

  const hasError =
    errMetrics || errRev || errCats || errOrdOv ||
    errTypes || errTrend || errInv || errAct || errRevw;

  if (isLoading) {
    return (
      <div>
        <DashboardHeader title="Dashboard" />
        <DashboardPageSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div>
        <DashboardHeader title="Dashboard" />
        <ErrorState message="Failed to load dashboard metrics." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader title="Dashboard" />

      <div className="flex flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            <MetricCards metrics={metrics} />
            
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
              <RevenueChart data={revenue} totalRevenue={metrics?.totalRevenue?.value} />
              <TopCategories data={categories} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
              <OrdersOverviewChart data={ordersOverview} />
              <OrderTypes data={orderTypes} />
            </div>
            
            <InventoryAlerts data={inventory} />
          </div>

          {/* Right Column */}
          <div className="w-full xl:w-[340px] flex flex-col gap-6">
            <TrendingMenus data={trending} />
            <RecentActivity data={activity} />
          </div>
        </div>

        {/* Bottom Row (Full Width) */}
        <CustomerReviews data={reviews} />
      </div>
    </div>
  );
}

export default DashboardView;
