import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

const ModalWrapper = ({ isOpen, onClose, title, icon: Icon, iconColorClass = "text-gray-500", iconBgClass = "bg-gray-100", headerBgClass = "bg-gray-50/50", children, isPending }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${headerBgClass}`}>
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgClass} ${iconColorClass}`}>
                  <Icon size={20} />
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 m-0">{title}</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 text-gray-500 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ModalWrapper;
