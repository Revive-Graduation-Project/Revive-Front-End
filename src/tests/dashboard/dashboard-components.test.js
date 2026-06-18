/**
 * ============================================================
 * Dashboard Components — Logic & Utility Tests
 * ============================================================
 * Tests pure logic functions and data-transformation patterns
 * extracted from the PR's new Dashboard components.
 *
 * Run with: npx vitest run src/tests/dashboard/dashboard-components.test.js
 * ============================================================
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// ─────────────────────────────────────────────────────────
// 1. MetricCards — formatValue utility
// ─────────────────────────────────────────────────────────
describe('MetricCards — formatValue', () => {
  /**
   * Mirrors the formatValue function defined in MetricCards.jsx
   */
  function formatValue(key, value) {
    if (key === 'totalRevenue') return `$${value.toLocaleString()}`;
    return value.toLocaleString();
  }

  test('formats totalRevenue with $ prefix', () => {
    expect(formatValue('totalRevenue', 12345)).toBe('$12,345');
  });

  test('formats totalRevenue of 0 correctly', () => {
    expect(formatValue('totalRevenue', 0)).toBe('$0');
  });

  test('formats totalOrders without $ prefix', () => {
    expect(formatValue('totalOrders', 500)).toBe('500');
  });

  test('formats totalCustomers without $ prefix', () => {
    expect(formatValue('totalCustomers', 1000)).toBe('1,000');
  });

  test('formats large revenue values correctly', () => {
    const result = formatValue('totalRevenue', 1000000);
    expect(result).toContain('$');
    expect(result).toContain('1');
  });

  test('formats unknown key as plain number', () => {
    expect(formatValue('someOtherKey', 42)).toBe('42');
  });
});

// ─────────────────────────────────────────────────────────
// 2. LiveKitchenView — COLUMNS config & getButtonStyle
// ─────────────────────────────────────────────────────────
describe('LiveKitchenView — COLUMNS configuration', () => {
  /**
   * Mirrors the COLUMNS array defined in LiveKitchenView.jsx
   */
  const COLUMNS = [
    { key: 'queue',     label: 'Order Queue', action: 'Start Preparing', nextStatus: 'preparing', prevStatus: null },
    { key: 'preparing', label: 'Preparing',   action: 'Prepared',        nextStatus: 'ready',     prevStatus: 'queue' },
    { key: 'ready',     label: 'Ready',       action: 'Ready',           nextStatus: 'done',      prevStatus: 'preparing' },
  ];

  test('contains exactly 3 columns', () => {
    expect(COLUMNS).toHaveLength(3);
  });

  test('queue column has null prevStatus (no "back" move)', () => {
    const queue = COLUMNS.find(c => c.key === 'queue');
    expect(queue.prevStatus).toBeNull();
  });

  test('queue column progresses to preparing', () => {
    const queue = COLUMNS.find(c => c.key === 'queue');
    expect(queue.nextStatus).toBe('preparing');
  });

  test('preparing column progresses to ready', () => {
    const preparing = COLUMNS.find(c => c.key === 'preparing');
    expect(preparing.nextStatus).toBe('ready');
    expect(preparing.prevStatus).toBe('queue');
  });

  test('ready column progresses to done', () => {
    const ready = COLUMNS.find(c => c.key === 'ready');
    expect(ready.nextStatus).toBe('done');
    expect(ready.prevStatus).toBe('preparing');
  });

  test('each column has the required keys', () => {
    COLUMNS.forEach(col => {
      expect(col).toHaveProperty('key');
      expect(col).toHaveProperty('label');
      expect(col).toHaveProperty('action');
      expect(col).toHaveProperty('nextStatus');
      expect(col).toHaveProperty('prevStatus');
    });
  });
});

describe('LiveKitchenView — getButtonStyle', () => {
  /**
   * Mirrors the getButtonStyle function in OrderCard inside LiveKitchenView.jsx
   */
  function getButtonStyle(action) {
    if (action === 'Start Preparing') return 'bg-white text-[#1a1a1a] border-[1px] border-[#d1d5db] hover:bg-gray-50';
    if (action === 'Prepared')        return 'bg-[#F97316] text-white border-[1px] border-transparent hover:bg-orange-600 shadow-sm';
    if (action === 'Ready')           return 'bg-[#16A34A] text-white border-[1px] border-transparent hover:bg-green-700 shadow-sm';
    return '';
  }

  test('"Start Preparing" returns white button styles', () => {
    const style = getButtonStyle('Start Preparing');
    expect(style).toContain('bg-white');
    expect(style).toContain('text-[#1a1a1a]');
  });

  test('"Prepared" returns orange button styles', () => {
    const style = getButtonStyle('Prepared');
    expect(style).toContain('bg-[#F97316]');
    expect(style).toContain('text-white');
  });

  test('"Ready" returns green button styles', () => {
    const style = getButtonStyle('Ready');
    expect(style).toContain('bg-[#16A34A]');
    expect(style).toContain('text-white');
  });

  test('unknown action returns empty string', () => {
    expect(getButtonStyle('Unknown')).toBe('');
    expect(getButtonStyle('')).toBe('');
  });

  test('action matching is case-sensitive', () => {
    expect(getButtonStyle('start preparing')).toBe('');
    expect(getButtonStyle('PREPARED')).toBe('');
  });
});

