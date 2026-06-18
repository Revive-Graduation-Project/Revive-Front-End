import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenuCategories, getMenuItems, deleteMenuItem, updateMenuItem, createMenuItem, saveRecipe, getRecipeIngredients } from "../../services/dashboardService";

export const menuKeys = {
  all:         ["menu"],
  categories:  () => ["menu", "categories"],
  items:       (filters) => ["menu", "items", filters],
  ingredients: () => ["menu", "recipe-ingredients"],
};

/**
 * Fetches menu categories.
 * @return {Object} A query result containing menu categories.
 */
export function useMenuCategories() {
  return useQuery({ queryKey: menuKeys.categories(), queryFn: getMenuCategories });
}

/**
 * Retrieves menu items with optional filtering.
 * @param {object} [filters={}] - Optional filter criteria for menu items.
 * @returns {object} Query result containing menu items.
 */
export function useMenuItems(filters = {}) {
  return useQuery({
    queryKey: menuKeys.items(filters),
    queryFn:  () => getMenuItems(filters),
  });
}

/**
 * Fetches recipe ingredients.
 * @return {object} A query result object containing recipe ingredients data.
 */
export function useRecipeIngredients() {
  return useQuery({ queryKey: menuKeys.ingredients(), queryFn: getRecipeIngredients });
}

/**
 * Mutation hook for deleting a menu item.
 *
 * Optimistically removes the item from the cached menu items and attempts deletion.
 * If the deletion fails, the previous cache state is restored. After completion,
 * the entire menu cache is invalidated to ensure consistency.
 *
 * @return {object} A mutation object to trigger the deletion.
 */
export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteMenuItem(id),
    onMutate:  async (id) => {
      await qc.cancelQueries({ queryKey: menuKeys.all });
      const prev = qc.getQueriesData({ queryKey: menuKeys.all });
      // Optimistic: remove from all item queries
      qc.setQueriesData({ queryKey: ["menu", "items"] }, (old) =>
        Array.isArray(old) ? old.filter((item) => item.id !== id) : old
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      ctx?.prev?.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}

/**
 * Mutation hook for updating a menu item.
 * @return {object} A mutation object that accepts an object with `id` and `data` properties.
 */
export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMenuItem(id, data),
    onSettled:  () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}

/**
 * Creates a menu item.
 * 
 * The mutation invalidates the menu cache on completion.
 * @returns {Object} A React Query mutation object.
 */
export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMenuItem,
    onSettled:  () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}

/**
 * Creates a mutation to save a new recipe.
 * @returns {UseMutationResult} A mutation hook for saving recipes.
 */
export function useSaveRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveRecipe,
    onSuccess:  () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}
