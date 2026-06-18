import { useState, useEffect } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";

// ── Regex validators ────────────────────────────────────────────────
const VALIDATORS = {
  name:        { pattern: /^[a-zA-Z\u0600-\u06FF\s]{2,60}$/, msg: "2–60 letters only" },
  costPerUnit: { pattern: /^\d+(\.\d{1,2})?\$?$/, msg: "e.g. 40 or 40.50" },
  stock:       { pattern: /^\d+$/, msg: "Whole numbers only" },
  nutrient:    { pattern: /^\d+(\.\d+)?g?$/, msg: "e.g. 15 or 15g" },
};

// ── Character-level blockers (prevent typing invalid chars) ─────────
const FILTERS = {
  name:        (v) => v.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, ""),
  costPerUnit: (v) => v.replace(/[^\d.$]/g, "").replace(/(\.\d{2})\d+/, "$1"),
  stock:       (v) => v.replace(/\D/g, ""),
  nutrient:    (v) => v.replace(/[^\d.g]/g, "").replace(/(\.\d+)g?.*/, "$1g"),
};

const EMPTY_FORM = {
  name: "", category: "Vegetables",
  fat: "", calories: "", protein: "", sugar: "",
  stock: "", costPerUnit: "",
};

/**
 * Renders a labeled form field with optional error message.
 */
function Field({ htmlFor, label, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[13px] font-bold text-gray-700 mb-1">{label}</label>
      {children}
      {error && (
        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

/**
 * Modal form for adding or editing an ingredient.
 *
 * @param {boolean} isOpen - Controls visibility of the modal.
 * @param {Function} onClose - Callback invoked when the user closes the modal.
 * @param {Function} onSubmit - Callback invoked with validated form data upon successful submission.
 * @param {Object} [initialData] - Pre-populated ingredient data for editing. When provided, the modal operates in edit mode.
 * @returns {ReactElement|null} The rendered modal if open, otherwise null.
 */
function IngredientModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const validate = (field, value) => {
    const v = String(value).trim();
    if (field === "name")        return VALIDATORS.name.pattern.test(v)        ? "" : VALIDATORS.name.msg;
    if (field === "costPerUnit") return VALIDATORS.costPerUnit.pattern.test(v)  ? "" : VALIDATORS.costPerUnit.msg;
    if (field === "stock")       return VALIDATORS.stock.pattern.test(v)        ? "" : VALIDATORS.stock.msg;
    if (["fat","calories","protein","sugar"].includes(field)) {
      if (!v) return ""; // optional
      return VALIDATORS.nutrient.pattern.test(v) ? "" : VALIDATORS.nutrient.msg;
    }
    return "";
  };

  const getFilter = (field) => {
    if (field === "name")        return FILTERS.name;
    if (field === "costPerUnit") return FILTERS.costPerUnit;
    if (field === "stock")       return FILTERS.stock;
    if (["fat","calories","protein","sugar"].includes(field)) return FILTERS.nutrient;
    return (v) => v;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const filtered = getFilter(name)(value);
    setFormData((prev) => ({ ...prev, [name]: filtered }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, filtered) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ["name", "costPerUnit", "stock"];
    const optional = ["fat", "calories", "protein", "sugar"];
    const newErrors = {};
    [...required, ...optional].forEach((f) => {
      const err = validate(f, formData[f] ?? "");
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries([...required, ...optional].map((f) => [f, true])));
    if (Object.keys(newErrors).length > 0) return;

    // Normalize nutrients to end with "g"
    const normalized = { ...formData };
    optional.forEach((f) => {
      if (normalized[f] && !/g$/.test(normalized[f])) normalized[f] += "g";
    });

    onSubmit(normalized);
  };

  const inputClass = (field) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-2 text-[14px] focus:outline-none transition-colors ${
      errors[field] ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-orange-400"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-[18px] font-bold text-[#1a1a1a]">
            {isEditing ? "Edit Ingredient" : "Add Ingredient"}
          </h2>
         <button type="button" aria-label="Close ingredient modal" onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
<form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4" noValidate>

  <Field htmlFor="ingredient-name" label="Name" error={errors.name}>
    <input
      id="ingredient-name"
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="e.g. Tomatoes"
      className={inputClass("name")}
    />
  </Field>


  <div className="grid grid-cols-2 gap-4">
    <Field htmlFor="ingredient-category" label="Category">
      <select
        id="ingredient-category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        className={inputClass("category")}
      >
        <option value="Vegetables">Vegetables</option>
        <option value="Protein">Protein</option>
        <option value="Sauces">Sauces</option>
        <option value="Stock">Stock</option>
      </select>
    </Field>


    <Field
      htmlFor="ingredient-stock"
      label="Stock Amount"
      error={errors.stock}
    >
      <input
        id="ingredient-stock"
        type="text"
        name="stock"
        value={formData.stock}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g. 5000"
        className={inputClass("stock")}
      />
    </Field>
  </div>


  <div className="grid grid-cols-2 gap-4">
    <Field
      htmlFor="ingredient-cost"
      label="Price (e.g. 40)"
      error={errors.costPerUnit}
    >
      <input
        id="ingredient-cost"
        type="text"
        name="costPerUnit"
        value={formData.costPerUnit}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="40"
        className={inputClass("costPerUnit")}
      />
    </Field>


    <Field
      htmlFor="ingredient-fat"
      label="Fat (optional)"
      error={errors.fat}
    >
      <input
        id="ingredient-fat"
        type="text"
        name="fat"
        value={formData.fat}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="e.g. 15g"
        className={inputClass("fat")}
      />
    </Field>
  </div>


  <div className="grid grid-cols-3 gap-4">
    <Field
      htmlFor="ingredient-calories"
      label="Calories"
      error={errors.calories}
    >
      <input
        id="ingredient-calories"
        type="text"
        name="calories"
        value={formData.calories}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="47g"
        className={inputClass("calories")}
      />
    </Field>


    <Field
      htmlFor="ingredient-protein"
      label="Protein"
      error={errors.protein}
    >
      <input
        id="ingredient-protein"
        type="text"
        name="protein"
        value={formData.protein}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="25g"
        className={inputClass("protein")}
      />
    </Field>


    <Field
      htmlFor="ingredient-sugar"
      label="Sugar"
      error={errors.sugar}
    >
      <input
        id="ingredient-sugar"
        type="text"
        name="sugar"
        value={formData.sugar}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="5g"
        className={inputClass("sugar")}
      />
    </Field>
  </div>


  <div className="mt-2 flex gap-3 justify-end">
    <button
      type="button"
      onClick={onClose}
      className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
    >
      Cancel
    </button>

    <button
      type="submit"
      className="px-5 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
    >
      {isEditing ? "Save Changes" : "Add Ingredient"}
    </button>
  </div>

</form>
      </div>
    </div>
  );
}

export default IngredientModal;
