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
 * Queries menu items based on optional filter criteria.
 * @param {object} [filters={}] - Filter criteria for the menu items.
 * @returns {object} The menu items query result.
 */
export function useMenuItems(filters = {}) {
  return useQuery({
    queryKey: menuKeys.items(filters),
    queryFn:  () => getMenuItems(filters),
  });
}

/**
 * Retrieves recipe ingredients.
 * @returns {object} The React Query result containing recipe ingredients data.
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
 * @return {object} A mutation object for updating a menu item when called with `{ id, data }`.
 */
```
export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMenuItem(id, data),
    onSettled:  () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}

/**
 * Provides a mutation hook for creating menu items.
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
 * Creates a mutation for saving recipes.
 * Invalidates all menu queries when the recipe is successfully saved.
 * @returns {UseMutationResult} The mutation object.
 */
export function useSaveRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveRecipe,
    onSuccess:  () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}
