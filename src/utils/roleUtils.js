/**
 * Centralized Role Check Utilities
 * ─────────────────────────────────────────────────────────────────
 * Replaces fragile ad-hoc string comparisons across layout, navigation,
 * and route guards.
 */

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  CHIEF: "chief",
  CHEF: "chef",
  HEAD_CHEF: "head_chef",
  SOUS_CHEF: "sous_chef",
  USER: "user",
};

/** Roles allowed to enter any part of the Staff Dashboard */
export const STAFF_ROLES = [
  ROLES.ADMIN,
  ROLES.MANAGER,
  ROLES.CHIEF,
  ROLES.CHEF,
  ROLES.HEAD_CHEF,
  ROLES.SOUS_CHEF,
];

/** Roles restricted specifically to kitchen operations & order queue */
export const KITCHEN_ONLY_ROLES = [
  ROLES.CHIEF,
  ROLES.CHEF,
  ROLES.HEAD_CHEF,
  ROLES.SOUS_CHEF,
];

/**
 * Checks if a user has staff access to the dashboard.
 */
export function isStaffUser(user) {
  if (!user || !user.role) return false;
  return STAFF_ROLES.includes(String(user.role).toLowerCase());
}

/**
 * Checks if a user is restricted to kitchen/order views only.
 */
export function isKitchenOnlyUser(user) {
  if (!user || !user.role) return false;
  return KITCHEN_ONLY_ROLES.includes(String(user.role).toLowerCase());
}
