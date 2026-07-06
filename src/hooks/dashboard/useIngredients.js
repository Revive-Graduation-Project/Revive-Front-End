import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getIngredients,
  updateIngredientStock,
  uploadIngredientsFile,
} from "../../services/dashboardService";

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
    onSettled:  () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}

/** Upload a CSV / XLSX file to POST /api/inventory/upload */
export function useUploadIngredients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadIngredientsFile,
    onSettled:  () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}
