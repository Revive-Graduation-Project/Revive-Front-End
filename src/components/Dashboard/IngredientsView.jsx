import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import {
  useIngredients,
  useUploadIngredients,
  useUpdateIngredientStock,
} from "../../hooks/dashboard/useIngredients";
import { useToast } from "../../store/toastStore";
import {
  FiSearch,
  FiUploadCloud,
  FiEdit2,
  FiPackage,
  FiAlertTriangle,
} from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";
import SortMenu from "./shared/SortMenu";
import IngredientModal from "./shared/IngredientModal";
import IngredientNutrientsModal from "./shared/IngredientNutrientsModal";
import { sortItems } from "../../utils/sortItems";
import { formatStockDisplay as formatStock } from "../../utils/stockUtils";

// ── Constants ─────────────────────────────────────────────────────────────────
const ING_SORT_COLS = [
  { key: "name",  label: "Name"  },
  { key: "stock", label: "Stock" },
];

const TABLE_HEADERS = ["Name", "Fat", "Cal", "Pro", "Sug", "Stock", "Actions"];

// ── Helpers ───────────────────────────────────────────────────────────────────

// ── Sub-components ────────────────────────────────────────────────────────────

const getNutrientStyle = (name = "") => {
  const n = String(name).toLowerCase();
  if (n.includes("energy") || n.includes("calor") || n.includes("kcal")) {
    return {
      dot: "bg-amber-500 shadow-2xs shadow-amber-500/50",
      badge: "bg-amber-50 text-amber-700 border border-amber-200/60",
      hover: "hover:border-amber-200 hover:bg-amber-50/30",
    };
  }
  if (n.includes("protein")) {
    return {
      dot: "bg-blue-500 shadow-2xs shadow-blue-500/50",
      badge: "bg-blue-50 text-blue-700 border border-blue-200/60",
      hover: "hover:border-blue-200 hover:bg-blue-50/30",
    };
  }
  if (n.includes("fat") || n.includes("lipid") || n.includes("cholesterol")) {
    return {
      dot: "bg-rose-500 shadow-2xs shadow-rose-500/50",
      badge: "bg-rose-50 text-rose-700 border border-rose-200/60",
      hover: "hover:border-rose-200 hover:bg-rose-50/30",
    };
  }
  if (n.includes("sugar") || n.includes("carb") || n.includes("fiber")) {
    return {
      dot: "bg-emerald-500 shadow-2xs shadow-emerald-500/50",
      badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
      hover: "hover:border-emerald-200 hover:bg-emerald-50/30",
    };
  }
  if (n.includes("sodium") || n.includes("salt") || n.includes("calcium") || n.includes("iron")) {
    return {
      dot: "bg-purple-500 shadow-2xs shadow-purple-500/50",
      badge: "bg-purple-50 text-purple-700 border border-purple-200/60",
      hover: "hover:border-purple-200 hover:bg-purple-50/30",
    };
  }
  return {
    dot: "bg-slate-400 shadow-2xs shadow-slate-400/50",
    badge: "bg-slate-100 text-slate-700 border border-slate-200/60",
    hover: "hover:border-slate-300 hover:bg-slate-50",
  };
};

/**
 * Renders dynamic nutrient key-value pairs in a sleek, vertically stacked list
 * with color-coded indicator dots and structured badge alignment.
 */
