import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock DashboardHeader to avoid auth store dependency
vi.mock('../../../components/Dashboard/DashboardHeader', () => ({
  default: ({ title }) => <header data-testid="dashboard-header">{title}</header>,
}));

// Mock shared components
vi.mock('../../../components/Dashboard/shared/DashboardSkeleton', () => ({
  DashboardPageSkeleton: () => <div data-testid="page-skeleton" />,
  KanbanCardSkeleton: () => <div data-testid="kanban-card-skeleton" />,
}));
vi.mock('../../../components/Dashboard/shared/ErrorState', () => ({
  default: ({ message, onRetry }) => (
    <div data-testid="error-state">
      <span>{message}</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}));
vi.mock('../../../components/Dashboard/shared/ConfirmModal', () => ({
  default: ({ isOpen, onClose, onConfirm, title }) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <span>{title}</span>
        <button onClick={onClose}>Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }}>Confirm</button>
      </div>
    ) : null,
}));

// Mock kitchen hooks
vi.mock('../../../hooks/dashboard/useKitchenOrders', () => ({
  useRealtimeKitchen: vi.fn(),
  useUpdateKitchenStatus: vi.fn(),
}));

import LiveKitchenView from '../../../components/Dashboard/LiveKitchenView';
import { useRealtimeKitchen, useUpdateKitchenStatus } from '../../../hooks/dashboard/useKitchenOrders';

const mockBoards = {
  queue: [
    { id: 'ORD-001', time: '10:30', name: 'Alice', items: ['Burger'], notes: 'No onions' },
    { id: 'ORD-002', time: '10:45', name: 'Bob', items: ['Pizza'], notes: null },
  ],
  preparing: [
    { id: 'ORD-003', time: '10:20', name: 'Charlie', items: ['Pasta'], notes: 'Extra sauce' },
  ],
  ready: [
    { id: 'ORD-004', time: '10:00', name: 'Dana', items: ['Salad'], notes: null },
  ],
  done: [
    { id: 'ORD-005', time: '09:50', name: 'Eve', items: ['Soup'], notes: null },
  ],
};

const mockMutate = vi.fn();

