import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import App from '../App';
import useAuthStore from '../store/authStore';

// Mock the store
vi.mock('../store/authStore');

vi.mock('../pages/customization/Customization', () => ({
  default: () => <div data-testid="customization-page">Customization Page</div>
}));

vi.mock('../components/layout/Navbar', () => ({ default: () => <nav>Navbar</nav> }));
vi.mock('../components/layout/Footer', () => ({ default: () => <footer>Footer</footer> }));
vi.mock('../components/OrderFlow/SideCartDrawer', () => ({ default: () => <div>SideCartDrawer</div> }));

vi.mock('../pages', () => ({
  Home: () => <div>Home</div>,
  Login: () => <div>Login</div>,
  Signup: () => <div>Signup</div>,
  Cart: () => <div>Cart</div>,
  Checkout: () => <div>Checkout</div>,
  Payment: () => <div>Payment</div>,
  Thanks: () => <div>Thanks</div>,
  Favorites: () => <div>Favorites</div>,
  StoreDebug: () => <div>StoreDebug</div>,
  Profile: () => <div>Profile</div>,
  Dashboard: () => <div>Dashboard</div>,
  Orders: () => <div>Orders</div>,
  RecipeBuilder: () => <div>RecipeBuilder</div>,
  ChefMenu: () => <div>ChefMenu</div>,
  LiveKitchen: () => <div>LiveKitchen</div>,
  MenuManagement: () => <div>MenuManagement</div>,
  Ingredients: () => <div>Ingredients</div>,
}));

vi.mock('../pages/Menu/Menu', () => ({
  default: () => <div>Menu</div>
}));

vi.mock('../hooks/useAuthInit', () => ({
  useAuthInit: vi.fn()
}));
vi.mock('../hooks/useRestaurantInit', () => ({
  useRestaurantInit: vi.fn()
}));

// Provide a mock for matchMedia (often needed for UI libraries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('App Routing - Customize (SCRUM-50)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ProtectedRoute fallback when accessing /customize unauthenticated', () => {
    useAuthStore.mockImplementation((selector) => {
      const state = { isAuthenticated: false, loading: false };
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter initialEntries={['/customize']}>
        <App />
      </MemoryRouter>
    );

    // The ProtectedRoute renders "Please log in to continue"
    expect(screen.getByText(/Please log in to continue/i)).toBeInTheDocument();
    // Customization page should NOT be rendered
    expect(screen.queryByTestId('customization-page')).not.toBeInTheDocument();
  });

  it('renders Customization page when accessing /customize authenticated', () => {
    useAuthStore.mockImplementation((selector) => {
      const state = { isAuthenticated: true, loading: false };
      return selector ? selector(state) : state;
    });

    render(
      <MemoryRouter initialEntries={['/customize']}>
        <App />
      </MemoryRouter>
    );

    // The Customization page SHOULD be rendered
    expect(screen.getByTestId('customization-page')).toBeInTheDocument();
    // Protected route fallback should NOT be rendered
    expect(screen.queryByText(/Please log in to continue/i)).not.toBeInTheDocument();
  });
});
