/**
 * ============================================================
 * Store Tests
 * ============================================================
 * Tests all Zustand stores by calling their actions directly
 * via store.getState() — no React rendering needed.
 *
 * Run with: npm test
 * ============================================================
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// ─────────────────────────────────────────────────────────
// Mock localStorage (required for zustand persist middleware)
// ─────────────────────────────────────────────────────────
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] ?? null,
        setItem: (key, value) => { store[key] = String(value); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });


// ─────────────────────────────────────────────────────────
// Mock the api module so store tests don't make real calls
// ─────────────────────────────────────────────────────────
vi.mock('../../services/api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

// ─────────────────────────────────────────────────────────
// 1. ORDER STORE
// ─────────────────────────────────────────────────────────
describe('🛒 OrderStore', () => {
    let store;

    const mockMeal = { id: 1, name: 'Chicken Bowl', price: 120, category: 'Chicken' };
    const mockMeal2 = { id: 2, name: 'Green Salad', price: 140, category: 'Vegetarian' };

    beforeEach(async () => {
        localStorageMock.clear();
        // Re-import fresh store each test to reset state
        vi.resetModules();
        const mod = await import('../../store/orderStore');
        store = mod.default;
        store.setState({
            items: [], totalItems: 0, totalAmount: 0,
            error: null, loading: false, note: '',
            lastOrder: null, isCartDrawerOpen: false,
            myOrders: [], myOrdersLoading: false, myOrdersError: null,
            customerDetails: { email: '', firstName: '', lastName: '', phone: '', region: '', city: '', address: '', zipCode: '' },
            paymentMethod: 'cash', savedCard: null,
        });

        const { api } = await import('../../services/api');
        api.post.mockResolvedValue({ data: { message: 'Success' } });
    });

    test('addItem — adds a new item to cart', () => {
        store.getState().addItem(mockMeal);
        const { items, totalItems, totalAmount } = store.getState();
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(1);
        expect(totalItems).toBe(1);
        expect(totalAmount).toBe(120);
        console.log('✅ addItem works');
    });

    test('addItem — increments quantity for duplicate item', () => {
        store.getState().addItem(mockMeal);
        store.getState().addItem(mockMeal);
        const { items, totalItems, totalAmount } = store.getState();
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(2);
        expect(totalItems).toBe(2);
        expect(totalAmount).toBe(240);
        console.log('✅ addItem duplicate increments quantity');
    });

    test('addItem — rejects invalid item', () => {
        store.getState().addItem({ id: 1, name: 'Bad' }); // missing price
        expect(store.getState().items).toHaveLength(0);
        expect(store.getState().error).toBe('Invalid item data');
        console.log('✅ addItem rejects invalid item');
    });

    test('removeItem — removes item from cart', () => {
        store.getState().addItem(mockMeal);
        store.getState().removeItem(1);
        expect(store.getState().items).toHaveLength(0);
        expect(store.getState().totalItems).toBe(0);
        expect(store.getState().totalAmount).toBe(0);
        console.log('✅ removeItem works');
    });

    test('increaseQty / decreaseQty — change item quantity', () => {
        store.getState().addItem(mockMeal);
        store.getState().increaseQty(1);
        expect(store.getState().items[0].quantity).toBe(2);

        store.getState().decreaseQty(1);
        expect(store.getState().items[0].quantity).toBe(1);
        console.log('✅ increaseQty / decreaseQty work');
    });

    test('decreaseQty — removes item when quantity hits 0', () => {
        store.getState().addItem(mockMeal);
        store.getState().decreaseQty(1);
        expect(store.getState().items).toHaveLength(0);
        console.log('✅ decreaseQty removes item at 0');
    });

    test('clearCart — resets cart state', () => {
        store.getState().addItem(mockMeal);
        store.getState().addItem(mockMeal2);
        store.getState().clearCart();
        const { items, totalItems, totalAmount } = store.getState();
        expect(items).toHaveLength(0);
        expect(totalItems).toBe(0);
        expect(totalAmount).toBe(0);
        console.log('✅ clearCart works');
    });

    test('getDeliveryFee — returns fee only when cart not empty', () => {
        expect(store.getState().getDeliveryFee()).toBe(0);
        store.getState().addItem(mockMeal);
        expect(store.getState().getDeliveryFee()).toBeGreaterThan(0);
        console.log('✅ getDeliveryFee works');
    });

    test('getTotalWithDelivery — includes delivery fee', () => {
        store.getState().addItem(mockMeal); // 120 EGP
        const total = store.getState().getTotalWithDelivery();
        const fee = store.getState().getDeliveryFee();
        expect(total).toBe(120 + fee);
        console.log('✅ getTotalWithDelivery works');
    });

    test('submitOrder — fails on empty cart', async () => {
        const result = await store.getState().submitOrder();
        expect(result).toBe(false);
        expect(store.getState().error).toBe('Cart is empty');
        console.log('✅ submitOrder rejects empty cart');
    });

    test('submitOrder — succeeds with valid cart', async () => {
        store.getState().addItem(mockMeal);
        const result = await store.getState().submitOrder();
        expect(result).toBe(true);
        expect(store.getState().items).toHaveLength(0); // cart cleared
        expect(store.getState().lastOrder).not.toBeNull();
        console.log('✅ submitOrder succeeds');
    });

    test('openCartDrawer / closeCartDrawer — toggle drawer', () => {
        store.getState().openCartDrawer();
        expect(store.getState().isCartDrawerOpen).toBe(true);
        store.getState().closeCartDrawer();
        expect(store.getState().isCartDrawerOpen).toBe(false);
        console.log('✅ cart drawer toggle works');
    });
});


// ─────────────────────────────────────────────────────────
// 2. FAVORITES STORE
// ─────────────────────────────────────────────────────────
describe('❤️  FavoritesStore', () => {
    let store;

    const mockMeal = { id: 1, name: 'Beef Steak', price: 180, category: 'Beef' };

    beforeEach(async () => {
        localStorageMock.clear();
        vi.resetModules();
        const mod = await import('../../store/favoritesStore');
        store = mod.default;
        store.setState({ favorites: [] });
    });

    test('toggleFavorite — adds item to favorites', () => {
        store.getState().toggleFavorite(mockMeal);
        expect(store.getState().favorites).toHaveLength(1);
        expect(store.getState().favorites[0].id).toBe(1);
        console.log('✅ toggleFavorite adds');
    });

    test('toggleFavorite — removes item if already in favorites', () => {
        store.getState().toggleFavorite(mockMeal);
        store.getState().toggleFavorite(mockMeal); // toggle off
        expect(store.getState().favorites).toHaveLength(0);
        console.log('✅ toggleFavorite removes');
    });

    test('isFavorite — returns correct boolean', () => {
        expect(store.getState().isFavorite(1)).toBe(false);
        store.getState().toggleFavorite(mockMeal);
        expect(store.getState().isFavorite(1)).toBe(true);
        console.log('✅ isFavorite works');
    });

    test('clearFavorites — empties the list', () => {
        store.getState().toggleFavorite(mockMeal);
        store.getState().clearFavorites();
        expect(store.getState().favorites).toHaveLength(0);
        console.log('✅ clearFavorites works');
    });
});


// ─────────────────────────────────────────────────────────
// 3. LOYALTY STORE
// ─────────────────────────────────────────────────────────
describe('🏆 LoyaltyStore', () => {
    let store;

    beforeEach(async () => {
        localStorageMock.clear();
        vi.resetModules();
        const mod = await import('../../store/loyaltyStore');
        store = mod.default;
        store.setState({ points: 0, history: [], error: null });
    });

    test('earnPoints — adds points and logs history', () => {
        store.getState().earnPoints(100);
        expect(store.getState().points).toBe(100);
        expect(store.getState().history).toHaveLength(1);
        expect(store.getState().history[0].type).toBe('EARN');
        console.log('✅ earnPoints works');
    });

    test('earnPoints — rejects non-positive amounts', () => {
        store.getState().earnPoints(0);
        expect(store.getState().points).toBe(0);
        expect(store.getState().error).toBeTruthy();
        console.log('✅ earnPoints rejects 0');
    });

    test('earnPoints — idempotency: same transactionId not processed twice', () => {
        store.getState().earnPoints(100, 'tx-001');
        store.getState().earnPoints(100, 'tx-001'); // duplicate
        expect(store.getState().points).toBe(100); // only added once
        console.log('✅ earnPoints idempotency works');
    });

    test('redeemPoints — deducts points', () => {
        store.getState().earnPoints(200);
        store.getState().redeemPoints(50);
        expect(store.getState().points).toBe(150);
        expect(store.getState().history).toHaveLength(2);
        console.log('✅ redeemPoints works');
    });

    test('redeemPoints — rejects insufficient points', () => {
        store.getState().earnPoints(30);
        store.getState().redeemPoints(100);
        expect(store.getState().points).toBe(30); // unchanged
        expect(store.getState().error).toBe('Insufficient loyalty points');
        console.log('✅ redeemPoints rejects insufficient balance');
    });

    test('resetLoyalty — clears everything', () => {
        store.getState().earnPoints(500);
        store.getState().resetLoyalty();
        expect(store.getState().points).toBe(0);
        expect(store.getState().history).toHaveLength(0);
        console.log('✅ resetLoyalty works');
    });
});


// ─────────────────────────────────────────────────────────
// 4. RESTAURANT STORE (meals fetch via mock api)
// ─────────────────────────────────────────────────────────
describe('🍽️  RestaurantStore', () => {
    let store;

    beforeEach(async () => {
        localStorageMock.clear();
        vi.resetModules();

        // Setup the api mock to return mock meals
        const { api } = await import('../../services/api');
        api.get.mockResolvedValue({
            data: [
                { id: 1, name: 'Chicken Bowl', price: 120, category: 'Chicken' },
                { id: 2, name: 'Green Salad', price: 140, category: 'Vegetarian' },
            ],
        });

        const mod = await import('../../store/restaurantStore');
        store = mod.default;
        store.setState({ meals: [], loading: false, error: null });
    });

    test('fetchMeals — loads meals from service', async () => {
        await store.getState().fetchMeals();
        const { meals, loading, error } = store.getState();
        expect(meals).toHaveLength(2);
        expect(meals[0].name).toBe('Chicken Bowl');
        expect(loading).toBe(false);
        expect(error).toBeNull();
        console.log('✅ fetchMeals loads mock data');
    });

    test('fetchMeals — handles API error gracefully', async () => {
        const { api } = await import('../../services/api');
        api.get.mockRejectedValueOnce(new Error('Network error'));

        await store.getState().fetchMeals();
        expect(store.getState().meals).toHaveLength(0);
        expect(store.getState().error).toBe('Network error');
        expect(store.getState().loading).toBe(false);
        console.log('✅ fetchMeals handles errors');
    });

    test('clearError — resets error state', async () => {
        store.setState({ error: 'Something went wrong' });
        store.getState().clearError();
        expect(store.getState().error).toBeNull();
        console.log('✅ clearError works');
    });
});
