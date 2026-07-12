import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import { useProfileStore, useAuthStore } from "../../store";
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
  const authUser = useAuthStore((state) => state.user) || {};
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Profile Not Found
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Your profile appears to have been deleted or does not exist.
          </p>
          <button
            onClick={() => useAuthStore.getState().logout()}
            className="bg-(--color-orange) hover:bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold transition cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    authUser?.fullName ||
    authUser?.name ||
    [authUser?.firstName, authUser?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Your Name";
  const avatar =
    authUser?.profilePictureUrl ||
    authUser?.avatar ||
    authUser?.photo ||
    user?.profilePictureUrl ||
    user?.avatar ||
    user?.photo ||
    "/images/avatar-placeholder.jpeg";

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
