import React, { useEffect } from 'react';
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import SideCartDrawer from "../components/OrderFlow/SideCartDrawer";
import { Toaster } from "sonner";
import { useAuthStore } from "../store";
import { isStaffUser, isSuperAdmin, isKitchenOnlyUser } from "../utils/roleUtils";

function AppLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // 1. Admin can navigate to everything in the app (do not restrict or redirect)
    if (isSuperAdmin(user)) {
      return;
    }

    // 2. Chief can navigate to only Live Kitchen
    if (isKitchenOnlyUser(user)) {
      navigate('/dashboard/live-kitchen', { replace: true });
      return;
    }

    // 3. Manager navigates to only the dashboard pages
    if (isStaffUser(user)) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-center bg-cover">
      <Navbar />
      <SideCartDrawer />
      <Toaster
        position="top-right"
        richColors
        expand={false}
        duration={3000}
      />
      {/* navbar will only be displayed on app pages */}
      <Outlet /> {/* This is where child routes will be rendered */}
      <Footer /> {/* footer will only be displayed on app pages */}
    </div>
  );
}

export default AppLayout;
