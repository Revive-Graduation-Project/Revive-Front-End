import { create } from "zustand";
import { useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, ...toast }] }));
    // Auto-dismiss after duration
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, toast.duration ?? 3500);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function useToast() {
  const _addToast = useToastStore((state) => state.addToast);

  const success = useCallback(
    (message) => _addToast({ type: "success", message }),
    [_addToast]
  );
  const error = useCallback(
    (message) => _addToast({ type: "error", message, duration: 5000 }),
    [_addToast]
  );
  const info = useCallback(
    (message) => _addToast({ type: "info", message }),
    [_addToast]
  );

  const addToast = useCallback(
    (message, type = "info") => {
      const duration = type === "error" ? 5000 : 3500;
      _addToast({ type, message, duration });
    },
    [_addToast]
  );

  return { success, error, info, addToast };
}

export const TOAST_STYLES = {
  success: { icon: FiCheckCircle, cls: "bg-green-50 border-green-200 text-green-700", iconCls: "text-green-500" },
  error: { icon: FiAlertCircle, cls: "bg-red-50 border-red-200 text-red-700", iconCls: "text-red-500" },
  info: { icon: FiInfo, cls: "bg-sky-50 border-sky-200 text-sky-700", iconCls: "text-sky-500" },
};
