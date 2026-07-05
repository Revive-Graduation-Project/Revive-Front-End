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
import { sortItems } from "../../utils/sortItems";

// ── Constants ─────────────────────────────────────────────────────────────────
const ING_SORT_COLS = [
  { key: "name",  label: "Name"  },
  { key: "stock", label: "Stock" },
];

const TABLE_HEADERS = ["Name", "Nutrients", "Stock", "Actions"];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a gram value with appropriate unit and low-stock flag */
const formatStock = (stock) => {
  if (stock === 0)      return { text: "0g",                              isOut: true,  isLow: false };
  if (stock >= 1000)    return { text: `${(stock / 1000).toFixed(1)}kg`, isOut: false, isLow: false };
  return                       { text: `${stock}g`,                      isOut: false, isLow: stock < 100 };
};

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Renders dynamic nutrient key-value pairs as green pills.
 * The backend returns nutrients as Array<Record<string, unknown>>.
 */
function NutrientPills({ nutrients }) {
  if (!Array.isArray(nutrients) || nutrients.length === 0)
    return <span className="text-gray-300 text-[11px]">—</span>;

  const entries = nutrients.flatMap((obj) =>
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && String(v).trim() !== ""
    )
  );

  if (entries.length === 0)
    return <span className="text-gray-300 text-[11px]">—</span>;

  return (
    <div className="flex flex-wrap gap-1 max-w-[280px]">
      {entries.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-full border border-green-100 whitespace-nowrap"
        >
          {key}: {typeof value === "object" ? JSON.stringify(value) : value}
        </span>
      ))}
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
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
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
    uploadFile(selectedFile, {
      onSuccess: () => { addToast("Ingredients updated successfully!", "success"); setSelectedFile(null); },
      onError:   () => addToast("Failed to upload file.", "error"),
    });
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

  if (error) {
    return (
      <div>
        <DashboardHeader title="Ingredients" />
        <ErrorState message="Failed to load ingredients." onRetry={refetch} />
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

            {/* Sort */}
            <SortMenu
              columns={ING_SORT_COLS}
              sortKey={sortKey}
              sortDir={sortDir}
              onChange={(k, d) => { setSortKey(k); setSortDir(d); }}
            />
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
                    <td colSpan={4}>
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
                    const { text: stockText, isOut, isLow } = formatStock(item.stock);
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors"
                      >
                        {/* Name + Description */}
                        <td className="px-6 py-4 w-[220px]">
                          <p className="text-[13px] font-bold text-[#1a1a1a] leading-tight">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </td>

                        {/* Nutrients — dynamic key-value pills */}
                        <td className="px-4 py-4">
                          <NutrientPills nutrients={item.nutrients} />
                        </td>

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
                            onClick={() => handleEdit(item)}
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
    </div>
  );
}

export default IngredientsView;