function NutrientPills({ nutrients }) {
  if (!nutrients || (Array.isArray(nutrients) && nutrients.length === 0))
    return <span className="text-gray-300 text-[12px] font-medium">—</span>;

  const list = Array.isArray(nutrients) ? nutrients : [nutrients];
  const parsed = [];

  list.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const name = item.nutrientName || item.name || item.label || item.nutrient || "";
    const val = item.value !== undefined ? item.value : (item.amount !== undefined ? item.amount : (item.val !== undefined ? item.val : ""));
    const unit = item.unitName || item.unit || item.u || "";

    if (name) {
      let valStr = val !== "" && val !== null && val !== undefined ? String(val) : "";
      if (unit && valStr) {
        valStr += ` ${String(unit).toLowerCase()}`;
      } else if (unit && !valStr) {
        valStr = String(unit);
      }
      parsed.push({ name: String(name), value: valStr });
    } else {
      Object.entries(item).forEach(([k, v]) => {
        if (v === null || v === undefined || String(v).trim() === "") return;
        if (["id", "_id", "unitName", "unit", "value", "amount"].includes(k)) return;
        let valStr = typeof v === "object"
          ? (v.value !== undefined ? `${v.value}${v.unitName ? ` ${String(v.unitName).toLowerCase()}` : ""}` : (v.amount !== undefined ? `${v.amount}${v.unit ? ` ${String(v.unit).toLowerCase()}` : ""}` : JSON.stringify(v)))
          : String(v);
        parsed.push({ name: k, value: valStr });
      });
    }
  });

  if (parsed.length === 0)
    return <span className="text-gray-300 text-[12px] font-medium">—</span>;

  return (
    <div className="flex flex-col gap-1.5 min-w-[220px] max-w-[300px] py-1">
      {parsed.map((item, idx) => {
        const { dot, badge, hover } = getNutrientStyle(item.name);
        return (
          <div
            key={`${item.name}-${idx}`}
            className={`flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-[#F8F9FB] border border-gray-100/80 shadow-2xs transition-all duration-200 ${hover}`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
              <span className="text-[12px] font-bold text-[#1a1a1a] truncate capitalize">
                {item.name}
              </span>
            </div>
            <span
              className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg shrink-0 whitespace-nowrap ${badge}`}
            >
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Summary stat card — value computed from live data, no extra API call needed */
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-sm px-6 py-5 flex items-center gap-4"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-[28px] font-extrabold text-[#1a1a1a] leading-tight">{value}</p>
        <p className="text-[12px] text-gray-400 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function IngredientsView() {
  const [searchQuery, setSearchQuery]             = useState("");
  const [sortKey, setSortKey]                     = useState(null);
  const [sortDir, setSortDir]                     = useState("asc");
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [viewingNutrientsItem, setViewingNutrientsItem] = useState(null);
  const [selectedFile, setSelectedFile]           = useState(null);

  const { addToast } = useToast();

  const { data: ingredients, isLoading, error, refetch } = useIngredients();
  const { mutate: uploadFile, isPending: isUploading }    = useUploadIngredients();
  const { mutate: updateStock }                           = useUpdateIngredientStock();

  // ── File handlers ─────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleFileSubmit = () => {
    if (!selectedFile) return;
    const fileToUpload = selectedFile;
    setSelectedFile(null); // Clear immediately for non-blocking background upload UX
    uploadFile(fileToUpload);
  };

  // ── Edit handler ──────────────────────────────────────────────────────────
  const handleEdit = (item) => {
    setEditingIngredient(item);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    // formData = { stock: number } — sent to PATCH /api/ingredients/{id}/stock
    updateStock(
      { id: editingIngredient.id, data: formData },
      {
        onSuccess: () => { addToast("Stock updated!", "success"); setIsModalOpen(false); },
        onError:   () => addToast("Failed to update stock.", "error"),
      }
    );
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <DashboardHeader title="Ingredients" />
        <DashboardPageSkeleton />
      </div>
    );
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const allIngredients  = ingredients || [];
  const totalCount      = allIngredients.length;
  const outOfStockCount = allIngredients.filter((i) => i.stock === 0).length;

  const searchFiltered = searchQuery.trim()
    ? allIngredients.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allIngredients;

  const filtered = sortItems(searchFiltered, sortKey, sortDir);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <DashboardHeader title="Ingredients" />

      <div className="p-4 md:p-8 flex flex-col gap-6">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
          <StatCard
            label="Total Ingredients"
            value={totalCount}
            icon={FiPackage}
            color="#F97316"
          />
          <StatCard
            label="Out of Stock"
            value={outOfStockCount}
            icon={FiAlertTriangle}
            color="#EF4444"
          />
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-3xl shadow-sm">

          {/* Toolbar */}
          <div className="px-6 pt-6 pb-2 flex items-center justify-between gap-4">
            {/* Search by name */}
            <div className="relative flex-1 max-w-xs">
              <FiSearch
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search ingredients…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>

            {/* Sort + Nutrients Scale Notice */}
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold text-orange-600 bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-200/60 shadow-2xs whitespace-nowrap">
                Nutrients for every 100g :
              </span>
              <SortMenu
                columns={ING_SORT_COLS}
                sortKey={sortKey}
                sortDir={sortDir}
                onChange={(k, d) => { setSortKey(k); setSortDir(d); }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto px-6 pb-6 mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F5F6F8] rounded-xl overflow-hidden">
                  {TABLE_HEADERS.map((h, idx) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-[12px] font-bold text-[#1a1a1a] ${
                        idx === 0
                          ? "rounded-l-xl text-left pl-6 w-[220px]"
                          : idx === TABLE_HEADERS.length - 1
                          ? "rounded-r-xl text-center w-[100px]"
                          : idx === TABLE_HEADERS.length - 2
                          ? "text-center w-[90px]"
                          : "text-left"
                      }`}
                    >
                      {h === "Actions" ? "" : h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState
                        title="No ingredients found"
                        description={
                          searchQuery
                            ? "Try a different search term."
                            : "Upload a CSV to add ingredients."
                        }
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const { text: stockText, isOut, isLow } = formatStock(item.stock, item.unit);
                    return (
                      <tr
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setViewingNutrientsItem(item)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setViewingNutrientsItem(item); } }}
                        className="group border-b border-gray-200/80 hover:bg-orange-50/30 transition-colors cursor-pointer"
                      >
                        {/* Name + Description + Hover Button */}
                        <td className="px-6 py-4 w-[240px]">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-[13px] font-bold text-[#1a1a1a] leading-tight">
                                {item.name}
                              </p>
                              {item.description && (
                                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setViewingNutrientsItem(item); }}
                              className="opacity-0 group-hover:opacity-100 transition-all duration-200 inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 hover:bg-orange-500 text-orange-600 hover:text-white rounded-lg text-[11px] font-bold shadow-sm cursor-pointer shrink-0"
                              title="See full nutritional details"
                            >
                              See full details
                            </button>
                          </div>
                        </td>

                       
                        {/* Fat */}
                        <td className="px-4 py-4 text-[12px] text-green-600 font-semibold">{item.fat ?? "-"}</td>
                        {/* Cal */}
                        <td className="px-4 py-4 text-[12px] text-green-600 font-semibold">{item.calories ?? "-"}</td>
                        {/* Pro */}
                        <td className="px-4 py-4 text-[12px] text-green-600 font-semibold">{item.protein ?? "-"}</td>
                        {/* Sug */}
                        <td className="px-4 py-4 text-[12px] text-green-600 font-semibold">{item.sugar ?? "-"}</td>

                        {/* Stock */}
                        <td className="px-4 py-4 text-center w-[90px]">
                          <span
                            className={`text-[13px] font-extrabold ${
                              isOut ? "text-red-500" : isLow ? "text-amber-500" : "text-[#1a1a1a]"
                            }`}
                          >
                            {stockText}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-center w-[100px]">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-lg text-[12px] font-bold border border-gray-100 transition-all cursor-pointer shadow-sm"
                          >
                            <FiEdit2 size={13} /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── CSV upload ── */}
        <div className="flex flex-col gap-3">
          <label
            className={`bg-[#38761d] hover:bg-green-800 text-white px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg w-fit cursor-pointer transition-transform hover:scale-105 ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <FiUploadCloud size={20} className="text-[#F97316]" />
            <span className="text-[14px] font-bold">
              {selectedFile ? selectedFile.name : "Upload ingredients CSV"}
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </label>

          {selectedFile && (
            <button
              onClick={handleFileSubmit}
              disabled={isUploading}
              className={`bg-[#F97316] hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-lg w-fit transition-transform hover:scale-105 ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? "Uploading…" : "Submit"}
            </button>
          )}
        </div>

      </div>

      {/* ── Edit stock modal ── */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingIngredient}
      />

      {/* ── Complete nutritional details modal ── */}
      <IngredientNutrientsModal
        isOpen={Boolean(viewingNutrientsItem)}
        onClose={() => setViewingNutrientsItem(null)}
        ingredient={viewingNutrientsItem}
      />
    </div>
  );
}

export default IngredientsView;
