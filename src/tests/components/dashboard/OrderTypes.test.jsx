import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderTypes from '../../../components/Dashboard/OrderTypes';

const mockData = [
  { name: 'Dine-In', percentage: 45, count: 120 },
  { name: 'Takeaway', percentage: 35, count: 93 },
  { name: 'Online', percentage: 20, count: 53 },
];

describe('OrderTypes', () => {
  test('renders the "Order Types" heading', () => {
    render(<OrderTypes data={mockData} />);
    expect(screen.getByText('Order Types')).toBeInTheDocument();
  });

  test('renders each order type name', () => {
    render(<OrderTypes data={mockData} />);
    expect(screen.getByText(/Dine-In/)).toBeInTheDocument();
    expect(screen.getByText(/Takeaway/)).toBeInTheDocument();
    expect(screen.getByText(/Online/)).toBeInTheDocument();
  });

  test('renders count for each order type', () => {
    render(<OrderTypes data={mockData} />);
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('93')).toBeInTheDocument();
    expect(screen.getByText('53')).toBeInTheDocument();
  });

  test('renders percentage for each order type', () => {
    render(<OrderTypes data={mockData} />);
    expect(screen.getByText(/45%/)).toBeInTheDocument();
    expect(screen.getByText(/35%/)).toBeInTheDocument();
    expect(screen.getByText(/20%/)).toBeInTheDocument();
  });

  test('renders progress bar with correct width style for each item', () => {
    const { container } = render(<OrderTypes data={mockData} />);
    const progressBars = container.querySelectorAll('[style*="width"]');
    const widths = Array.from(progressBars).map((el) => el.style.width);
    expect(widths).toContain('45%');
    expect(widths).toContain('35%');
    expect(widths).toContain('20%');
  });

  test('renders empty data without crashing', () => {
    render(<OrderTypes data={[]} />);
    expect(screen.getByText('Order Types')).toBeInTheDocument();
  });

  test('renders a single order type correctly', () => {
    const singleData = [{ name: 'Online', percentage: 100, count: 500 }];
    render(<OrderTypes data={singleData} />);
    expect(screen.getByText(/Online/)).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  test('renders TimeFilter component', () => {
    render(<OrderTypes data={mockData} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('renders 0% progress bar when percentage is 0', () => {
    const zeroData = [{ name: 'Dine-In', percentage: 0, count: 0 }];
    const { container } = render(<OrderTypes data={zeroData} />);
    const progressBars = container.querySelectorAll('[style*="width"]');
    const widths = Array.from(progressBars).map((el) => el.style.width);
    expect(widths).toContain('0%');
  });
});