import axios from "axios";

// Create an Axios instance with configurations
export const api =  axios.create({
  baseURL: 'https://api.example.com', // Replace with API base URL when available
  withCredentials: true, // refresh token is sent in httpOnly cookie 
  headers:{
    'Content-Type': 'application/json',
  }
})

let accessToken = null; // in-memory access token for higher security against XSS attacks
let isRefreshing = false; // flag to indicate if token refresh is in progress
const refreshQueue = []; // queue to hold requests while token is being refreshed

// Attach access token to every outgoing request
api.interceptors.request.use(config => {
  accessToken && (config.headers['Authorization'] = `Bearer ${accessToken}`);
  return config;
}, error => Promise.reject(error));

// Handle 401 errors and automatic token refresh
api.interceptors.response.use(response => response , async error => {
    const originalRequest = error.config;
    
    // If refresh endpoint fails, refresh token expired - user must re-login
    if(originalRequest.url.includes('/auth/refresh')) {
        accessToken = null; 
        isRefreshing = false;
        refreshQueue.forEach(promise => promise.reject(new Error('Session expired')));
        refreshQueue.length = 0;
        return Promise.reject(error);  // TODO: Redirect to /auth/login here
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
            const res = await api.post('/auth/refresh');
            accessToken = res.data.token;
            isRefreshing = false;

            // Update header for current request
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

            // Process the queue
            refreshQueue.forEach(promise => promise.resolve(accessToken));
            refreshQueue.length = 0; // Clear the queue to avoid memory leaks

            // Return the actual call to api()
            return api(originalRequest); 
        } catch (err) {
            isRefreshing = false;
            refreshQueue.forEach(promise => promise.reject(err));
            refreshQueue.length = 0;
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
});

// Function to set the access token after login
export const setAccessToken = (token) => {
  accessToken = token; 
};

// Function to get the current access token for testing purposes
export const getAccessToken = () => accessToken;
