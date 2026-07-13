import { FiStar } from "react-icons/fi";
import { BiSpreadsheet, BiRestaurant } from "react-icons/bi";
import { MdAttachMoney } from "react-icons/md";
import TimeFilter from "./shared/TimeFilter";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          size={10}
          fill={i <= Math.round(rating) ? "#EAB308" : "none"}
          stroke={i <= Math.round(rating) ? "#EAB308" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

function TrendingMenus({ data }) {
  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start px-1">
        <h3 className="text-[14px] font-bold text-[#1a1a1a] m-0">Trending Menus</h3>
        <TimeFilter defaultValue="This Month" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-1 gap-5">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-3.5 shadow-sm flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            {/* Header: Title and Rating */}
            <div className="flex justify-between items-center px-1.5">
              <p className="text-[13px] font-bold text-[#1a1a1a] truncate m-0">{item.name}</p>
              <div className="flex items-center gap-1.5">
                <StarRating rating={item.rating} />
                <span className="text-[10px] font-bold text-[#1a1a1a]">{item.rating}</span>
              </div>
            </div>

            {/* Image */}
            <div className="w-full h-[120px] rounded-[20px] overflow-hidden bg-orange-50 relative flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-orange-300 gap-1 p-2 text-center">
                <BiRestaurant size={28} />
                <span className="text-[11px] font-medium text-orange-400 line-clamp-1">{item.name}</span>
              </div>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover absolute inset-0 z-10"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              ) : null}
            </div>

            {/* Footer: Orders and Revenue */}
            <div className="flex justify-between items-center px-1.5 pb-1">
              <div className="flex items-center gap-1">
                <BiSpreadsheet size={14} className="text-[#F97316]" />
                <span className="text-[10px] text-[#1a1a1a] font-medium ml-1">orders:</span>
                <span className="text-[11px] font-bold text-[#F97316] ml-1">{item.orders}</span>
              </div>
              <div className="flex items-center gap-1">
                <MdAttachMoney size={15} className="text-[#F97316]" />
                <span className="text-[10px] text-[#1a1a1a] font-medium">Revenue</span>
                <span className="text-[11px] font-bold text-[#F97316] ml-1">{(item.revenue / 1000).toFixed(1)}k EGP</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingMenus;
