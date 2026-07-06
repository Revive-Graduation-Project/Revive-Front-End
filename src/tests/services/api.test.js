// api.test.js
import { describe, test, expect, beforeEach, afterEach } from 'vitest'; // Vitest testing framework
import AxiosMockAdapter from 'axios-mock-adapter'; // Axios mock adapter for simulating API responses
import { api } from '../../services/api'; // Import the Axios instance with interceptors 
import { useAuthStore } from '../../store';// Import token store functions
 
// Test Suite for Axios Interceptors 
// Focused on token attachment, auto-refresh, and queuing logic
describe('Axios Interceptors - Simple Tests', () => {
  let mock;
  const { setAccessToken, getAccessToken } = useAuthStore.getState();
  // Setup mock adapter before each test
  beforeEach(() => {
    mock = new AxiosMockAdapter(api , {onNoMatch: 'throwException'});
    setAccessToken(null); // Ensure no token at start of each test
  });
  // Reset mock adapter after each test
  afterEach(() => {
    mock.reset(); // Reset the mock adapter
    setAccessToken(null); // Clear access token after each test
  });

  // TEST 1: Does it attach the token?
 test('Attaches Authorization header when accessToken exists', async () => {
  // Set a test access token
  setAccessToken('TEST_TOKEN');

  // simulate a successful API response
  mock.onGet('/test-auth').reply(200, {});

  await api.get('/test-auth');
  
  // Check that the token was attached in headers
  const requestHeaders = mock.history.get[0].headers;
  expect(requestHeaders.Authorization).toBe('Bearer TEST_TOKEN');

  console.log('✅ Authorization header attachment test passed!');
});

  // TEST 2: Does it refresh the token on 401 ?
test('Calls refresh endpoint when getting 401', async () => {
  setAccessToken('old-token');

  mock.onGet('/user/profile').replyOnce(401) // first call fails with 401

  mock.onGet('/user/profile').reply(200 , {name: 'John'}); // Second call succeeds

  mock.onPost('/auth/refresh').reply(200, { token: 'new-token' });

  const response = await api.get('/user/profile');

  expect(mock.history.post.length).toBe(1); // One refresh call
  expect(mock.history.get.length).toBe(2); // Two GET attempts
  expect(getAccessToken()).toBe('new-token'); // Token should be updated
  expect(response.data.name).toBe('John'); // Final response should be successful
   
  console.log('✅ Auto-refresh test passed!');
});

  // TEST 3: Does it queue multiple requests while refreshing ?
 test('Queues multiple requests during refresh', async () => {
  // All requests fail first time
  mock.onGet('/endpoint1').replyOnce(401).onGet('/endpoint1').reply(200, { id: 1 });
  mock.onGet('/endpoint2').replyOnce(401).onGet('/endpoint2').reply(200, { id: 2 });
  mock.onGet('/endpoint3').replyOnce(401).onGet('/endpoint3').reply(200, { id: 3 });

  mock.onPost('/auth/refresh').reply(200, { token: 'new-token' });

  const [r1, r2, r3] = await Promise.all([
    api.get('/endpoint1'),
    api.get('/endpoint2'),
    api.get('/endpoint3')
  ]);

  expect(mock.history.post.length).toBe(1); // Key assertion: Only ONE refresh call
  expect(mock.history.get.length).toBe(6); // 3 failed GET requests and 3 retried GET requests after refresh token
  expect(getAccessToken()).toBe('new-token');
  
  // Verify all succeeded
  expect(r1.data.id).toBe(1);
  expect(r2.data.id).toBe(2);
  expect(r3.data.id).toBe(3);
  
  console.log('✅ Request queuing test passed!');
});

  // TEST 4: Does it handle refresh failure?
  test('Handles when refresh token expires', async () => {
    // Request fails
    mock.onGet('/user/profile').reply(401);
    
    // Refresh ALSO fails (refresh token expired)
    mock.onPost('/auth/refresh').reply(401);

    // Should throw error
    try {
       await api.get('/user/profile');
    } catch (error) {
      expect(error.response.status).toBe(401);
    }
 
    // Should have tried to refresh once
    expect(mock.history.post.length).toBe(1);
    
    console.log('✅ Refresh failure test passed!');
  });

  // TEST 5: Does it handle normal errors (not 401)?
  test('Normal errors pass through without refresh', async () => {

    mock.onGet('/user/profile').reply(500, { error: 'Server error' });

    try {
      await api.get('/user/profile');
    } catch (error) {
      expect(error.response.status).toBe(500);
    }

    // Should NOT call refresh for 500 errors
    expect(mock.history.post.length).toBe(0);
    
    console.log('✅ Normal error test passed!');
  });

  // TEST 6: Does it decode JWT to set expiresAt?
  test('Decodes JWT to set expiresAt correctly', async () => {
    setAccessToken('old-token');

    // Create a mock JWT with a specific expiration time (e.g., 1 hour from now)
    const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour in seconds
    const mockPayload = btoa(JSON.stringify({ exp: futureExp }));
    const mockJwt = `header.${mockPayload}.signature`;

    mock.onGet('/user/profile').replyOnce(401).onGet('/user/profile').reply(200, { name: 'John' });
    mock.onPost('/auth/refresh').reply(200, { token: mockJwt });

    await api.get('/user/profile');

    // get expiresAt from store
    const { expiresAt } = useAuthStore.getState();
    
    // It should be exactly futureExp * 1000
    expect(expiresAt).toBe(futureExp * 1000);

    console.log('✅ JWT decoding test passed!');
  });

  // TEST 7: Does it ignore 401 errors from /auth/login?
  test('Does not attempt to refresh token on 401 from /auth/login', async () => {
    mock.onPost('/auth/login').reply(401, { message: 'Invalid email or password' });

    try {
      await api.post('/auth/login', { email: 'wrong@example.com', password: 'wrong' });
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('Invalid email or password');
    }

    // Should NOT call refresh for 401 errors from /auth/login
    expect(mock.history.post.filter(req => req.url === '/auth/refresh').length).toBe(0);

    console.log('✅ Ignore 401 from login test passed!');
  });
});