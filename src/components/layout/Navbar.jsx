import { Link, NavLink } from "react-router";
import Cart from "../ui/Cart";
import SearchBar from "./SearchBar";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";
import { useAuthStore } from "../../store";

/* ─────────────────────────────────────────────
   Nav link definitions
   PUBLIC    → visible to everyone
   PROTECTED → visible only when authenticated
───────────────────────────────────────────── */
const ALL_NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/customize", label: "Customize" },
  { to: "/favorites", label: "Favorites" },
];

/**
 * Shared className resolver for NavLink — keeps active styling DRY.
 */
const navLinkClass = ({ isActive }) =>
  `${isActive ? "active-navlink text-green font-semibold" : "text-gray-600"} hover:text-green transition-colors px-3 py-2 rounded-md self-center`;

/* ─────────────────────────────────────────────
   Navbar Component
   - Reads isAuthenticated from Zustand authStore
   - Conditionally renders nav links & action button
   - Route-level protection is already handled in App.jsx
───────────────────────────────────────────── */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Read authentication state & user
  const { isAuthenticated, user } = useAuthStore();
  const userRole = user?.role?.toLowerCase();
  const isChief = userRole === "chief" || userRole === "chef";
  const isStaff = user && ["admin", "manager", "chief", "chef"].includes(userRole);

  // Dynamically include Dashboard (or Live Kitchen + Orders for Chief) if user has staff role
  const dynamicNavLinks = [
    ...ALL_NAV_LINKS,
    ...(isStaff
      ? isChief
        ? [
            { to: "/dashboard/live-kitchen", label: "Live Kitchen" },
            { to: "/dashboard/orders", label: "Orders" },
          ]
        : [{ to: "/dashboard", label: "Dashboard" }]
      : []),
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed inset-x-0 top-0 z-30 flex flex-col w-full border-b border-gray-100">
      <div className="w-full flex flex-col md:flex-row p-3 gap-y-4 justify-between items-center max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* ── Top bar: Logo · Search · Actions ── */}
        <div className="w-full flex justify-between items-center gap-x-4">
          {/* Branding */}
          <h1 className="flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <span className="branding-title text-3xl md:text-4xl font-bold text-orange tracking-tight">
                Re
              </span>
              <span className="branding-title text-3xl md:text-4xl font-bold text-green tracking-tight">
                vive
              </span>
            </Link>
          </h1>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-grow justify-center px-4 max-w-2xl">
            <SearchBar />
          </div>

          {/* Cart + Auth action */}
          <div className="flex items-center gap-x-4 md:gap-x-6 flex-shrink-0">
            <Cart />

            {isAuthenticated ? (
              /* ── Authenticated: Profile icon ── */
              <Link
                to="/profile"
                className="flex items-center gap-x-2 group"
                title="View your profile"
              >
                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-green/10 transition-colors duration-300">
                  <FaUserCircle className="text-2xl md:text-3xl text-green group-hover:scale-110 transition-transform duration-300 ease-out" />
                </div>
                <span className="text-base md:text-lg tracking-tight font-medium text-gray-700 group-hover:text-green hidden sm:block transition-colors">Profile</span>
              </Link>
            ) : (
              /* ── Guest: Login link ── */
              <Link
                to="/auth/login"
                className="flex items-center gap-x-2 group"
              >
                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-green/10 transition-colors duration-300">
                  <FaUserCircle className="text-2xl md:text-3xl text-gray-400 group-hover:text-green group-hover:scale-110 transition-all duration-300 ease-out" />
                </div>
                <span className="text-base md:text-lg tracking-tight font-medium text-gray-600 group-hover:text-green hidden sm:block transition-colors">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="w-full md:hidden flex justify-center">
          <SearchBar />
        </div>
      </div>

      {/* ── Nav links (collapsible on mobile) ── */}
      <div
        className={`${
          !isOpen ? "max-h-0 opacity-0" : "max-h-[400px] opacity-100"
        } md:max-h-screen md:opacity-100 overflow-hidden transition-all duration-500 ease-in-out w-full`}
      >
        <div className="flex flex-col md:flex-row items-center justify-center md:gap-x-8 lg:gap-x-12 text-base md:text-lg font-medium text-gray-700 py-4 md:py-3 border-t border-gray-100 max-w-7xl mx-auto">
          {dynamicNavLinks.map(({ to, label }) => (
            <NavLink key={to} className={navLinkClass} to={to}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* ── Mobile hamburger toggle ── */}
      <button
        className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 md:hidden flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm z-40"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        <MdOutlineKeyboardArrowDown className={`text-2xl text-green transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </nav>
  );
}

export default Navbar;
