import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientsMetrics, getIngredients, createIngredient, updateIngredient, deleteIngredient, uploadIngredientsFile } from "../../services/dashboardService";

export const ingredientKeys = {
  all:     ["ingredients"],
  metrics: () => ["ingredients", "metrics"],
  list:    (filters) => ["ingredients", "list", filters],
};

/**
 * Fetches metrics data for ingredients.
 * @returns {object} Query result containing ingredient metrics.
 */
export function useIngredientsMetrics() {
  return useQuery({ queryKey: ingredientKeys.metrics(), queryFn: getIngredientsMetrics });
}

/**
 * Fetches the list of ingredients based on optional filters.
 * @param {Object} [filters={}] - Optional filters to apply to the ingredient list.
 * @return {Object} A React Query result containing the ingredients data.
 */
export function useIngredients(filters = {}) {
  return useQuery({
    queryKey: ingredientKeys.list(filters),
    queryFn:  () => getIngredients(filters),
  });
}

/**
 * Creates a mutation hook for deleting an ingredient.
 * @returns {Object} A mutation object that accepts an ingredient ID and deletes the ingredient.
 */
export function useDeleteIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteIngredient(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ingredientKeys.all });
      const prev = qc.getQueriesData({ queryKey: ingredientKeys.all });
      qc.setQueriesData({ queryKey: ["ingredients", "list"] }, (old) =>
        Array.isArray(old) ? old.filter((item) => item.id !== id) : old
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      ctx?.prev?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}

/**
 * Provides a mutation for creating new ingredients.
 * @return {object} A mutation object for creating ingredients.
 */
export function useCreateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createIngredient,
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}

/**
 * Creates a mutation hook for updating an ingredient.
 * @returns {UseMutationResult} A mutation that accepts `id` and `data` and invalidates ingredient queries when settled.
 */
export function useUpdateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateIngredient(id, data),
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}

/**
 * Prepares a mutation for uploading ingredients.
 * @return {Object} A mutation object for uploading ingredients data.
 */
export function useUploadIngredients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadIngredientsFile,
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}