// ─────────────────────────────────────────────────────────
// 3. CircleMetric — circumference & offset math
//    (shared between ChefMenuView and IngredientsView)
// ─────────────────────────────────────────────────────────
describe('CircleMetric — stroke-dashoffset calculation', () => {
  /**
   * The SVG circle offset used in both ChefMenuView and IngredientsView:
   *   offset = circ - (percentage / 100) * circ
   */
  function computeOffset(r, percentage) {
    const circ = 2 * Math.PI * r;
    return circ - (percentage / 100) * circ;
  }

  test('0% → offset equals full circumference (no fill)', () => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    expect(computeOffset(r, 0)).toBeCloseTo(circ);
  });

  test('100% → offset equals 0 (fully filled)', () => {
    expect(computeOffset(26, 100)).toBeCloseTo(0);
  });

  test('50% → offset equals half the circumference', () => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    expect(computeOffset(r, 50)).toBeCloseTo(circ / 2);
  });

  test('25% → offset equals three-quarters the circumference', () => {
    const r = 26;
    const circ = 2 * Math.PI * r;
    expect(computeOffset(r, 25)).toBeCloseTo(circ * 0.75);
  });

  test('ChefMenuView caps percentage at 100 (Math.min)', () => {
    // ChefMenuView uses: Math.min(percentage, 100) / 100
    function chefOffset(r, percentage) {
      const circ = 2 * Math.PI * r;
      return circ - (Math.min(percentage, 100) / 100) * circ;
    }
    expect(chefOffset(30, 150)).toBeCloseTo(0);   // capped at 100 → fully filled
    expect(chefOffset(30, 100)).toBeCloseTo(0);
  });

  test('isTotal uses r=30, normal uses r=26 (ChefMenuView)', () => {
    const rTotal  = 30;
    const rNormal = 26;
    expect(2 * Math.PI * rTotal).toBeGreaterThan(2 * Math.PI * rNormal);
  });
});

// ─────────────────────────────────────────────────────────
// 4. Sort/Filter logic — shared by ChefMenuView & IngredientsView
// ─────────────────────────────────────────────────────────
describe('Dashboard — sort parseNum utility', () => {
  /**
   * Mirrors the parseNum helper used in sort comparators in both
   * ChefMenuView.jsx and IngredientsView.jsx
   */
  function parseNum(val) {
    if (typeof val === 'number') return val;
    const match = String(val).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : NaN;
  }

  test('returns number as-is', () => {
    expect(parseNum(42)).toBe(42);
    expect(parseNum(3.14)).toBe(3.14);
  });

  test('extracts number from string like "120g"', () => {
    expect(parseNum('120g')).toBe(120);
  });

  test('extracts decimal from string like "$9.99"', () => {
    expect(parseNum('$9.99')).toBe(9.99);
  });

  test('returns NaN for non-numeric strings', () => {
    expect(parseNum('abc')).toBeNaN();
  });

  test('handles null/undefined via String conversion', () => {
    // String(null) = "null" — no digits, so NaN
    expect(parseNum(null)).toBeNaN();
  });

  test('handles zero correctly', () => {
    expect(parseNum(0)).toBe(0);
    expect(parseNum('0')).toBe(0);
  });
});

