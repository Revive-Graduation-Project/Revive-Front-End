import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InventoryAlerts from '../../../components/Dashboard/InventoryAlerts';

const makeItems = (prefix, count, withDays = false) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${prefix} ${i + 1}`,
    image: `🥬`,
    ...(withDays ? { daysLeft: i + 1 } : {}),
  }));

const mockData = {
  lowStock: makeItems('Low', 2),
  shelfLife: makeItems('Shelf', 4, true),
  inSeason: makeItems('Season', 3),
};

describe('InventoryAlerts', () => {
  test('renders the INVENTORY ALERTS heading', () => {
    render(<InventoryAlerts data={mockData} />);
    expect(screen.getByText('INVENTORY ALERTS')).toBeInTheDocument();
  });

  test('renders "Low Stock" section label', () => {
    render(<InventoryAlerts data={mockData} />);
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
  });

  test('renders "Shelf-life: less than 3 days" section label', () => {
    render(<InventoryAlerts data={mockData} />);
    expect(screen.getByText('Shelf-life: less than 3 days')).toBeInTheDocument();
  });

  test('renders "In Season" section label', () => {
    render(<InventoryAlerts data={mockData} />);
    expect(screen.getByText('In Season')).toBeInTheDocument();
  });

  test('shows at most 3 items per section', () => {
    render(<InventoryAlerts data={mockData} />);
    // shelfLife has 4 items — only first 3 names should be visible
    expect(screen.getByText('Shelf 1')).toBeInTheDocument();
    expect(screen.getByText('Shelf 2')).toBeInTheDocument();
    expect(screen.getByText('Shelf 3')).toBeInTheDocument();
    // Shelf 4 should NOT appear (sliced to 3)
    expect(screen.queryByText('Shelf 4')).toBeNull();
  });

  test('shows overflow count badge when section has more than 3 items', () => {
    render(<InventoryAlerts data={mockData} />);
    // shelfLife has 4 items → badge "+1"
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  test('does NOT show overflow badge when section has exactly 3 items', () => {
    const dataExact = {
      lowStock: makeItems('L', 3),
      shelfLife: makeItems('S', 3, true),
      inSeason: makeItems('I', 3),
    };
    render(<InventoryAlerts data={dataExact} />);
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });

  test('shows daysLeft for shelfLife items', () => {
    render(<InventoryAlerts data={mockData} />);
    // shelfLife items have daysLeft — shown as "(NDay left)"
    // mockData shelfLife[0] has daysLeft: 1
    const daysLeftTexts = screen.getAllByText('(1Day left)');
    expect(daysLeftTexts.length).toBeGreaterThanOrEqual(1);
  });

  test('does NOT show daysLeft for lowStock or inSeason items', () => {
    const dataWithOnlyLow = {
      lowStock: [{ id: 1, name: 'Tomato', image: '🍅', daysLeft: 99 }],
      shelfLife: [],
      inSeason: [],
    };
    render(<InventoryAlerts data={dataWithOnlyLow} />);
    // lowStock items should NOT show daysLeft even if the field is present on the object
    expect(screen.queryByText('(99Day left)')).toBeNull();
  });

  test('renders empty sections without crashing', () => {
    const emptyData = {
      lowStock: [],
      shelfLife: [],
      inSeason: [],
    };
    render(<InventoryAlerts data={emptyData} />);
    expect(screen.getByText('INVENTORY ALERTS')).toBeInTheDocument();
    expect(screen.getByText('Low Stock')).toBeInTheDocument();
  });

  test('renders items with emoji images', () => {
    const data = {
      lowStock: [{ id: 1, name: 'Spinach', image: '🥬' }],
      shelfLife: [],
      inSeason: [],
    };
    render(<InventoryAlerts data={data} />);
    expect(screen.getByText('🥬')).toBeInTheDocument();
    expect(screen.getByText('Spinach')).toBeInTheDocument();
  });

  test('overflow badge shows correct count for many items', () => {
    const dataMany = {
      lowStock: makeItems('X', 7),
      shelfLife: [],
      inSeason: [],
    };
    render(<InventoryAlerts data={dataMany} />);
    // 7 - 3 = 4 overflow
    expect(screen.getByText('+4')).toBeInTheDocument();
  });
});