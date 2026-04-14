const roleColors = {
  "Inventory Manager": "bg-orange-50 text-orange-500",
  "Kitchen Admin":     "bg-sky-50 text-sky-600",
  Receptionist:        "bg-green-50 text-green-600",
};

function RecentActivity({ data }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)] h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Recent Activity</h3>
        <button
          type="button"
          onClick={() => alert("More options coming soon!")}
          className="bg-transparent border-none cursor-pointer text-gray-400 text-lg leading-none hover:text-gray-600 transition-colors"
        >
          ···
        </button>
      </div>

      <div className="flex flex-col">
        {data.map((item, index) => {
          const roleStyle = roleColors[item.role] || "bg-gray-100 text-gray-500";
          return (
            <div key={item.id} className="flex gap-3 pb-4 relative">
              {/* Timeline line */}
              {index < data.length - 1 && (
                <div className="absolute left-[18px] top-9 bottom-0 w-px bg-gray-100" />
              )}

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0 z-1">
                {item.avatar}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[13px] font-semibold text-[#1a1a1a]">{item.user}</span>
                  <span className={`text-[10px] font-semibold rounded-md px-1.5 py-0.5 ${roleStyle}`}>
                    {item.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-0.5 leading-snug">{item.action}</p>
                <span className="text-[11px] text-gray-400">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivity;
