import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenuCategories, getMenuItems, deleteMenuItem, updateMenuItem, createMenuItem, saveRecipe, getRecipeIngredients, uploadMealImage } from "../../services/dashboardService";

export const menuKeys = {
  all:         ["menu"],
  categories:  () => ["menu", "categories"],
  items:       (filters) => ["menu", "items", filters],
  ingredients: () => ["menu", "recipe-ingredients"],
};

export function useMenuCategories() {
  return useQuery({ queryKey: menuKeys.categories(), queryFn: getMenuCategories });
}

export function useMenuItems(filters = {}) {
  return useQuery({
    queryKey: menuKeys.items(filters),
    queryFn:  () => getMenuItems(filters),
  });
}

export function useRecipeIngredients() {
  return useQuery({ queryKey: menuKeys.ingredients(), queryFn: getRecipeIngredients });
}

/** Mutation: delete a menu item */
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

/** Mutation: update a menu item */
export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const payload = {
        name: data.name,
        description: data.description || "",
        price: parseFloat(data.price),
        category: data.category,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : []
      };
      
      const res = await updateMenuItem(id, payload);
      
      if (data.imageFile) {
        await uploadMealImage(id, data.imageFile);
      }
      
      return res;
    },
    onSettled:  () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}

/** Mutation: create a menu item */
export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const payload = {
        name: data.name,
        description: data.description || "",
        price: parseFloat(data.price),
        category: data.category,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : []
      };
      
      const meal = await createMenuItem(payload);
      
      // If the backend returns the created meal with an ID, upload the image
      // Assuming the backend returns the created object or at least { id: ... }
      if (data.imageFile && meal && (meal.id || meal._id)) {
        await uploadMealImage(meal.id || meal._id, data.imageFile);
      }
      
      return meal;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}

/** Mutation: save a new recipe */
export function useSaveRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveRecipe,
    onSuccess:  () => qc.invalidateQueries({ queryKey: menuKeys.all }),
  });
}
