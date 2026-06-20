/**
 * Toast Container
 * ─────────────────────────────────────────────────────────────────
 * Mounts the toast UI. Place once in DashboardLayout.
 *
 * The hook and styles live in toastStore.js:
 *   import { useToast } from "../../store/toastStore";
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

import { FiX } from "react-icons/fi";
import { useToastStore, TOAST_STYLES } from "../../../store/toastStore";

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
