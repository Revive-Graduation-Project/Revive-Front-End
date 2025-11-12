import { Link, NavLink } from "react-router";
import Cart from "./Cart";
import SearchBar from "./SearchBar";
import { FaUserCircle } from "react-icons/fa";
import Login from "../pages/auth/Login";

function Navbar() {
  return (
    <nav className="bg-[#FFFBF4CC] fixed inset-x-0 z-10 flex flex-wrap p-2">
      <div className="w-full flex justify-around items-center">
        <h1 className="grow text-center">
          <span className="branding-title text-orange">Re</span>
          <span className="branding-title text-green">vive</span>
        </h1>
        <SearchBar />
        <div className="flex justify-center gap-x-3 grow">
          <Cart />
          <Link
            to="/auth/login"
            className="text-green flex items-center gap-x-2 hover:text-green-800 group"
          >
            <FaUserCircle className="text-2xl transform group-hover:rotate-360 duration-500" />
            <span className="text-xl tracking-tight">Login</span>
          </Link>
        </div>
      </div>
      <div className="w-full">
        <div className="roboto flex justify-center gap-x-28 text-xl text-gray-800">
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "active-navlink" : ""} hover:text-green p-2`
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "active-navlink" : ""} hover:text-green p-2`
            }
            to="/menu"
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "active-navlink" : ""} hover:text-green p-2`
            }
            to="/customize"
          >
            Customize
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "active-navlink" : ""} hover:text-green p-2`
            }
            to="/contact"
          >
            Contact Us
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${isActive ? "active-navlink" : ""} hover:text-green p-2`
            }
            to="/about"
          >
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
