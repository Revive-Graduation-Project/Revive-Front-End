import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import { useDashboardRealtime } from "../hooks/dashboard/useDashboardRealtime";
import { ToastContainer } from "../components/Dashboard/shared/useToast";

/**
 * Renders the staff dashboard shell with a fixed sidebar, scrollable content area, and global toast notifications.
 * Initializes the dashboard real-time connection for all views.
 */
function DashboardLayout() {
  // Initialize real-time WebSocket connection for all dashboard views
  useDashboardRealtime();

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
