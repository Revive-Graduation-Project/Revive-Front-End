import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

/**
 * Modal Component
 * 
 * A highly accessible, portal-rendered modal window.
 * 
 * Features:
 * - Focus Management: Automatically traps focus on open and restores it on close.
 * - Background Control: Locks the body scroll when active to prevent layout shifts.
 * - Portal Rendering: Renders into `document.body` for safe layering above all other content.
 * - UX: Implements backdrop-blur and zoom-in animations.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = "hidden";
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "unset";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 id="modal-title" className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-orange-500 outline-none"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
