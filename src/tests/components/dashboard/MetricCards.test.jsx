import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MetricCards from '../../../components/Dashboard/MetricCards';

const mockMetrics = {
  totalOrders: { value: 1234, change: 5.2, trend: 'up' },
  totalCustomers: { value: 890, change: 2.1, trend: 'down' },
  totalRevenue: { value: 56789, change: 8.5, trend: 'up' },
};

describe('MetricCards', () => {
  test('renders all three metric cards when given complete metrics', () => {
    render(<MetricCards metrics={mockMetrics} />);
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Customer')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  test('formats totalRevenue with dollar sign', () => {
    render(<MetricCards metrics={mockMetrics} />);
    expect(screen.getByText('$56,789')).toBeInTheDocument();
  });

  test('formats totalOrders without dollar sign', () => {
    render(<MetricCards metrics={mockMetrics} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  test('formats totalCustomers without dollar sign', () => {
    render(<MetricCards metrics={mockMetrics} />);
    expect(screen.getByText('890')).toBeInTheDocument();
  });

  test('renders empty metrics gracefully (no cards)', () => {
    const { container } = render(<MetricCards metrics={{}} />);
    expect(screen.queryByText('Total Orders')).toBeNull();
    expect(screen.queryByText('Total Revenue')).toBeNull();
    expect(container.querySelectorAll('.rounded-\\[20px\\]')).toHaveLength(0);
  });

  test('renders with default empty object when metrics prop is omitted', () => {
    const { container } = render(<MetricCards />);
    expect(screen.queryByText('Total Orders')).toBeNull();
  });

  test('displays absolute value of change percentage', () => {
    const metricsWithNegative = {
      totalOrders: { value: 100, change: -3.7, trend: 'down' },
    };
    render(<MetricCards metrics={metricsWithNegative} />);
    expect(screen.getByText('3.7%')).toBeInTheDocument();
  });

  test('renders only the provided metric keys (partial metrics)', () => {
    const partialMetrics = {
      totalOrders: { value: 42, change: 1.5, trend: 'up' },
    };
    render(<MetricCards metrics={partialMetrics} />);
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.queryByText('Total Customer')).toBeNull();
    expect(screen.queryByText('Total Revenue')).toBeNull();
  });

  test('formatValue returns dollar prefix only for totalRevenue', () => {
    const metrics = {
      totalOrders: { value: 500, change: 0, trend: 'up' },
      totalRevenue: { value: 500, change: 0, trend: 'up' },
    };
    render(<MetricCards metrics={metrics} />);
    // Revenue should have $500
    expect(screen.getByText('$500')).toBeInTheDocument();
    // Orders should just be 500 (no dollar sign)
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  test('renders zero values correctly', () => {
    const metrics = {
      totalRevenue: { value: 0, change: 0, trend: 'up' },
    };
    render(<MetricCards metrics={metrics} />);
    expect(screen.getByText('$0')).toBeInTheDocument();
  });

  test('renders large numbers with locale formatting', () => {
    const metrics = {
      totalOrders: { value: 1000000, change: 0, trend: 'up' },
    };
    render(<MetricCards metrics={metrics} />);
    expect(screen.getByText('1,000,000')).toBeInTheDocument();
  });
});