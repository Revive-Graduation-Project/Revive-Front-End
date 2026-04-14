import { FiAlertTriangle } from "react-icons/fi";

function AlertItem({ emoji, name, daysLeft }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[22px] border-2 border-gray-100">
        {emoji}
      </div>
      <span className="text-[11px] font-medium text-gray-700">{name}</span>
      {daysLeft !== undefined && (
        <span className="text-[10px] text-red-500">({daysLeft} day{daysLeft !== 1 ? "s" : ""} left)</span>
      )}
    </div>
  );
}

const SECTION_STYLES = {
  lowStock:   { bg: "bg-red-50",    border: "border-red-200",    title: "text-red-500"    },
  shelfLife:  { bg: "bg-orange-50", border: "border-orange-200", title: "text-orange-500" },
  inSeason:   { bg: "bg-green-50",  border: "border-green-200",  title: "text-green-600"  },
};

function InventoryAlerts({ data }) {
  const sections = [
    { key: "lowStock",  label: "Low Stock",                  items: data.lowStock,  showDays: false },
    { key: "shelfLife", label: "Shelf-life: less than 3 days", items: data.shelfLife, showDays: true  },
    { key: "inSeason",  label: "In Season",                  items: data.inSeason,  showDays: false },
  ];

  return (
    <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2 mb-4">
        <FiAlertTriangle size={16} className="text-orange-500" />
        <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0 uppercase tracking-wide">
          Inventory Alerts
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {sections.map(({ key, label, items, showDays }) => {
          const s = SECTION_STYLES[key];
          return (
            <div key={key} className={`${s.bg} border ${s.border} rounded-xl p-3.5`}>
              <p className={`text-[11px] font-bold ${s.title} mb-3 uppercase tracking-wide`}>{label}</p>
              <div className="flex gap-3 flex-wrap">
                {items.map((item) => (
                  <AlertItem
                    key={item.id}
                    emoji={item.image}
                    name={item.name}
                    daysLeft={showDays ? item.daysLeft : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InventoryAlerts;