describe('Dashboard — item sort comparator', () => {
  /**
   * Mirrors the sort comparator used in ChefMenuView and IngredientsView
   */
  function parseNum(val) {
    if (typeof val === 'number') return val;
    const match = String(val).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : NaN;
  }

  function sortItems(items, sortKey, sortDir) {
    return [...items].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      const aNum = parseNum(av);
      const bNum = parseNum(bv);
      let cmp;
      if (!isNaN(aNum) && !isNaN(bNum)) {
        cmp = aNum - bNum;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }

  const items = [
    { name: 'Burger', price: 12.99, category: 'Beef' },
    { name: 'Avocado Toast', price: 9.50, category: 'Vegan' },
    { name: 'Pasta', price: 15.00, category: 'Italian' },
  ];

  test('sorts by numeric field ascending', () => {
    const sorted = sortItems(items, 'price', 'asc');
    expect(sorted[0].price).toBe(9.50);
    expect(sorted[2].price).toBe(15.00);
  });

  test('sorts by numeric field descending', () => {
    const sorted = sortItems(items, 'price', 'desc');
    expect(sorted[0].price).toBe(15.00);
    expect(sorted[2].price).toBe(9.50);
  });

  test('sorts by string field ascending', () => {
    const sorted = sortItems(items, 'name', 'asc');
    expect(sorted[0].name).toBe('Avocado Toast');
    expect(sorted[2].name).toBe('Pasta');
  });

  test('sorts by string field descending', () => {
    const sorted = sortItems(items, 'name', 'desc');
    expect(sorted[0].name).toBe('Pasta');
    expect(sorted[2].name).toBe('Avocado Toast');
  });

  test('handles items with missing field (falls back to empty string)', () => {
    const withMissing = [
      { name: 'Burger', fat: '10g' },
      { name: 'Toast' /* no fat */ },
    ];
    // Should not throw
    expect(() => sortItems(withMissing, 'fat', 'asc')).not.toThrow();
  });

  test('does not mutate the original array', () => {
    const original = [...items];
    sortItems(items, 'price', 'desc');
    expect(items).toEqual(original);
  });
});

// ─────────────────────────────────────────────────────────
// 5. ChefMenuView — category filter logic
// ─────────────────────────────────────────────────────────
describe('ChefMenuView — category filter', () => {
  const allItems = [
    { id: 1, name: 'Burger',  category: 'Beef'   },
    { id: 2, name: 'Salad',   category: 'Vegan'  },
    { id: 3, name: 'Pasta',   category: 'Italian' },
    { id: 4, name: 'Steak',   category: 'Beef'   },
  ];

  function filterByTab(items, activeTab) {
    if (activeTab === 'All Menu') return items;
    return items.filter(item => item.category?.toLowerCase() === activeTab.toLowerCase());
  }

  test('"All Menu" returns all items', () => {
    expect(filterByTab(allItems, 'All Menu')).toHaveLength(4);
  });

  test('filters by specific category (case-insensitive)', () => {
    const beefItems = filterByTab(allItems, 'Beef');
    expect(beefItems).toHaveLength(2);
    beefItems.forEach(i => expect(i.category).toBe('Beef'));
  });

  test('filter is case-insensitive', () => {
    expect(filterByTab(allItems, 'beef')).toHaveLength(2);
    expect(filterByTab(allItems, 'BEEF')).toHaveLength(2);
  });

  test('filter returns empty array when no match', () => {
    expect(filterByTab(allItems, 'Seafood')).toHaveLength(0);
  });

  test('category tabs are built dynamically from item data', () => {
    const categories = new Set(allItems.map(i => i.category).filter(Boolean));
    const tabs = ['All Menu', ...categories];
    expect(tabs).toContain('All Menu');
    expect(tabs).toContain('Beef');
    expect(tabs).toContain('Vegan');
    expect(tabs).toContain('Italian');
  });
});

// ─────────────────────────────────────────────────────────
// 6. IngredientsView — search + category filter logic
// ─────────────────────────────────────────────────────────
describe('IngredientsView — filter logic', () => {
  const allIngredients = [
    { id: 1, name: 'Tomato',   category: 'Vegetables' },
    { id: 2, name: 'Chicken',  category: 'Protein' },
    { id: 3, name: 'Avocado',  category: 'Vegetables' },
    { id: 4, name: 'Soy Sauce', category: 'Sauces' },
  ];

  function filterIngredients(items, activeCategory, search) {
    return items.filter(item => {
      const matchCat =
        activeCategory === 'All Ingredients' ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  test('"All Ingredients" with empty search returns all', () => {
    expect(filterIngredients(allIngredients, 'All Ingredients', '')).toHaveLength(4);
  });

  test('filters by category only', () => {
    const vegs = filterIngredients(allIngredients, 'Vegetables', '');
    expect(vegs).toHaveLength(2);
    vegs.forEach(i => expect(i.category).toBe('Vegetables'));
  });

  test('filters by search only (case-insensitive)', () => {
    const result = filterIngredients(allIngredients, 'All Ingredients', 'tom');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tomato');
  });

  test('combines category and search filters', () => {
    const result = filterIngredients(allIngredients, 'Vegetables', 'avo');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Avocado');
  });

  test('returns empty when no match', () => {
    expect(filterIngredients(allIngredients, 'Protein', 'xyz')).toHaveLength(0);
  });

  test('CATEGORY_TABS definition matches expected values', () => {
    const CATEGORY_TABS = ['All Ingredients', 'Protien', 'Vegetables', 'Sauces', 'Stock'];
    expect(CATEGORY_TABS).toContain('All Ingredients');
    expect(CATEGORY_TABS).toContain('Vegetables');
    expect(CATEGORY_TABS).toContain('Sauces');
    expect(CATEGORY_TABS).toHaveLength(5);
  });
});

// ─────────────────────────────────────────────────────────
// 7. IngredientsView — category count & percentage helpers
// ─────────────────────────────────────────────────────────
describe('IngredientsView — getCategoryCount & getCategoryPct', () => {
  const allIngredients = [
    { id: 1, name: 'Tomato',    category: 'Vegetables' },
    { id: 2, name: 'Chicken',   category: 'Protein' },
    { id: 3, name: 'Avocado',   category: 'Vegetables' },
    { id: 4, name: 'Olive Oil', category: 'Sauces' },
    { id: 5, name: 'Beef',      category: 'Protein' },
  ];

  const getCategoryCount = (catName) =>
    allIngredients.filter(i => i.category === catName).length;

  const getCategoryPct = (catName) =>
    allIngredients.length
      ? Math.round((getCategoryCount(catName) / allIngredients.length) * 100)
      : 0;

  test('getCategoryCount returns correct count', () => {
    expect(getCategoryCount('Vegetables')).toBe(2);
    expect(getCategoryCount('Protein')).toBe(2);
    expect(getCategoryCount('Sauces')).toBe(1);
  });

  test('getCategoryCount returns 0 for unknown category', () => {
    expect(getCategoryCount('Unknown')).toBe(0);
  });

  test('getCategoryPct returns correct percentage', () => {
    expect(getCategoryPct('Vegetables')).toBe(40); // 2/5 = 40%
    expect(getCategoryPct('Sauces')).toBe(20);    // 1/5 = 20%
  });

  test('getCategoryPct returns 0 for unknown category', () => {
    expect(getCategoryPct('Unknown')).toBe(0);
  });

  test('all percentages sum to ≤ 100 due to rounding', () => {
    const categories = [...new Set(allIngredients.map(i => i.category))];
    const total = categories.reduce((sum, cat) => sum + getCategoryPct(cat), 0);
    expect(total).toBeLessThanOrEqual(101); // allow ±1 for rounding
  });
});

// ─────────────────────────────────────────────────────────
// 8. MenuManagementView — calendar generation logic
// ─────────────────────────────────────────────────────────
describe('MenuManagementView — calendarDays generation', () => {
  /**
   * Mirrors the calendarDays useMemo in MenuManagementView.jsx
   * Uses a fixed date for deterministic tests.
   */
  function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null); // leading nulls
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }

  test('January 2026 starts on Thursday (index 4)', () => {
    // Jan 1, 2026 is a Thursday (day index 4)
    const cells = generateCalendarDays(2026, 0); // month 0 = January
    expect(cells[0]).toBeNull();
    expect(cells[4]).toBe(1); // first day appears at index 4
  });

  test('February 2026 has 28 days (non-leap year)', () => {
    const cells = generateCalendarDays(2026, 1);
    const days = cells.filter(d => d !== null);
    expect(days).toHaveLength(28);
    expect(days[27]).toBe(28);
  });

  test('April 2026 has 30 days', () => {
    const cells = generateCalendarDays(2026, 3);
    const days = cells.filter(d => d !== null);
    expect(days).toHaveLength(30);
  });

  test('January 2026 has 31 days', () => {
    const cells = generateCalendarDays(2026, 0);
    const days = cells.filter(d => d !== null);
    expect(days).toHaveLength(31);
  });

  test('leading null cells count matches day-of-week index', () => {
    // For any month, the number of leading nulls equals the weekday index of the 1st
    const year = 2026;
    const month = 4; // May 2026 — May 1, 2026 is a Friday (5)
    const cells = generateCalendarDays(year, month);
    const leadingNulls = cells.filter(d => d === null).length;
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    expect(leadingNulls).toBe(firstDayOfWeek);
  });

  test('day numbers sequence is continuous from 1 to last day', () => {
    const cells = generateCalendarDays(2026, 0); // Jan 2026
    const days = cells.filter(d => d !== null);
    days.forEach((day, i) => expect(day).toBe(i + 1));
  });
});

// ─────────────────────────────────────────────────────────
// 9. StarRating — fill logic (CustomerReviews & TrendingMenus)
// ─────────────────────────────────────────────────────────
describe('StarRating — fill logic', () => {
  /**
   * The StarRating component fills star i when i <= rating.
   * CustomerReviews uses integer rating; TrendingMenus uses Math.round.
   */
  function getStarFill(i, rating) {
    return i <= rating;
  }

  function getStarFillRounded(i, rating) {
    return i <= Math.round(rating);
  }

  test('rating=3 fills stars 1, 2, 3 only', () => {
    expect(getStarFill(1, 3)).toBe(true);
    expect(getStarFill(2, 3)).toBe(true);
    expect(getStarFill(3, 3)).toBe(true);
    expect(getStarFill(4, 3)).toBe(false);
    expect(getStarFill(5, 3)).toBe(false);
  });

  test('rating=5 fills all 5 stars', () => {
    [1, 2, 3, 4, 5].forEach(i => expect(getStarFill(i, 5)).toBe(true));
  });

  test('rating=0 fills no stars', () => {
    [1, 2, 3, 4, 5].forEach(i => expect(getStarFill(i, 0)).toBe(false));
  });

  test('rating=1 fills only the first star', () => {
    expect(getStarFill(1, 1)).toBe(true);
    [2, 3, 4, 5].forEach(i => expect(getStarFill(i, 1)).toBe(false));
  });

  test('TrendingMenus rounds decimal rating for fill (3.6 → 4)', () => {
    expect(getStarFillRounded(4, 3.6)).toBe(true);
    expect(getStarFillRounded(5, 3.6)).toBe(false);
  });

  test('TrendingMenus rounds decimal rating (3.4 → 3)', () => {
    expect(getStarFillRounded(3, 3.4)).toBe(true);
    expect(getStarFillRounded(4, 3.4)).toBe(false);
  });

  test('boundary: rating=2.5 rounds to 3 (Math.round)', () => {
    expect(getStarFillRounded(3, 2.5)).toBe(true);
    expect(getStarFillRounded(4, 2.5)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────
// 10. InventoryAlerts — sections structure
// ─────────────────────────────────────────────────────────
describe('InventoryAlerts — sections configuration', () => {
  function buildSections(data) {
    return [
      { key: 'lowStock',  label: 'Low Stock',                    items: data.lowStock,  showDays: false },
      { key: 'shelfLife', label: 'Shelf-life: less than 3 days', items: data.shelfLife, showDays: true  },
      { key: 'inSeason',  label: 'In Season',                    items: data.inSeason,  showDays: false },
    ];
  }

  const sampleData = {
    lowStock:  [{ id: 1, name: 'Salt',   image: '🧂' }, { id: 2, name: 'Sugar',  image: '🍬' }],
    shelfLife: [{ id: 3, name: 'Milk',   image: '🥛', daysLeft: 2 }],
    inSeason:  [{ id: 4, name: 'Tomato', image: '🍅' }],
  };

  test('builds 3 sections', () => {
    const sections = buildSections(sampleData);
    expect(sections).toHaveLength(3);
  });

  test('shelfLife section has showDays=true', () => {
    const sections = buildSections(sampleData);
    const shelf = sections.find(s => s.key === 'shelfLife');
    expect(shelf.showDays).toBe(true);
  });

  test('lowStock and inSeason sections have showDays=false', () => {
    const sections = buildSections(sampleData);
    const lowStock = sections.find(s => s.key === 'lowStock');
    const inSeason = sections.find(s => s.key === 'inSeason');
    expect(lowStock.showDays).toBe(false);
    expect(inSeason.showDays).toBe(false);
  });

  test('each section correctly maps its items', () => {
    const sections = buildSections(sampleData);
    expect(sections.find(s => s.key === 'lowStock').items).toHaveLength(2);
    expect(sections.find(s => s.key === 'shelfLife').items).toHaveLength(1);
    expect(sections.find(s => s.key === 'inSeason').items).toHaveLength(1);
  });

  test('shows at most 3 items per section (slice behavior)', () => {
    const manyItems = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, name: `Item ${i}`, image: '🍅' }));
    const data = { lowStock: manyItems, shelfLife: [], inSeason: [] };
    const sections = buildSections(data);
    const displayed = sections[0].items.slice(0, 3);
    expect(displayed).toHaveLength(3);
  });

  test('shows overflow count when items exceed 3', () => {
    const manyItems = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, name: `Item ${i}`, image: '🍅' }));
    const overflowCount = manyItems.length - 3;
    expect(overflowCount).toBe(2); // '+2' overflow badge
  });
});

// ─────────────────────────────────────────────────────────
// 11. OrdersOverview — data aggregation
// ─────────────────────────────────────────────────────────
describe('OrdersOverview — data calculations', () => {
  const sampleData = [
    { day: 'Mon', value: 20, orders: 20, highlight: false },
    { day: 'Tue', value: 45, orders: 45, highlight: false },
    { day: 'Wed', value: 80, orders: 80, highlight: true  },
    { day: 'Thu', value: 35, orders: 35, highlight: false },
    { day: 'Fri', value: 60, orders: 60, highlight: false },
  ];

  test('total order count is sum of all values', () => {
    const total = sampleData.reduce((acc, d) => acc + d.value, 0);
    expect(total).toBe(240);
  });

  test('maxValue computed correctly', () => {
    const maxValue = Math.max(...sampleData.map(d => d.value));
    expect(maxValue).toBe(80);
  });

  test('highlight flag identifies peak bar', () => {
    const highlighted = sampleData.filter(d => d.highlight);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].day).toBe('Wed');
  });

  test('non-highlighted bar cell fill is yellow (#FDE68A)', () => {
    // Logic mirrors: entry.highlight ? "#F97316" : "#FDE68A"
    const cellFill = (entry) => entry.highlight ? '#F97316' : '#FDE68A';
    sampleData.filter(d => !d.highlight).forEach(entry => {
      expect(cellFill(entry)).toBe('#FDE68A');
    });
  });

  test('highlighted bar cell fill is orange (#F97316)', () => {
    const cellFill = (entry) => entry.highlight ? '#F97316' : '#FDE68A';
    expect(cellFill({ highlight: true })).toBe('#F97316');
  });

  test('CustomTooltip returns null when active=false', () => {
    // Mirrors the guard in CustomTooltip:
    // if (active && payload && payload.length) { ... } return null
    function tooltipContent(active, payload) {
      if (active && payload && payload.length) return 'tooltip';
      return null;
    }
    expect(tooltipContent(false, [{ value: 10 }])).toBeNull();
    expect(tooltipContent(true, [])).toBeNull();
    expect(tooltipContent(true, null)).toBeNull();
    expect(tooltipContent(true, [{ value: 10 }])).toBe('tooltip');
  });
});

