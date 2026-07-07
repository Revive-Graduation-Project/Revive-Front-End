import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getIngredients,
  updateIngredientStock,
  uploadIngredientsFile,
} from "../../services/dashboardService";
import useUIStore from "../../store/uiStore";

// ── Query keys ────────────────────────────────────────────────────────────────
export const ingredientKeys = {
  all:  ["ingredients"],
  list: (filters) => ["ingredients", "list", filters],
};

// ── Queries ───────────────────────────────────────────────────────────────────

/** Fetch the full ingredient list from GET /api/ingredients */
export function useIngredients(filters = {}) {
  return useQuery({
    queryKey: ingredientKeys.list(filters),
    queryFn:  () => getIngredients(filters),
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/**
 * Update a single ingredient's stock via PATCH /api/ingredients/{id}/stock.
 * Expected payload: { stock: number }
 */
export function useUpdateIngredientStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateIngredientStock(id, data),
    onSuccess: (_res, { id, data }) => {
      useUIStore.getState().addNotification({
        title: "Stock Level Updated",
        message: `Ingredient #${id} stock level was adjusted to ${data.stock} units.`,
        type: data.stock < 5 ? "critical" : "info",
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
                description: "You can navigate away while this uploads in the background."
              });
            }
          }
        });
        toast.success(`Successfully uploaded ${file.name || "CSV file"}!`, { id: toastId, description: "Inventory updated successfully." });
        useUIStore.getState().addNotification({
          title: "Inventory File Uploaded",
          message: `File "${file.name || "CSV"}" was uploaded in background. Inventory stock levels updated.`,
          type: "success",
          category: "Inventory",
        });
        return result;
      } catch (err) {
        toast.error(`Failed to upload ${file.name || "CSV file"}.`, { id: toastId, description: err?.response?.data?.message || err.message || "Please try again." });
        throw err;
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}
