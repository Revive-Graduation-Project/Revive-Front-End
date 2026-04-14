import { FiStar } from "react-icons/fi";

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          size={11}
          fill={i <= Math.round(rating) ? "#F97316" : "none"}
          stroke={i <= Math.round(rating) ? "#F97316" : "#D1D5DB"}
        />
      ))}
    </div>
  );
}

function TrendingMenus({ data }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)] h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Trending Menus</h3>
        <span className="text-[11px] text-gray-400">This Month ▾</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {data.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors duration-200 hover:bg-[#FFF8F0] ${
              index === 0 ? "bg-[#FFF8F0]" : "bg-transparent"
            }`}
          >
            {/* Image */}
            <div className="w-14 h-14 rounded-[10px] overflow-hidden shrink-0 bg-orange-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1a1a1a] mb-0.5 truncate">{item.name}</p>
              <div className="flex items-center gap-1.5">
                <StarRating rating={item.rating} />
                <span className="text-[11px] text-gray-400">{item.rating}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.orders} orders</p>
            </div>

            {/* Revenue */}
            <div className="text-right shrink-0">
              <p className="text-[13px] font-bold text-orange-500 m-0">
                ${(item.revenue / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingMenus;