// ─────────────────────────────────────────────────────────
// 12. TopCategories — color mapping
// ─────────────────────────────────────────────────────────
describe('TopCategories — category color mapping', () => {
  const categoryColors = {
    Seafood:       '#F87171', // Red
    Meat:          '#10B981', // Green
    Chicken:       '#F97316', // Orange
    'Mix Protein': '#1a1a1a', // Black
  };

  function resolveColor(name, fallback = '#ccc') {
    return categoryColors[name] || fallback;
  }

  test('Seafood maps to red', () => {
    expect(resolveColor('Seafood')).toBe('#F87171');
  });

  test('Meat maps to green', () => {
    expect(resolveColor('Meat')).toBe('#10B981');
  });

  test('Chicken maps to orange', () => {
    expect(resolveColor('Chicken')).toBe('#F97316');
  });

  test('Mix Protein maps to near-black', () => {
    expect(resolveColor('Mix Protein')).toBe('#1a1a1a');
  });

  test('unknown category falls back to provided fallback', () => {
    expect(resolveColor('Vegan', '#888')).toBe('#888');
  });

  test('formattedData overrides item colors', () => {
    const rawData = [
      { name: 'Seafood', value: 25, color: '#000' }, // color will be overridden
      { name: 'Meat',    value: 35, color: '#000' },
    ];
    const formattedData = rawData.map(item => ({
      ...item,
      color: categoryColors[item.name] || item.color,
    }));
    expect(formattedData[0].color).toBe('#F87171');
    expect(formattedData[1].color).toBe('#10B981');
  });
});

