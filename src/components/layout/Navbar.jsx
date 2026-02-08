import { Link, NavLink } from "react-router";
import Cart from "../ui/Cart";
import SearchBar from "./SearchBar";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-[#FFFBF4CC] fixed inset-x-0 z-10 flex flex-wrap p-3 gap-y-3">
      <div className="w-full flex flex-wrap p-3 gap-y-2 justify-around items-center">
        <h1 className="grow text-center">
          <Link to="/home">
            <span className="branding-title text-3xl md:text-4xl text-orange">
              Re
            </span>
            <span className="branding-title text-3xl md:text-4xl text-green">
              vive
            </span>
          </Link>
        </h1>
        <SearchBar />
        <div className="flex justify-center gap-x-3 grow order-2 md:order-3">
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
      <div
        className={`${
          !isOpen ? "max-h-0" : "max-h-96"
        } md:max-h-96 overflow-hidden transition-all duration-500 ease-in-out w-full`}
      >
        <div className="flex flex-col text-lg md:flex-row md:justify-center md:gap-x-14 lg:gap-x-28 md:text-xl text-gray-800">
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "active-navlink" : ""
              } hover:text-green p-2 self-start`
            }
            to="/home"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "active-navlink" : ""
              } hover:text-green p-2 self-start`
            }
            to="/menu"
          >
            Menu
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "active-navlink" : ""
              } hover:text-green p-2 self-start`
            }
            to="/customize"
          >
            Customize
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "active-navlink" : ""
              } hover:text-green p-2 self-start`
            }
            to="/contact"
          >
            Contact Us
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${
                isActive ? "active-navlink" : ""
              } hover:text-green p-2 self-start`
            }
            to="/about"
          >
            About
          </NavLink>
        </div>
      </div>
      <button
        className="absolute left-1/2 transform -translate-x-1/2 -bottom-3.5 md:hidden flex items-center gap-x-1 cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <MdOutlineKeyboardArrowDown className="text-2xl text-green" />
      </button>
    </nav>
  );
}

export default Navbar;
