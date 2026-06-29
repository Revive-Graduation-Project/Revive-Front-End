import { FiBell } from "react-icons/fi";
import useAuthStore from "../../store/authStore";

function DashboardHeader({ title = "Dashboard", subtitle }) {
  const { user } = useAuthStore();

  const safeName = typeof user?.name === 'string' ? user.name : '';
  const safeRole = typeof user?.role === 'string' ? user.role : 'Staff';

  const firstName = safeName ? safeName.split(" ")[0] : "";
  const fullName  = safeName || "Loading...";
  const roleName  = safeRole;
  
  const initials = safeName
    ? safeName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
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
                  e.currentTarget.nextSibling.style.display = "flex";
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
