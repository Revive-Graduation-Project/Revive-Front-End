import { FiStar } from "react-icons/fi";
import { BiSpreadsheet } from "react-icons/bi";
import { MdAttachMoney } from "react-icons/md";
import TimeFilter from "./shared/TimeFilter";

/**
 * Renders a star rating visualization.
 * @param {number} rating - The rating value to display.
 * @returns {JSX.Element} A row of 5 star icons, with filled stars for the rounded rating value.
 */
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

/**
 * Displays a list of trending menu items with ratings, images, orders, and revenue.
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.data - Menu items to display, each with `id`, `name`, `rating`, `image`, `orders`, and `revenue`.
 * @returns {JSX.Element} The rendered component.
 */
function TrendingMenus({ data }) {
  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex justify-between items-start px-1">
        <h3 className="text-[14px] font-bold text-[#1a1a1a] m-0">Trending Menus</h3>
        <TimeFilter defaultValue="This Month" />
      </div>

      <div className="flex flex-col gap-5">
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
            <div className="w-full h-[120px] rounded-[20px] overflow-hidden bg-orange-50 relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
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
                <span className="text-[11px] font-bold text-[#F97316] ml-1">${(item.revenue / 1000).toFixed(3)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingMenus;
