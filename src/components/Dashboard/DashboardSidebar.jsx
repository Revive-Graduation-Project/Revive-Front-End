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
import { HiSparkles } from "react-icons/hi2";
import useAuthStore from "../../store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: MdDashboard, end: true },
  { to: "/dashboard/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/dashboard/recipe-builder", label: "Recipe Builder", icon: MdRestaurantMenu },
  { to: "/dashboard/chef-menu", label: "Menu", icon: MdOutlineMenuBook },
  { to: "/dashboard/live-kitchen", label: "Live Kitchen", icon: MdOutlineKitchen },
  { to: "/dashboard/menu-management", label: "Menu Management", icon: MdListAlt },
  { to: "/dashboard/ingredients", label: "Ingredients", icon: MdOutlineSetMeal },
];

/**
 * Renders the dashboard sidebar with navigation links, an AI Intelligence card, and logout functionality.
 */
function DashboardSidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-[240px] fixed top-0 left-0 h-screen bg-white shadow-[2px_0_12px_rgba(0,0,0,0.06)] flex flex-col z-50 overflow-y-auto">

      {/* Logo */}
      <div className="px-6 pt-7 pb-5 text-center">
        <NavLink to="/dashboard" className="no-underline inline-block">
          <span className="text-3xl font-bold text-orange-500">Re</span>
          <span className="text-3xl font-bold text-green-600">vive</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        <ul className="list-none m-0 p-0 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
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

      {/* AI Intelligence Card */}
      <div className="px-3 pb-4 mt-auto">
        <div className="bg-linear-to-br from-[#1a3a2a] to-[#2d5a3d] rounded-2xl p-[18px] relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full bg-white/5" />

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-green-300/15 border border-green-300/30 rounded-full px-2.5 py-0.5 mb-2.5">
            <HiSparkles size={12} className="text-green-300" />
            <span className="text-[11px] text-green-300 font-semibold tracking-wide uppercase">AI Intelligence</span>
          </div>

          <p className="text-white text-[13px] font-bold mb-1.5 leading-snug">
            Refine the Avocado Glow Bowl?
          </p>
          <p className="text-amber-400 text-[11px] mb-3.5 leading-relaxed font-medium">
            Supply costs for hass avocados are up 12%. Suggest swapping for regional sunflower-hummus base to maintain 45% margin.
          </p>

          <button
            type="button"
            onClick={() => alert("Optimization logic applied!")}
            className="w-full bg-white text-[#1a3a2a] rounded-2xl text-xs font-bold py-2 px-3 cursor-pointer hover:bg-green-50 transition-colors shadow-sm border-none"
          >
            <div>Apply</div> 
            Optimization
          </button>
        </div>
      </div>

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
