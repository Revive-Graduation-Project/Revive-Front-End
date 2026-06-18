import { FiSearch, FiBell } from "react-icons/fi";
import useAuthStore from "../../store/authStore";

/**
 * Renders a sticky dashboard header with user profile, search functionality, and notifications.
 * @param {string} [title="Dashboard"] - The main heading text.
 * @param {string} [subtitle] - An optional greeting message; displays a personalized welcome using the user's first name if not provided.
 * @return {React.ReactElement} The dashboard header component.
 */
function DashboardHeader({ title = "Dashboard", subtitle }) {
  const { user } = useAuthStore();

  const firstName = user?.name ? user.name.split(" ")[0] : "";
  const fullName  = user?.name || "Loading...";
  const roleName  = user?.role || "Staff";
  
  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  const displaySubtitle = subtitle || (firstName ? `Hello ${firstName}, Welcome back` : "Welcome back");

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 md:px-8 py-6 bg-transparent sticky top-0 z-10 gap-4 md:gap-0">
      {/* Title + greeting */}
      <div>
        <h1 className="text-[28px] font-bold text-[#1a1a1a] m-0 tracking-tight">{title}</h1>
        <p className="text-[13px] text-gray-500 mt-1 font-medium">{displaySubtitle}</p>
      </div>

      {/* Right: search + bell + profile */}
      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-3 bg-white rounded-full px-5 py-3 shadow-sm min-w-[200px] md:min-w-[320px]">
          <FiSearch size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="border-none outline-none text-[13px] text-gray-700 bg-transparent w-full font-medium"
          />
        </div>

        <div className="flex items-center gap-5">
          {/* Bell */}
          <button
            type="button"
            className="w-[46px] h-[46px] rounded-2xl bg-white flex items-center justify-center cursor-pointer relative hover:shadow-md transition-shadow shadow-sm border-none"
          >
            <FiBell size={20} className="text-[#1a1a1a]" />
            <span className="absolute top-[12px] right-[12px] w-2 h-2 bg-orange-500 rounded-full border-[1.5px] border-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-gray-400 m-0 font-medium capitalize">{roleName.toLowerCase()}</p>
              <p className="text-[13px] font-bold text-[#1a1a1a] m-0">{fullName}</p>
            </div>
            
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-[42px] h-[42px] rounded-xl object-cover bg-white shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            
            {/* Fallback avatar */}
            <div 
              className={`${user?.avatar ? "hidden" : "flex"} w-[42px] h-[42px] rounded-xl bg-gray-800 items-center justify-center text-white font-bold text-[14px] shadow-sm tracking-widest`}
            >
              {user?.name ? initials : (
                <div className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
