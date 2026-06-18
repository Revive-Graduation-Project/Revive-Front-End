import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock the real-time hook before importing DashboardLayout
vi.mock('../../../hooks/dashboard/useDashboardRealtime', () => ({
  useDashboardRealtime: vi.fn(() => ({ isConnected: true })),
}));

// Mock DashboardSidebar to avoid its deep dependency tree
vi.mock('../../../components/Dashboard/DashboardSidebar', () => ({
  default: () => <aside data-testid="dashboard-sidebar">Sidebar</aside>,
}));

// Mock the toast container
vi.mock('../../../components/Dashboard/shared/useToast', () => ({
  useToast: vi.fn(() => ({ addToast: vi.fn(), success: vi.fn(), error: vi.fn(), info: vi.fn() })),
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock react-router-dom Outlet to render a placeholder
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <main data-testid="outlet-content">Page Content</main>,
  };
});

import DashboardLayout from '../../../Layout/DashboardLayout';
import { useDashboardRealtime } from '../../../hooks/dashboard/useDashboardRealtime';

describe('DashboardLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDashboardRealtime.mockReturnValue({ isConnected: true });
  });

  const renderLayout = () =>
    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

  test('renders the dashboard sidebar', () => {
    renderLayout();
    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
  });

  test('renders the outlet for nested routes', () => {
    renderLayout();
    expect(screen.getByTestId('outlet-content')).toBeInTheDocument();
  });

  test('renders the toast container', () => {
    renderLayout();
    expect(screen.getByTestId('toast-container')).toBeInTheDocument();
  });

  test('initializes the real-time connection on mount', () => {
    renderLayout();
    expect(useDashboardRealtime).toHaveBeenCalledTimes(1);
  });

  test('renders a root flex container', () => {
    const { container } = renderLayout();
    const root = container.firstChild;
    expect(root).toBeInTheDocument();
    expect(root.tagName.toLowerCase()).toBe('div');
  });

  test('renders a <main> element for the scrollable content area', () => {
    renderLayout();
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  test('sidebar is rendered before main content in DOM order', () => {
    const { container } = renderLayout();
    const sidebar = screen.getByTestId('dashboard-sidebar');
    const main = screen.getByRole('main');
    // sidebar should appear before main in the DOM
    const position = sidebar.compareDocumentPosition(main);
    // DOCUMENT_POSITION_FOLLOWING = 4
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('re-renders without error when connected state changes', () => {
    useDashboardRealtime.mockReturnValue({ isConnected: false });
    expect(() => renderLayout()).not.toThrow();
  });
});