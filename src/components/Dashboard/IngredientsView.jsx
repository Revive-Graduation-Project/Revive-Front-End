import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { useIngredientsMetrics, useIngredients, useUploadIngredients, useDeleteIngredient, useCreateIngredient, useUpdateIngredient } from "../../hooks/dashboard/useIngredients";
import { useToast } from "./shared/useToast";
import { FiSearch, FiPlus, FiUploadCloud, FiTrash2, FiEdit2 } from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import EmptyState from "./shared/EmptyState";
import StatusBadge from "./shared/StatusBadge";
import SortMenu from "./shared/SortMenu";
import IngredientModal from "./shared/IngredientModal";
import ConfirmModal from "./shared/ConfirmModal";

function CircleMetric({ pct, color, value, label, badge, change = 0 }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const mainColor = badge ? "#EF4444" : "#F97316"; // Orange or Red for numbers
  const ringColor = badge ? "#EF4444" : "#22C55E"; // Green or Red for ring

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-2 ${badge ? "border border-red-500" : ""}`}>
      {/* Left: Ring */}
      <div className="relative w-[50px] h-[50px] flex items-center justify-center shrink-0">
        <svg width="50" height="50" style={{ transform: "rotate(-90deg)" }} className="absolute inset-0">
          <circle cx="25" cy="25" r={r} fill="none" stroke="#F3F4F6" strokeWidth="4" />
          <circle cx="25" cy="25" r={r} fill="none" stroke={ringColor} strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <span className="text-[9px] font-bold z-10 text-[#1a1a1a]">{pct}%</span>
      </div>
      
      {/* Right: Text Data */}
      <div className="flex flex-col items-end">
        <p className="text-[12px] text-[#1a1a1a] font-medium m-0">{label}</p>
        <p className="text-[22px] font-bold m-0 leading-tight" style={{ color: mainColor }}>{value}</p>
        <p className="text-[9px] m-0 font-bold flex items-center gap-0.5" style={{ color: mainColor }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          {Math.abs(change).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

const CATEGORY_TABS = ["All Ingredients", "Protien", "Vegetables", "Sauces", "Stock"];

function IngredientsView() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Ingredients");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const ING_SORT_COLS = [
    { key: "name",        label: "Name"     },
    { key: "category",   label: "Category" },
    { key: "fat",        label: "Fat"      },
    { key: "calories",   label: "Calories" },
    { key: "protein",    label: "Protein"  },
    { key: "sugar",      label: "Sugar"    },
    { key: "stock",      label: "Stock"    },
    { key: "costPerUnit",label: "Price"    },
  ];

  const { addToast } = useToast();

  const { data: metrics, isLoading: loadMetrics } = useIngredientsMetrics();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: ingredients, isLoading: loadIngredients, error } = useIngredients();
  const { mutate: uploadFile, isPending: isUploading } = useUploadIngredients();
  const { mutate: deleteIngredient } = useDeleteIngredient();
  const { mutate: createIngredient } = useCreateIngredient();
  const { mutate: updateIngredient } = useUpdateIngredient();

  const isLoading = loadMetrics || loadIngredients;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile(file, {
      onSuccess: () => addToast("Ingredients updated successfully!", "success"),
      onError:   () => addToast("Failed to upload ingredients.", "error"),
    });
    e.target.value = "";
  };

  const handleDelete = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteIngredient(deletingId, {
      onSuccess: () => addToast("Ingredient deleted", "success"),
      onError:   () => addToast("Failed to delete ingredient", "error"),
    });
    setDeletingId(null);
  };

  const handleModalSubmit = (formData) => {
    if (editingIngredient) {
      updateIngredient(
        { id: editingIngredient.id, data: formData },
        {
          onSuccess: () => { addToast("Ingredient updated!", "success"); setIsModalOpen(false); },
          onError: () => addToast("Failed to update ingredient", "error")
        }
      );
    } else {
      createIngredient(formData, {
        onSuccess: () => { addToast("Ingredient added!", "success"); setIsModalOpen(false); },
        onError: () => addToast("Failed to add ingredient", "error")
      });
    }
  };

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
        <ErrorState message="Failed to load ingredients data." onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const allIngredients = ingredients || [];
  const categories      = [...new Set(allIngredients.map((i) => i.category))];

  const filtered = (() => {
    let items = allIngredients.filter((item) => {
      const matchCat =
        activeCategory === "All Ingredients" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
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

  const getCategoryCount = (catName) => allIngredients.filter(i => i.category === catName).length;
  const getCategoryPct = (catName) => allIngredients.length ? Math.round((getCategoryCount(catName) / allIngredients.length) * 100) : 0;

  const metricRows = metrics
    ? [
        { label: "Total Ingredients", value: metrics.total || 0, pct: 100, change: metrics.totalChange || 1.58 },
        { label: "Protien",           value: getCategoryCount("Protein"),    pct: getCategoryPct("Protein"),  change: 0.92 },
        { label: "Vegetables",        value: getCategoryCount("Vegetables"), pct: getCategoryPct("Vegetables"),  change: 0.12 },
        { label: "Sauces",            value: getCategoryCount("Sauces"),     pct: getCategoryPct("Sauces"),  change: 0.92 },
        { label: "Out of stock",      value: metrics.outOfStock || 0, pct: metrics.total ? Math.round((metrics.outOfStock / metrics.total) * 100) : 0,  badge: true, change: metrics.outOfStockChange || 0.42 },
      ]
    : [];

  return (
    <div>
      <DashboardHeader title="Ingredients" />

      <div className="p-4 md:p-8 flex flex-col gap-6">

        {/* Top Metric Circle Cards */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {metricRows.map((m, i) => (
              <CircleMetric key={i} pct={m.pct} value={m.value} label={m.label} badge={m.badge} />
            ))}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-sm relative pb-10">

          {/* Toolbar */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex flex-row items-center justify-between mb-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-4 w-full overflow-x-auto">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCategory(tab)}
                    className={`px-4 py-1.5 text-[13px] font-bold cursor-pointer transition-all whitespace-nowrap ${
                      activeCategory === tab
                        ? "text-[#1a1a1a] border border-[#F97316] rounded-full bg-transparent"
                        : "text-[#1a1a1a] border border-transparent hover:text-orange-500 bg-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="shrink-0 flex items-center">
                {/* Sort */}
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
                  {["name", "Category", "Fat", "Cal", "Pro", "Sug", "Stock", "Price", "Edit", "Delet"].map((h, idx) => (
                    <th key={h} className={`px-4 py-2.5 text-[12px] font-bold text-[#1a1a1a] text-center ${idx === 0 ? "rounded-l-xl text-left pl-6" : ""} ${idx === 9 ? "rounded-r-xl" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10}><EmptyState title="No ingredients found" description="Adjust your search or add a new ingredient." /></td></tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-orange-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image || "https://img.icons8.com/color/48/tomato.png"} alt={item.name} className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-50 p-1" />
                          <span className="text-[12px] font-bold text-[#1a1a1a]">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px] font-medium text-[#1a1a1a] text-center">{item.category}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.fat || "-"}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.calories || "-"}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.protein || "-"}</td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#22C55E] text-center">{item.sugar || "-"}</td>
                      <td className={`px-4 py-4 text-[12px] font-bold text-center ${item.stock < 20 ? "text-red-500" : "text-[#1a1a1a]"}`}>
                        {item.stock >= 1000 ? `${(item.stock/1000).toFixed(0)}k` : item.stock}
                      </td>
                      <td className="px-4 py-4 text-[12px] font-bold text-[#F97316] text-center">{item.costPerUnit}</td>
                      <td className="px-4 py-4 text-center cursor-pointer hover:text-orange-500 transition-colors" onClick={() => { setEditingIngredient(item); setIsModalOpen(true); }}>
                        <FiEdit2 size={16} />
                      </td>
                      <td className="px-4 py-4 text-center cursor-pointer text-red-500 hover:text-red-600 transition-colors" onClick={() => handleDelete(item.id)}>
                        <FiTrash2 size={16} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Floating + Button */}
          <button onClick={() => { setEditingIngredient(null); setIsModalOpen(true); }} className="absolute bottom-6 right-6 w-12 h-12 bg-[#38761d] hover:bg-green-800 text-white rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer transition-transform hover:scale-105 z-10">
            <FiPlus size={24} />
          </button>
        </div>

        {/* Upload Button sitting on the yellow background */}
        <div className="flex justify-start">
          <label className={`bg-[#38761d] hover:bg-green-800 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-105 ${isUploading ? "opacity-50" : ""}`}>
            <FiUploadCloud size={20} className="text-[#F97316]" />
            <span className="text-[14px] font-bold">{isUploading ? "Uploading..." : "Upload ingredients file"}</span>
            <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      <IngredientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