describe('LiveKitchenView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUpdateKitchenStatus.mockReturnValue({ mutate: mockMutate });
  });

  describe('error state', () => {
    beforeEach(() => {
      useRealtimeKitchen.mockReturnValue({
        boards: { queue: [], preparing: [], ready: [], done: [] },
        isConnected: false,
        isFetching: false,
        error: new Error('Connection failed'),
        refetch: vi.fn(),
      });
    });

    test('renders error state when connection fails', () => {
      render(<LiveKitchenView />);
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    test('shows error message about kitchen stream', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('Failed to connect to kitchen stream.')).toBeInTheDocument();
    });

    test('retry button calls refetch', () => {
      const refetch = vi.fn();
      useRealtimeKitchen.mockReturnValue({
        boards: { queue: [], preparing: [], ready: [], done: [] },
        isConnected: false,
        isFetching: false,
        error: new Error('Connection failed'),
        refetch,
      });
      render(<LiveKitchenView />);
      fireEvent.click(screen.getByRole('button', { name: /retry/i }));
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      useRealtimeKitchen.mockReturnValue({
        boards: mockBoards,
        isConnected: true,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    test('renders the Live Kitchen header', () => {
      render(<LiveKitchenView />);
      expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Live Kitchen');
    });

    test('renders "Live Kitchen" live indicator text', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('Live Kitchen')).toBeInTheDocument();
    });

    test('renders all three kanban column headers', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText(/Order Queue/)).toBeInTheDocument();
      expect(screen.getByText(/Preparing/)).toBeInTheDocument();
      expect(screen.getByText(/Ready/)).toBeInTheDocument();
    });

    test('renders orders in the queue column', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
      expect(screen.getByText('ORD-002')).toBeInTheDocument();
    });

    test('renders orders in the preparing column', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('ORD-003')).toBeInTheDocument();
    });

    test('renders orders in the ready column', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('ORD-004')).toBeInTheDocument();
    });

    test('renders the Done section', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText(/Done/)).toBeInTheDocument();
    });

    test('renders a completed order in the Done section', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('ORD-005')).toBeInTheDocument();
    });

    test('renders Refresh button', () => {
      render(<LiveKitchenView />);
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    });

    test('clicking Refresh calls refetch', () => {
      const refetch = vi.fn();
      useRealtimeKitchen.mockReturnValue({
        boards: mockBoards,
        isConnected: true,
        isFetching: false,
        error: null,
        refetch,
      });
      render(<LiveKitchenView />);
      fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
      expect(refetch).toHaveBeenCalledTimes(1);
    });

    test('renders order notes badge for orders with notes', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('No onions')).toBeInTheDocument();
    });

    test('"Start Preparing" button calls mutate for queue orders', () => {
      render(<LiveKitchenView />);
      const startBtns = screen.getAllByRole('button', { name: /start preparing/i });
      fireEvent.click(startBtns[0]);
      expect(mockMutate).toHaveBeenCalledWith({ orderId: 'ORD-001', nextStatus: 'preparing' });
    });

    test('"Prepared" button calls mutate for preparing orders', () => {
      render(<LiveKitchenView />);
      const preparedBtns = screen.getAllByRole('button', { name: /prepared/i });
      fireEvent.click(preparedBtns[0]);
      expect(mockMutate).toHaveBeenCalledWith({ orderId: 'ORD-003', nextStatus: 'ready' });
    });

    test('clicking "Cancel" on a queue order opens confirm modal', () => {
      render(<LiveKitchenView />);
      const cancelBtns = screen.getAllByRole('button', { name: /cancel order/i });
      fireEvent.click(cancelBtns[0]);
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
      expect(screen.getByText('Cancel Order?')).toBeInTheDocument();
    });

    test('confirming cancel calls mutate with "cancelled" status', () => {
      render(<LiveKitchenView />);
      const cancelBtns = screen.getAllByRole('button', { name: /cancel order/i });
      fireEvent.click(cancelBtns[0]);
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
      expect(mockMutate).toHaveBeenCalledWith({ orderId: 'ORD-001', nextStatus: 'cancelled' });
    });

    test('dismissing cancel modal closes it without calling mutate', () => {
      render(<LiveKitchenView />);
      const cancelBtns = screen.getAllByRole('button', { name: /cancel order/i });
      fireEvent.click(cancelBtns[0]);
      fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
      expect(screen.queryByTestId('confirm-modal')).toBeNull();
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('empty columns', () => {
    beforeEach(() => {
      useRealtimeKitchen.mockReturnValue({
        boards: { queue: [], preparing: [], ready: [], done: [] },
        isConnected: true,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    test('shows "No orders here" empty state for empty columns', () => {
      render(<LiveKitchenView />);
      const emptyMessages = screen.getAllByText('No orders here');
      expect(emptyMessages.length).toBe(3); // one for each column
    });

    test('shows "No completed orders yet" for empty done section', () => {
      render(<LiveKitchenView />);
      expect(screen.getByText('No completed orders yet')).toBeInTheDocument();
    });
  });

  describe('loading/fetching state', () => {
    test('shows kanban card skeletons when isFetching and columns are empty', () => {
      useRealtimeKitchen.mockReturnValue({
        boards: { queue: [], preparing: [], ready: [], done: [] },
        isConnected: true,
        isFetching: true,
        error: null,
        refetch: vi.fn(),
      });
      render(<LiveKitchenView />);
      const skeletons = screen.getAllByTestId('kanban-card-skeleton');
      // 2 skeletons per empty column × 3 columns = 6
      expect(skeletons.length).toBe(6);
    });
  });
});
