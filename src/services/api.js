import axios from "axios";
import { useAuthStore } from "../store";
import { restoreSessionService } from "./auth.service";
// Create an Axios instance with configurations
export const api =  axios.create({
  baseURL: 'https://api.example.com', // Replace with API base URL when available
  withCredentials: true, // refresh token is sent in httpOnly cookie 
  headers:{
    'Content-Type': 'application/json',
  }
})

const { getAccessToken, setAccessToken , logout } = useAuthStore.getState(); // Accessor methods for token management
let isRefreshing = false; // flag to indicate if token refresh is in progress
const refreshQueue = []; // queue to hold requests while token is being refreshed

// Attach access token to every outgoing request
api.interceptors.request.use(config => {
  getAccessToken() && (config.headers['Authorization'] = `Bearer ${getAccessToken()}`);
  return config;
}, error => Promise.reject(error));

// Handle 401 errors and automatic token refresh
api.interceptors.response.use(response => response , async error => {
    const originalRequest = error.config;
    // If refresh endpoint fails, refresh token expired - user must re-login
    if(originalRequest.url.includes('/auth/refresh')) {
        isRefreshing = false;
        refreshQueue.forEach(promise => promise.reject(new Error('Session expired')));
        refreshQueue.length = 0;
        logout(); // Clear session data and trigger logout flow
        return Promise.reject(error);
    } 

    // If any endpoint returns 401 (unauthorized), attempt to refresh the access token
    if (error.response?.status === 401 && !originalRequest._retry) {
        
        // If already refreshing, queue this request and wait
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then(token => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return api(originalRequest); // Retry request with new token
            }).catch(err => Promise.reject(err));
        }
        
        // Start token refresh process
        isRefreshing = true;
        originalRequest._retry = true;
        
      try {
            //await to refresh token
            const res = await restoreSessionService();
            setAccessToken(res.data.token , res.data.expiresAt); // Update token in store
            isRefreshing = false;

            // Update header for current request
            originalRequest.headers['Authorization'] = `Bearer ${getAccessToken()}`;

            // Process the queue
            refreshQueue.forEach(promise => promise.resolve(getAccessToken()));
            refreshQueue.length = 0; // Clear the queue to avoid memory leaks

            // Return the actual call to api()
            return api(originalRequest); 
        } catch (err) {
            isRefreshing = false;
            refreshQueue.forEach(promise => promise.reject(err));
            refreshQueue.length = 0;
            logout(); // Clear session data and trigger logout flow
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
});
