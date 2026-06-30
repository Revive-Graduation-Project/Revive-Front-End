/**
 * sortItems
 * ─────────────────────────────────────────
 * Generic multi-column sort for dashboard tables.
 * Handles both numeric values and numeric strings with units (e.g. "15g", "1.2k").
 *
 * @param {Array}   items   - Array of objects to sort (not mutated)
 * @param {string|null} sortKey - Object key to sort by; null = unsorted
 * @param {'asc'|'desc'} sortDir - Sort direction
 * @param {Array}   [columns] - Optional column config array; if the matching column
 *                              has a `comparator(a, b)` function it will be used instead
 *                              of the default numeric/string logic.
 * @returns {Array} New sorted array
 */
export function sortItems(items, sortKey, sortDir, columns = []) {
  if (!sortKey) return items;

  // If the active column defines a custom comparator, delegate to it.
  const colDef = columns.find((c) => c.key === sortKey);
  if (colDef?.comparator) {
    return [...items].sort((a, b) => {
      const cmp = colDef.comparator(a, b);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  return [...items].sort((a, b) => {
    const av = a[sortKey] ?? "";
    const bv = b[sortKey] ?? "";

    const parseNum = (val) => {
      if (typeof val === "number") return val;
      const str = String(val).trim().toLowerCase();
      // Recognise magnitude suffixes: 1.2k → 1200, 3.5m → 3500000, 2b → 2000000000
      const suffixMatch = str.match(/^([\d.]+)\s*([kmb])$/);
      if (suffixMatch) {
        const n = parseFloat(suffixMatch[1]);
        const multipliers = { k: 1_000, m: 1_000_000, b: 1_000_000_000 };
        return n * (multipliers[suffixMatch[2]] ?? 1);
      }
      const match = str.match(/[\d.]+/);
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
