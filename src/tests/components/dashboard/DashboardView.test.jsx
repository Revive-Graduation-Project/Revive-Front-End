import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock DashboardHeader to avoid deep auth store deps
vi.mock('../../../components/Dashboard/DashboardHeader', () => ({
  default: ({ title }) => <header data-testid="dashboard-header">{title}</header>,
}));

// Mock all child presentational components
vi.mock('../../../components/Dashboard/MetricCards', () => ({
  default: ({ metrics }) => <div data-testid="metric-cards">{JSON.stringify(metrics)}</div>,
}));
vi.mock('../../../components/Dashboard/RevenueChart', () => ({
  default: () => <div data-testid="revenue-chart" />,
}));
vi.mock('../../../components/Dashboard/TopCategories', () => ({
  default: () => <div data-testid="top-categories" />,
}));
vi.mock('../../../components/Dashboard/shared/OrdersOverviewChart', () => ({
  default: () => <div data-testid="orders-overview-chart" />,
}));
vi.mock('../../../components/Dashboard/OrderTypes', () => ({
  default: () => <div data-testid="order-types" />,
}));
vi.mock('../../../components/Dashboard/TrendingMenus', () => ({
  default: () => <div data-testid="trending-menus" />,
}));
vi.mock('../../../components/Dashboard/InventoryAlerts', () => ({
  default: () => <div data-testid="inventory-alerts" />,
}));
vi.mock('../../../components/Dashboard/RecentActivity', () => ({
  default: () => <div data-testid="recent-activity" />,
}));
vi.mock('../../../components/Dashboard/CustomerReviews', () => ({
  default: () => <div data-testid="customer-reviews" />,
}));

// Mock the skeleton and error shared components
vi.mock('../../../components/Dashboard/shared/DashboardSkeleton', () => ({
  DashboardPageSkeleton: () => <div data-testid="dashboard-skeleton" />,
}));
vi.mock('../../../components/Dashboard/shared/ErrorState', () => ({
  default: ({ message, onRetry }) => (
    <div data-testid="error-state">
      <span>{message}</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));

// Mock all dashboard data hooks
vi.mock('../../../hooks/dashboard/useDashboard', () => ({
  useDashboardMetrics: vi.fn(),
  useRevenueData: vi.fn(),
  useTopCategories: vi.fn(),
  useOrdersOverview: vi.fn(),
  useOrderTypes: vi.fn(),
  useTrendingMenus: vi.fn(),
  useInventoryAlerts: vi.fn(),
  useRecentActivity: vi.fn(),
  useCustomerReviews: vi.fn(),
}));

import DashboardView from '../../../components/Dashboard/DashboardView';
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
} from '../../../hooks/dashboard/useDashboard';

const mockData = {
  metrics: { totalRevenue: { value: 50000 }, orders: 200 },
  revenue: [{ month: 'Jan', value: 1000 }],
  categories: [{ name: 'Pizza', count: 10 }],
  ordersOverview: { total: 50 },
  orderTypes: { dineIn: 30, takeout: 20 },
  trending: [{ id: 1, name: 'Burger' }],
  inventory: { lowStock: [], shelfLife: [], inSeason: [] },
  activity: [{ id: 1, type: 'order', message: 'New order' }],
  reviews: [{ id: 1, title: 'Great!', comment: 'Loved it', name: 'Alice', rating: 5, date: '2024-01-01', time: '12:00' }],
};

const loadingState = { data: undefined, isLoading: true, error: null };
const successState = (data) => ({ data, isLoading: false, error: null });
const errorState = { data: undefined, isLoading: false, error: new Error('Failed') };

function setAllHooksTo(stateFactory) {
  useDashboardMetrics.mockReturnValue(stateFactory(mockData.metrics));
  useRevenueData.mockReturnValue(stateFactory(mockData.revenue));
  useTopCategories.mockReturnValue(stateFactory(mockData.categories));
  useOrdersOverview.mockReturnValue(stateFactory(mockData.ordersOverview));
  useOrderTypes.mockReturnValue(stateFactory(mockData.orderTypes));
  useTrendingMenus.mockReturnValue(stateFactory(mockData.trending));
  useInventoryAlerts.mockReturnValue(stateFactory(mockData.inventory));
  useRecentActivity.mockReturnValue(stateFactory(mockData.activity));
  useCustomerReviews.mockReturnValue(stateFactory(mockData.reviews));
}

describe('DashboardView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    beforeEach(() => {
      // All hooks return loading
      [useDashboardMetrics, useRevenueData, useTopCategories, useOrdersOverview,
       useOrderTypes, useTrendingMenus, useInventoryAlerts, useRecentActivity, useCustomerReviews]
        .forEach(hook => hook.mockReturnValue(loadingState));
    });

    test('renders the page skeleton while loading', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
    });

    test('renders the header with "Dashboard" title while loading', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Dashboard');
    });

    test('does not render metric cards while loading', () => {
      render(<DashboardView />);
      expect(screen.queryByTestId('metric-cards')).toBeNull();
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      // metrics hook errors; others load successfully
      useDashboardMetrics.mockReturnValue(errorState);
      useRevenueData.mockReturnValue(successState(mockData.revenue));
      useTopCategories.mockReturnValue(successState(mockData.categories));
      useOrdersOverview.mockReturnValue(successState(mockData.ordersOverview));
      useOrderTypes.mockReturnValue(successState(mockData.orderTypes));
      useTrendingMenus.mockReturnValue(successState(mockData.trending));
      useInventoryAlerts.mockReturnValue(successState(mockData.inventory));
      useRecentActivity.mockReturnValue(successState(mockData.activity));
      useCustomerReviews.mockReturnValue(successState(mockData.reviews));
    });

    test('renders the error state when any hook fails', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    test('shows an error message', () => {
      render(<DashboardView />);
      expect(screen.getByText('Failed to load dashboard metrics.')).toBeInTheDocument();
    });

    test('does not render metric cards on error', () => {
      render(<DashboardView />);
      expect(screen.queryByTestId('metric-cards')).toBeNull();
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      setAllHooksTo(successState);
    });

    test('renders the DashboardHeader with title "Dashboard"', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Dashboard');
    });

    test('renders MetricCards with metrics data', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('metric-cards')).toBeInTheDocument();
    });

    test('renders the RevenueChart', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
    });

    test('renders TopCategories', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('top-categories')).toBeInTheDocument();
    });

    test('renders the OrdersOverviewChart', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('orders-overview-chart')).toBeInTheDocument();
    });

    test('renders OrderTypes', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('order-types')).toBeInTheDocument();
    });

    test('renders TrendingMenus', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('trending-menus')).toBeInTheDocument();
    });

    test('renders InventoryAlerts', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('inventory-alerts')).toBeInTheDocument();
    });

    test('renders RecentActivity', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
    });

    test('renders CustomerReviews', () => {
      render(<DashboardView />);
      expect(screen.getByTestId('customer-reviews')).toBeInTheDocument();
    });
  });

  describe('partial loading states', () => {
    test('shows skeleton if only one hook is still loading', () => {
      setAllHooksTo(successState);
      // Override one hook to still be loading
      useRecentActivity.mockReturnValue(loadingState);
      render(<DashboardView />);
      expect(screen.getByTestId('dashboard-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('metric-cards')).toBeNull();
    });
  });
});