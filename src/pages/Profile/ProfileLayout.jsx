import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import { useAuthStore, useProfileStore } from "../../store";
import { LoadingSpinner } from "../../components";
import {
  LuClipboard,
  LuLogOut,
  LuTrophy,
  LuUser,
} from "react-icons/lu";
import { useShallow } from "zustand/shallow";

export default function ProfileLayout() {
  const authUser = useAuthStore((state) => state.user);
  const { user, loading, error, fetchProfile } = useProfileStore(
    useShallow((state) => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      fetchProfile: state.fetchProfile,
    })),
  );

  useEffect(() => {
    if (!authUser?.id) return;
    if (!user && !loading && !error) {
      fetchProfile(authUser.id);
    }
  }, [user, loading, error, fetchProfile, authUser?.id]);

  // Only show the full-page spinner while there's no profile data yet
  // (the initial fetch). Once `user` exists, subsequent actions
  // (uploadPicture, deletePicture, updateUserProfile) also flip
  // `loading` true/false — but we don't want those to unmount the
  // whole layout (and with it, Sidebar's local preview state) every
  // time. Sidebar/other children handle their own in-flight UI for
  // those actions instead.
  if (loading && !user) {
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
        <Sidebar links={sidebarLinks} />

        <div className="md:col-span-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}