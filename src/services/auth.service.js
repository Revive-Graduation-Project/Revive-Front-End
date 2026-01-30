import { api } from './api';

// Register
export const register =  (data) => {
     return api.post('/auth/register', data);
};

// Login
export const loginService = async (credentials) => {
    return api.post('/auth/login', credentials);
};

// Logout service to handle manual logout not for session expiration scenarios
export const logoutService = async () => {
     return api.post('/auth/logout');
};

// Restore session on app load (refresh token flow)
export const restoreSessionService = async () => {
   return api.post('/auth/refresh');
};