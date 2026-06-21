/**
 * sortItems
 * ─────────────────────────────────────────
 * Generic multi-column sort for dashboard tables.
 * Handles both numeric values and numeric strings with units (e.g. "15g", "1.2k").
 *
 * @param {Array}   items   - Array of objects to sort (not mutated)
 * @param {string|null} sortKey - Object key to sort by; null = unsorted
 * @param {'asc'|'desc'} sortDir - Sort direction
 * @returns {Array} New sorted array
 */
export function sortItems(items, sortKey, sortDir) {
  if (!sortKey) return items;

  return [...items].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";

    const parseNum = (val) => {
      if (typeof val === "number") return val;
      const match = String(val).match(/[\d.]+/);
      return match ? parseFloat(match[0]) : NaN;
    };

    const aNum = parseNum(av);
    const bNum = parseNum(bv);

    let cmp;
    if (!isNaN(aNum) && !isNaN(bNum)) {
      cmp = aNum - bNum;
    } else {
      cmp = String(av).localeCompare(String(bv));
    }

    return sortDir === "asc" ? cmp : -cmp;
  });
}
