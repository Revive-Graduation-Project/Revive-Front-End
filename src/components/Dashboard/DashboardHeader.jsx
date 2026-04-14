import { FiSearch, FiBell } from "react-icons/fi";
import chefLogo from "../../../public/images/chef-avatar.png";

function DashboardHeader({ title = "Dashboard", subtitle = "Hello Basmala, Welcome back" }) {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-[#FFF8F0] border-b border-[#FFE8CC] sticky top-0 z-10">
      {/* Title + greeting */}
      <div>
        <h1 className="text-[22px] font-bold text-[#1a1a1a] m-0">{title}</h1>
        <p className="text-[13px] text-gray-400 mt-0.5 font-normal">{subtitle}</p>
      </div>

      {/* Right: search + bell + profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5">
          <FiSearch size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="border-none outline-none text-[13px] text-gray-700 bg-transparent w-40"
          />
        </div>

        {/* Bell */}
        <button
          type="button"
          onClick={() => alert("Notifications coming soon!")}
          className="w-[38px] h-[38px] rounded-xl bg-white border border-gray-200 flex items-center justify-center cursor-pointer relative hover:border-orange-300 transition-colors"
        >
          <FiBell size={16} className="text-gray-500" />
          <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] bg-orange-500 rounded-full border-[1.5px] border-[#FFF8F0]" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <p className="text-[13px] font-semibold text-[#1a1a1a] m-0">Chef Marc</p>
            <p className="text-[11px] text-gray-400 m-0">Head Curator</p>
          </div>
          <img
            src={chefLogo}
            alt="Chef Profile"
            className="w-[38px] h-[38px] rounded-full object-cover border-2 border-orange-500 bg-white"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback avatar */}
          <div className="hidden w-[38px] h-[38px] rounded-full bg-linear-to-br from-orange-500 to-orange-400 items-center justify-center text-white font-bold text-sm">
            CM
          </div>
          </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
