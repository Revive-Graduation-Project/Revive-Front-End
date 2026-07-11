import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { AppLayout, AuthLayout, DashboardLayout } from "./Layout";
import Customization from "./pages/customization/Customization";
import StaffRoute from "./components/StaffRoute";

import {
  Home,
  Login,
  Signup,
  ForgotPassword,
  ResetPassword,
  Cart,
  Payment,
  Thanks,
  Favorites,
  Profile,
  Dashboard,
  Orders,
  RecipeBuilder,
  ChefMenu,
  LiveKitchen,
  MenuManagement,
  Ingredients,
  Notifications,
} from "./pages";
import { ProfileLayout, ProfileOrders, Rewards } from "./pages/Profile";
import { useAuthInit } from "./hooks/useAuthInit";
import Menu from "./pages/Menu/Menu";
import { useRestaurantInit } from "./hooks/useRestaurantInit";
import { useAuthStore } from "./store";
import { LoadingSpinner } from "./components";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  useAuthInit();
  useRestaurantInit();

  const { loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* ── App Routes ──
            AppLayout (Navbar + Footer) wraps ALL app pages.
            Home and Menu are PUBLIC — no auth required.
            All other routes are PROTECTED via ProtectedRoute. */}
        <Route path="/" element={<AppLayout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />

          {/* Protected routes — ProtectedRoute shows a message + redirects to login if not authenticated */}
          <Route path="customize" element={<ProtectedRoute><Customization /></ProtectedRoute>} />
          <Route path="favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="cart"      element={<Cart />} />
          <Route path="checkout"  element={<Navigate to="/cart" replace />} />
          <Route path="payment"   element={<Payment />} />
          <Route path="thanks"    element={<Thanks />} />
          
          <Route path="profile" element={<ProtectedRoute><ProfileLayout /></ProtectedRoute>}>
            <Route index element={<Profile />} />
            <Route path="orders" element={<ProfileOrders />} />
            <Route path="rewards" element={<Rewards />} />
          </Route>
        </Route>

        {/* Auth Routes — always accessible */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/reset-password" element={<ResetPassword />} />
        

        {/* Catch-all: redirect unknown URLs to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* ── Dashboard Routes ──
            Separate full-screen layout (no Navbar/Footer).
            Protected: requires authentication (chef/admin).       */}
        <Route
          path="/dashboard"
          element={
            <StaffRoute>
              <DashboardLayout />
            </StaffRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="recipe-builder" element={<RecipeBuilder />} />
          <Route path="chef-menu" element={<ChefMenu />} />
          <Route path="live-kitchen" element={<LiveKitchen />} />
          <Route path="menu-management" element={<MenuManagement />} />
          <Route path="ingredients" element={<Ingredients />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </>
  );
}
