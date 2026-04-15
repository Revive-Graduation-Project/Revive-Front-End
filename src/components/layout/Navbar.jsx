import { Link, NavLink } from "react-router";
import Cart from "../UI/Cart";
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
// All nav links are always visible — access control is handled at the route level by ProtectedRoute
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
  `${isActive ? "active-navlink" : ""} hover:text-green p-2 self-start`;

/* ─────────────────────────────────────────────
   Navbar Component
   - Reads isAuthenticated from Zustand authStore
   - Conditionally renders nav links & action button
   - Route-level protection is already handled in App.jsx
   - "More" dropdown links to home-page section anchors
───────────────────────────────────────────── */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Read authentication state — used only for Login vs Profile button
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <nav className="bg-gray-50 fixed inset-x-0 z-10 flex flex-wrap p-3 gap-y-3">

      {/* ── Top bar: Logo · Search · Actions ── */}
      <div className="w-full flex flex-wrap p-3 gap-y-2 justify-around items-center">

        {/* Branding */}
        <h1 className="grow text-center">
          <Link to="/">
            <span className="branding-title text-3xl md:text-4xl text-(--color-orange)">
              Re
            </span>
            <span className="branding-title text-3xl md:text-4xl text-(--color-green)">
              vive
            </span>
          </Link>
        </h1>

        <SearchBar />

        {/* Cart + Auth action */}
        <div className="flex items-center justify-center gap-x-4 grow order-2 md:order-3">
          <Cart />

          {isAuthenticated ? (
            /* ── Authenticated: Profile icon ── */
            <Link
              to="/profile"
              className="text-(--color-green) flex items-center gap-x-2 group transition-colors"
              title="View your profile"
            >
              <FaUserCircle className="text-3xl transform group-hover:rotate-360 duration-500" />
              <span className="text-xl tracking-tight font-medium">Profile</span>
            </Link>
          ) : (
            /* ── Guest: Login link ── */
            <Link
              to="/auth/login"
              className="text-(--color-green) flex items-center gap-x-2 group transition-colors"
            >
              <FaUserCircle className="text-3xl transform group-hover:rotate-360 duration-500" />
              <span className="text-xl tracking-tight font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Nav links (collapsible on mobile) ──
          overflow-hidden drives the max-h collapse animation on mobile.
          md:overflow-visible lets the absolute "More" dropdown escape
          the container on desktop without being clipped.               */}
      <div
        className={`${
          !isOpen ? "max-h-0" : "max-h-screen"
        } md:max-h-screen overflow-hidden md:overflow-visible transition-all duration-500 ease-in-out w-full`}
      >
        <div className="flex flex-col text-lg md:flex-row md:justify-center md:gap-x-14 lg:gap-x-28 md:text-xl text-gray-800">

          {/* Nav links — shown to all users; ProtectedRoute guards access at page level */}
          {ALL_NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} className={navLinkClass} to={to}>
              {label}
            </NavLink>
          ))}

          {/* ── More Dropdown ── */}
          <div className="relative self-start">
            <button
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`${
                isMoreOpen ? "active-navlink" : ""
              } hover:text-green p-2 flex items-center gap-1 cursor-pointer`}
              aria-haspopup="true"
              aria-expanded={isMoreOpen}
            >
              More
              <MdOutlineKeyboardArrowDown
                className={`text-xl text-green transition-transform duration-300 ${
                  isMoreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown panel */}
            <div
              className={`${
                isMoreOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden transition-all duration-300 ease-in-out
                md:absolute md:left-0 md:top-full md:mt-1
                md:bg-white md:rounded-xl md:shadow-lg md:border md:border-gray-100 md:min-w-[200px]`}
            >
              {/* change it later */}
              <span className="block px-4 py-3 text-gray-400 italic text-base">
                this contains secondary sections
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Mobile hamburger toggle ── */}
      <button
        className="absolute left-1/2 transform -translate-x-1/2 -bottom-3.5 md:hidden flex items-center gap-x-1 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        <MdOutlineKeyboardArrowDown className="text-2xl text-green" />
      </button>
    </nav>
  );
}

export default Navbar;
