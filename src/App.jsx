import { Route, Routes, Navigate } from "react-router";
import { AppLayout, AuthLayout } from "./Layout";
import { useAuthInit } from "./hooks/useAuthInit";
// import { useAuthStore } from "./store";
// import { LoadingSpinner } from "./components";
import Customization from "./pages/customization/Customization";

import {
  Home,
  Login,
  Signup,
  Cart,
  Checkout,
  Payment,
  Thanks,
  Favorites,
  StoreDebug,
} from "./pages";
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
            All other routes are PROTECTED via ProtectedRoute.        */}
        <Route path="/" element={<AppLayout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />

          {/* Protected routes — ProtectedRoute shows a message + redirects to login if not authenticated */}
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="thanks" element={<Thanks />} />
          {/* remove the text when the profile is ready */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">
                  Profile page coming soon
                </div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Auth Routes — always accessible */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Debug Route — remove before production */}
        <Route path="/debug" element={<StoreDebug />} />

        {/* Catch-all: redirect unknown URLs to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
