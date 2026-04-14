import { useState, useEffect } from "react";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { getMenuCategories, getMenuItems } from "../../services/dashboardService";
import { FiSearch, FiStar } from "react-icons/fi";

const CATEGORY_TABS = ["All", "Chicken", "Meat", "Seafood", "Vegetarian", "Desserts", "Mixed"];

function CategoryProgress({ name, percentage, count, color }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div className="bg-white rounded-[14px] px-4 py-[18px] shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex flex-col items-center gap-2.5 hover:shadow-[0_4px_20px_rgba(249,115,22,0.1)] transition-shadow duration-200">
      <div className="relative">
        <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="40" cy="40" r={r} fill="none" stroke="#F3F4F6" strokeWidth="8" />
          <circle
            cx="40" cy="40" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-[#1a1a1a]">{percentage}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[13px] font-semibold text-[#1a1a1a] mb-0.5">{name}</p>
        <p className="text-[11px] text-gray-400 m-0">{count} items</p>
      </div>
    </div>
  );
}

function ChefMenuView() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMenuCategories(), getMenuItems()])
      .then(([cats, items]) => { setCategories(cats); setMenuItems(items); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = menuItems.filter((item) => {
    const matchesTab = activeTab === "All" || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <DashboardHeader title="Chef Menu" subtitle="Hello Basmala, Welcome back" />

      <div className="p-8 flex flex-col gap-6">
        {/* Category Progress Charts */}
        {!loading && (
          <div className="grid grid-cols-5 gap-3.5">
            {categories.map((cat) => (
              <CategoryProgress key={cat.name} {...cat} />
            ))}
          </div>
        )}

        {/* Menu Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
          {/* Table header bar */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-[15px] font-bold text-[#1a1a1a] m-0">All Meals</h3>
              <p className="text-xs text-gray-400 mt-0.5">{filtered.length} of {menuItems.length} total</p>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-[10px] px-3.5 py-2 border border-gray-200">
              <FiSearch size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search meals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-none outline-none bg-transparent text-[13px] text-gray-700 w-40"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-5 py-3 border-b border-gray-100 flex gap-1 overflow-x-auto">
            {CATEGORY_TABS.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg border-none cursor-pointer text-xs whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-orange-500 text-white font-semibold"
                    : "bg-transparent text-gray-500 font-normal hover:bg-orange-50 hover:text-orange-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FFF8F0]">
                  {["Meal Name", "Category", "Price", "Calories", "Protein", "Fat", "Sugar", "Rating", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-400 text-sm">No meals found</td>
                  </tr>
                )}
                {filtered.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`transition-colors duration-150 hover:bg-[#FFFBF7] ${i < filtered.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-[#1a1a1a]">{item.name}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-semibold text-orange-500 bg-orange-50 rounded-md px-2 py-0.5">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-bold text-orange-500">${item.price}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{item.calories}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{item.protein}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{item.fat}</td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500">{item.sugar}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <FiStar size={12} fill="#F97316" stroke="#F97316" />
                        <span className="text-xs font-semibold text-[#1a1a1a]">{item.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-semibold text-green-600 bg-green-50 rounded-md px-2 py-0.5">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChefMenuView;
