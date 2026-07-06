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

export function useMenuItems(filters = {}, options = {}) {
  return useQuery({
    queryKey: menuKeys.items(filters),
    queryFn:  () => getMenuItems(filters),
    ...options,
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

const buildMenuPayload = async (data, id) => {
  let existingIngredients = [];
  try {
    const res = await getRecipeIngredients();
    existingIngredients = Array.isArray(res) ? res : (res?.items || res?.data || []);
  } catch (err) {
    console.warn("[buildMenuPayload] Could not fetch DB ingredients for ID mapping:", err);
  }

  const cleanIngredients = Array.isArray(data.ingredients)
    ? data.ingredients.map((ing) => {
        const obj = typeof ing === "object" && ing !== null ? ing : { name: String(ing) };
        const nameStr = String(obj.name || obj.ingredientName || "").trim();
        const lowerName = nameStr.toLowerCase();
        
        // Match against existing DB ingredients by name
        const match = existingIngredients.find((dbIng) => {
          const dbName = String(dbIng.name || "").trim().toLowerCase();
          return dbName === lowerName || dbName.includes(lowerName) || lowerName.includes(dbName);
        });

        // Resolve numeric ingredientId required by OpenAPI schema
        let idVal = obj.ingredientId !== undefined ? parseInt(obj.ingredientId, 10) : (obj.ingredient?.id !== undefined ? parseInt(obj.ingredient.id, 10) : undefined);
        if (isNaN(idVal) || idVal === undefined) {
          if (match && (match.id || match._id)) {
            idVal = parseInt(match.id || match._id, 10);
          } else if (typeof obj.id === "number" && obj.id < 10000000000 && !obj.mealId && !obj.snapshotName) {
            idVal = obj.id; // Real DB id, not Date.now() timestamp
          } else if (typeof obj._id === "number") {
            idVal = obj._id;
          } else {
            idVal = 1; // Fallback so backend schema doesn't fail on null/0 foreign key
          }
        }

        const numVal = parseFloat(obj.amount || obj.quantity || obj.value || obj.quantityGrams) || 0;
        const unitVal = obj.unit || (typeof obj.amount === "string" ? obj.amount.replace(/[\d\s.]/g, "") : "") || "g";

        return {
          // Exactly matching OpenAPI IngredientQuantity schema: required [ingredientId, quantity]
          ingredientId: idVal,
          quantity: numVal,
          // Aliases for compatibility with any mapper or DTO
          id: idVal,
          name: nameStr || (match ? match.name : ""),
          amount: `${numVal}${unitVal}`,
          quantityGrams: numVal,
          unit: unitVal,
        };
      })
    : [];

  const priceVal = parseFloat(data.price) || 0;
  const targetId = id !== undefined ? id : (data.id || data._id);
  const numId = targetId !== undefined && targetId !== null ? (typeof targetId === "number" ? targetId : parseInt(targetId, 10)) : undefined;

  return {
    ...data,
    id: !isNaN(numId) && numId !== undefined ? numId : undefined,
    _id: !isNaN(numId) && numId !== undefined ? numId : undefined,
    name: data.name || "",
    description: data.description || "",
    price: priceVal,
    category: data.category || "General",
    ingredients: cleanIngredients,
    mealIngredients: cleanIngredients,
    // Extra fields for complete DTO compatibility
    fat: data.fat || "0g",
    calories: parseInt(data.calories, 10) || 0,
    protein: data.protein || "0g",
    sugar: data.sugar || "0g",
    isActive: data.isActive !== undefined ? data.isActive : true,
    status: data.status || "Active",
    image: data.image || data.imageUrl || null,
    imageUrl: data.imageUrl || data.image || null,
    rating: data.rating || 0,
    hasDiscount: data.hasDiscount || false,
    discountPercentage: data.discountPercentage || 0,
    nutrients: data.nutrients || [],
  };
};

const extractMealId = (meal, fallbackId) => {
  if (fallbackId !== undefined && fallbackId !== null) return fallbackId;
  if (meal === null || meal === undefined) return undefined;
  if (typeof meal === "number" || (typeof meal === "string" && !isNaN(parseInt(meal, 10)))) {
    return parseInt(meal, 10);
  }
  if (typeof meal === "object") {
    return meal.id || meal._id || meal.mealId || meal.data?.id || meal.data?._id || meal.result?.id || meal.result?._id;
  }
  return undefined;
};

/** Mutation: update a menu item */
export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const payload = await buildMenuPayload(data, id);

      const res = await updateMenuItem(id, payload);

      // Image upload is a partial-success step: a failed upload should not
      // roll back the already-committed meal update.
      if (data.imageFile) {
        const mealId = extractMealId(res, id);
        if (mealId !== undefined && mealId !== null) {
          await uploadMealImage(mealId, data.imageFile);
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
      const payload = await buildMenuPayload(data);

      const meal = await createMenuItem(payload);

      // Image upload is a partial-success step: a failed upload should not
      // roll back the already-committed meal create.
      if (data.imageFile && meal) {
        const mealId = extractMealId(meal);
        if (mealId !== undefined && mealId !== null) {
          await uploadMealImage(mealId, data.imageFile);
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
