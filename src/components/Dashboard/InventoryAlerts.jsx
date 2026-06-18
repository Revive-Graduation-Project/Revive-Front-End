import { FiAlertTriangle } from "react-icons/fi";

/**
 * Renders a compact inventory alert tile with an icon, item name, and optional day count.
 * @param {string} emoji - The emoji icon.
 * @param {string} name - The item name.
 * @param {number} [daysLeft] - Optional number of days remaining.
 */
function AlertItem({ emoji, name, daysLeft }) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[48px]">
      <div className="w-[42px] h-[42px] rounded-full bg-[#f8f9fa] flex items-center justify-center text-[20px] shadow-sm">
        {emoji}
      </div>
      <span className="text-[11px] font-semibold text-[#1a1a1a] text-center">{name}</span>
      {daysLeft !== undefined && (
        <span className="text-[9px] text-gray-500">({daysLeft}Day left)</span>
      )}
    </div>
  );
}

/**
 * Renders an inventory alerts dashboard with categorized item sections.
 * @param {Object} data - The alert data object containing `lowStock`, `shelfLife`, and `inSeason` arrays.
 */
function InventoryAlerts({ data }) {
  const sections = [
    { key: "lowStock",  label: "Low Stock",                  items: data.lowStock,  showDays: false },
    { key: "shelfLife", label: "Shelf-life: less than 3 days", items: data.shelfLife, showDays: true  },
    { key: "inSeason",  label: "In Season",                  items: data.inSeason,  showDays: false },
  ];

  return (
    <div className="bg-white rounded-3xl px-6 py-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-5">
        <FiAlertTriangle size={20} className="text-red-600" fill="#fee2e2" />
        <h3 className="text-[14px] font-bold text-[#1a1a1a] m-0 uppercase tracking-wider">
          INVENTORY ALERTS
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sections.map(({ key, label, items, showDays }) => {
          return (
            <div key={key} className={`bg-white border border-[#FEE2E2] rounded-2xl p-4 shadow-[0_2px_10px_rgba(254,226,226,0.5)]`}>
              <p className={`text-[12px] font-bold text-[#1a1a1a] mb-3`}>{label}</p>
              <div className="flex gap-4 items-start">
                {items.slice(0, 3).map((item) => (
                  <AlertItem
                    key={item.id}
                    emoji={item.image}
                    name={item.name}
                    daysLeft={showDays ? item.daysLeft : undefined}
                  />
                ))}
                {items.length > 3 && (
                  <div className="flex flex-col items-center justify-center h-[42px]">
                    <div className="w-[28px] h-[28px] rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold border border-gray-200">
                      +{items.length - 3}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InventoryAlerts;
