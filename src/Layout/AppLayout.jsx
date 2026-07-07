import React from 'react';
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";
import SideCartDrawer from "../components/OrderFlow/SideCartDrawer";
import { Toaster } from "sonner";

function AppLayout() {
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
