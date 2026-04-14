import { useState } from "react";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import { saveRecipe } from "../../services/dashboardService";
import { mockRecipeIngredients } from "../../mocks/dashboardMock";
import { FiPlus, FiTrash2, FiUpload } from "react-icons/fi";

const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-[10px] text-[13px] text-gray-700 bg-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors box-border";
const labelCls = "text-[12px] font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide";

function RecipeBuilderView() {
  const [form, setForm] = useState({ name: "", price: "", time: "", description: "", fat: "", calories: "", protein: "", sugar: "" });
  const [ingredients, setIngredients] = useState(mockRecipeIngredients);
  const [newIngredient, setNewIngredient] = useState({ name: "", amount: "", emoji: "🥦" });
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const addIngredient = () => {
    if (!newIngredient.name.trim()) return;
    setIngredients((prev) => [...prev, { id: Date.now(), ...newIngredient }]);
    setNewIngredient({ name: "", amount: "", emoji: "🥦" });
  };

  const removeIngredient = (id) => setIngredients((prev) => prev.filter((i) => i.id !== id));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await saveRecipe({ ...form, ingredients });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("[RecipeBuilder] save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const saveBtnCls = saved
    ? "bg-green-600"
    : saving
    ? "bg-orange-400 cursor-not-allowed"
    : !form.name.trim()
    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
    : "bg-orange-500 hover:bg-orange-600 cursor-pointer";

  return (
    <div>
      <DashboardHeader title="Recipe Builder" subtitle="Hello Basmala, Welcome back" />

      <div className="p-8 grid gap-6 items-start" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        {/* ── Left: Form ── */}
        <div className="flex flex-col gap-5">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4">Meal Details</h3>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className={labelCls}>Meal Name</label>
                <input className={inputCls} placeholder="e.g. Avocado Glow Bowl" value={form.name} onChange={handleChange("name")} />
              </div>
              <div>
                <label className={labelCls}>Price ($)</label>
                <input className={inputCls} type="number" placeholder="0.00" value={form.price} onChange={handleChange("price")} />
              </div>
              <div>
                <label className={labelCls}>Prep Time (min)</label>
                <input className={inputCls} type="number" placeholder="30" value={form.time} onChange={handleChange("time")} />
              </div>
            </div>
            <div className="mt-3.5">
              <label className={labelCls}>Description</label>
              <textarea
                className={`${inputCls} h-20 resize-y`}
                placeholder="Describe the meal..."
                value={form.description}
                onChange={handleChange("description")}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4">Ingredients</h3>

            {/* Ingredient list */}
            <div className="mb-3.5">
              {ingredients.map((ing) => (
                <div key={ing.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                  <span className="text-xl">{ing.emoji}</span>
                  <span className="flex-1 text-[13px] font-medium text-gray-700">{ing.name}</span>
                  <span className="text-xs text-gray-400 min-w-[50px]">{ing.amount}</span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ing.id)}
                    className="bg-transparent border-none cursor-pointer text-red-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add ingredient row */}
            <div className="flex gap-2 items-center">
              <input
                className="w-10 px-2 py-2 border border-gray-200 rounded-[10px] text-center text-lg outline-none focus:border-orange-500"
                value={newIngredient.emoji}
                onChange={(e) => setNewIngredient((p) => ({ ...p, emoji: e.target.value }))}
              />
              <input
                className={`${inputCls} flex-2`}
                placeholder="Ingredient name"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient((p) => ({ ...p, name: e.target.value }))}
              />
              <input
                className={`${inputCls} flex-1`}
                placeholder="Amount"
                value={newIngredient.amount}
                onChange={(e) => setNewIngredient((p) => ({ ...p, amount: e.target.value }))}
              />
              <button
                type="button"
                onClick={addIngredient}
                className="bg-orange-500 border-none rounded-[10px] text-white px-3.5 py-2.5 cursor-pointer flex items-center gap-1 text-xs font-semibold whitespace-nowrap hover:bg-orange-600 transition-colors"
              >
                <FiPlus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4">Nutritional Values</h3>
            <div className="grid grid-cols-4 gap-3.5">
              {[
                { field: "fat",      label: "Fat (g)",     emoji: "🧈" },
                { field: "calories", label: "Calories",    emoji: "🔥" },
                { field: "protein",  label: "Protein (g)", emoji: "💪" },
                { field: "sugar",    label: "Sugar (g)",   emoji: "🍬" },
              ].map(({ field, label, emoji }) => (
                <div key={field}>
                  <label className={labelCls}>{emoji} {label}</label>
                  <input className={inputCls} type="number" placeholder="0" value={form[field]} onChange={handleChange(field)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Image + Save ── */}
        <div className="flex flex-col gap-5 sticky top-[88px]">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl p-[22px] shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-4">Meal Preview</h3>
            <label
              htmlFor="meal-image"
              className={`flex flex-col items-center justify-center gap-3 h-[280px] rounded-xl border-2 border-dashed border-orange-200 cursor-pointer overflow-hidden transition-colors hover:border-orange-400 ${imagePreview ? "" : "bg-[#FFF8F0]"}`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="meal preview" className="w-full h-full object-cover rounded-[10px]" />
              ) : (
                <>
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">
                    <FiUpload size={22} className="text-orange-500" />
                  </div>
                  <p className="text-[13px] text-gray-400 m-0 text-center">Click to upload meal photo</p>
                  <p className="text-[11px] text-gray-300 m-0">PNG, JPG up to 5MB</p>
                </>
              )}
              <input id="meal-image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {imagePreview && (
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="mt-2.5 w-full bg-transparent border border-gray-200 rounded-lg py-1.5 text-xs text-gray-500 cursor-pointer hover:border-gray-400 transition-colors"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className={`w-full py-3.5 rounded-xl border-none text-sm font-bold text-white transition-all duration-200 tracking-wide ${saveBtnCls}`}
          >
            {saved ? "✓ Meal Saved!" : saving ? "Saving..." : "Add Meal"}
          </button>

          {/* Summary card */}
          {form.name && (
            <div className="bg-[#FFF8F0] rounded-xl p-4 border border-[#FFE8CC]">
              <p className="text-[12px] font-bold text-orange-500 mb-2 uppercase tracking-wide">Summary</p>
              <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{form.name}</p>
              {form.price && <p className="text-[13px] text-gray-500 mb-0.5">Price: ${form.price}</p>}
              {form.time  && <p className="text-[13px] text-gray-500 mb-0.5">Time: {form.time} min</p>}
              <p className="text-[13px] text-gray-500 m-0">{ingredients.length} ingredients</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeBuilderView;
