import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import { useProfileStore } from "../../store";
import { LoadingSpinner } from "../../components";
import {
  LuClipboard,
  LuCreditCard,
  LuLogOut,
  LuTrophy,
  LuUser,
} from "react-icons/lu";
import { useShallow } from "zustand/shallow";

export default function ProfileLayout() {

  const { user, loading, error, fetchProfile } = useProfileStore(
    useShallow((state) => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      fetchProfile: state.fetchProfile,
    })),
  );

  useEffect(() => {
    let mounted = true;
    if (!user && !loading && !error) {
      fetchProfile();
    }
    return () => {
      mounted = false;
    };
  }, [user, loading, error, fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-gray-500">
        No profile data available.
      </div>
    );
  }

  const displayName = user?.name || user?.fullName || "Your Name";
  const avatar =
    user?.avatar || user?.photo || "/images/avatar-placeholder.jpeg";

  const sidebarLinks = [
    {
      to: "/profile",
      label: "Profile",
      icon: <LuUser size={20} />,
      active: false,
    },
    {
      to: "/profile/orders",
      label: "My Orders",
      icon: <LuClipboard size={20} />,
      active: false,
    },
    {
      to: "/profile/rewards",
      label: "My Rewards",
      icon: <LuTrophy size={20} />,
      active: false,
    },
    { to: "/auth/logout", label: "Log out", icon: <LuLogOut size={20} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 pt-44 pb-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <Sidebar avatar={avatar} name={displayName} links={sidebarLinks} />

        <div className="md:col-span-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
