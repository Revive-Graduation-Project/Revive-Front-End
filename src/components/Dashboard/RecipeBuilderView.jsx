import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { useRecipeIngredients, useSaveRecipe } from "../../hooks/dashboard/useMenuItems";
import { useToast } from "./shared/useToast";
import { 
  FiPlus, FiTrash2, FiCamera, FiBookOpen, FiDollarSign, 
  FiClock, FiAlignLeft, FiChevronUp, FiChevronDown, FiShare2, FiTarget, FiUser, FiEye, FiGrid, FiUploadCloud
} from "react-icons/fi";
import { DashboardPageSkeleton } from "./shared/DashboardSkeleton";
import ErrorState from "./shared/ErrorState";

export default function RecipeBuilderView() {
  const { state } = useLocation();
  const editMeal = state?.editMeal ?? null;

  const [form, setForm] = useState({ name: "", category: "", price: "", time: "", description: "", fat: "", calories: "", protein: "", sugar: "" });
  const [localIngredients, setLocalIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({ name: "", amount: "", imagePreview: null });
  const [mealImagePreview, setMealImagePreview] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const { addToast } = useToast();
  const { data: initialIngredients, isLoading: loadIngredients, error: errIngredients } = useRecipeIngredients();
  const { mutate: saveRecipe, isPending: saving, isSuccess: saved, reset: resetMutation } = useSaveRecipe();

  // Pre-fill form when editing an existing meal
  useEffect(() => {
    if (editMeal) {
      setForm({
        name:        editMeal.name        ?? "",
        category:    editMeal.category    ?? "",
        price:       editMeal.price !== undefined ? String(editMeal.price) : "",
        time:        editMeal.time         ?? "",
        description: editMeal.description  ?? "",
        fat:         editMeal.fat          ?? "",
        calories:    editMeal.calories     ?? "",
        protein:     editMeal.protein      ?? "",
        sugar:       editMeal.sugar        ?? "",
      });
      if (editMeal.image) setMealImagePreview(editMeal.image);
      if (editMeal.ingredients?.length) setLocalIngredients(editMeal.ingredients);
    }
  }, [editMeal]);

  useEffect(() => {
    if (initialIngredients && localIngredients.length === 0 && !editMeal) {
      setLocalIngredients(initialIngredients);
    }
  }, [initialIngredients, localIngredients.length, editMeal]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleNutrientInput = (field) => (e) => {
    let val = e.target.value.replace(/[^\d]/g, "");
    setForm((f) => ({ ...f, [field]: val ? val + "g" : "" }));
  };

  /** Price: digits and single decimal point only → positive number */
  const handlePriceInput = (e) => {
    const val = e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
    setForm(f => ({ ...f, price: val }));
  };

  /** Time: digits only → positive integer (minutes) */
  const handleTimeInput = (e) => {
    const val = e.target.value.replace(/[^\d]/g, "");
    setForm(f => ({ ...f, time: val }));
  };

  const adjustNutrient = (field, delta) => {
    setForm((f) => {
      let current = parseInt((f[field] || "").replace(/[^\d]/g, ""), 10);
      if (isNaN(current)) current = 0;
      let next = Math.max(0, current + delta);
      return { ...f, [field]: next + "g" };
    });
  };

  const addIngredient = () => {
    if (!newIngredient.name.trim()) return;
    setLocalIngredients((prev) => [...prev, { id: Date.now(), ...newIngredient }]);
    setNewIngredient({ name: "", amount: "", imagePreview: null });
  };

  const handleIngredientAmountInput = (e) => {
    let val = e.target.value.toLowerCase();
    // Strictly allow numbers, optional spaces, and exactly "g", "m", or "ml"
    if (/^\d*\s*(m|ml|g)?$/.test(val)) {
      setNewIngredient(p => ({ ...p, amount: val }));
    }
  };

  const removeIngredient = (id) => setLocalIngredients((prev) => prev.filter((i) => i.id !== id));

  const handleMealImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setMealImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setNewIngredient(p => ({ ...p, imagePreview: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    saveRecipe(
      { ...form, ingredients: localIngredients },
      {
        onSuccess: () => {
          addToast("Recipe saved successfully!", "success");
          setTimeout(() => {
            setForm({ name: "", category: "", price: "", time: "", description: "", fat: "", calories: "", protein: "", sugar: "" });
            setMealImagePreview(null);
            setLocalIngredients([]);
            resetMutation();
          }, 2000);
        },
        onError: () => {
          addToast("Failed to save recipe. Please try again.", "error");
        }
      }
    );
  };

  const isFormComplete = 
    form.name.trim() !== "" && 
    form.category !== "" &&
    form.price !== "" && 
    form.time !== "" && 
    form.description.trim() !== "" &&
    form.fat !== "" &&
    form.calories !== "" &&
    form.protein !== "" &&
    form.sugar !== "" &&
    localIngredients.length > 0 &&
    mealImagePreview !== null;

  if (loadIngredients && !editMeal) return <div><DashboardHeader title={editMeal ? "Edit Meal" : "Recipe Builder"} /><DashboardPageSkeleton /></div>;
  if (errIngredients) return <div><DashboardHeader title={editMeal ? "Edit Meal" : "Recipe Builder"} /><ErrorState message="Failed to load recipe data." onRetry={() => window.location.reload()} /></div>;

  const pageTitle = editMeal ? `Editing: ${editMeal.name}` : "Recipe Builder";
  const pageSubtitle = editMeal
    ? "Update the meal details, ingredients, and nutritional values below."
    : "Craft balanced, nutritionally optimized meals. Every ingredient added dynamically updates the macro profile to ensure culinary excellence meets dietary precision.";

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
                  <div 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="bg-white rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm border border-transparent hover:border-orange-200 focus-within:border-orange-200 transition-colors cursor-pointer"
                  >
                    <FiGrid className="text-gray-400 shrink-0" size={16} />
                    <span className={`text-[13px] font-medium flex-1 ${form.category ? 'text-gray-700' : 'text-gray-400'}`}>
                      {form.category || "Select category..."}
                    </span>
                    <FiChevronDown className="text-gray-400 shrink-0" size={14} />
                  </div>
                  
                  {isCategoryOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)}></div>
                      <div className="absolute top-[76px] left-0 w-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 z-50 border border-gray-100/50">
                        {["Chicken", "Meat", "Seafood", "Vegetarian", "Desserts", "Mixed"].map(cat => (
                          <div 
                            key={cat}
                            onClick={() => { setForm(f => ({ ...f, category: cat })); setIsCategoryOpen(false); }}
                            className={`px-5 py-2.5 text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-between ${
                              form.category === cat ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-orange-500"
                            }`}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[14px] font-medium text-[#1a1a1a] mb-2">Price</p>
                  <div className="bg-white rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm">
                    <FiDollarSign className="text-gray-400 shrink-0" size={16} />
                    <input placeholder="Enter meal price..." className="bg-transparent border-none outline-none w-full text-[13px] font-medium text-gray-600" value={form.price} onChange={handlePriceInput} />
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#1a1a1a] mb-2">Time</p>
                  <div className="bg-white rounded-full px-5 py-3.5 flex items-center gap-3 shadow-sm">
                    <FiClock className="text-gray-400 shrink-0" size={16} />
                    <input placeholder="Cooking time (min)..." className="bg-transparent border-none outline-none w-full text-[13px] font-medium text-gray-600" value={form.time} onChange={handleTimeInput} />
                  </div>
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
              <div className="grid grid-cols-[1fr_2fr_1fr] border-b border-gray-200 pb-3 mb-5 px-4">
                <p className="text-[14px] font-medium text-[#1a1a1a] text-center">Photo</p>
                <p className="text-[14px] font-medium text-[#1a1a1a] text-center">Name</p>
                <p className="text-[14px] font-medium text-[#1a1a1a] text-center">Amount</p>
              </div>
              
              {/* List */}
              <div className="flex flex-col gap-4 mb-4">
                {localIngredients.map((ing) => (
                  <div key={ing.id} className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4 group relative px-4">
                    <div className="flex justify-center">
                      {ing.imagePreview || ing.emoji ? (
                         ing.imagePreview ? <img src={ing.imagePreview} alt={ing.name} className="h-8 w-8 object-cover rounded-md" /> : <span className="text-2xl">{ing.emoji}</span>
                      ) : (
                         <div className="h-8 w-8 bg-gray-100 rounded-md"></div>
                      )}
                    </div>
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
                      <FiTrash2 size={14}/>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Row */}
              <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4 mt-8 px-4">
                <label className="bg-[#B3B3B3] h-9 rounded-2xl flex items-center justify-center text-white cursor-pointer hover:bg-gray-500 transition-colors mx-auto w-14 shadow-sm">
                   <FiCamera size={16}/>
                   <input type="file" accept="image/*" className="hidden" onChange={handleIngredientImageUpload} />
                </label>
                <div className="bg-[#F5F6F8] rounded-full py-1.5 px-4 text-center flex items-center justify-center">
                  <input 
                    className="bg-transparent text-[12px] font-medium text-gray-600 border-none outline-none w-full text-center" 
                    placeholder="Name" 
                    value={newIngredient.name} 
                    onChange={e => setNewIngredient(p => ({...p, name: e.target.value}))} 
                  />
                </div>
                <div className="bg-[#F5F6F8] rounded-full py-1.5 px-4 text-center flex items-center justify-center">
                  <input 
                    className="bg-transparent text-[12px] font-medium text-gray-600 border-none outline-none w-full text-center" 
                    placeholder="Amount" 
                    value={newIngredient.amount} 
                    onChange={handleIngredientAmountInput} 
                  />
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
          <div className="w-full h-[220px] bg-white rounded-4xl flex flex-col items-center justify-center relative overflow-hidden shadow-sm group">
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

          {/* Nutritional Value */}
          <div>
            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-5">Nutritional Value</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'fat', label: 'Fat', color: 'text-blue-500', Icon: FiShare2 },
                { key: 'calories', label: 'Calories', color: 'text-green-500', Icon: FiTarget },
                { key: 'protein', label: 'Protein', color: 'text-blue-400', Icon: FiUser },
                { key: 'sugar', label: 'Suger', color: 'text-orange-400', Icon: FiEye }
              ].map(nut => (
                <div key={nut.key} className="bg-white rounded-3xl pt-5 pb-6 px-4 flex flex-col items-center justify-center relative shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50/50">
                  <p className="text-[14px] font-medium text-[#1a1a1a] mb-3">{nut.label}</p>
                  <div className="bg-[#F5F6F8] rounded-xl px-4 py-2 flex items-center gap-3">
                    <input 
                       className="bg-transparent text-[13px] font-medium text-gray-600 border-none outline-none text-center w-10" 
                       value={form[nut.key]} 
                       onChange={handleNutrientInput(nut.key)}
                       placeholder="0g"
                    />
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FiChevronUp size={10} className="cursor-pointer hover:text-gray-800" onClick={() => adjustNutrient(nut.key, 1)} />
                      <FiChevronDown size={10} className="cursor-pointer hover:text-gray-800" onClick={() => adjustNutrient(nut.key, -1)} />
                    </div>
                  </div>
                  <nut.Icon className={`absolute bottom-3 right-3 ${nut.color} opacity-80`} size={16} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Section ── */}
        {isFormComplete && (
          <div className="col-span-1 lg:col-span-2 mt-2 mb-12 flex justify-center transition-all duration-300">
             <div className="bg-white rounded-[2.5rem] p-10 flex flex-col items-center justify-center shadow-sm w-full max-w-2xl">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] mb-8">
                {editMeal ? "Save your changes?" : "Do you want to Add this meal to Menu ?"}
              </h2>
               <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                  <button 
                     onClick={() => {
                        setForm({ name: "", category: "", price: "", time: "", description: "", fat: "", calories: "", protein: "", sugar: "" });
                        setMealImagePreview(null);
                        setLocalIngredients([]);
                     }}
                     className="cursor-pointer bg-white text-[#1a1a1a] font-bold py-3.5 px-12 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100 hover:bg-gray-300 transition-colors w-full sm:w-auto"
                  >
                     Discard
                  </button>
                  <button 
                     onClick={handleSave}
                     className="cursor-pointer bg-orange-400 text-white font-bold py-3.5 px-12 rounded-2xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-colors w-full sm:w-auto"
                  >
                     {saved ? (editMeal ? "Saved!" : "Added!") : (editMeal ? "Save Changes" : "Add Meal")}
                  </button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
