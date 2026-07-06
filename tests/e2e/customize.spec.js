import { test, expect } from '@playwright/test';

test.describe('Customization Auth Protection (SCRUM-50)', () => {
  test('TC-CUST-AUTH-001: Guest user is prompted to login when accessing customization', async ({ page }) => {
    await page.goto('/customize');
    
    // Check if the lock icon or the message is visible
    try {
      await expect(page.getByText(/Please log in to continue/i)).toBeVisible();
      await expect(page.getByText('🔒')).toBeVisible();
    } catch (error) {
      await page.screenshot({ path: 'test-failure.png' });
      throw error;
    }
  });

  test('TC-CUST-AUTH-002: Authenticated user can access customization page', async ({ page }) => {
    // Navigate directly to login
    await page.goto('/auth/login');
    
    // Use test credentials
    await page.getByPlaceholder(/Enter your email/i).fill('john.doe@example.com');
    await page.getByPlaceholder(/Enter your password/i).fill('password123');
    
    // Click login
    await page.getByRole('button', { name: /Log in/i }).click();
    
    // Wait for the app to redirect to home page
    try {
      await page.waitForURL('http://localhost:5173/', { timeout: 15000 });
    } catch (error) {
      await page.screenshot({ path: 'login-timeout.png' });
      throw error;
    }
    
    // Navigate to customize
    await page.goto('/customize');
    
    // Expect the Customization page to load successfully
    await expect(page.getByText(/Let's Start Cooking/i)).toBeVisible();
  });
});
