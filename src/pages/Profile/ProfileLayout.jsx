import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import { useProfileStore } from "../../store";
import { LoadingSpinner } from "../../components";
import { LuClipboard, LuCreditCard, LuLogOut, LuTrophy, LuUser } from "react-icons/lu";

export default function ProfileLayout() {
  const user = useProfileStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const fetchProfile = useProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setLoading(true);
      fetchProfile()
        .catch(() => {})
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const displayName = user?.name || user?.fullName || "Your Name";
  const avatar = user?.avatar || user?.photo || "/images/avatar-placeholder.jpeg";

  const sidebarLinks = [
    { to: "/profile", label: "Profile", icon: <LuUser size={20} />, active: false },
    { to: "/profile/orders", label: "My Orders", icon: <LuClipboard size={20} />, active: false },
    { to: "/profile/rewards", label: "My Rewards", icon: <LuTrophy size={20} />, active: false },
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
