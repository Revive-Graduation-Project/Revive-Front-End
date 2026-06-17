/**
 * Toast Store + Container
 * ─────────────────────────────────────────────────────────────────
 * Lightweight toast system using Zustand. No third-party libraries.
 *
 * Usage (anywhere in dashboard):
 *   import { useToast } from "./shared/useToast";
 *   const toast = useToast();
 *
 *   // Option A — named methods (preferred)
 *   toast.success("Saved!");
 *   toast.error("Failed to save.");
 *   toast.info("Loading...");
 *
 *   // Option B — generic (used in some view files)
 *   toast.addToast("Saved!", "success");
 *   toast.addToast("Failed!", "error");
 */

import { create } from "zustand";
import { useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

// ── Store ─────────────────────────────────────────────────────────
const useToastStore = create((set) => ({
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

// ── Hook ──────────────────────────────────────────────────────────
/**
 * Returns toast helpers. Supports two call signatures:
 *   toast.success("message")           ← named helpers
 *   toast.addToast("message", "type")  ← generic shorthand (views use this)
 */
export function useToast() {
  const { addToast: _addToast } = useToastStore();

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

  // Generic: addToast("message", "success" | "error" | "info")
  const addToast = useCallback(
    (message, type = "info") => {
      const duration = type === "error" ? 5000 : 3500;
      _addToast({ type, message, duration });
    },
    [_addToast]
  );

  return { success, error, info, addToast };
}

// ── UI config ─────────────────────────────────────────────────────
const TOAST_STYLES = {
  success: { icon: FiCheckCircle, cls: "bg-green-50 border-green-200 text-green-700", iconCls: "text-green-500" },
  error: { icon: FiAlertCircle, cls: "bg-red-50   border-red-200   text-red-700", iconCls: "text-red-500" },
  info: { icon: FiInfo, cls: "bg-sky-50   border-sky-200   text-sky-700", iconCls: "text-sky-500" },
};

// ── Container (mounted once in DashboardLayout) ───────────────────
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-200 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const cfg = TOAST_STYLES[toast.type] ?? TOAST_STYLES.info;
        const Icon = cfg.icon;
        return (
          <div
            key={toast.id}
            className={`animate-slide-in pointer-events-auto flex items-start gap-3 max-w-sm w-full px-4 py-3 rounded-xl border shadow-lg ${cfg.cls}`}
          >
            <Icon size={16} className={`mt-0.5 shrink-0 ${cfg.iconCls}`} />
            <p className="text-xs font-medium flex-1 leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="bg-transparent border-none cursor-pointer p-0.5 rounded opacity-60 hover:opacity-100 transition-opacity"
            >
              <FiX size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
