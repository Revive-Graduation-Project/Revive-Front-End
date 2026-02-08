import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";
function AppLayout() {
  return (
    <div className="min-h-screen  bg-center bg-cover">
      <Navbar />
      {/* navbar will only be displayed on app pages */}
      <Outlet /> {/* This is where child routes will be rendered */}
    </div>
  );
}

export default AppLayout;
