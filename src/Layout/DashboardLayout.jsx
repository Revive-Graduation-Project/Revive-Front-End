import { Outlet, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import { useDashboardRealtime } from "../hooks/dashboard/useDashboardRealtime";
import { useAuthStore } from "../store";
import { isKitchenOnlyUser } from "../utils/roleUtils";

/**
 * DashboardLayout
 * Full-screen staff dashboard shell.
 * No customer Navbar/Footer — completely separate from AppLayout.
 * ToastContainer is mounted here so toasts appear globally across all dashboard pages.
 */
function DashboardLayout() {
  // Initialize real-time WebSocket connection for all dashboard views
  useDashboardRealtime();
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const isChief = isKitchenOnlyUser(user);

  // Restrict Chief to Live Kitchen and Orders only
  const isAllowedForChief = location.pathname.includes("/live-kitchen") || location.pathname.includes("/orders");
  if (isChief && !isAllowedForChief) {
    return <Navigate to="/dashboard/live-kitchen" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#f5ecdc]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Fixed left sidebar */}
      <DashboardSidebar />

      {/* Scrollable main content */}
      <main className="flex-1 overflow-y-auto" style={{ marginLeft: "240px" }}>
        <Outlet />
      </main>

      <Toaster position="top-right" richColors expand={false} duration={3000} style={{ zIndex: 99999 }} />
    </div>
  );
}

export default DashboardLayout;
