function OrderTypes({ data }) {
  const icons = { "Dine-In": "🍽️", Takeaway: "🥡", Online: "📱" };

  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-[18px]">
        <div>
          <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">Order Types</h3>
          <p className="text-xs text-gray-400 mt-0.5">This Month</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {data.map(({ name, percentage, count, color }) => (
          <div key={name}>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[15px]">{icons[name]}</span>
                <span className="text-[13px] font-medium text-gray-700">{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{count}</span>
                <span className="text-[13px] font-bold text-[#1a1a1a]">{percentage}%</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-in-out"
                style={{ width: `${percentage}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderTypes;
