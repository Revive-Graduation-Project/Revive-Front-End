import { api } from './api';
import { useAuthStore } from '../store';

const { login, logout } = useAuthStore.getState();

// Register
export const register = async (data) => {
    try {
        const response = await api.post('/auth/register', data);
        return response; // Return the full response for further handling if needed
    } catch (error) {
        return Promise.reject(error);
    }
};

// Login
export const loginService = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        login(credentials.username, response.data.token, response.data.expiresAt);
        return response; // Return the full response for further handling if needed
    } catch (error) {
        return Promise.reject(error);
    }
};

// Logout service to handle manual logout not for session expiration scenarios
export const logoutService = async () => {
    try {
        const response = await api.post('/auth/logout'); // to invalidate token on server
        logout(); // Clear client-side auth state
        return response; // Return the full response for further handling if needed
    } catch (error) {
        return Promise.reject(error);
    }
};

// Restore session on app load (refresh token flow)
export const restoreSession = async () => {
    // Get fresh state
    const { user, token, setAccessToken, logout } = useAuthStore.getState();

    // If we have a user (persisted) but no token (lost in memory due to refresh)
    if (user && !token) {
        try {
            // Attempt to get a new access token using the httpOnly cookie
            const { data } = await api.post('/auth/refresh');
            setAccessToken(data.token);
            return data.token;
        } catch (error) {
            // Refresh failed (cookie expired, invalid, etc.)
            console.error("Session restoration failed:", error);
            logout(); // Clear everything
            throw error; // Let caller handle redirect
        }
    }
    return null; // No restoration needed
};