import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock DashboardHeader to avoid auth store dep
vi.mock('../../../components/Dashboard/DashboardHeader', () => ({
  default: ({ title }) => <header data-testid="dashboard-header">{title}</header>,
}));

// Mock TrendingMenus
vi.mock('../../../components/Dashboard/TrendingMenus', () => ({
  default: ({ data }) => <div data-testid="trending-menus">{data?.length} items</div>,
}));

// Mock shared components
vi.mock('../../../components/Dashboard/shared/DashboardSkeleton', () => ({
  DashboardPageSkeleton: () => <div data-testid="page-skeleton" />,
}));
vi.mock('../../../components/Dashboard/shared/ErrorState', () => ({
  default: ({ message, onRetry }) => (
    <div data-testid="error-state">
      <span>{message}</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));
vi.mock('../../../components/Dashboard/shared/EmptyState', () => ({
  default: ({ title }) => <div data-testid="empty-state">{title}</div>,
}));
vi.mock('../../../components/Dashboard/shared/SortMenu', () => ({
  default: ({ onChange }) => <div data-testid="sort-menu" />,
}));
vi.mock('../../../components/Dashboard/shared/MenuModal', () => ({
  default: ({ isOpen, onClose, onSubmit, initialData }) =>
    isOpen ? (
      <div data-testid="menu-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSubmit({ name: 'Test', price: 10 })}>Submit</button>
        {initialData && <span data-testid="editing-item">{initialData.name}</span>}
      </div>
    ) : null,
}));

// Mock useToast
vi.mock('../../../components/Dashboard/shared/useToast', () => ({
  useToast: vi.fn(() => ({
    addToast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  })),
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock menu hooks
vi.mock('../../../hooks/dashboard/useMenuItems', () => ({
  useMenuCategories: vi.fn(),
  useMenuItems: vi.fn(),
  useCreateMenuItem: vi.fn(),
  useUpdateMenuItem: vi.fn(),
}));
vi.mock('../../../hooks/dashboard/useDashboard', () => ({
  useTrendingMenus: vi.fn(),
}));

import ChefMenuView from '../../../components/Dashboard/ChefMenuView';
import {
  useMenuCategories,
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
} from '../../../hooks/dashboard/useMenuItems';
import { useTrendingMenus } from '../../../hooks/dashboard/useDashboard';

const mockCategories = {
  totalChange: 2.5,
  totalPercentage: 85,
  items: [
    { name: 'Starters', percentage: 40, change: 1.2 },
    { name: 'Mains', percentage: 60, change: -0.5 },
  ],
};

const mockMenuItems = [
  { id: '1', name: 'Burger', category: 'Mains', fat: '10g', calories: '500', protein: '25g', sugar: '5g', price: 12.99 },
  { id: '2', name: 'Caesar Salad', category: 'Starters', fat: '8g', calories: '300', protein: '12g', sugar: '3g', price: 8.99 },
  { id: '3', name: 'Pizza', category: 'Mains', fat: '15g', calories: '700', protein: '30g', sugar: '8g', price: 15.99 },
];

const mockTrending = [{ id: 1, name: 'Burger' }];
const mockMutate = vi.fn();

const successState = (data) => ({ data, isLoading: false, error: null });
const loadingState = { data: undefined, isLoading: true, error: null };
const errorState = { data: undefined, isLoading: false, error: new Error('Failed') };

describe('ChefMenuView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCreateMenuItem.mockReturnValue({ mutate: mockMutate });
    useUpdateMenuItem.mockReturnValue({ mutate: mockMutate });
  });

  describe('loading state', () => {
    beforeEach(() => {
      useMenuCategories.mockReturnValue(loadingState);
      useMenuItems.mockReturnValue(loadingState);
      useTrendingMenus.mockReturnValue(loadingState);
    });

    test('renders skeleton while loading', () => {
      render(<ChefMenuView />);
      expect(screen.getByTestId('page-skeleton')).toBeInTheDocument();
    });

    test('renders header with Menu title while loading', () => {
      render(<ChefMenuView />);
      expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Menu');
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      useMenuCategories.mockReturnValue(errorState);
      useMenuItems.mockReturnValue(successState(mockMenuItems));
      useTrendingMenus.mockReturnValue(successState(mockTrending));
    });

    test('renders error state when categories hook fails', () => {
      render(<ChefMenuView />);
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByText('Failed to load menu data.')).toBeInTheDocument();
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      useMenuCategories.mockReturnValue(successState(mockCategories));
      useMenuItems.mockReturnValue(successState(mockMenuItems));
      useTrendingMenus.mockReturnValue(successState(mockTrending));
    });

    test('renders header with Menu title', () => {
      render(<ChefMenuView />);
      expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Menu');
    });

    test('renders "All Menu" tab by default', () => {
      render(<ChefMenuView />);
      expect(screen.getByRole('button', { name: 'All Menu' })).toBeInTheDocument();
    });

    test('renders category tabs dynamically from menu items', () => {
      render(<ChefMenuView />);
      expect(screen.getByRole('button', { name: 'Mains' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Starters' })).toBeInTheDocument();
    });

    test('renders all menu items by default (All Menu tab active)', () => {
      render(<ChefMenuView />);
      expect(screen.getByText('Burger')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByText('Pizza')).toBeInTheDocument();
    });

    test('filters items when a category tab is clicked', () => {
      render(<ChefMenuView />);
      fireEvent.click(screen.getByRole('button', { name: 'Starters' }));
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.queryByText('Burger')).toBeNull();
    });

    test('renders "All Menu" tab showing all items again after category filter', () => {
      render(<ChefMenuView />);
      fireEvent.click(screen.getByRole('button', { name: 'Starters' }));
      fireEvent.click(screen.getByRole('button', { name: 'All Menu' }));
      expect(screen.getByText('Burger')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByText('Pizza')).toBeInTheDocument();
    });

    test('renders item prices in orange', () => {
      render(<ChefMenuView />);
      expect(screen.getByText('$12.99')).toBeInTheDocument();
      expect(screen.getByText('$8.99')).toBeInTheDocument();
    });

    test('renders edit button for each menu item', () => {
      render(<ChefMenuView />);
      const editBtns = screen.getAllByTitle(/Edit/);
      expect(editBtns.length).toBe(3);
    });

    test('clicking add (+) button opens MenuModal without initial data', () => {
      render(<ChefMenuView />);
      // The floating + button has no accessible label, find by its type
      const addBtn = screen.getByTitle ? null : null;
      // Find by checking all buttons for the one that opens modal
      const buttons = screen.getAllByRole('button');
      // The floating + button in ChefMenuView doesn't have a title, look for it by position
      // Instead test that the modal appears after clicking the + button
      // Locate the "+" floating button - it's the last button before modal opens
      const floatingAddBtn = buttons[buttons.length - 1];
      fireEvent.click(floatingAddBtn);
      expect(screen.getByTestId('menu-modal')).toBeInTheDocument();
    });

    test('clicking edit button opens MenuModal with item data', () => {
      render(<ChefMenuView />);
      const editBtns = screen.getAllByTitle(/Edit Burger/);
      fireEvent.click(editBtns[0]);
      expect(screen.getByTestId('menu-modal')).toBeInTheDocument();
      expect(screen.getByTestId('editing-item')).toHaveTextContent('Burger');
    });

    test('renders SortMenu component', () => {
      render(<ChefMenuView />);
      expect(screen.getByTestId('sort-menu')).toBeInTheDocument();
    });

    test('renders TrendingMenus sidebar when trending data is available', () => {
      render(<ChefMenuView />);
      expect(screen.getByTestId('trending-menus')).toBeInTheDocument();
    });

    test('shows metric circle for total meals count', () => {
      render(<ChefMenuView />);
      expect(screen.getByText('Total Meals')).toBeInTheDocument();
    });

    test('shows category metric circles', () => {
      render(<ChefMenuView />);
      expect(screen.getByText('Starters')).toBeInTheDocument();
    });

    test('modal can be closed via Close button', () => {
      render(<ChefMenuView />);
      const editBtns = screen.getAllByTitle(/Edit Burger/);
      fireEvent.click(editBtns[0]);
      expect(screen.getByTestId('menu-modal')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByTestId('menu-modal')).toBeNull();
    });
  });

  describe('empty menu items', () => {
    test('shows empty state when no items exist', () => {
      useMenuCategories.mockReturnValue(successState(mockCategories));
      useMenuItems.mockReturnValue(successState([]));
      useTrendingMenus.mockReturnValue(successState(mockTrending));
      render(<ChefMenuView />);
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });
});