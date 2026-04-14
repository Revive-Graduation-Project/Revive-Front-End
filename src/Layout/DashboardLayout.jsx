import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

/**
 * DashboardLayout
 * Full-screen staff dashboard shell.
 * No customer Navbar/Footer — completely separate from AppLayout.
 */
function DashboardLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: "#FFF8F0", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Fixed left sidebar */}
      <DashboardSidebar />

      {/* Scrollable main content */}
      <main className="flex-1 overflow-y-auto" style={{ marginLeft: "240px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
