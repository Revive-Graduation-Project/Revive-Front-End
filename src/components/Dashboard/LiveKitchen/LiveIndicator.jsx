import { FiRefreshCw } from "react-icons/fi";

export function LiveIndicator({ title = "Live Kitchen", isFetching, error, onRefresh }) {
  return (
    <div className="bg-[#F5F6F8] rounded-xl px-6 py-3 shadow-sm relative flex items-center justify-center min-h-[48px]">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${error ? "bg-amber-500" : "bg-emerald-500 animate-pulse"} shadow-sm`} />
        <span className="text-[16px] font-medium text-[#1a1a1a] uppercase tracking-wider">
          {error ? "Live Kitchen (Offline / Reconnecting...)" : title}
        </span>
      </div>
      <div className="absolute right-6">
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-orange-500 hover:text-orange-600 cursor-pointer transition-colors border-none bg-transparent"
        >
          <FiRefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
    </div>
  );
}
