import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdOutlineMenuBook,
  MdOutlineKitchen,
  MdListAlt,
  MdOutlineSetMeal,
} from "react-icons/md";
import { FiShoppingBag, FiLogOut, FiUsers } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import { isKitchenOnlyUser, isAdminUser, isSuperAdmin } from "../../utils/roleUtils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: MdDashboard, end: true },
  { to: "/dashboard/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/dashboard/recipe-builder", label: "Recipe Builder", icon: MdRestaurantMenu },
  { to: "/dashboard/chef-menu", label: "Menu", icon: MdOutlineMenuBook },
  { to: "/dashboard/live-kitchen", label: "Live Kitchen", icon: MdOutlineKitchen },
  { to: "/dashboard/menu-management", label: "Menu Management", icon: MdListAlt },
  { to: "/dashboard/ingredients", label: "Ingredients", icon: MdOutlineSetMeal },
  { to: "/dashboard/staff-management", label: "Staff Management", icon: FiUsers },
];

function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isChief = isKitchenOnlyUser(user);
  const isSuper = isSuperAdmin(user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsDrawerOpen((prev) => !prev);
    window.addEventListener("toggle-dashboard-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-dashboard-sidebar", handleToggle);
  }, []);

  let visibleNavItems = navItems;
  if (isChief) {
    visibleNavItems = navItems.filter((item) => item.to === "/dashboard/live-kitchen");
  } else if (isSuper) {
    visibleNavItems = [
      ...navItems,
      { to: "/", label: "Customer App", icon: MdRestaurantMenu, end: true },
    ];
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isCompactRail = !isDrawerOpen;

  return (
    <>
      {/* Overlay Backdrop for tablet/mobile drawer mode */}
      {isDrawerOpen && (
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-[2px_0_12px_rgba(0,0,0,0.06)] flex flex-col z-50 overflow-y-auto transition-all duration-300 ${
          isDrawerOpen
            ? "translate-x-0 w-[240px]"
            : "-translate-x-full md:translate-x-0 md:w-[76px] lg:w-[240px]"
        }`}
      >
        {/* Logo */}
        <div className={`pt-7 pb-5 text-center ${isCompactRail ? "px-2 lg:px-6" : "px-6"}`}>
          <NavLink
            to={isChief ? "/dashboard/live-kitchen" : "/dashboard"}
            onClick={() => setIsDrawerOpen(false)}
            className="no-underline inline-block"
          >
            {isCompactRail ? (
              <>
                <span className="text-3xl font-bold text-orange-500 md:inline lg:hidden">Re</span>
                <span className="text-3xl font-bold text-orange-500 hidden lg:inline">Re</span>
                <span className="text-3xl font-bold text-green-600 hidden lg:inline">vive</span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold text-orange-500">Re</span>
                <span className="text-3xl font-bold text-green-600">vive</span>
              </>
            )}
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
          <ul className="list-none m-0 p-0 flex flex-col gap-1">
            {visibleNavItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setIsDrawerOpen(false)}
                  title={label}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-[11px] rounded-[16px] no-underline text-sm transition-all duration-200 ${
                      isCompactRail ? "justify-center lg:justify-start px-2 lg:px-4" : "px-4"
                    } ${
                      isActive
                        ? "bg-[#FDF4E7] text-orange-500 font-semibold"
                        : "text-gray-500 font-medium hover:bg-orange-50 hover:text-orange-500"
                    }`
                  }
                >
                  <Icon size={20} className="shrink-0" />
                  <span className={`truncate ${isCompactRail ? "hidden lg:inline" : "inline"}`}>
                    {label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6 mt-4">
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`w-full flex items-center gap-3 py-[11px] rounded-xl bg-transparent border-none text-red-500 font-semibold text-sm cursor-pointer hover:bg-red-50 transition-colors ${
              isCompactRail ? "justify-center lg:justify-start px-2 lg:px-4" : "px-4"
            }`}
          >
            <FiLogOut size={20} className="shrink-0" />
            <span className={`${isCompactRail ? "hidden lg:inline" : "inline"}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default DashboardSidebar;
