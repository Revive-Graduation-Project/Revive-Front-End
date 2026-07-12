import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiImage, FiSave, FiAlertCircle, FiList } from "react-icons/fi";
import { useUpdateMenuItem, useMenuCategories } from "../../../hooks/dashboard/useMenuItems";
import { toast } from "../../../utils/toastUtils";
import ModalWrapper from "./ModalWrapper";

const EditMealModal = ({ isOpen, onClose, meal }) => {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { data: categories } = useMenuCategories();
  const categoryOptions = categories?.items?.map(c => c.name) || ["General", "Main Course", "Appetizer", "Dessert", "Beverage"];

  const { mutate: updateItem, isPending } = useUpdateMenuItem();

  useEffect(() => {
    if (meal && isOpen) {
      setFormData({
        name: meal.name || "",
        description: meal.description || "",
        category: meal.category || "General",
        price: meal.price || 0,
      });
      setImageFile(null);
      setPreviewUrl(meal.image || meal.imageUrl || null);
    }
  }, [meal, isOpen]);

  if (!isOpen || !meal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds 5MB limit.");
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Meal name is required.");
    if (formData.price < 0) return toast.error("Price cannot be negative.");

    updateItem(
      { id: meal.id, data: { ...formData, imageFile } },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Edit Meal Details" isPending={isPending}>
      <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              
              {/* Left Column: Image Upload */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <p className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Photo</p>
                <label className="relative w-full aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-orange-300 transition-colors group">
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiUploadCloud className="text-white mb-2" size={24} />
                        <span className="text-white text-xs font-bold">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiImage className="text-gray-300 mb-2" size={32} />
                      <span className="text-gray-400 text-xs font-medium">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-[11px] text-gray-400 text-center">Supported: JPG, PNG (Max 5MB)</p>
              </div>

              {/* Right Column: Fields */}
              <div className="w-full md:w-2/3 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase">Meal Name</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
                      placeholder="e.g. Avocado Toast"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-colors appearance-none"
                    >
                      {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                      {!categoryOptions.includes(formData.category) && <option value={formData.category}>{formData.category}</option>}
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[12px] font-bold text-gray-700 mb-1.5 uppercase">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-colors resize-none"
                      placeholder="Brief description of the meal..."
                    />
                  </div>
                </div>

                {/* Read-Only Nutrition & Ingredients */}
                <div className="mt-2 bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-3">
                      <FiAlertCircle size={16} />
                      <span className="text-[12px] font-bold uppercase tracking-wide">Nutrition (Auto-calculated)</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-white rounded-lg py-2 border border-blue-50"><span className="block text-[10px] text-gray-500 font-medium">Calories</span><span className="text-[13px] font-bold text-gray-800">{meal.calories || '-'}</span></div>
                      <div className="bg-white rounded-lg py-2 border border-blue-50"><span className="block text-[10px] text-gray-500 font-medium">Protein</span><span className="text-[13px] font-bold text-gray-800">{meal.protein || '-'}</span></div>
                      <div className="bg-white rounded-lg py-2 border border-blue-50"><span className="block text-[10px] text-gray-500 font-medium">Fat</span><span className="text-[13px] font-bold text-gray-800">{meal.fat || '-'}</span></div>
                      <div className="bg-white rounded-lg py-2 border border-blue-50"><span className="block text-[10px] text-gray-500 font-medium">Sugar</span><span className="text-[13px] font-bold text-gray-800">{meal.sugar || '-'}</span></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <FiList size={16} />
                      <span className="text-[12px] font-bold uppercase tracking-wide">Ingredients</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-50 flex flex-wrap gap-2">
                      {meal.ingredients && meal.ingredients.length > 0 ? (
                        meal.ingredients.map((ing, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-50 rounded text-[11px] font-medium text-gray-600 border border-gray-100">
                            {ing.name} ({ing.quantity}{ing.unit})
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-gray-400">No ingredients specified.</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 mt-1 text-center">Ingredients and nutrition must be updated via CSV or Recipe Builder.</p>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl text-gray-600 font-semibold text-[13px] hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-bold text-[13px] flex items-center gap-2 shadow-md shadow-orange-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Saving..." : <><FiSave size={16} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </form>
    </ModalWrapper>
  );
};

export default EditMealModal;
