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
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        time: data.time || "",
        fat: data.fat || "",
        calories: data.calories || "",
        protein: data.protein || "",
        sugar: data.sugar || "",
      };

      const res = await updateMenuItem(id, payload);

      // Image upload is a partial-success step: a failed upload should not
      // roll back the already-committed meal update.
      if (data.imageFile) {
        try {
          await uploadMealImage(id, data.imageFile);
        } catch (imgErr) {
          console.warn("[useUpdateMenuItem] Image upload failed (meal saved):", imgErr);
        }
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
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        time: data.time || "",
        fat: data.fat || "",
        calories: data.calories || "",
        protein: data.protein || "",
        sugar: data.sugar || "",
      };

      const meal = await createMenuItem(payload);

      // Image upload is a partial-success step: a failed upload should not
      // roll back the already-committed meal create.
      if (data.imageFile && meal && (meal.id || meal._id)) {
        try {
          await uploadMealImage(meal.id || meal._id, data.imageFile);
        } catch (imgErr) {
          console.warn("[useCreateMenuItem] Image upload failed (meal saved):", imgErr);
        }
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
