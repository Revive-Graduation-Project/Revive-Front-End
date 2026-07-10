// src/pages/customization/Sections/SpecialInstructions.jsx
import React from "react";
import { MessageSquare } from "lucide-react";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const SpecialInstructions = () => {
  const { comment, setComment } = useCustomizeStore();

  return (
    <div className="mt-10 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
          <MessageSquare size={16} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Special Instructions</h3>
          <p className="text-xs text-gray-400">
            Anything you&apos;d like the chef to know?
          </p>
        </div>
      </div>

      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="e.g., Dressing on the side, extra crispy, allergy notes..."
        className="w-full mt-3 border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-y bg-gray-50/50 hover:bg-white"
      />
    </div>
  );
};

export default SpecialInstructions;
