import { describe, test, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrdersOverview from '../../../components/Dashboard/OrdersOverview';

// recharts uses ResizeObserver which is not available in jsdom
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockData = [
  { day: 'Mon', orders: 40, highlight: false },
  { day: 'Tue', orders: 65, highlight: true },
  { day: 'Wed', orders: 55, highlight: false },
  { day: 'Thu', orders: 80, highlight: false },
  { day: 'Fri', orders: 90, highlight: true },
  { day: 'Sat', orders: 70, highlight: false },
  { day: 'Sun', orders: 30, highlight: false },
];

describe('OrdersOverview', () => {
  test('renders the "Orders overview" heading', () => {
    render(<OrdersOverview data={mockData} />);
    expect(screen.getByText('Orders overview')).toBeInTheDocument();
  });

  test('calculates and displays total orders from data', () => {
    render(<OrdersOverview data={mockData} />);
    // 40+65+55+80+90+70+30 = 430
    expect(screen.getByText('430')).toBeInTheDocument();
  });

  test('displays "in this period" label', () => {
    render(<OrdersOverview data={mockData} />);
    expect(screen.getByText(/in this period/i)).toBeInTheDocument();
  });

  test('renders TimeFilter component', () => {
    render(<OrdersOverview data={mockData} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('renders with empty data without crashing', () => {
    render(<OrdersOverview data={[]} />);
    expect(screen.getByText('Orders overview')).toBeInTheDocument();
    // Total should be 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('correctly sums single-item data', () => {
    render(<OrdersOverview data={[{ day: 'Mon', orders: 42, highlight: false }]} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  test('correctly sums data with all zeros', () => {
    const zeroData = [
      { day: 'Mon', orders: 0, highlight: false },
      { day: 'Tue', orders: 0, highlight: false },
    ];
    render(<OrdersOverview data={zeroData} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('renders more options button', () => {
    render(<OrdersOverview data={mockData} />);
    // The FiMoreHorizontal button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });
});