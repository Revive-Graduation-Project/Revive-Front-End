/**
 * Filters and ranks menu dishes based on the user's search query.
 *
 * @param {Array} meals - Array of menu dish objects.
 * @param {string} query - The search text entered by the user.
 * @returns {Array} Sorted list of matching dish objects.
 */
export function filterDishes(meals = [], query = "") {
  if (!query || typeof query !== "string") {
    return [];
  }

  const normalizedQuery = query.trim().replace(/\s+/g, " ").toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  if (!Array.isArray(meals)) {
    return [];
  }

  const matches = [];

  for (const meal of meals) {
    const nameLower = (meal.name || "").toLowerCase();
    const descLower = (meal.description || "").toLowerCase();
    const catLower = (meal.category || "").toLowerCase();

    let score = 0;

    // Exact or prefix name match
    if (nameLower === normalizedQuery) {
      score = Math.max(score, 100);
    } else if (nameLower.startsWith(normalizedQuery)) {
      score = Math.max(score, 80);
    } else if (nameLower.includes(normalizedQuery)) {
      score = Math.max(score, 60);
    }

    // Category match
    if (catLower === normalizedQuery) {
      score = Math.max(score, 50);
    } else if (catLower.includes(normalizedQuery)) {
      score = Math.max(score, 35);
    }

    // Description match
    if (descLower.includes(normalizedQuery)) {
      score = Math.max(score, 25);
    }

    if (score > 0) {
      matches.push({
        ...meal,
        _score: score,
      });
    }
  }

  // Sort descending by match score, then alphabetically by dish name
  matches.sort((a, b) => {
    if (b._score !== a._score) {
      return b._score - a._score;
    }
    return (a.name || "").localeCompare(b.name || "");
  });

  return matches.map(({ _score, ...meal }) => meal);
}
