import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import DashboardHeader from "./DashboardHeader";
import { useCreateMenuItem, useUpdateMenuItem } from "../../hooks/dashboard/useMenuItems";
import { useIngredients } from "../../hooks/dashboard/useIngredients";
import {
  FiPlus, FiTrash2, FiCamera, FiBookOpen, FiDollarSign,
  FiAlignLeft, FiChevronDown, FiGrid, FiUploadCloud, FiSearch, FiX
} from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";
import IngredientSelector from "./shared/IngredientSelector";

export default function RecipeBuilderView() {
  const { state } = useLocation();
  const editMeal = state?.editMeal ?? null;

  const [form, setForm] = useState({ name: "", category: "", price: "", description: "" });
  const [localIngredients, setLocalIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: "", amount: "" });
  const [isCustomName, setIsCustomName] = useState(false);
  const [mealImagePreview, setMealImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);


  const { data: availableIngredients = [] } = useIngredients();
  const { mutate: createMeal, isSuccess: created, isPending: creating, isLoading: createLoading, reset: resetCreate } = useCreateMenuItem();
  const { mutate: updateMeal, isSuccess: updated, isPending: updating, isLoading: updateLoading, reset: resetUpdate } = useUpdateMenuItem();
  const isSaving = creating || createLoading || updating || updateLoading;
  const saved = created || updated;

  // Pre-fill form when editing an existing meal
  useEffect(() => {
    if (editMeal) {
      setForm({
        name: editMeal.name ?? "",
        category: editMeal.category ?? "",
        price: editMeal.price !== undefined ? String(editMeal.price) : "",
        description: editMeal.description ?? "",
      });
      if (editMeal.image) setMealImagePreview(editMeal.image);
      if (editMeal.ingredients?.length) {
        const normIngs = editMeal.ingredients.map((ing, idx) => {
          const name = typeof ing === "object" && ing !== null
            ? (ing.name || ing.ingredient?.name || ing.ingredientName || ing.snapshotName || "Ingredient")
            : String(ing);
          const rawAmt = typeof ing === "object" && ing !== null
            ? (ing.amount !== undefined ? ing.amount : (ing.quantityGrams !== undefined ? ing.quantityGrams : (ing.quantity !== undefined ? ing.quantity : "0")))
            : "0";
          const unit = typeof ing === "object" && ing !== null ? (ing.unit || "g") : "g";
          const amount = typeof rawAmt === "string" && rawAmt.endsWith(unit) ? rawAmt : `${rawAmt}${unit}`;
          return {
            ...(typeof ing === "object" && ing !== null ? ing : {}),
            id: typeof ing === "object" && ing !== null ? (ing.id || ing.ingredientId || Date.now() + idx) : Date.now() + idx,
            ingredientId: typeof ing === "object" && ing !== null ? (ing.ingredientId || ing.ingredient?.id || ing.id) : undefined,
            name: String(name).trim(),
            amount,
            unit,
          };
        });
        setLocalIngredients(normIngs);
      }
    }
  }, [editMeal]);

  // Initial ingredients was removed because it hit a mock endpoint

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  /** Price: digits and single decimal point only → positive number */
  const handlePriceInput = (e) => {
    const val = e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    setForm(f => ({ ...f, price: val }));
  };

  const addIngredient = () => {
    if (!newIngredient.name.trim() || newIngredient.name === "__custom__") return;
    const cleanNum = newIngredient.amount ? String(newIngredient.amount).replace(/[^\d.]/g, "") : "0";
    const formattedAmount = `${cleanNum || "0"}${newIngredient.unit || "g"}`;
    setLocalIngredients((prev) => [...prev, { id: Date.now(), ...newIngredient, amount: formattedAmount }]);
    setNewIngredient({ name: "", amount: "", ingredientId: undefined, unit: "g" });
    setIsCustomName(false);
  };

  const handleIngredientAmountInput = (e) => {
    // Like parseStock in Ingredients page: edit numeric digits directly
    const val = e.target.value.replace(/[^\d.]/g, "").replace(/^(\d*\.?\d*).*/, "$1");
    setNewIngredient(p => ({ ...p, amount: val }));
  };

  const removeIngredient = (id) => setLocalIngredients((prev) => prev.filter((i) => i.id !== id));

  const handleMealImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setMealImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const payload = { ...(editMeal || {}), ...form, id: editMeal ? (editMeal.id || editMeal._id) : undefined, ingredients: localIngredients, imageFile };
    const options = {
      onSuccess: () => {
        setTimeout(() => {
          if (!editMeal) {
            setForm({ name: "", category: "", price: "", description: "" });
            setMealImagePreview(null);
            setImageFile(null);
            setLocalIngredients([]);
          }
          resetCreate();
          resetUpdate();
        }, 2000);
      },
    };

    if (editMeal) {
      updateMeal({ id: editMeal.id || editMeal._id, data: payload }, options);
    } else {
      createMeal(payload, options);
    }
  };

  const isFormComplete =
    form.name.trim() !== "" &&
    form.category !== "" &&
    form.price !== "" &&
    form.description.trim() !== "" &&
    localIngredients.length > 0 &&
    mealImagePreview !== null;

  const pageTitle = editMeal ? `Editing: ${editMeal.name}` : "Recipe Builder";
  const pageSubtitle = editMeal
    ? "Update the meal details and ingredients below."
    : "Craft exceptional culinary creations. Add ingredients and meal details to build your custom recipe for the menu.";

  return (
    <div className="pb-12">
      <DashboardHeader title={editMeal ? "Edit Meal" : "Recipe Builder"} />

      {/* ── Top Header Section ── */}
      <div className="text-center pt-8 pb-10 px-4">
        <h2 className="text-[20px] font-bold text-[#1a1a1a] mb-2 tracking-tight">{pageTitle}</h2>
        <p className="text-[13px] text-gray-500 max-w-[450px] mx-auto leading-relaxed font-medium">
          {pageSubtitle}
        </p>
      </div>

      <div className="px-4 md:px-12 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-x-12 gap-y-10 items-start">
        {/* ── Left Column ── */}
        <div className="flex flex-col gap-8">

          {/* Meal Information */}
          <div>
            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-5">Meal Information</h3>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[14px] font-medium text-[#1a1a1a] mb-2">Meal Name</p>
                  <div className="bg-white rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm border border-transparent focus-within:border-orange-200 transition-colors">
                    <FiBookOpen className="text-gray-400 shrink-0" size={16} />
                    <input placeholder="Enter meal name..." className="bg-transparent border-none outline-none w-full text-[13px] font-medium text-gray-600" value={form.name} onChange={handleChange("name")} />
                  </div>
                </div>
                <div className="relative">
                  <p className="text-[14px] font-medium text-[#1a1a1a] mb-2">Category</p>
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryOpen}
                    className="w-full text-left bg-white rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm border border-transparent hover:border-orange-200 focus:border-orange-200 focus:outline-none transition-colors cursor-pointer"
                  >
                    <FiGrid className="text-gray-400 shrink-0" size={16} />
                    <span className={`text-[13px] font-medium flex-1 ${form.category ? 'text-gray-700' : 'text-gray-400'}`}>
                      {form.category || "Select category..."}
                    </span>
                    <FiChevronDown className="text-gray-400 shrink-0" size={14} />
                  </button>

                  {isCategoryOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} aria-hidden="true" tabIndex={-1}></div>
                      <div className="absolute top-[76px] left-0 w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 z-50 border border-gray-100/50" role="listbox">
                        {["Chicken", "Meat", "Seafood", "Vegetarian", "Desserts", "Mixed"].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              role="option"
                              aria-selected={form.category === cat}
                              onClick={() => { setForm(f => ({ ...f, category: cat })); setIsCategoryOpen(false); }}
                              className={`w-full text-left px-5 py-2.5 text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-between focus:outline-none focus:bg-gray-50 ${form.category === cat ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                                }`}
                            >
                              {cat}
                            </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[14px] font-medium text-[#1a1a1a] mb-2">Price</p>
                <div className="bg-white rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm">
                  <FiDollarSign className="text-gray-400 shrink-0" size={16} />
                  <input placeholder="Enter meal price..." className="bg-transparent border-none outline-none w-full text-[13px] font-medium text-gray-600" value={form.price} onChange={handlePriceInput} />
                </div>
              </div>

              <div>
                <p className="text-[14px] font-medium text-[#1a1a1a] mb-2">Meal Description</p>
                <div className="bg-white rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm border border-transparent focus-within:border-orange-200 transition-colors">
                  <FiAlignLeft className="text-gray-400 shrink-0" size={16} />
                  <input placeholder="Enter meal description..." className="bg-transparent border-none outline-none w-full text-[13px] font-medium text-gray-600" value={form.description} onChange={handleChange("description")} />
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient */}
          <div>
            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-5">Ingredient</h3>
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50/50">
              {/* Header */}
              <div className="grid grid-cols-[2fr_1fr] border-b border-gray-200 pb-3 mb-5 px-4">
                <p className="text-[14px] font-medium text-[#1a1a1a] text-center">Name</p>
                <p className="text-[14px] font-medium text-[#1a1a1a] text-center">Amount</p>
              </div>

              {/* List */}
              <div className="flex flex-col gap-4 mb-4">
                {localIngredients.map((ing) => (
                  <div key={ing.id} className="grid grid-cols-[2fr_1fr] items-center gap-4 group relative px-4">
                    <div className="bg-[#F5F6F8] rounded-full py-1.5 px-4 text-center">
                      <span className="text-[12px] font-medium text-gray-600">{ing.name}</span>
                    </div>
                    <div className="bg-[#F5F6F8] rounded-full py-1.5 px-4 text-center">
                      <span className="text-[12px] font-medium text-gray-600">{ing.amount}</span>
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={() => removeIngredient(ing.id)}
                      className="absolute -left-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Row */}
              <div className="grid grid-cols-[2fr_1fr] items-center gap-4 mt-8 px-4">
                <IngredientSelector
                  availableIngredients={availableIngredients}
                  newIngredient={newIngredient}
                  setNewIngredient={setNewIngredient}
                  isCustomName={isCustomName}
                  setIsCustomName={setIsCustomName}
                />
                <div className="bg-[#F5F6F8] rounded-full py-1.5 px-4 text-center flex items-center justify-center gap-1">
                  <input
                    className="bg-transparent text-[12px] font-medium text-gray-600 border-none outline-none w-full text-center"
                    placeholder="0"
                    value={newIngredient.amount}
                    onChange={handleIngredientAmountInput}
                  />
                  <span className="text-[12px] font-bold text-gray-400 shrink-0">{newIngredient.unit || "g"}</span>
                </div>
              </div>

              <div className="flex justify-end mt-6 pr-4">
                <button onClick={addIngredient} className="bg-[#16A34A] hover:bg-green-700 text-white rounded-full p-2.5 transition-colors shadow-md">
                  <FiPlus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col gap-8 pt-10 lg:pt-14">

          {/* ── Top Section: Image Upload ── */}
          <div className="col-span-1 lg:col-span-2 relative mt-4">
            <div className="w-full h-[280px] bg-white rounded-4xl flex flex-col items-center justify-center relative overflow-hidden shadow-sm group">
              {mealImagePreview ? (
                <>
                  <img src={mealImagePreview} alt="Meal Preview" className="w-full h-full object-cover" />
                  <label className="absolute bottom-4 right-4 cursor-pointer bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform z-10">
                    <FiCamera className="text-orange-500" size={20} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleMealImageUpload} />
                  </label>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-green-200 rounded-4xl hover:bg-green-50/50 transition-colors shadow-[0_4px_25px_rgba(34,197,94,0.08)] cursor-pointer group-hover:border-green-300">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center shadow-[0_8px_20px_rgba(34,197,94,0.25)] mb-4 transition-transform group-hover:-translate-y-1">
                    <FiUploadCloud size={28} className="text-green-700" />
                  </div>
                  <span className="text-[16px] font-bold text-green-700 tracking-wide">Upload Meal Image Here</span>
                  <span className="text-[13px] font-medium text-gray-400 mt-2">Supports JPG, PNG, WEBP</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleMealImageUpload} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Section ── */}
        {isFormComplete && (
          <div className="col-span-1 lg:col-span-2 mt-2 mb-12 flex justify-center transition-all duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center shadow-sm w-full max-w-2xl">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-8">
                {editMeal ? "Do you want to update this meal in Menu ?" : "Do you want to add this meal to Menu ?"}
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                <button
                  onClick={() => {
                    setForm({ name: "", category: "", price: "", time: "", description: "" });
                    setMealImagePreview(null);
                    setLocalIngredients([]);
                  }}
                  className="cursor-pointer bg-white text-[#1a1a1a] font-bold py-3.5 px-12 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100 hover:bg-gray-300 transition-colors w-full sm:w-auto"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || saved}
                  className="cursor-pointer bg-orange-400 text-white font-bold py-3.5 px-12 rounded-2xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-colors w-full sm:w-auto disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? (editMeal ? "Updating..." : "Adding...")
                    : saved
                      ? (editMeal ? "Updated!" : "Added!")
                      : (editMeal ? "Update Meal" : "Add Meal")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
