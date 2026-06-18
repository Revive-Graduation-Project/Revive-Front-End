import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import useAuthStore from '../../../store/authStore';

// Mock the auth store
vi.mock('../../../store/authStore', () => ({
  default: vi.fn(),
}));

describe('DashboardHeader', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({ user: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders the provided title', () => {
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  test('renders a custom title', () => {
    render(<DashboardHeader title="Orders" />);
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument();
  });

  test('defaults title to "Dashboard" when not provided', () => {
    render(<DashboardHeader />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  test('shows "Welcome back" subtitle when no user', () => {
    useAuthStore.mockReturnValue({ user: null });
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  test('shows greeting with first name when user is present', () => {
    useAuthStore.mockReturnValue({ user: { name: 'Alice Smith', role: 'chef' } });
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Hello Alice, Welcome back')).toBeInTheDocument();
  });

  test('uses custom subtitle when provided, overriding auto-generated one', () => {
    useAuthStore.mockReturnValue({ user: { name: 'Alice Smith', role: 'chef' } });
    render(<DashboardHeader title="Menu" subtitle="Custom subtitle" />);
    expect(screen.getByText('Custom subtitle')).toBeInTheDocument();
    expect(screen.queryByText('Hello Alice, Welcome back')).toBeNull();
  });

  test('displays full user name in profile section', () => {
    useAuthStore.mockReturnValue({ user: { name: 'Alice Smith', role: 'chef' } });
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  test('displays user role (lowercase) in profile section', () => {
    useAuthStore.mockReturnValue({ user: { name: 'Alice Smith', role: 'Admin' } });
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  test('defaults role to "Staff" when user has no role', () => {
    useAuthStore.mockReturnValue({ user: { name: 'Alice Smith' } });
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('staff')).toBeInTheDocument();
  });

  test('shows "Loading..." when user has no name', () => {
    useAuthStore.mockReturnValue({ user: {} });
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders initials from user name', () => {
    useAuthStore.mockReturnValue({ user: { name: 'Bob Jones', role: 'chef' } });
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByText('BJ')).toBeInTheDocument();
  });

  test('renders at most 2 initials from a long name', () => {
    useAuthStore.mockReturnValue({ user: { name: 'Alice Bob Charlie', role: 'chef' } });
    render(<DashboardHeader title="Dashboard" />);
    // Should show "AB" not "ABC"
    expect(screen.getByText('AB')).toBeInTheDocument();
    expect(screen.queryByText('ABC')).toBeNull();
  });

  test('renders search input placeholder', () => {
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  test('renders notification bell button', () => {
    render(<DashboardHeader title="Dashboard" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('renders profile image when user has avatar', () => {
    useAuthStore.mockReturnValue({
      user: { name: 'Alice', role: 'chef', avatar: 'https://example.com/avatar.jpg' },
    });
    render(<DashboardHeader title="Dashboard" />);
    const img = screen.getByAltText('Profile');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });
});