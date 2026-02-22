/**
 * ⚠️  DEPRECATED — DO NOT USE
 * ============================================================
 * This file has been replaced by the proper service layer.
 *
 * Use instead:
 *   - Menu data      → src/services/menu.service.js
 *   - Restaurants    → api.get('/restaurants') via src/services/api.js
 *   - Meals by cat   → api.get('/menu') + filter client-side, or extend menu.service.js
 *
 * Mock data is now handled centrally in src/mocks/handlers.js
 * and is plugged into the axios instance in src/services/api.js
 * via a custom adapter when VITE_USE_MOCK=true.
 * ============================================================
 */

export { };
