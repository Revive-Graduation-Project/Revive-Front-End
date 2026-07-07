import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiCheckCircle, FiAlertCircle, FiClock, FiInfo, FiCheck } from "react-icons/fi";
import { useAuthStore, useProfileStore, useUIStore } from "../../store";
import { formatNotificationTime } from "../../store/uiStore";

function DashboardHeader({ title = "Dashboard", subtitle }) {
  const { user: authUser } = useAuthStore();
  const { user: profileUser, fetchProfile } = useProfileStore();
  const { notifications = [], markAllAsRead, markAsRead } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileUser) {
      fetchProfile();
    }
  }, [profileUser, fetchProfile]);

  const user = profileUser || authUser;
  const avatarSrc = user?.avatar || user?.photo || user?.profileImage || user?.imageUrl || "/images/chef-avatar.png";
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rawName = 
    profileUser?.name || 
    profileUser?.fullName || 
    (profileUser?.firstName || profileUser?.lastName ? `${profileUser?.firstName || ""} ${profileUser?.lastName || ""}`.trim() : "") ||
    authUser?.name || 
    authUser?.fullName || 
    (authUser?.firstName || authUser?.lastName ? `${authUser?.firstName || ""} ${authUser?.lastName || ""}`.trim() : "") ||
    authUser?.username ||
    authUser?.email?.split("@")[0] ||
    "Chef Admin";

  const safeName = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : 'Chef Admin';
  const safeRole = typeof user?.role === 'string' && user.role ? user.role : 'Staff';

  const firstName = safeName.split(" ")[0];
  const fullName  = safeName;
  const roleName  = safeRole;
  
  const initials = safeName
    ? safeName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  const displaySubtitle = subtitle 
    ? subtitle 
    : firstName 
      ? `Welcome back, ${firstName}! Here's what's happening in your restaurant today.`
      : `Here's what's happening in your restaurant today.`;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case "critical": return <FiAlertCircle className="text-red-500 shrink-0" size={16} />;
      case "success":  return <FiCheckCircle className="text-green-500 shrink-0" size={16} />;
      case "warning":  return <FiClock className="text-orange-500 shrink-0" size={16} />;
      default:         return <FiInfo className="text-blue-500 shrink-0" size={16} />;
    }
  };

  const getNotifBarColor = (type) => {
    switch (type) {
      case "critical": return "border-l-4 border-red-500 bg-red-50/40";
      case "success":  return "border-l-4 border-green-500 bg-green-50/40";
      case "warning":  return "border-l-4 border-orange-500 bg-orange-50/40";
      default:         return "border-l-4 border-blue-500 bg-blue-50/40";
    }
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-6 bg-transparent sticky top-0 z-100   gap-4 md:gap-0">
      {/* Title + greeting */}
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] m-0 tracking-tight">{title}</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">{displaySubtitle}</p>
      </div>

      {/* Right: bell + profile */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-5 relative" ref={dropdownRef}>
          {/* Bell button */}
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-[46px] h-[46px] rounded-2xl bg-white flex items-center justify-center cursor-pointer relative hover:shadow-md transition-all shadow-sm border border-gray-100"
            aria-label="Notifications"
          >
            <FiBell size={20} className="text-[#1a1a1a]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-orange-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {showDropdown && (
            <div className="absolute right-0 top-[56px] w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Popover Header */}
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-[#1a1a1a]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-orange-100 text-orange-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[12px] font-semibold text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors bg-transparent border-none cursor-pointer p-0"
                  >
                    <FiCheck size={13} /> Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50 flex flex-col">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-[13px] font-medium">
                    No notifications right now
                  </div>
                ) : (
                  notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-3.5 transition-colors cursor-pointer hover:bg-gray-50 flex flex-col gap-1 ${getNotifBarColor(notif.type)} ${!notif.read ? "font-medium" : "opacity-75"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {getNotifIcon(notif.type)}
                          <span className="text-[13px] font-bold text-[#1a1a1a] truncate">
                            {notif.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                          {formatNotificationTime(notif)}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-600 line-clamp-2 m-0 leading-relaxed pl-5">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Popover Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/80 text-center">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/dashboard/notifications");
                  }}
                  className="w-full py-2 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm cursor-pointer border-none"
                >
                  See full notifications
                </button>
              </div>
            </div>
          )}

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-400 m-0 font-medium capitalize">{roleName.toLowerCase()}</p>
              <p className="text-[13px] font-bold text-[#1a1a1a] m-0">{fullName}</p>
            </div>
            
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-[42px] h-[42px] rounded-xl object-cover bg-white shadow-sm border border-gray-100"
              onError={(e) => {
                if (!e.currentTarget.src.endsWith("/images/chef-avatar.png")) {
                  e.currentTarget.src = "/images/chef-avatar.png";
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
