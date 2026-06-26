import { FiFileText, FiList, FiCalendar } from "react-icons/fi";

const roleIcons = {
  "Inventory Manager": <FiFileText size={16} className="text-[#F97316]" />,
  "Kitchen Admin":     <FiList size={16} className="text-[#F97316]" />,
  Receptionist:        <FiCalendar size={16} className="text-[#F97316]" />,
};

function RecentActivity({ data }) {
  return (
    <div className="bg-white rounded-3xl px-6 py-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[14px] font-bold text-[#1a1a1a] m-0">Recent Activity</h3>
        <button
          type="button"
          className="bg-transparent border-none cursor-pointer text-gray-400 text-[16px] font-bold leading-none hover:text-gray-600 transition-colors"
        >
          •••
        </button>
      </div>

      <div className="flex flex-col flex-1">
        {data.map((item, index) => {
          const Icon = roleIcons[item.role] || <FiFileText size={16} className="text-[#F97316]" />;
          return (
            <div key={item.id} className="flex gap-4 pb-5 relative">
              {/* Timeline line */}
              {index < data.length - 1 && (
                <div className="absolute left-[21px] top-11 bottom-[-4px] w-px border-l-2 border-dotted border-[#D1D5DB]" />
              )}

              {/* Icon Box */}
              <div className="w-[42px] h-[42px] rounded-xl bg-[#FFF7ED] flex items-center justify-center shrink-0 z-10">
                {Icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[13px] font-bold text-[#1a1a1a]">{item.user}</span>
                  <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 whitespace-nowrap bg-white border border-gray-200 text-gray-500`}>
                    {item.role}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 m-0 mb-1 leading-snug pr-4">{item.action}</p>
                <span className="text-[10px] text-gray-400">{item.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivity;
