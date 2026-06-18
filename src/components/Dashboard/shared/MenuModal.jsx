import { useState, useEffect } from "react";
import { FiX, FiAlertCircle, FiUploadCloud } from "react-icons/fi";

// ── Regex validators ────────────────────────────────────────────────
const VALIDATORS = {
  name:     { pattern: /^[a-zA-Z\u0600-\u06FF\s]{2,60}$/, msg: "2–60 letters only" },
  price:    { pattern: /^\d+(\.\d{1,2})?$/,               msg: "e.g. 15 or 15.99" },
  nutrient: { pattern: /^\d+(\.\d+)?g?$/,                 msg: "e.g. 25 or 25g" },
};

// ── Character-level blockers ────────────────────────────────────────
const FILTERS = {
  name:     (v) => v.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, ""),
  price:    (v) => v.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1").replace(/(\.\d{2})\d+/, "$1"),
  nutrient: (v) => v.replace(/[^\d.g]/g, "").replace(/(\.\d+)g?.*/, "$1g"),
};

const EMPTY_FORM = {
  name: "", category: "Chicken",
  fat: "", calories: "", protein: "", sugar: "", price: "", image: "",
};

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-bold text-gray-700 mb-1">{label}</label>
      {children}
      {error && (
        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
          <FiAlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function MenuModal({ isOpen, onClose, onSubmit, initialData }) {
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
    if (field === "name")  return VALIDATORS.name.pattern.test(v)  ? "" : VALIDATORS.name.msg;
    if (field === "price") return VALIDATORS.price.pattern.test(v) ? "" : VALIDATORS.price.msg;
    if (["fat","calories","protein","sugar"].includes(field)) {
      if (!v) return ""; // optional
      return VALIDATORS.nutrient.pattern.test(v) ? "" : VALIDATORS.nutrient.msg;
    }
    return "";
  };

  const getFilter = (field) => {
    if (field === "name")  return FILTERS.name;
    if (field === "price") return FILTERS.price;
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: url }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ["name", "price"];
    const optional = ["fat", "calories", "protein", "sugar"];
    const newErrors = {};
    [...required, ...optional].forEach((f) => {
      const err = validate(f, formData[f] ?? "");
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries([...required, ...optional].map((f) => [f, true])));
    if (Object.keys(newErrors).length > 0) return;

    // Normalize nutrients
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
            {isEditing ? "Edit Meal" : "Add Meal"}
          </h2>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4" noValidate>

          <Field label="Meal Name" id="nameInput" error={errors.name}>
            <input
              id="nameInput"
              type="text" name="name" value={formData.name}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="e.g. Grilled Chicken"
              maxLength={60}
              className={inputClass("name")}
            />
          </Field>

          <Field label="Meal Image">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="imageInput"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-xl cursor-pointer text-[13px] font-bold text-gray-600 hover:text-orange-500 transition-colors w-fit shadow-sm"
              >
                <FiUploadCloud size={18} />
                <span>Upload Photo</span>
              </label>
              <input
                id="imageInput"
                type="file" accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
              )}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" id="categoryInput">
              <select id="categoryInput" name="category" value={formData.category} onChange={handleChange} className={inputClass("category")}>
                <option value="Chicken">Chicken</option>
                <option value="Mixed">Mixed</option>
                <option value="Meat">Meat</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Seafood">Seafood</option>
              </select>
            </Field>
            <Field label="Price (e.g. 15.99)" id="priceInput" error={errors.price}>
              <input
                id="priceInput"
                type="text" name="price" value={formData.price}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="15.99"
                className={inputClass("price")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Fat (optional)" id="fatInput" error={errors.fat}>
              <input id="fatInput" type="text" name="fat" value={formData.fat} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 18g" className={inputClass("fat")} />
            </Field>
            <Field label="Calories (optional)" id="caloriesInput" error={errors.calories}>
              <input id="caloriesInput" type="text" name="calories" value={formData.calories} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 520g" className={inputClass("calories")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Protein (optional)" id="proteinInput" error={errors.protein}>
              <input id="proteinInput" type="text" name="protein" value={formData.protein} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 38g" className={inputClass("protein")} />
            </Field>
            <Field label="Sugar (optional)" id="sugarInput" error={errors.sugar}>
              <input id="sugarInput" type="text" name="sugar" value={formData.sugar} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 4g" className={inputClass("sugar")} />
            </Field>
          </div>

          <div className="mt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
              {isEditing ? "Save Changes" : "Add Meal"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default MenuModal;
