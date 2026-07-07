import { useState, useEffect } from "react";
import { FiBell, FiCheckCircle, FiAlertCircle, FiClock, FiInfo, FiCheck, FiTrash2, FiFilter } from "react-icons/fi";
import DashboardHeader from "./DashboardHeader";
import useUIStore, { formatNotificationTime, getNotificationGroup } from "../../store/uiStore";

function NotificationsView() {
  const { notifications = [], markAllAsRead, markAsRead, removeNotification, clearNotifications } = useUIStore();
  const [activeTab, setActiveTab] = useState("All");
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.read;
    return n.category === activeTab;
  });

  // Group notifications dynamically by timestamp (e.g., "Today", "Yesterday", "Earlier")
  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    const groupName = getNotificationGroup(notif);
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(notif);
    return acc;
  }, {});

  const getNotifIcon = (type) => {
    switch (type) {
      case "critical":
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
            <FiAlertCircle size={22} />
          </div>
        );
      case "success":
        return (
          <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shrink-0 shadow-xs">
            <FiCheckCircle size={22} />
          </div>
        );
      case "warning":
        return (
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-xs">
            <FiClock size={22} />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
            <FiInfo size={22} />
          </div>
        );
    }
  };

  const getCardBorder = (type, isRead) => {
    const base = "border-l-[6px] transition-all duration-200";
    if (type === "critical") return `${base} border-l-red-500 ${!isRead ? "bg-red-50/30 border-red-100" : "bg-white border-gray-100"}`;
    if (type === "success")  return `${base} border-l-green-500 ${!isRead ? "bg-green-50/30 border-green-100" : "bg-white border-gray-100"}`;
    if (type === "warning")  return `${base} border-l-orange-400 ${!isRead ? "bg-orange-50/30 border-orange-100" : "bg-white border-gray-100"}`;
    return `${base} border-l-blue-500 ${!isRead ? "bg-blue-50/30 border-blue-100" : "bg-white border-gray-100"}`;
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "Inventory":   return "bg-purple-100 text-purple-700";
      case "Performance": return "bg-green-100 text-green-700";
      case "Orders":      return "bg-orange-100 text-orange-700";
      default:            return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Notifications"
        subtitle="Track system alerts, order updates, and inventory warnings in real-time."
      />

      <div className="flex flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["All", "Unread", "Inventory", "Orders", "Performance"].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl font-bold text-[13px] transition-all cursor-pointer whitespace-nowrap border-none flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                  {tab === "Unread" && unreadCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[11px] ${isActive ? "bg-white text-orange-600" : "bg-orange-100 text-orange-600"}`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[13px] font-bold transition-all flex items-center gap-1.5 border-none cursor-pointer"
              >
                <FiCheck size={16} /> Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="px-3.5 py-2 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl text-[13px] font-bold transition-all flex items-center gap-1.5 border-none cursor-pointer"
              >
                <FiTrash2 size={15} /> Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications Groups */}
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <FiBell size={28} />
            </div>
            <h3 className="text-[18px] font-bold text-[#1a1a1a] m-0">No notifications found</h3>
            <p className="text-[13px] text-gray-500 mt-1 max-w-sm">
              You don't have any notifications in the "{activeTab}" category right now.
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([groupName, items]) => (
            <div key={groupName} className="flex flex-col gap-3">
              {/* Group Heading */}
              <div className="flex items-center gap-2 pl-2">
                <span className="text-[14px] font-extrabold text-gray-500 uppercase tracking-wider">
                  {groupName}
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                {items.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif.id);
                    }}
                    className={`rounded-2xl p-5 shadow-xs hover:shadow-md border flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative overflow-hidden group ${getCardBorder(
                      notif.type,
                      notif.read
                    )}`}
                  >
                    {/* Left: Icon & Content */}
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      {getNotifIcon(notif.type)}

                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[16px] font-bold text-[#1a1a1a]">
                            {notif.title}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase ${getCategoryBadge(
                              notif.category
                            )}`}
                          >
                            {notif.category || "System"}
                          </span>
                          {!notif.read && (
                            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                          )}
                        </div>

                        <p className="text-[13.5px] text-gray-600 m-0 leading-relaxed font-normal">
                          {notif.message}
                        </p>
                      </div>
                    </div>

                    {/* Right: Timestamp & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 sm:border-none">
                      <span className="text-[12px] font-bold text-gray-400">
                        {formatNotificationTime(notif)}
                      </span>

                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notif.id);
                            }}
                            title="Mark as read"
                            className="p-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors border-none cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                          >
                            <FiCheck size={13} /> Mark read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif.id);
                          }}
                          title="Delete notification"
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors border-none cursor-pointer bg-transparent sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsView;
