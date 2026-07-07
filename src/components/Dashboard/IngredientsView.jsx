import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import {
  useIngredientsMetrics,
  useIngredients,
  useUploadIngredients,
  useDeleteIngredient,
  useCreateIngredient,
  useUpdateIngredient,
} from "../../hooks/dashboard/useIngredients";
import { useToast } from "../../store/toastStore";
import { FiSearch, FiPlus, FiUploadCloud, FiEdit2, FiTrash2 } from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";
import StatusBadge from "./shared/StatusBadge";
import SortMenu from "./shared/SortMenu";
import IngredientModal from "./shared/IngredientModal";
import ConfirmModal from "./shared/ConfirmModal";
import MetricRingCard from "./shared/MetricRingCard";
import { sortItems } from "../../utils/sortItems";

// ── Sort columns — defined outside the component so they are never recreated ──
const ING_SORT_COLS = [
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "fat", label: "Fat" },
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein" },
  { key: "sugar", label: "Sugar" },
  { key: "stock", label: "Stock" },
  { key: "costPerUnit", label: "Price" },
];

// Table column headers (9 total)
const TABLE_HEADERS = ["Name", "Category", "Fat", "Cal", "Pro", "Sug", "Stock", "Price", "Actions"];

function IngredientsView() {
  const [activeCategory, setActiveCategory] = useState("All Ingredients");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { addToast } = useToast();

  const { data: metrics, isLoading: loadMetrics } = useIngredientsMetrics();
  const {
    data: ingredients,
    isLoading: loadIngredients,
    error,
    refetch,
  } = useIngredients();

  const { mutate: uploadFile, isPending: isUploading } = useUploadIngredients();
  const { mutate: deleteIngredient } = useDeleteIngredient();
  const { mutate: createIngredient } = useCreateIngredient();
  const { mutate: updateIngredient } = useUpdateIngredient();

  const isLoading = loadMetrics || loadIngredients;

  // ── File handlers ──────────────────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    e.target.value = ""; // reset input so the same file can be re-selected
  };

  const handleSubmitFile = () => {
    if (!selectedFile) return;
    uploadFile(selectedFile, {
      onSuccess: () => { addToast("Ingredients updated successfully!", "success"); setSelectedFile(null); },
      onError: () => addToast("Failed to upload ingredients.", "error"),
    });
  };

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  const handleDelete = (id) => setDeletingId(id);

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteIngredient(deletingId, {
      onSuccess: () => addToast("Ingredient deleted", "success"),
      onError: () => addToast("Failed to delete ingredient", "error"),
    });
    setDeletingId(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingIngredient) {
      updateIngredient(
        { id: editingIngredient.id, data: formData },
        {
          onSuccess: () => { addToast("Ingredient updated!", "success"); setIsModalOpen(false); },
          onError: () => addToast("Failed to update ingredient", "error"),
        }
      );
    } else {
      createIngredient(formData, {
        onSuccess: () => { addToast("Ingredient added!", "success"); setIsModalOpen(false); },
        onError: () => addToast("Failed to add ingredient", "error"),
      });
    }
  };

  const openAddModal = () => { setEditingIngredient(null); setIsModalOpen(true); };
  const openEditModal = (item) => { setEditingIngredient(item); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <DashboardHeader title="Ingredients" />
        <DashboardPageSkeleton />
      </div>
    );
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const allIngredients = ingredients || [];
  const categories = [...new Set(allIngredients.map((i) => i.category))];
  const categoryTabs = ["All Ingredients", ...categories.filter(Boolean)];

  const getCategoryCount = (catName) =>
    allIngredients.filter((i) => i.category === catName).length;

  const getCategoryPct = (catName) =>
    allIngredients.length
      ? Math.round((getCategoryCount(catName) / allIngredients.length) * 100)
      : 0;

  const outOfStockCount = allIngredients.filter(
    (i) => i.stock === 0 || i.stock === "0"
  ).length;

  const outOfStockPct = allIngredients.length
    ? Math.round((outOfStockCount / allIngredients.length) * 100)
    : 0;

  // Metric cards configuration
  const metricRows = [
    { label: "Total Ingredients", value: allIngredients.length, pct: 100, change: metrics?.totalChange ?? 1.58 },
    { label: "Protein", value: getCategoryCount("Protein"), pct: getCategoryPct("Protein"), change: 0.92 },
    { label: "Vegetables", value: getCategoryCount("Vegetables"), pct: getCategoryPct("Vegetables"), change: 0.12 },
    { label: "Sauces", value: getCategoryCount("Sauces"), pct: getCategoryPct("Sauces"), change: 0.92 },
    { label: "Out of stock", value: outOfStockCount, pct: outOfStockPct, change: metrics?.outOfStockChange ?? 0.42, badge: true },
  ];

  // Filter by active category
  const categoryFiltered = activeCategory === "All Ingredients"
    ? allIngredients
    : allIngredients.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );

  // Sort using shared utility (returns a new array, never mutates)
  const filtered = sortItems(categoryFiltered, sortKey, sortDir);

  return (
    <div>
      <DashboardHeader title="Ingredients" />

      <div className="p-4 md:p-8 flex flex-col gap-6">

        {/* ── Metric ring cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {metricRows.map((m) => (
            <MetricRingCard
              key={m.label}
              label={m.label}
              value={m.value}
              pct={m.pct}
              change={m.change}
              badge={m.badge}
              size="sm"
            />
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="bg-white rounded-3xl shadow-sm relative pb-10">

          {/* Toolbar */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex flex-row items-center justify-between mb-4">
              {/* Category tabs */}
              <div className="flex items-center gap-4 w-full overflow-x-auto">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCategory(tab)}
                    className={`px-4 py-1.5 text-[13px] font-bold cursor-pointer transition-all whitespace-nowrap ${activeCategory === tab
                        ? "text-[#1a1a1a] border border-[#F97316] rounded-full bg-transparent"
                        : "text-[#1a1a1a] border border-transparent hover:text-orange-500 bg-transparent"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="shrink-0 flex items-center">
                <SortMenu
                  columns={ING_SORT_COLS}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onChange={(k, d) => { setSortKey(k); setSortDir(d); }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto px-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F5F6F8] rounded-xl overflow-hidden">
                  {TABLE_HEADERS.map((h, idx) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-[12px] font-bold text-[#1a1a1a] text-center ${idx === 0 ? "rounded-l-xl text-left pl-6" : ""
                        } ${idx === TABLE_HEADERS.length - 1 ? "rounded-r-xl" : ""}`}
                    >
                      {h === "Actions" ? "" : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9}>
                      <EmptyState
                        title="No ingredients found"
                        description="Adjust your filter or add a new ingredient."
                      />
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "https://img.icons8.com/color/48/tomato.png"}
                            alt={item.name}
                            className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-50 p-1"
                          />
                          <span className="text-[12px] font-bold text-[#1a1a1a]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-medium text-[#1a1a1a] text-center">{item.category}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.fat || "-"}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.calories || "-"}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.protein || "-"}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.sugar || "-"}</td>
                      <td className={`px-4 py-4 text-[12px] font-bold text-center ${item.stock < 20 ? "text-red-500" : "text-[#1a1a1a]"}`}>
                        {item.stock >= 1000 ? `${(item.stock / 1000).toFixed(0)}k` : item.stock}
                      </td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#F97316] text-center">{item.costPerUnit}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-lg text-[12px] font-bold border border-gray-100 transition-all cursor-pointer shadow-sm"
                            onClick={() => openEditModal(item)}
                            title={`Edit ${item.name}`}
                          >
                            <FiEdit2 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg text-[12px] font-bold border border-gray-100 transition-all cursor-pointer shadow-sm"
                            onClick={() => handleDelete(item.id)}
                            title={`Delete ${item.name}`}
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Floating add button */}
          <button
            onClick={openAddModal}
            className="absolute bottom-6 right-6 w-12 h-12 bg-[#38761d] hover:bg-green-800 text-white rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer transition-transform hover:scale-105 z-10"
            title="Add ingredient"
          >
            <FiPlus size={24} />
          </button>
        </div>

        {/* ── CSV upload ── */}
        <div className="flex flex-col gap-4 justify-start items-start">
          <label
            className={`bg-[#38761d] hover:bg-green-800 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105 ${isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
          >
            <FiUploadCloud size={20} className="text-[#F97316]" />
            <span className="text-[14px] font-bold">
              {selectedFile ? selectedFile.name : "Upload ingredients csv"}
            </span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>

          {selectedFile && (
            <button
              onClick={handleSubmitFile}
              disabled={isUploading}
              className={`bg-[#F97316] hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-transform hover:scale-105 ${isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isUploading ? "Uploading…" : "Submit"}
            </button>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <IngredientModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        initialData={editingIngredient}
      />

      <ConfirmModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title="Delete Ingredient"
        message="Are you sure you want to delete this ingredient? This action cannot be undone."
      />
    </div>
  );
}

export default IngredientsView;
