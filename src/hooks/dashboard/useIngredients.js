import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../../utils/toastUtils";
import {
  getIngredients,
  updateIngredientStock,
  uploadIngredientsFile,
} from "../../services/dashboardService";
import useUIStore from "../../store/uiStore";
import { evaluateStock } from "../../utils/stockUtils";

// ── Query keys ────────────────────────────────────────────────────────────────
export const ingredientKeys = {
  all:  ["ingredients"],
  list: (filters) => ["ingredients", "list", filters],
};

// ── Queries ───────────────────────────────────────────────────────────────────

/** Fetch the full ingredient list from GET /api/ingredients and scan stock levels */
export function useIngredients(filters = {}) {
  const query = useQuery({
    queryKey: ingredientKeys.list(filters),
    queryFn:  () => getIngredients(filters),
  });

  useEffect(() => {
    if (Array.isArray(query.data)) {
      const outOfStockItems = query.data.filter((i) => evaluateStock(i.stock, i.unit).isOutOfStock);
      const lowStockItems = query.data.filter((i) => evaluateStock(i.stock, i.unit).isLowStock);

      // 1. Out of stock alert scanner
      if (outOfStockItems.length > 0) {
        const names = outOfStockItems.map((i) => i.name).slice(0, 3).join(", ");
        const more = outOfStockItems.length > 3 ? ` and ${outOfStockItems.length - 3} others` : "";
        useUIStore.getState().addUniqueNotification({
          id: "inv-scanner-out-of-stock",
          title: "Out of Stock Alert",
          message: `${names}${more} are completely OUT OF STOCK! Restock immediately.`,
          type: "critical",
          category: "Inventory",
        });
      } else {
        useUIStore.getState().removeNotificationsByPrefix("inv-scanner-out-of-stock");
      }

      // 2. Low stock alert scanner
      if (lowStockItems.length > 0) {
        const names = lowStockItems.map((i) => `${i.name} (${i.stock} ${i.unit || "g"})`).slice(0, 3).join(", ");
        const more = lowStockItems.length > 3 ? ` and ${lowStockItems.length - 3} others` : "";
        useUIStore.getState().addUniqueNotification({
          id: "inv-scanner-low-stock",
          title: "Low Stock Warning",
          message: `${names}${more} are running low on stock! Restock needed.`,
          type: "warning",
          category: "Inventory",
        });
      } else {
        useUIStore.getState().removeNotificationsByPrefix("inv-scanner-low-stock");
      }
    }
  }, [query.data]);

  return query;
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/**
 * Update a single ingredient's stock via PATCH /api/ingredients/{id}/stock.
 * Expected payload: { stock: number }
 */
export function useUpdateIngredientStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data, name }) => {
      const ingName = name || `Ingredient #${id}`;
      const toastId = toast.loading(`Updating stock for "${ingName}" in background...`, {
        duration: 6000,
        description: "You can navigate away while this updates in background."
      });
      try {
        const res = await updateIngredientStock(id, data);
        toast.success(`Updated stock for "${ingName}"!`, { id: toastId, duration: 6000, description: `Stock level adjusted to ${data.stock}.` });
        return res;
      } catch (err) {
        toast.error(`Failed to update stock for "${ingName}".`, { id: toastId, duration: 6000, description: err?.response?.data?.message || err.message || "Please try again." });
        throw err;
      }
    },
    onSuccess: (_res, { id, data, unit }) => {
      const { isLowStock, isOutOfStock } = evaluateStock(data.stock, unit || "g");
      useUIStore.getState().addNotification({
        title: "Stock Level Updated",
        message: `Ingredient #${id} stock level was adjusted to ${data.stock} units.`,
        type: isOutOfStock || isLowStock ? "critical" : "info",
        category: "Inventory",
      });
    },
    onSettled:  () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}

/** Upload a CSV / XLSX file to POST /api/inventory/upload with background progress toast */
export function useUploadIngredients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fileOrPayload) => {
      const file = fileOrPayload?.file || fileOrPayload;
      const toastId = toast.loading(`Uploading ${file.name || "CSV file"} (0%)...`, {
        duration: 6000,
        description: "You can navigate away while this uploads in the background."
      });

      try {
        const result = await uploadIngredientsFile({
          file,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              toast.loading(`Uploading ${file.name || "CSV file"} (${percent}%)...`, {
                id: toastId,
                duration: 6000,
                description: "You can navigate away while this uploads in the background."
              });
            }
          }
        });
        toast.success(`Successfully uploaded ${file.name || "CSV file"}!`, { id: toastId, duration: 6000, description: "Inventory updated successfully." });
        useUIStore.getState().addNotification({
          title: "Inventory File Uploaded",
          message: `File "${file.name || "CSV"}" was uploaded in background. Inventory stock levels updated.`,
          type: "success",
          category: "Inventory",
        });
        return result;
      } catch (err) {
        toast.error(`Failed to upload ${file.name || "CSV file"}.`, { id: toastId, duration: 6000, description: err?.response?.data?.message || err.message || "Please try again." });
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ingredientKeys.all, refetchType: "all" });
      qc.invalidateQueries({ queryKey: ["menu"], refetchType: "all" });
    },
  });
}
