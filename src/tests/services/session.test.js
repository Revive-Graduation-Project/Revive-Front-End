import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import AxiosMockAdapter from 'axios-mock-adapter';
import { api } from '../../services/api';
import useAuthStore from '../../store/authStore';

// Test Suite for Session Restoration & Security
describe('Session Logic & Security Tests', () => {
    let mock;
    const { restoreSession , login , getAccessToken } = useAuthStore.getState();
    beforeEach(() => {
        // Reset Zustand store state
        useAuthStore.setState({
            user: null,
            token: null,
            isAuthenticated: false
        });

        // Clear localStorage
        localStorage.clear();

        // Mock Axios
        mock = new AxiosMockAdapter(api);
    });

    afterEach(() => {
        mock.reset();
    });

    // TEST 1: Security - Ensure token is NOT persisted
    test('SECURITY: Token should NOT be persisted to localStorage', async () => {
        const fakeUser = { id: 1, email: 'test@test.com' };
        const fakeToken = 'secret_access_token';
        const fakeExpiry = Date.now() + 10000;
        mock.onPost('/auth/login').reply(200, {
            user: fakeUser,
            token: fakeToken,
            expiresAt: fakeExpiry
        });
        // Login (updates store)
        await login({ user: fakeUser, token: fakeToken, expiresAt: fakeExpiry });

        // Verify In-Memory State have token
        expect(getAccessToken()).toBe(fakeToken);

        // Verify LocalStorage - Should ONLY have user and expiresAt
        const storedData = JSON.parse(localStorage.getItem('revive-auth-store'));
        const persistedState = storedData.state;

        expect(persistedState.user).toEqual(fakeUser);       // User should be there
        expect(persistedState.token).toBeUndefined();        // Token should be MISSING!
        expect(persistedState.expiresAt).toBe(fakeExpiry);   // Expiry should be there

        console.log('✅ Security Test Passed: Token removed from localStorage!');
    });

    // TEST 2: restoreSession Success
    test('restoreSession calls refresh endpoint and restores token', async () => {
        const fakeUser = { id: 1, email: 'user@test.com' };
        useAuthStore.setState({ user: fakeUser, token: null }); // Simulate page refresh state

        const newToken = 'new_refreshed_token';
        mock.onPost('/auth/refresh').reply(200, { token: newToken });
  
        // Call restoreSession
        const restoredToken = await restoreSession();

        // Assertions
        expect(mock.history.post.length).toBe(1); // API called
        expect(restoredToken).toBe(newToken);     // Returned correct token
        expect(useAuthStore.getState().token).toBe(newToken); // Updated store
        expect(useAuthStore.getState().isAuthenticated).toBe(true); // Authenticated
        console.log('✅ restoreSession Success Test Passed!');
    });

    // TEST 3: restoreSession Failure
    test('restoreSession handles failure correctly', async () => {
        const fakeUser = { id: 1, email: 'user@test.com' };
        useAuthStore.setState({ user: fakeUser, token: null });

        // Simulate refresh failure (e.g., cookie expired)
        mock.onPost('/auth/refresh').reply(401);

        // Call restoredSession and expect failure
        try {
            await restoreSession();
        } catch (error) {
            expect(error.response.status).toBe(401);
        }

        // Should have logged out
        expect(useAuthStore.getState().user).toBeNull();
        expect(useAuthStore.getState().isAuthenticated).toBe(false);

        console.log('✅ restoreSession Failure Test Passed!');
    });

    // TEST 4: restoreSession Skipped if not needed
    test('restoreSession does nothing if no user', async () => {
        useAuthStore.setState({ user: null, token: null }); // No user logged in

        const result = await restoreSession();

        expect(result).toBeNull();
        expect(mock.history.post.length).toBe(0); // Should NOT call API

        console.log('✅ restoreSession Skip Test Passed!');
    });
});
