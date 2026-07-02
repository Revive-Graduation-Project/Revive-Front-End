import { Outlet, useLocation, Navigate } from "react-router-dom";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import { useDashboardRealtime } from "../hooks/dashboard/useDashboardRealtime";
import { ToastContainer } from "../components/Dashboard/shared/useToast";
import useAuthStore from "../store/authStore";

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

  const userRole = user?.role?.toLowerCase();
  const isChief = userRole === "chief" || userRole === "chef";

  // Restrict Chief to Live Kitchen only
  if (isChief && !location.pathname.includes("/live-kitchen")) {
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

      {/* Global toast notifications — renders on top of everything */}
      <ToastContainer />
    </div>
  );
}

export default DashboardLayout;
