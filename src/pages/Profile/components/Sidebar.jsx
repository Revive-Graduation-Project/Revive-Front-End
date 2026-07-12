import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuthStore } from "../../../store";

export default function Sidebar({ avatar, name, links = [] }) {
  return (
    <aside className="md:col-span-4">
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: "#ff9b00" }}>
        <div className="text-center text-white relative">
          <div className="w-28 h-28 rounded-full mx-auto mt-10 overflow-hidden border-4 border-white bg-white">
            <img src={avatar} alt="avatar" className="object-cover w-full h-full" />
          </div>
          <h3 className="mt-6 font-semibold text-lg text-black">{name}</h3>
        </div>

        <div className="p-6 bg-transparent text-black">
          <ul className="space-y-4">
            {links.map((item, idx) => {
              const isLogout = item.to === "/auth/logout" || item.label?.toLowerCase?.() === "log out";
              return (
                <li key={item.to || idx} className={`flex items-center gap-3`}>
                  {item.icon ? <span>{item.icon}</span> : null}
                  {isLogout ? (
                    <LogoutButton label={item.label} />
                  ) : item.to ? (
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        ` ${isActive ? "font-semibold text-green-700" : "text-black hover:text-gray-700 transition-colors"}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    <span className="text-black">{item.label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}

function LogoutButton({ label = "Log out" }) {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout(true);
    navigate("/auth/login");
  };

  return (
    <button onClick={handleLogout} className="text-black cursor-pointer hover:text-gray-700 transition-colors">
      {label}
    </button>
  );
}