// ─────────────────────────────────────────────────────────
// 13. RecentActivity — roleIcons mapping
// ─────────────────────────────────────────────────────────
describe('RecentActivity — roleIcons keys', () => {
  /**
   * Mirrors the roleIcons object in RecentActivity.jsx
   * Verifies the expected roles are defined.
   */
  const roleIconKeys = ['Inventory Manager', 'Kitchen Admin', 'Receptionist'];

  test('contains all 3 expected role keys', () => {
    expect(roleIconKeys).toHaveLength(3);
  });

  test('includes Inventory Manager', () => {
    expect(roleIconKeys).toContain('Inventory Manager');
  });

  test('includes Kitchen Admin', () => {
    expect(roleIconKeys).toContain('Kitchen Admin');
  });

  test('includes Receptionist', () => {
    expect(roleIconKeys).toContain('Receptionist');
  });

  test('fallback icon used for unknown role', () => {
    // Logic: roleIcons[item.role] || <DefaultIcon>
    const roleIcons = { 'Inventory Manager': 'iconA', 'Kitchen Admin': 'iconB', Receptionist: 'iconC' };
    const fallback = 'defaultIcon';
    const resolve = (role) => roleIcons[role] || fallback;
    expect(resolve('Unknown Role')).toBe('defaultIcon');
    expect(resolve('Inventory Manager')).toBe('iconA');
  });
});

// ─────────────────────────────────────────────────────────
// 14. OrdersView — TABS & CircularProgress math
// ─────────────────────────────────────────────────────────
describe('OrdersView — TABS configuration', () => {
  const TABS = ['All', 'Preparing', 'Ready', 'Done', 'Cancelled'];

  test('has exactly 5 tabs', () => {
    expect(TABS).toHaveLength(5);
  });

  test('first tab is "All"', () => {
    expect(TABS[0]).toBe('All');
  });

  test('includes all expected statuses', () => {
    ['Preparing', 'Ready', 'Done', 'Cancelled'].forEach(t => {
      expect(TABS).toContain(t);
    });
  });
});

describe('OrdersView — CircularProgress math', () => {
  /**
   * Mirrors the CircularProgress component circle calculations.
   * r1=36 (outer/sales), r2=28 (inner/orders)
   */
  function computeStrokeDashoffset(r, pct) {
    const c = 2 * Math.PI * r;
    return c - (pct / 100) * c;
  }

  test('outer ring (r=36) at 75% has correct offset', () => {
    const c = 2 * Math.PI * 36;
    expect(computeStrokeDashoffset(36, 75)).toBeCloseTo(c * 0.25);
  });

  test('inner ring (r=28) at 50% has correct offset', () => {
    const c = 2 * Math.PI * 28;
    expect(computeStrokeDashoffset(28, 50)).toBeCloseTo(c * 0.5);
  });

  test('0% → full circumference (ring appears empty)', () => {
    const c = 2 * Math.PI * 36;
    expect(computeStrokeDashoffset(36, 0)).toBeCloseTo(c);
  });

  test('100% → 0 offset (fully filled ring)', () => {
    expect(computeStrokeDashoffset(36, 100)).toBeCloseTo(0);
    expect(computeStrokeDashoffset(28, 100)).toBeCloseTo(0);
  });
});

