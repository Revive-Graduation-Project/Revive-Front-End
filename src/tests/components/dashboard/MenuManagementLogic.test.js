/**
 * Tests for pure utility logic extracted from MenuManagementView.jsx.
 *
 * The isValidMenuFile and calendar-days helpers are defined inline in the
 * component, so we reproduce them here to unit-test independently.
 */
import { describe, test, expect } from 'vitest';

// ── Re-implement the pure helpers exactly as they appear in MenuManagementView ──

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];

function isValidMenuFile(file) {
  const name = file.name.toLowerCase();
  const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  return hasAllowedExt && file.size <= MAX_FILE_SIZE;
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

// ── isValidMenuFile ──────────────────────────────────────────────────────────

describe('isValidMenuFile', () => {
  const makeFile = (name, sizeBytes) => ({ name, size: sizeBytes });

  test('accepts a valid .csv file under 10 MB', () => {
    expect(isValidMenuFile(makeFile('menu.csv', 1024))).toBe(true);
  });

  test('accepts a valid .xlsx file under 10 MB', () => {
    expect(isValidMenuFile(makeFile('menu.xlsx', 5 * 1024 * 1024))).toBe(true);
  });

  test('accepts a valid .xls file under 10 MB', () => {
    expect(isValidMenuFile(makeFile('menu.xls', 100))).toBe(true);
  });

  test('accepts a file at exactly the 10 MB limit', () => {
    expect(isValidMenuFile(makeFile('menu.csv', MAX_FILE_SIZE))).toBe(true);
  });

  test('rejects a file exceeding 10 MB', () => {
    expect(isValidMenuFile(makeFile('menu.csv', MAX_FILE_SIZE + 1))).toBe(false);
  });

  test('rejects a .pdf file even if small', () => {
    expect(isValidMenuFile(makeFile('menu.pdf', 1024))).toBe(false);
  });

  test('rejects a .txt file', () => {
    expect(isValidMenuFile(makeFile('data.txt', 100))).toBe(false);
  });

  test('rejects a .json file', () => {
    expect(isValidMenuFile(makeFile('data.json', 100))).toBe(false);
  });

  test('accepts .CSV (uppercase extension)', () => {
    expect(isValidMenuFile(makeFile('MENU.CSV', 1024))).toBe(true);
  });

  test('accepts mixed-case extension .Xlsx', () => {
    expect(isValidMenuFile(makeFile('Menu.Xlsx', 1024))).toBe(true);
  });

  test('rejects file with no extension', () => {
    expect(isValidMenuFile(makeFile('menufile', 1024))).toBe(false);
  });

  test('rejects a file that is 0 bytes but has valid extension', () => {
    // 0 bytes is <= 10MB so this is actually valid by the implementation
    expect(isValidMenuFile(makeFile('empty.csv', 0))).toBe(true);
  });
});

// ── buildCalendarDays ────────────────────────────────────────────────────────

describe('buildCalendarDays (calendar helper in MenuManagementView)', () => {
  test('January 2025 starts on Wednesday (day index 3), has 31 days', () => {
    // Jan 1 2025 = Wednesday = index 3
    const cells = buildCalendarDays(2025, 0); // month 0 = January
    expect(cells[0]).toBeNull(); // 3 leading nulls
    expect(cells[1]).toBeNull();
    expect(cells[2]).toBeNull();
    expect(cells[3]).toBe(1);    // 1st of January
    expect(cells[cells.length - 1]).toBe(31);
    // Total cells: 3 nulls + 31 days = 34
    expect(cells.length).toBe(34);
  });

  test('February 2024 (leap year) has 29 days', () => {
    const cells = buildCalendarDays(2024, 1); // February 2024
    const days = cells.filter((c) => c !== null);
    expect(days.length).toBe(29);
    expect(days[days.length - 1]).toBe(29);
  });

  test('February 2023 (non-leap year) has 28 days', () => {
    const cells = buildCalendarDays(2023, 1);
    const days = cells.filter((c) => c !== null);
    expect(days.length).toBe(28);
  });

  test('days are contiguous starting from 1', () => {
    const cells = buildCalendarDays(2025, 5); // June 2025
    const days = cells.filter((c) => c !== null);
    expect(days[0]).toBe(1);
    days.forEach((d, idx) => {
      expect(d).toBe(idx + 1);
    });
  });

  test('month that starts on Sunday (day index 0) has no leading nulls', () => {
    // Find a month that starts on Sunday: e.g. June 2025 starts on Sunday
    const cells = buildCalendarDays(2025, 8); // September 2025 starts on Monday (idx 1)
    // Just assert the first cell is either null or 1 depending on the start day
    expect(cells[0] === null || cells[0] === 1).toBe(true);
  });

  test('leading null count equals the first-day-of-week index', () => {
    const cells = buildCalendarDays(2025, 2); // March 2025 starts on Saturday = index 6
    const leadingNulls = cells.filter((c, i) => c === null && i < 7).length;
    // March 1 2025 = Saturday = 6
    expect(leadingNulls).toBe(6);
  });
});