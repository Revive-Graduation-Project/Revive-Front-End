// src/pages/customization/utils/categoryGrouping.js

export const FIXED_CATEGORY_DEFINITIONS = [
  {
    id: "base",
    label: "Base",
    icon: "🌾",
    description: "Choose your foundation grains or greens",
    keywords: ["base", "grain", 'rice', 'carb', 'noodle', 'quinoa', 'root']
  },
  {
    id: "vegetables",
    label: "Vegetables",
    icon: "🥦",
    description: "Pack in fresh, crisp farm vegetables",
    keywords: ["vegetable", "veggie", "green", "salad", "veggies"]
  },
  {
    id: "sauces",
    label: "Sauces",
    icon: "🥫",
    description: "Drizzle with handcrafted signature dressings",
    keywords: ["sauce", "dressing", "dip", "vinaigrette"]
  },
  {
    id: "extras",
    label: "Extras",
    icon: "➕",
    description: "Add crunch, seeds, cheese, or premium toppings",
    keywords: ["extra", "topping", "add", "crunch", "cheese", "seed", "nut"]
  }
];

/**
 * Maps dynamic backend slots to fixed ordered frontend categories:
 * 1. Base -> 2. Vegetables -> 3. Sauces -> 4. Extras
 * Guarantees no backend slot is lost by placing unmatched slots into Extras.
 * Hides categories if they have no ingredients.
 */
export function mapSlotsToFixedCategories(slots = []) {
  if (!Array.isArray(slots) || slots.length === 0) return [];

  const categoryMap = {
    base: {
      ...FIXED_CATEGORY_DEFINITIONS[0],
      items: [],
      sections: []
    },
    vegetables: {
      ...FIXED_CATEGORY_DEFINITIONS[1],
      items: [],
      sections: []
    },
    sauces: {
      ...FIXED_CATEGORY_DEFINITIONS[2],
      items: [],
      sections: []
    },
    extras: {
      ...FIXED_CATEGORY_DEFINITIONS[3],
      items: [],
      sections: []
    }
  };

  slots.forEach((section) => {
    const nameLower = (section.slotName || "").toLowerCase();
    let assignedKey = null;

    // Check exact or keyword match
    if (nameLower === "base" || FIXED_CATEGORY_DEFINITIONS[0].keywords.some(k => nameLower.includes(k))) {
      assignedKey = "base";
    } else if (nameLower === "vegetables" || FIXED_CATEGORY_DEFINITIONS[1].keywords.some(k => nameLower.includes(k))) {
      assignedKey = "vegetables";
    } else if (nameLower === "sauces" || FIXED_CATEGORY_DEFINITIONS[2].keywords.some(k => nameLower.includes(k))) {
      assignedKey = "sauces";
    } else {
      // Default fallback to extras
      assignedKey = "extras";
    }

    categoryMap[assignedKey].sections.push(section);

    if (Array.isArray(section.ingredients)) {
      section.ingredients.forEach((ing) => {
        categoryMap[assignedKey].items.push({
          ...ing,
          _originalSection: section
        });
      });
    }
  });

  // Return strictly in fixed order [base, vegetables, sauces, extras], excluding empty categories
  return [
    categoryMap.base,
    categoryMap.vegetables,
    categoryMap.sauces,
    categoryMap.extras
  ].filter(cat => cat.items.length > 0);
}
