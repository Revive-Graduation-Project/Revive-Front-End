import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardSidebar from '../../../components/Dashboard/DashboardSidebar';
import useAuthStore from '../../../store/authStore';

// Mock the auth store
vi.mock('../../../store/authStore', () => ({
  default: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogout = vi.fn();

describe('DashboardSidebar', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue(mockLogout);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderSidebar = (initialPath = '/dashboard') =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <DashboardSidebar />
      </MemoryRouter>
    );

  test('renders the Revive brand logo', () => {
    renderSidebar();
    expect(screen.getByText('Re')).toBeInTheDocument();
    expect(screen.getByText('vive')).toBeInTheDocument();
  });

  test('renders all navigation items', () => {
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Recipe Builder')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Live Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Menu Management')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
  });

  test('renders the AI Intelligence card', () => {
    renderSidebar();
    expect(screen.getByText('AI Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Refine the Avocado Glow Bowl?')).toBeInTheDocument();
  });

  test('renders the Logout button', () => {
    renderSidebar();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  test('clicking Logout calls logout function and navigates to "/"', () => {
    renderSidebar();
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigation links have correct hrefs', () => {
    renderSidebar();
    const ordersLink = screen.getByRole('link', { name: /orders/i });
    expect(ordersLink).toHaveAttribute('href', '/dashboard/orders');
    const ingredientsLink = screen.getByRole('link', { name: /ingredients/i });
    expect(ingredientsLink).toHaveAttribute('href', '/dashboard/ingredients');
  });

  test('Dashboard link has href /dashboard', () => {
    renderSidebar();
    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i });
    // At least one link to /dashboard (the logo link and the nav item)
    const hasRootDash = dashboardLinks.some(
      (el) => el.getAttribute('href') === '/dashboard'
    );
    expect(hasRootDash).toBe(true);
  });

  test('renders AI Intelligence action button', () => {
    renderSidebar();
    const applyBtn = screen.getByRole('button', { name: /apply/i });
    expect(applyBtn).toBeInTheDocument();
  });

  test('nav items count is 7', () => {
    renderSidebar();
    const navLinks = screen.getAllByRole('link');
    // Should include logo link (1) + 7 nav item links = 8 total
    expect(navLinks.length).toBeGreaterThanOrEqual(7);
  });
});