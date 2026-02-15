import { Route, Routes, Navigate } from "react-router";
import { AppLayout, AuthLayout } from "./Layout";
import {
  Home,
  Login,
  Signup,
  Cart,
  Checkout,
  Payment,
  Thanks,
  Favorites,
} from "./pages";
import { useAuthInit } from "./hooks/useAuthInit";
import { useRestaurantInit } from "./hooks/useRestaurantInit";
import { useAuthStore } from "./store";
import { LoadingSpinner } from "./components";
import SideCartDrawer from './components/OrderFlow/SideCartDrawer';

export default function App() {
  useAuthInit();
  useRestaurantInit(); // Initialize restaurant data

  const { isAuthenticated, loading } = useAuthStore();

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
        {/* App Routes - Protected */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <AppLayout />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment" element={<Payment />} />
          <Route path="thanks" element={<Thanks />} />
        </Route>

        {/* Auth Routes - Always accessible */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* 
            If user types /random-page-that-doesnt-exist this route below catches it
            If authenticated → Redirects to / (home)
            If NOT authenticated → Redirects to /auth/login 
        */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/" : "/auth/login"} replace />
          }
        />
      </Routes>

      <SideCartDrawer />
    </>
  );
}
