import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIngredientsMetrics, getIngredients, createIngredient, updateIngredient, deleteIngredient, uploadIngredientsFile } from "../../services/dashboardService";

export const ingredientKeys = {
  all:     ["ingredients"],
  metrics: () => ["ingredients", "metrics"],
  list:    (filters) => ["ingredients", "list", filters],
};

export function useIngredientsMetrics() {
  return useQuery({ queryKey: ingredientKeys.metrics(), queryFn: getIngredientsMetrics });
}

export function useIngredients(filters = {}) {
  return useQuery({
    queryKey: ingredientKeys.list(filters),
    queryFn:  () => getIngredients(filters),
  });
}

/** Mutation: delete an ingredient */
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

/** Mutation: create an ingredient */
export function useCreateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createIngredient,
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}

/** Mutation: update an ingredient */
export function useUpdateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateIngredient(id, data),
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}

/** Mutation: upload ingredients CSV */
export function useUploadIngredients() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadIngredientsFile,
    onSettled: () => qc.invalidateQueries({ queryKey: ingredientKeys.all }),
  });
}
