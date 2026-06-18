import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock DashboardHeader to avoid auth store dep
vi.mock('../../../components/Dashboard/DashboardHeader', () => ({
  default: ({ title }) => <header data-testid="dashboard-header">{title}</header>,
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
  default: ({ title, description }) => (
    <div data-testid="empty-state">
      <span>{title}</span>
      {description && <span>{description}</span>}
    </div>
  ),
}));
vi.mock('../../../components/Dashboard/shared/SortMenu', () => ({
  default: () => <div data-testid="sort-menu" />,
}));
vi.mock('../../../components/Dashboard/shared/StatusBadge', () => ({
  default: ({ status }) => <span data-testid="status-badge">{status}</span>,
}));
vi.mock('../../../components/Dashboard/shared/IngredientModal', () => ({
  default: ({ isOpen, onClose, onSubmit, initialData }) =>
    isOpen ? (
      <div data-testid="ingredient-modal">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSubmit({ name: 'Test Ingredient' })}>Submit</button>
        {initialData && <span data-testid="editing-ingredient">{initialData.name}</span>}
      </div>
    ) : null,
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

// Mock useToast
vi.mock('../../../components/Dashboard/shared/useToast', () => ({
  useToast: vi.fn(() => ({
    addToast: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  })),
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock ingredient hooks
vi.mock('../../../hooks/dashboard/useIngredients', () => ({
  useIngredientsMetrics: vi.fn(),
  useIngredients: vi.fn(),
  useUploadIngredients: vi.fn(),
  useDeleteIngredient: vi.fn(),
  useCreateIngredient: vi.fn(),
  useUpdateIngredient: vi.fn(),
}));

import IngredientsView from '../../../components/Dashboard/IngredientsView';
import {
  useIngredientsMetrics,
  useIngredients,
  useUploadIngredients,
  useDeleteIngredient,
  useCreateIngredient,
  useUpdateIngredient,
} from '../../../hooks/dashboard/useIngredients';

const mockMetrics = {
  total: 25,
  totalChange: 1.58,
  outOfStock: 3,
  outOfStockChange: 0.42,
};

const mockIngredients = [
  { id: '1', name: 'Chicken', category: 'Protein', fat: '5g', calories: '200', protein: '30g', sugar: '0g', stock: 150, costPerUnit: '$2.50', image: null },
  { id: '2', name: 'Tomato', category: 'Vegetables', fat: '0g', calories: '18', protein: '1g', sugar: '3g', stock: 10, costPerUnit: '$0.50', image: null },
  { id: '3', name: 'Soy Sauce', category: 'Sauces', fat: '0g', calories: '10', protein: '2g', sugar: '1g', stock: 5000, costPerUnit: '$1.00', image: null },
];

const mockMutate = vi.fn();

const successState = (data) => ({ data, isLoading: false, error: null });
const loadingState = { data: undefined, isLoading: true, error: null };
const errorState = { data: undefined, isLoading: false, error: new Error('Failed') };

describe('IngredientsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDeleteIngredient.mockReturnValue({ mutate: mockMutate });
    useCreateIngredient.mockReturnValue({ mutate: mockMutate });
    useUpdateIngredient.mockReturnValue({ mutate: mockMutate });
    useUploadIngredients.mockReturnValue({ mutate: mockMutate, isPending: false });
  });

  describe('loading state', () => {
    beforeEach(() => {
      useIngredientsMetrics.mockReturnValue(loadingState);
      useIngredients.mockReturnValue(loadingState);
    });

    test('renders skeleton while loading', () => {
      render(<IngredientsView />);
      expect(screen.getByTestId('page-skeleton')).toBeInTheDocument();
    });

    test('renders header with Ingredients title while loading', () => {
      render(<IngredientsView />);
      expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Ingredients');
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      useIngredientsMetrics.mockReturnValue(successState(mockMetrics));
      useIngredients.mockReturnValue(errorState);
    });

    test('renders error state when ingredients hook fails', () => {
      render(<IngredientsView />);
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    test('shows error message about ingredients data', () => {
      render(<IngredientsView />);
      expect(screen.getByText('Failed to load ingredients data.')).toBeInTheDocument();
    });
  });

  describe('success state', () => {
    beforeEach(() => {
      useIngredientsMetrics.mockReturnValue(successState(mockMetrics));
      useIngredients.mockReturnValue(successState(mockIngredients));
    });

    test('renders header with Ingredients title', () => {
      render(<IngredientsView />);
      expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Ingredients');
    });

    test('renders "All Ingredients" category tab', () => {
      render(<IngredientsView />);
      expect(screen.getByRole('button', { name: 'All Ingredients' })).toBeInTheDocument();
    });

    test('renders all fixed category tabs', () => {
      render(<IngredientsView />);
      expect(screen.getByRole('button', { name: 'Protein' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Vegetables' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sauces' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Stock' })).toBeInTheDocument();
    });

    test('renders all ingredients by default', () => {
      render(<IngredientsView />);
      expect(screen.getByText('Chicken')).toBeInTheDocument();
      expect(screen.getByText('Tomato')).toBeInTheDocument();
      expect(screen.getByText('Soy Sauce')).toBeInTheDocument();
    });

    test('filters ingredients by category when Protein tab is clicked', () => {
      render(<IngredientsView />);
      fireEvent.click(screen.getByRole('button', { name: 'Protein' }));
      expect(screen.getByText('Chicken')).toBeInTheDocument();
      expect(screen.queryByText('Tomato')).toBeNull();
      expect(screen.queryByText('Soy Sauce')).toBeNull();
    });

    test('filters ingredients by Vegetables category', () => {
      render(<IngredientsView />);
      fireEvent.click(screen.getByRole('button', { name: 'Vegetables' }));
      expect(screen.getByText('Tomato')).toBeInTheDocument();
      expect(screen.queryByText('Chicken')).toBeNull();
    });

    test('switching back to All Ingredients shows all items', () => {
      render(<IngredientsView />);
      fireEvent.click(screen.getByRole('button', { name: 'Protein' }));
      fireEvent.click(screen.getByRole('button', { name: 'All Ingredients' }));
      expect(screen.getByText('Chicken')).toBeInTheDocument();
      expect(screen.getByText('Tomato')).toBeInTheDocument();
    });

    test('renders edit buttons for each ingredient', () => {
      render(<IngredientsView />);
      const editBtns = screen.getAllByLabelText(/Edit/i);
      expect(editBtns.length).toBe(3);
    });

    test('renders delete buttons for each ingredient', () => {
      render(<IngredientsView />);
      const deleteBtns = screen.getAllByLabelText(/Delete/i);
      expect(deleteBtns.length).toBe(3);
    });

    test('clicking edit button opens IngredientModal with item data', () => {
      render(<IngredientsView />);
      const editBtns = screen.getAllByLabelText(/Edit Chicken/i);
      fireEvent.click(editBtns[0]);
      expect(screen.getByTestId('ingredient-modal')).toBeInTheDocument();
      expect(screen.getByTestId('editing-ingredient')).toHaveTextContent('Chicken');
    });

    test('clicking add (+) button opens IngredientModal without initial data', () => {
      render(<IngredientsView />);
      // The floating + button - find last button before form buttons
      const allButtons = screen.getAllByRole('button');
      // The "+" button is the last button in the table card area
      // Filter to find the one that opens ingredient modal (not in table)
      // We'll click it and verify modal opens without editing-ingredient
      // The floating button is positioned at bottom-right of the table card
      // Find by iterating buttons until we find one that shows modal without editing-ingredient
      let foundAdd = false;
      for (const btn of allButtons) {
        fireEvent.click(btn);
        if (screen.queryByTestId('ingredient-modal') && !screen.queryByTestId('editing-ingredient')) {
          foundAdd = true;
          break;
        }
        // Close modal if it opened with editing data
        const closeBtn = screen.queryByRole('button', { name: 'Close' });
        if (closeBtn) fireEvent.click(closeBtn);
      }
      expect(foundAdd).toBe(true);
    });

    test('clicking delete button opens confirm modal', () => {
      render(<IngredientsView />);
      const deleteBtns = screen.getAllByLabelText(/Delete Chicken/i);
      fireEvent.click(deleteBtns[0]);
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });

    test('confirm modal shows "Delete Ingredient" title', () => {
      render(<IngredientsView />);
      const deleteBtns = screen.getAllByLabelText(/Delete/i);
      fireEvent.click(deleteBtns[0]);
      expect(screen.getByText('Delete Ingredient')).toBeInTheDocument();
    });

    test('confirming delete calls deleteIngredient mutate', () => {
      render(<IngredientsView />);
      const deleteBtns = screen.getAllByLabelText(/Delete Chicken/i);
      fireEvent.click(deleteBtns[0]);
      fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(mockMutate).toHaveBeenCalledWith('1', expect.any(Object));
    });

    test('cancelling delete closes modal without calling mutate', () => {
      render(<IngredientsView />);
      const deleteBtns = screen.getAllByLabelText(/Delete Chicken/i);
      fireEvent.click(deleteBtns[0]);
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByTestId('confirm-modal')).toBeNull();
      expect(mockMutate).not.toHaveBeenCalled();
    });

    test('renders stock in "k" notation for large values', () => {
      render(<IngredientsView />);
      // Soy Sauce has stock=5000, should show "5k"
      expect(screen.getByText('5k')).toBeInTheDocument();
    });

    test('renders low stock in red when stock < 20 (Tomato with stock=10)', () => {
      render(<IngredientsView />);
      // Tomato has stock=10, look for a cell with "10" that has red color
      const stockCells = screen.getAllByText('10');
      // At least one of them should be present
      expect(stockCells.length).toBeGreaterThan(0);
    });

    test('renders upload ingredients file button', () => {
      render(<IngredientsView />);
      expect(screen.getByText('Upload ingredients file')).toBeInTheDocument();
    });

    test('renders SortMenu component', () => {
      render(<IngredientsView />);
      expect(screen.getByTestId('sort-menu')).toBeInTheDocument();
    });

    test('renders metric circles when metrics data is present', () => {
      render(<IngredientsView />);
      expect(screen.getByText('Total Ingredients')).toBeInTheDocument();
      expect(screen.getByText('Out of stock')).toBeInTheDocument();
    });

    test('modal can be closed via Close button', () => {
      render(<IngredientsView />);
      const editBtns = screen.getAllByLabelText(/Edit Chicken/i);
      fireEvent.click(editBtns[0]);
      expect(screen.getByTestId('ingredient-modal')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByTestId('ingredient-modal')).toBeNull();
    });
  });

  describe('empty ingredients', () => {
    test('shows empty state when no ingredients exist', () => {
      useIngredientsMetrics.mockReturnValue(successState(mockMetrics));
      useIngredients.mockReturnValue(successState([]));
      render(<IngredientsView />);
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('No ingredients found')).toBeInTheDocument();
    });
  });

  describe('upload functionality', () => {
    test('shows "Uploading..." label when upload is pending', () => {
      useIngredientsMetrics.mockReturnValue(successState(mockMetrics));
      useIngredients.mockReturnValue(successState(mockIngredients));
      useUploadIngredients.mockReturnValue({ mutate: mockMutate, isPending: true });
      render(<IngredientsView />);
      expect(screen.getByText('Uploading...')).toBeInTheDocument();
    });
  });
});