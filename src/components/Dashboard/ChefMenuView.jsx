import { useState } from "react";
import { useNavigate } from "react-router";
import DashboardHeader from "./DashboardHeader";
import TrendingMenus from "./TrendingMenus";
import {
  useMenuCategories,
  useMenuItems,
  useDeleteMenuItem,
  isMenuItemActive,
} from "../../hooks/dashboard/useMenuItems";
import { useTrendingMenus } from "../../hooks/dashboard/useDashboard";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";
import SortMenu from "./shared/SortMenu";
import ConfirmModal from "./shared/ConfirmModal";
import DishDetailsModal from "./shared/DishDetailsModal";
import MetricRingCard from "./shared/MetricRingCard";
import InactiveMenuModal from "./shared/InactiveMenuModal";
import { sortItems } from "../../utils/sortItems";

// ── Sort columns — defined outside the component so they are never recreated ──
const MENU_SORT_COLS = [
  { key: "name", label: "Meal" },
  { key: "category", label: "Category" },
  { key: "fat", label: "Fat" },
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein" },
  { key: "sugar", label: "Sugar" },
  { key: "price", label: "Price" },
];

const TABLE_HEADERS = ["Meal", "Category", "Fat", "Cal", "Pro", "Sug", "Price", "Actions"];

function ChefMenuView() {
  const [activeTab, setActiveTab] = useState("All Menu");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [deletingId, setDeletingId] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);

  const navigate = useNavigate();
  const { mutate: deleteItem } = useDeleteMenuItem();

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const confirmDelete = () => {
    if (!deletingId) return;
    deleteItem(deletingId);
    setDeletingId(null);
  };

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: categories, isLoading: loadCats, error: errCats, refetch: refetchCats } = useMenuCategories();
  const { data: menuItems, isLoading: loadItems, error: errItems, refetch: refetchItems } = useMenuItems();
  const { data: trending, isLoading: loadTrend } = useTrendingMenus();

  const isLoading = loadCats || loadItems || loadTrend;
  const hasError = errCats || errItems;

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <DashboardHeader title="Menu" />
        <DashboardPageSkeleton />
      </div>
    );
  }

  if (hasError) {
    // Retry both failed queries without reloading the page
    const handleRetry = () => { refetchCats(); refetchItems(); };
    return (
      <div>
        <DashboardHeader title="Menu" />
        <ErrorState message="Failed to load menu data." onRetry={handleRetry} />
      </div>
    );
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const allItems = menuItems || [];
  const activeItems = allItems.filter(isMenuItemActive);
  const inactiveItems = allItems.filter(item => !isMenuItemActive(item));
  const totalMeals = activeItems.length;

  const totalChange = categories?.totalChange ?? 0;
  const totalPercentage = categories?.totalPercentage ?? 100;
  const categoryItems = categories?.items || [];

  // Get all unique category names from both API categories and live items
  const allCategoryNames = Array.from(new Set([
    ...categoryItems.map((c) => c.name).filter(Boolean),
    ...activeItems.map((i) => i.category).filter(Boolean),
  ]));

  const categoryCounts = allCategoryNames.map((name, index) => {
    const existing = categoryItems.find((c) => c.name?.toLowerCase() === name.toLowerCase()) || {};
    const count = activeItems.filter(
      (i) => i.category?.toLowerCase() === name.toLowerCase()
    ).length;
    const rawPct = totalMeals > 0 ? Math.round((count / totalMeals) * 100) : 0;
    const percentage = isNaN(rawPct) ? 0 : rawPct;
    const colors = ["#F97316", "#8B5CF6", "#3B82F6", "#10B981", "#EC4899", "#FB923C", "#C084FC"];
    return {
      name,
      color: existing.color || colors[index % colors.length],
      change: existing.change ?? 0,
      count,
      percentage,
    };
  });

  // Category tabs built from live item data
  const CATEGORY_TABS = ["All Menu", ...new Set(activeItems.map((i) => i.category).filter(Boolean))];

  // Filter then sort using shared utility
  const tabFiltered = activeTab === "All Menu"
    ? activeItems
    : activeItems.filter((item) => item.category?.toLowerCase() === activeTab.toLowerCase());

  const filtered = sortItems(tabFiltered, sortKey, sortDir);

  return (
    <div>
      <DashboardHeader title="Menu" />

      <div className="px-4 md:px-8 pt-4 md:pt-8">
        {/* ── Metric ring cards — horizontal scrollable row ── */}
        <div className="flex gap-4 overflow-x-auto pb-1">
          <MetricRingCard
            label="Total Meals"
            value={totalMeals}
            pct={totalPercentage}
            change={totalChange}
            size="lg"
          />
          {categoryCounts.map((cat) => (
            <MetricRingCard
              key={cat.name}
              label={cat.name}
              value={cat.count}
              pct={cat.percentage}
              change={cat.change}
              size="lg"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 p-4 md:p-8 items-start">
        {/* ── Main table area ── */}
        <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
          <div className="bg-white rounded-3xl shadow-sm relative pb-10">

            {/* Tab bar + sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100 gap-3 sm:gap-0">
              <div className="flex items-center gap-2 overflow-x-auto">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-[13px] font-semibold rounded-full border-none cursor-pointer transition-all whitespace-nowrap ${activeTab === tab
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-transparent text-gray-500 hover:text-orange-500"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsInactiveModalOpen(true)}
                  className="relative flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
                >
                  INACTIVE MENU
                  {inactiveItems.length > 0 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full absolute -top-1 -right-1 shadow-sm border-2 border-white">
                      {inactiveItems.length}
                    </span>
                  )}
                </button>
                <SortMenu
                  columns={MENU_SORT_COLS}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onChange={(k, d) => { setSortKey(k); setSortDir(d); }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto relative">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    {TABLE_HEADERS.map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                        {h === "Actions" ? "" : h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <EmptyState title="No meals found" description="Try adjusting your category filter." />
                      </td>
                    </tr>
                  )}
                  {filtered.map((item, i) => (
                    <tr
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      className={`group transition-colors hover:bg-orange-50/30 cursor-pointer ${i < filtered.length - 1 ? "border-b border-gray-50" : ""
                        }`}
                      onClick={() => setViewingItem(item)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setViewingItem(item); } }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 overflow-hidden shrink-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#1a1a1a] m-0">{item.name}</p>
                            <p className="text-[11px] text-gray-400 m-0 group-hover:text-orange-300 transition-colors duration-200">{item.category}</p>
                            <span className="text-[10px] font-semibold text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-0.5 group-hover:translate-y-0 inline-block">
                              Click to view details →
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-gray-500">{item.category}</td>
                      <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.fat ?? "-"}</td>
                      <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.calories ?? "-"}</td>
                      <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.protein ?? "-"}</td>
                      <td className="px-5 py-3.5 text-[12px] text-green-600 font-semibold">{item.sugar ?? "-"}</td>
                      <td className="px-5 py-3.5 text-[13px] font-bold text-orange-500">${item.price}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate("/dashboard/recipe-builder", { state: { editMeal: item } }); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-lg text-[12px] font-bold border border-gray-100 transition-all cursor-pointer shadow-sm"
                            title={`Edit ${item.name}`}
                          >
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeletingId(item.id); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg text-[12px] font-bold border border-gray-100 transition-all cursor-pointer shadow-sm"
                            title={`Delete ${item.name}`}
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Floating add button */}
            <button
              onClick={() => navigate("/dashboard/recipe-builder")}
              className="absolute bottom-6 right-6 w-12 h-12 bg-[#38761d] hover:bg-green-800 text-white rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer transition-transform hover:scale-105 z-10"
              title="Add menu item"
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

      {/* ── Modals ── */}

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete Menu Item"
        message="Are you sure you want to delete this meal? This action cannot be undone."
      />

      <DishDetailsModal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        dish={viewingItem}
      />

      <InactiveMenuModal
        isOpen={isInactiveModalOpen}
        onClose={() => setIsInactiveModalOpen(false)}
        inactiveItems={inactiveItems}
      />
    </div>
  );
}

export default ChefMenuView;
