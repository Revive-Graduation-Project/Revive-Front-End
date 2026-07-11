import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdOutlineMenuBook,
  MdOutlineKitchen,
  MdListAlt,
  MdOutlineSetMeal,
} from "react-icons/md";
import { FiShoppingBag, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "../../store";
import { isKitchenOnlyUser } from "../../utils/roleUtils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: MdDashboard, end: true },
  { to: "/dashboard/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/dashboard/recipe-builder", label: "Recipe Builder", icon: MdRestaurantMenu },
  { to: "/dashboard/chef-menu", label: "Menu", icon: MdOutlineMenuBook },
  { to: "/dashboard/live-kitchen", label: "Live Kitchen", icon: MdOutlineKitchen },
  { to: "/dashboard/menu-management", label: "Menu Management", icon: MdListAlt },
  { to: "/dashboard/ingredients", label: "Ingredients", icon: MdOutlineSetMeal },
];

function DashboardSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isChief = isKitchenOnlyUser(user);

  const visibleNavItems = isChief
    ? navItems.filter((item) => item.to === "/dashboard/live-kitchen" || item.to === "/dashboard/orders")
    : navItems;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-[240px] fixed top-0 left-0 h-screen bg-white shadow-[2px_0_12px_rgba(0,0,0,0.06)] flex flex-col z-50 overflow-y-auto">

      {/* Logo */}
      <div className="px-6 pt-7 pb-5 text-center">
        <NavLink to={isChief ? "/dashboard/live-kitchen" : "/dashboard"} className="no-underline inline-block">
          <span className="text-3xl font-bold text-orange-500">Re</span>
          <span className="text-3xl font-bold text-green-600">vive</span>
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
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-[11px] rounded-[16px] no-underline text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#FDF4E7] text-orange-500 font-semibold"
                      : "text-gray-500 font-medium hover:bg-orange-50 hover:text-orange-500"
                  }`
                }
              >
                <Icon size={18} />
                <span>{label}</span>
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
          className="w-full flex items-center gap-3 px-4 py-[11px] rounded-xl bg-transparent border-none text-red-500 font-semibold text-sm cursor-pointer hover:bg-red-50 transition-colors"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default DashboardSidebar;
