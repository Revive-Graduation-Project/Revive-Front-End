import React, { useRef, useState } from "react";
import { FiX, FiCamera, FiUploadCloud } from "react-icons/fi";
import { useUpdateMenuItem } from "../../../hooks/dashboard/useMenuItems";
import { useToast } from "../../../store/toastStore";

export default function InactiveMenuModal({ isOpen, onClose, inactiveItems }) {
  const { addToast } = useToast();
  const { mutate: updateMeal, isPending } = useUpdateMenuItem();
  const fileInputRef = useRef(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  if (!isOpen) return null;

  const handleAddPhotoClick = (id) => {
    // Do not allow switching items while an upload is in progress
    if (isPending) return;
    setSelectedItemId(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && selectedItemId) {
      const itemToUpdate = inactiveItems.find((i) => i.id === selectedItemId);
      if (itemToUpdate) {
        updateMeal(
          {
            id: itemToUpdate.id || itemToUpdate._id,
            data: { ...itemToUpdate, imageFile: file },
          },
          {
            onSuccess: () => {
              addToast("Photo added successfully! Dish is now active.", "success");
              setSelectedItemId(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              if (inactiveItems.length === 1) onClose(); // Auto close if it was the last item
            },
            onError: () => {
              addToast("Failed to upload photo. Please try again.", "error");
              setSelectedItemId(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            },
          }
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl relative flex flex-col max-h-[85vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Inactive Menu</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">Dishes without photos won't appear in the main menu.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {inactiveItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <FiCamera size={24} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">No Inactive Dishes</h3>
              <p className="text-sm text-gray-500">All your dishes have photos and are active.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {inactiveItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-orange-100 bg-white hover:bg-orange-50/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Placeholder image */}
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 border-dashed">
                      <FiCamera size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-800 mb-0.5">{item.name}</h4>
                      <div className="flex items-center gap-2 text-[12px] font-medium text-gray-500">
                        <span>{item.category}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-orange-500 font-bold">${item.price}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddPhotoClick(item.id)}
                    disabled={isPending && selectedItemId === item.id}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl text-[13px] font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending && selectedItemId === item.id ? (
                      <span className="animate-pulse">Uploading...</span>
                    ) : (
                      <>
                        <FiUploadCloud size={16} />
                        Add Photo
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
