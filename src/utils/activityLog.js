/**
 * Activity Log Utility
 * ─────────────────────────────────────────────────────────────────
 * Stores recent staff/system activity in localStorage so the
 * RecentActivity widget has real data without a backend endpoint.
 *
 * Max 20 entries are kept. Oldest entries are automatically dropped.
 */

const STORAGE_KEY = "revive_activity_log";
const MAX_ENTRIES = 20;

/**
 * Push a new activity entry to the log.
 * @param {{ user: string, role: string, action: string, avatar?: string }} entry
 */
export function pushActivity({ user, role, action, avatar = "" }) {
  const existing = getActivityRaw();
  const entry = {
    id:     Date.now(),
    user:   user   || "Staff",
    role:   role   || "Admin",
    action: action || "",
    avatar,
    // Store ISO so we can format it as "X mins ago" dynamically
    time: new Date().toISOString(),
  };
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently ignore quota errors
  }
  return updated;
}

/** Returns the raw stored entries (ISO time, no formatting). */
export function getActivityRaw() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/** Clears the entire activity log (useful for testing). */
export function clearActivity() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Formats an ISO timestamp as a human-readable relative time string.
 * e.g. "just now", "5 mins ago", "2 hours ago", "3 days ago"
 */
export function formatTimeAgo(isoString) {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  if (isNaN(diff) || diff < 0) return "";
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60)  return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  const hours   = Math.floor(minutes / 60);
  if (hours   < 24)  return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days    = Math.floor(hours   / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
