import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import TrendingMenus from "./TrendingMenus";
import { useMenuCategories, useMenuItems, useCreateMenuItem, useUpdateMenuItem } from "../../hooks/dashboard/useMenuItems";
import { useTrendingMenus } from "../../hooks/dashboard/useDashboard";
import { FiEdit2, FiCheck, FiX, FiPlus } from "react-icons/fi";
import { useToast } from "./shared/useToast";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";
import SortMenu from "./shared/SortMenu";
import MenuModal from "./shared/MenuModal";

/** Circular progress metric card — green ring, black name, orange count, red/green trend */
function CircleMetric({ name, percentage, count, change, isTotal }) {
  const r = isTotal ? 30 : 26;
  const circ = 2 * Math.PI * r;
  const sz = isTotal ? 76 : 68;
  const cx = sz / 2;
  const offset = circ - (Math.min(percentage, 100) / 100) * circ;
  const ringColor = "#22C55E"; // always green

  return (
    <div className="bg-white rounded-3xl px-5 py-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200 min-w-[160px]">
      {/* Ring */}
      <div className="relative shrink-0" style={{ width: sz, height: sz }}>
        <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)" }} className="absolute inset-0">
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={ringColor}
            strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-extrabold leading-none text-green-600">{percentage}%</span>
        </div>
      </div>
      {/* Text */}
      <div>
        <p className="text-[13px] font-semibold text-[#1a1a1a] m-0 whitespace-nowrap">{name}</p>
        <p className={`font-extrabold m-0 leading-none text-orange-500 ${isTotal ? "text-[28px]" : "text-[24px]"}`}>{count}</p>
        {change !== undefined && (
          <p className={`text-[10px] m-0 mt-1 font-medium ${change >= 0 ? "text-green-500" : "text-red-400"}`}>
            {change >= 0 ? "↑" : "↓"}{Math.abs(change).toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}

function ChefMenuView() {
  const [activeTab, setActiveTab] = useState("All Menu");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { addToast } = useToast();
  const { mutate: createItem } = useCreateMenuItem();
  const { mutate: updateItem } = useUpdateMenuItem();

  const handleModalSubmit = (formData) => {
    if (editingItem) {
      updateItem(
        { id: editingItem.id, data: formData },
        {
          onSuccess: () => { addToast("Menu item updated!", "success"); setIsModalOpen(false); },
          onError: () => addToast("Failed to update item", "error")
        }
      );
    } else {
      createItem(formData, {
        onSuccess: () => { addToast("Menu item added!", "success"); setIsModalOpen(false); },
        onError: () => addToast("Failed to add item", "error")
      });
    }
  };

  const MENU_SORT_COLS = [
    { key: "name",     label: "Meal"     },
    { key: "category", label: "Category" },
    { key: "fat",      label: "Fat"      },
    { key: "calories", label: "Calories" },
    { key: "protein",  label: "Protein"  },
    { key: "sugar",    label: "Sugar"    },
    { key: "price",    label: "Price"    },
  ];

  const { data: categories, isLoading: loadCats,  error: errCats  } = useMenuCategories();
  const { data: menuItems,  isLoading: loadItems, error: errItems } = useMenuItems();
  const { data: trending,   isLoading: loadTrend                   } = useTrendingMenus();

  const isLoading = loadCats || loadItems || loadTrend;
  const hasError  = errCats || errItems;

  if (isLoading) {
    return (
      <div>
        <DashboardHeader title="Menu" />
        <DashboardPageSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div>
        <DashboardHeader title="Menu" />
        <ErrorState message="Failed to load menu data." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  // Combine live mock data
  const allItems = menuItems || [];
  const totalMeals = allItems.length;

  // Destructure new categories shape: { totalChange, totalPercentage, items[] }
  const totalChange = categories?.totalChange ?? 0;
  const totalPercentage = categories?.totalPercentage ?? 100;
  const categoryItems = categories?.items || [];

  // Per-category counts — use live item count from actual menu data
  const categoryCounts = categoryItems.map(cat => ({
    ...cat,
    count: allItems.filter(i => i.category?.toLowerCase() === cat.name?.toLowerCase()).length,
  }));

  // Build tabs dynamically
  const CATEGORY_TABS = ["All Menu", ...new Set(allItems.map(i => i.category).filter(Boolean))];

  const filtered = (() => {
    let items = allItems.filter((item) => {
      if (activeTab === "All Menu") return true;
      return item.category?.toLowerCase() === activeTab.toLowerCase();
    });
    if (sortKey) {
      items.sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        const parseNum = (val) => {
          if (typeof val === "number") return val;
          const match = String(val).match(/[\d.]+/);
          return match ? parseFloat(match[0]) : NaN;
        };
        const aNum = parseNum(av);
        const bNum = parseNum(bv);
        let cmp;
        if (!isNaN(aNum) && !isNaN(bNum)) {
          cmp = aNum - bNum;
        } else {
          cmp = String(av).localeCompare(String(bv));
        }
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return items;
  })();

  return (
    <div>
      <DashboardHeader title="Menu" />

      <div className="px-4 md:px-8 pt-4 md:pt-8">
        {/* ── Metric cards — full-width horizontal row above everything ── */}
        <div className="flex gap-4 overflow-x-auto pb-1">
          <CircleMetric
            isTotal
            name="Total Meals"
            percentage={totalPercentage}
            count={totalMeals}
            change={totalChange}
          />
          {categoryCounts.map((cat) => (
            <CircleMetric
              key={cat.name}
              name={cat.name}
              percentage={cat.percentage}
              count={cat.count}
              change={cat.change}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 p-4 md:p-8 items-start">
        {/* ── Left/Main ── */}
        <div className="flex-1 flex flex-col gap-6 w-full min-w-0">

          {/* ── Table card ── */}
          <div className="bg-white rounded-3xl shadow-sm relative pb-10">

            {/* Tab bar + Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 gap-3 sm:gap-0">
              <div className="flex items-center gap-2 overflow-x-auto">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-[13px] font-semibold rounded-full border-none cursor-pointer transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-transparent text-gray-500 hover:text-orange-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <SortMenu
                columns={MENU_SORT_COLS}
                sortKey={sortKey}
                sortDir={sortDir}
                onChange={(k, d) => { setSortKey(k); setSortDir(d); }}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto relative">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Meal", "Category", "Fat", "Cal", "Pro", "Sug", "Price", "Edit"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8}><EmptyState title="No meals found" description="Try adjusting your category filter." /></td></tr>
                  )}
                  {filtered.map((item, i) => {

                    return (
                      <tr key={item.id} className={`transition-colors hover:bg-orange-50/30 ${i < filtered.length - 1 ? "border-b border-gray-50" : ""}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 overflow-hidden shrink-0">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                              )}
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-[#1a1a1a] m-0">{item.name}</p>
                              <p className="text-[11px] text-gray-400 m-0">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-gray-500">{item.category}</td>
                        <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.fat || "-"}</td>
                        <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.calories || "-"}</td>
                        <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.protein || "-"}</td>
                        <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.sugar || "-"}</td>
                        <td className="px-5 py-3.5 text-[13px] font-bold text-orange-500">${item.price}</td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-orange-500 bg-transparent border-none cursor-pointer rounded transition-colors"
                            title={`Edit ${item.name}`}
                          >
                            <FiEdit2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

            </div>

            {/* Floating + Button */}
            <button 
              onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
              className="absolute bottom-6 right-6 w-12 h-12 bg-[#38761d] hover:bg-green-800 text-white rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer transition-transform hover:scale-105 z-10"
            >
              <FiPlus size={24} />
            </button>

          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="w-full xl:w-[300px] shrink-0">
          {trending && <TrendingMenus data={trending} />}
        </div>
      </div>

      <MenuModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
      />
    </div>
  );
}

export default ChefMenuView;