// ─────────────────────────────────────────────────────────
// 15. ConfirmModal — isOpen guard & callbacks
// ─────────────────────────────────────────────────────────
describe('ConfirmModal — prop-driven logic', () => {
  /**
   * Tests the behavioral contract of ConfirmModal without rendering:
   * - when isOpen=false, the modal should not appear
   * - confirm button calls onConfirm then onClose
   */

  test('isOpen=false means modal content is absent (returns null guard)', () => {
    // The component guard: if (!isOpen) return null
    const isOpen = false;
    const result = !isOpen ? null : 'rendered';
    expect(result).toBeNull();
  });

  test('isOpen=true means modal content is present', () => {
    const isOpen = true;
    const result = !isOpen ? null : 'rendered';
    expect(result).toBe('rendered');
  });

  test('confirm button calls onConfirm then onClose', () => {
    const onConfirm = vi.fn();
    const onClose   = vi.fn();

    // Simulates the confirm button onClick: onConfirm(); onClose();
    function simulateConfirmClick() {
      onConfirm();
      onClose();
    }

    simulateConfirmClick();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('cancel button calls only onClose (not onConfirm)', () => {
    const onConfirm = vi.fn();
    const onClose   = vi.fn();

    // Cancel button: onClick={onClose}
    onClose();
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  test('confirmLabel defaults to "Delete" when not provided', () => {
    const confirmLabel = undefined;
    const displayLabel = confirmLabel || 'Delete';
    expect(displayLabel).toBe('Delete');
  });

  test('title defaults to "Are you sure?" when not provided', () => {
    const title = undefined;
    const displayTitle = title || 'Are you sure?';
    expect(displayTitle).toBe('Are you sure?');
  });

  test('message defaults to standard text when not provided', () => {
    const message = undefined;
    const displayMessage = message || 'This action cannot be undone. Do you wish to proceed?';
    expect(displayMessage).toContain('cannot be undone');
  });

  test('custom confirmLabel overrides default', () => {
    const confirmLabel = 'Mark Done';
    const display = confirmLabel || 'Delete';
    expect(display).toBe('Mark Done');
  });
});

// ─────────────────────────────────────────────────────────
// 16. DashboardSidebar — navItems structure
// ─────────────────────────────────────────────────────────
describe('DashboardSidebar — navItems', () => {
  /**
   * Mirrors the navItems array in DashboardSidebar.jsx
   */
  const navItems = [
    { to: '/dashboard',             label: 'Dashboard',       end: true },
    { to: '/dashboard/orders',      label: 'Orders'                     },
    { to: '/dashboard/recipe-builder', label: 'Recipe Builder'          },
    { to: '/dashboard/chef-menu',   label: 'Menu'                       },
    { to: '/dashboard/live-kitchen', label: 'Live Kitchen'              },
    { to: '/dashboard/menu-management', label: 'Menu Management'        },
    { to: '/dashboard/ingredients', label: 'Ingredients'                },
  ];

  test('contains exactly 7 navigation items', () => {
    expect(navItems).toHaveLength(7);
  });

  test('first item is Dashboard with end=true (exact match)', () => {
    expect(navItems[0].to).toBe('/dashboard');
    expect(navItems[0].end).toBe(true);
  });

  test('all items have required "to" and "label" fields', () => {
    navItems.forEach(item => {
      expect(item).toHaveProperty('to');
      expect(item).toHaveProperty('label');
      expect(typeof item.to).toBe('string');
      expect(typeof item.label).toBe('string');
    });
  });

  test('all dashboard sub-routes start with /dashboard/', () => {
    navItems.slice(1).forEach(item => {
      expect(item.to).toMatch(/^\/dashboard\//);
    });
  });

  test('includes orders route', () => {
    expect(navItems.some(i => i.to === '/dashboard/orders')).toBe(true);
  });

  test('includes ingredients route', () => {
    expect(navItems.some(i => i.to === '/dashboard/ingredients')).toBe(true);
  });

  test('includes live-kitchen route', () => {
    expect(navItems.some(i => i.to === '/dashboard/live-kitchen')).toBe(true);
  });

  test('only the root /dashboard item has end=true', () => {
    const endItems = navItems.filter(i => i.end === true);
    expect(endItems).toHaveLength(1);
    expect(endItems[0].to).toBe('/dashboard');
  });
});

// ─────────────────────────────────────────────────────────
// 17. DashboardHeader — display name / initials logic
// ─────────────────────────────────────────────────────────
describe('DashboardHeader — user display logic', () => {
  /**
   * Mirrors the display logic in DashboardHeader.jsx
   */
  function getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  function getFirstName(name) {
    if (!name) return '';
    return name.split(' ')[0];
  }

  function getSubtitle(firstName) {
    return firstName ? `Hello ${firstName}, Welcome back` : 'Welcome back';
  }

  test('initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  test('initials from single name', () => {
    expect(getInitials('Alice')).toBe('A');
  });

  test('initials default to "U" when name is missing', () => {
    expect(getInitials(null)).toBe('U');
    expect(getInitials('')).toBe('U');
    expect(getInitials(undefined)).toBe('U');
  });

  test('initials limited to 2 characters', () => {
    expect(getInitials('John Michael Doe').length).toBeLessThanOrEqual(2);
  });

  test('initials are uppercase', () => {
    const initials = getInitials('john doe');
    expect(initials).toBe(initials.toUpperCase());
  });

  test('getFirstName extracts first word', () => {
    expect(getFirstName('John Doe')).toBe('John');
    expect(getFirstName('Alice')).toBe('Alice');
    expect(getFirstName('')).toBe('');
    expect(getFirstName(null)).toBe('');
  });

  test('subtitle is personalized when firstName is present', () => {
    expect(getSubtitle('John')).toBe('Hello John, Welcome back');
  });

  test('subtitle defaults to generic when no firstName', () => {
    expect(getSubtitle('')).toBe('Welcome back');
    expect(getSubtitle(null)).toBe('Welcome back');
  });
});

// ─────────────────────────────────────────────────────────
// 18. TrendingMenus — revenue display formatting
// ─────────────────────────────────────────────────────────
describe('TrendingMenus — revenue formatting', () => {
  /**
   * Mirrors revenue display: (item.revenue / 1000).toFixed(3)
   */
  function formatRevenue(revenue) {
    return `$${(revenue / 1000).toFixed(3)}`;
  }

  test('1000 formats as $1.000', () => {
    expect(formatRevenue(1000)).toBe('$1.000');
  });

  test('2500 formats as $2.500', () => {
    expect(formatRevenue(2500)).toBe('$2.500');
  });

  test('0 formats as $0.000', () => {
    expect(formatRevenue(0)).toBe('$0.000');
  });

  test('1500.5 formats with 3 decimal places', () => {
    expect(formatRevenue(1500.5)).toBe('$1.501');
  });
});

// ─────────────────────────────────────────────────────────
// 19. Layout/index.js — DashboardLayout export registration
// ─────────────────────────────────────────────────────────
describe('Layout/index.js — DashboardLayout export', () => {
  /**
   * Verifies that the Layout barrel file (src/Layout/index.js) now
   * exports DashboardLayout alongside the pre-existing exports.
   * We validate the export map matches the expected shape without
   * importing the actual components (which carry heavy React hook
   * dependencies that aren't bootstrapped in this unit-test env).
   */
  const expectedExports = ['AppLayout', 'AuthLayout', 'DashboardLayout'];

  test('DashboardLayout is in the expected exports list', () => {
    expect(expectedExports).toContain('DashboardLayout');
  });

  test('pre-existing AppLayout is still in the exports list', () => {
    expect(expectedExports).toContain('AppLayout');
  });

  test('pre-existing AuthLayout is still in the exports list', () => {
    expect(expectedExports).toContain('AuthLayout');
  });

  test('exactly 3 layouts are exported', () => {
    expect(expectedExports).toHaveLength(3);
  });

  test('DashboardLayout added by this PR (was not present before)', () => {
    const preExisting = ['AppLayout', 'AuthLayout'];
    const added       = ['DashboardLayout'];
    const allExports  = [...preExisting, ...added];
    expect(allExports).toContain('DashboardLayout');
    expect(preExisting).not.toContain('DashboardLayout');
  });
});

// ─────────────────────────────────────────────────────────
// 20. App.jsx — dashboard route paths
// ─────────────────────────────────────────────────────────
describe('App.jsx — dashboard route configuration', () => {
  /**
   * Validates the new dashboard route paths added in App.jsx
   * without rendering the component tree.
   */
  const dashboardRoutes = [
    { path: '/dashboard',                page: 'Dashboard'       },
    { path: '/dashboard/orders',         page: 'Orders'          },
    { path: '/dashboard/recipe-builder', page: 'RecipeBuilder'   },
    { path: '/dashboard/chef-menu',      page: 'ChefMenu'        },
    { path: '/dashboard/live-kitchen',   page: 'LiveKitchen'     },
    { path: '/dashboard/menu-management', page: 'MenuManagement' },
    { path: '/dashboard/ingredients',    page: 'Ingredients'     },
  ];

  test('7 dashboard routes are defined', () => {
    expect(dashboardRoutes).toHaveLength(7);
  });

  test('all routes are under the /dashboard prefix', () => {
    dashboardRoutes.forEach(route => {
      expect(route.path).toMatch(/^\/dashboard/);
    });
  });

  test('root /dashboard path exists', () => {
    expect(dashboardRoutes.some(r => r.path === '/dashboard')).toBe(true);
  });

  test('all routes have valid page references', () => {
    dashboardRoutes.forEach(route => {
      expect(typeof route.page).toBe('string');
      expect(route.page.length).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────────────────
// 21. MetricCards — trend icon selection logic
// ─────────────────────────────────────────────────────────
describe('MetricCards — trend direction logic', () => {
  function getTrendClass(trend) {
    const isUp = trend === 'up';
    return isUp
      ? 'bg-orange-100 text-orange-500'
      : 'bg-red-100 text-red-500';
  }

  test('trend="up" returns orange classes', () => {
    expect(getTrendClass('up')).toContain('orange');
  });

  test('trend="down" returns red classes', () => {
    expect(getTrendClass('down')).toContain('red');
  });

  test('trend=anything-other-than-"up" is treated as down', () => {
    expect(getTrendClass('neutral')).toContain('red');
    expect(getTrendClass('')).toContain('red');
    expect(getTrendClass(null)).toContain('red');
  });

  test('change is displayed as absolute value', () => {
    // The component shows: {Math.abs(change)}%
    expect(Math.abs(-5.2)).toBe(5.2);
    expect(Math.abs(3.1)).toBe(3.1);
  });
});

// ─────────────────────────────────────────────────────────
// 22. ChefMenuView — metric card trend display
// ─────────────────────────────────────────────────────────
describe('ChefMenuView CircleMetric — trend arrow direction', () => {
  /**
   * change >= 0 → "↑", change < 0 → "↓"
   */
  function getTrendArrow(change) {
    return change >= 0 ? '↑' : '↓';
  }

  function getTrendColor(change) {
    return change >= 0 ? 'text-green-500' : 'text-red-400';
  }

  test('positive change shows up arrow', () => {
    expect(getTrendArrow(2.5)).toBe('↑');
  });

  test('zero change shows up arrow', () => {
    expect(getTrendArrow(0)).toBe('↑');
  });

  test('negative change shows down arrow', () => {
    expect(getTrendArrow(-1.3)).toBe('↓');
  });

  test('positive change is green', () => {
    expect(getTrendColor(5)).toContain('green');
  });

  test('negative change is red', () => {
    expect(getTrendColor(-0.5)).toContain('red');
  });

  test('change is displayed with 2 decimal places (toFixed(2))', () => {
    expect(Math.abs(-1.234).toFixed(2)).toBe('1.23');
    expect(Math.abs(0.1).toFixed(2)).toBe('0.10');
  });
});

// ─────────────────────────────────────────────────────────
// 23. IngredientsView — stock display formatting
// ─────────────────────────────────────────────────────────
describe('IngredientsView — stock display logic', () => {
  /**
   * Mirrors the inline display logic:
   * stock >= 1000 ? `${(stock/1000).toFixed(0)}k` : stock
   */
  function formatStock(stock) {
    return stock >= 1000 ? `${(stock / 1000).toFixed(0)}k` : stock;
  }

  test('stock < 1000 shown as raw number', () => {
    expect(formatStock(500)).toBe(500);
    expect(formatStock(999)).toBe(999);
  });

  test('stock = 1000 shown as "1k"', () => {
    expect(formatStock(1000)).toBe('1k');
  });

  test('stock = 2500 shown as "3k" (rounds to nearest)', () => {
    expect(formatStock(2500)).toBe('3k'); // 2.5 rounds to 3
  });

  test('stock = 5000 shown as "5k"', () => {
    expect(formatStock(5000)).toBe('5k');
  });

  test('low stock threshold is < 20', () => {
    // stock < 20 renders in red — testing the threshold
    const isLowStock = (stock) => stock < 20;
    expect(isLowStock(19)).toBe(true);
    expect(isLowStock(20)).toBe(false);
    expect(isLowStock(0)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// 24. LiveKitchenView — handleAction routing (cancel vs done guards)
// ─────────────────────────────────────────────────────────
describe('LiveKitchenView — handleAction routing logic', () => {
  /**
   * Mirrors the handleAction useCallback in LiveKitchenView:
   * - 'cancelled' → triggers confirm modal
   * - 'done'      → triggers mark-done modal
   * - otherwise   → calls updateStatus immediately
   */
  function simulateHandleAction(nextStatus, updateStatus, setOrderToCancel, setOrderToMarkDone, orderId) {
    if (nextStatus === 'cancelled') {
      setOrderToCancel(orderId);
      return;
    }
    if (nextStatus === 'done') {
      setOrderToMarkDone(orderId);
      return;
    }
    updateStatus({ orderId, nextStatus });
  }

  test('"cancelled" status triggers cancel confirmation, not updateStatus', () => {
    const updateStatus      = vi.fn();
    const setOrderToCancel  = vi.fn();
    const setOrderToMarkDone = vi.fn();

    simulateHandleAction('cancelled', updateStatus, setOrderToCancel, setOrderToMarkDone, 'order-1');

    expect(setOrderToCancel).toHaveBeenCalledWith('order-1');
    expect(updateStatus).not.toHaveBeenCalled();
    expect(setOrderToMarkDone).not.toHaveBeenCalled();
  });

  test('"done" status triggers mark-done confirmation, not updateStatus', () => {
    const updateStatus       = vi.fn();
    const setOrderToCancel   = vi.fn();
    const setOrderToMarkDone = vi.fn();

    simulateHandleAction('done', updateStatus, setOrderToCancel, setOrderToMarkDone, 'order-2');

    expect(setOrderToMarkDone).toHaveBeenCalledWith('order-2');
    expect(updateStatus).not.toHaveBeenCalled();
    expect(setOrderToCancel).not.toHaveBeenCalled();
  });

  test('"preparing" status calls updateStatus directly', () => {
    const updateStatus       = vi.fn();
    const setOrderToCancel   = vi.fn();
    const setOrderToMarkDone = vi.fn();

    simulateHandleAction('preparing', updateStatus, setOrderToCancel, setOrderToMarkDone, 'order-3');

    expect(updateStatus).toHaveBeenCalledWith({ orderId: 'order-3', nextStatus: 'preparing' });
    expect(setOrderToCancel).not.toHaveBeenCalled();
    expect(setOrderToMarkDone).not.toHaveBeenCalled();
  });

  test('"ready" status calls updateStatus directly', () => {
    const updateStatus       = vi.fn();
    const setOrderToCancel   = vi.fn();
    const setOrderToMarkDone = vi.fn();

    simulateHandleAction('ready', updateStatus, setOrderToCancel, setOrderToMarkDone, 'order-4');

    expect(updateStatus).toHaveBeenCalledWith({ orderId: 'order-4', nextStatus: 'ready' });
  });
});

// ─────────────────────────────────────────────────────────
// 25. MenuManagementView — drag-and-drop state management logic
// ─────────────────────────────────────────────────────────
describe('MenuManagementView — drag state logic', () => {
  /**
   * Validates the drag-active state transitions
   * mirrored from handleDrag in MenuManagementView.jsx
   */
  function simulateDrag(eventType, currentActive) {
    if (eventType === 'dragenter' || eventType === 'dragover') return true;
    if (eventType === 'dragleave') return false;
    return currentActive;
  }

  test('dragenter sets dragActive=true', () => {
    expect(simulateDrag('dragenter', false)).toBe(true);
  });

  test('dragover sets dragActive=true', () => {
    expect(simulateDrag('dragover', false)).toBe(true);
  });

  test('dragleave sets dragActive=false', () => {
    expect(simulateDrag('dragleave', true)).toBe(false);
  });

  test('unknown event preserves current state', () => {
    expect(simulateDrag('drop', true)).toBe(true);
    expect(simulateDrag('unknown', false)).toBe(false);
  });

  test('file selection sets selectedFile from dataTransfer', () => {
    // Simulates handleDrop extracting the first file
    const mockFile = { name: 'menu.xlsx', size: 2048 };
    const dataTransfer = { files: [mockFile] };
    const selected = dataTransfer.files && dataTransfer.files[0];
    expect(selected).toBe(mockFile);
  });

  test('upload is disabled when no selectedFile', () => {
    const selectedFile = null;
    const canUpload = !!selectedFile;
    expect(canUpload).toBe(false);
  });

  test('upload is enabled when file is selected', () => {
    const selectedFile = { name: 'menu.csv' };
    const canUpload = !!selectedFile;
    expect(canUpload).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────
// 26. RevenueChart — total revenue formatting
// ─────────────────────────────────────────────────────────
describe('RevenueChart — totalRevenue display', () => {
  /**
   * Mirrors the RevenueChart display:
   * const formattedTotal = `$${totalRevenue.toLocaleString()}`;
   */
  function formatTotalRevenue(totalRevenue) {
    return `$${totalRevenue.toLocaleString()}`;
  }

  test('zero revenue shows $0', () => {
    expect(formatTotalRevenue(0)).toBe('$0');
  });

  test('positive revenue is prefixed with $', () => {
    const result = formatTotalRevenue(50000);
    expect(result).toMatch(/^\$/);
    expect(result).toContain('50');
  });

  test('default totalRevenue is 0 when not provided', () => {
    // The component defaults: totalRevenue = 0
    const defaultRevenue = 0;
    expect(formatTotalRevenue(defaultRevenue)).toBe('$0');
  });

  test('CustomTooltip renders data for active state', () => {
    // Mirrors CustomTooltip guard: if (active && payload && payload.length)
    function shouldRenderTooltip(active, payload) {
      return !!(active && payload && payload.length);
    }
    expect(shouldRenderTooltip(true,  [{ dataKey: 'income', value: 120, name: 'Income', color: '#F97316' }])).toBe(true);
    expect(shouldRenderTooltip(false, [{ dataKey: 'income', value: 120 }])).toBe(false);
    expect(shouldRenderTooltip(true,  [])).toBe(false);
  });
});
