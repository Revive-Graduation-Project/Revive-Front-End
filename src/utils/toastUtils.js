import { toast as sonnerToast } from "sonner";

/**
 * Timed Toast Utility
 * ─────────────────────────────────────────────────────────────────
 * Wraps Sonner toast methods to give loading toasts a max-lifetime of 6 seconds,
 * while allowing success/error calls to cancel that timer early so the final
 * state toast is always visible for its full 6-second duration.
 *
 * Problem this solves:
 *   Sonner loading toasts have duration: Infinity by default — they never auto-dismiss.
 *   Naively passing duration:6000 to toast.loading() doesn't work because Sonner ignores
 *   the duration prop for loading variants.
 *   A forced setTimeout(..., 6000) fixes that — but only if we cancel it when success/error
 *   replaces the loading toast, otherwise the dismiss fires and kills the success toast.
 */

// Map of toastId → setTimeout handle so we can cancel early
const pendingDismissals = new Map();

export const toast = {
  loading: (message, options = {}) => {
    const id = sonnerToast.loading(message, options);
    const targetId = options.id !== undefined ? options.id : id;

    // Cancel any existing timer for this ID (e.g., progress-update calls with same id)
    if (pendingDismissals.has(targetId)) {
      clearTimeout(pendingDismissals.get(targetId));
    }

    // Set a max lifetime of 6 seconds so loading toasts don't stay on screen forever
    const timerId = setTimeout(() => {
      sonnerToast.dismiss(targetId);
      pendingDismissals.delete(targetId);
    }, 6000);

    pendingDismissals.set(targetId, timerId);
    return id;
  },

  success: (message, options = {}) => {
    // Cancel the loading toast's forced-dismiss timer so it doesn't kill this success toast
    const targetId = options.id;
    if (targetId !== undefined && pendingDismissals.has(targetId)) {
      clearTimeout(pendingDismissals.get(targetId));
      pendingDismissals.delete(targetId);
    }
    // Sonner correctly respects duration on success/error/info toasts
    return sonnerToast.success(message, { duration: 6000, ...options });
  },

  error: (message, options = {}) => {
    const targetId = options.id;
    if (targetId !== undefined && pendingDismissals.has(targetId)) {
      clearTimeout(pendingDismissals.get(targetId));
      pendingDismissals.delete(targetId);
    }
    return sonnerToast.error(message, { duration: 6000, ...options });
  },

  info: (message, options = {}) => {
    const targetId = options.id;
    if (targetId !== undefined && pendingDismissals.has(targetId)) {
      clearTimeout(pendingDismissals.get(targetId));
      pendingDismissals.delete(targetId);
    }
    return sonnerToast.info(message, { duration: 6000, ...options });
  },

  dismiss: (id) => {
    if (id !== undefined && pendingDismissals.has(id)) {
      clearTimeout(pendingDismissals.get(id));
      pendingDismissals.delete(id);
    }
    sonnerToast.dismiss(id);
  },
};
