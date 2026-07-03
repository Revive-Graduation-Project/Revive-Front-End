import { test, expect } from '@playwright/test';

test.describe('Kitchen Integration E2E', () => {

  // Increase test timeout since we need to wait for RabbitMQ saga + kitchen polling
  test.setTimeout(120_000);

  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto('http://localhost:5173/auth/login');
    
    try {
      await page.fill('input[type="email"]', 'admin@revive.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
    } catch (e) {
      console.log("Login failed or timed out: ", e);
    }
  });

  test('should create an order and process it in the kitchen', async ({ page }) => {
    // 1. Create an Order — navigate to menu
    await page.goto('http://localhost:5173/menu');
    
    // Add item to cart — target the specific Classic Cheeseburger card (visible only)
    await page.waitForSelector('button:has-text("Add to cart") >> visible=true');
    await page.locator('div.group:has(h3:has-text("Classic Cheeseburger"))').locator('button:has-text("Add to cart") >> visible=true').first().click();
    await page.goto('http://localhost:5173/checkout');
    
    // Fill checkout form
    await page.fill('#email', 'admin@revive.com');
    await page.fill('#firstName', 'System');
    await page.fill('#lastName', 'Admin');
    await page.fill('#phone', '1234567890');
    await page.locator('#region').selectOption({ index: 1 });
    await page.fill('#city', 'Testville');
    await page.fill('#address', '123 Test St');
    await page.fill('#zipCode', '12345');
    
    await page.click('button:has-text("Continue to Payment")');
    
    // Payment step
    await page.waitForURL('**/payment**');
    await page.click('button:has-text("Confirm payment")');
    
    // Wait for success page
    await page.waitForURL('**/thanks**', { timeout: 30000 });
    
    // Wait a few seconds for the saga to complete (order → RabbitMQ → kitchen ticket)
    await page.waitForTimeout(5000);
    
    // 2. Go to Live Kitchen
    await page.goto('http://localhost:5173/dashboard/live-kitchen');
    
    // Wait for the kitchen board to load and show the order in the queue
    // The board polls every 30s, but initial load happens on mount
    const queueColumn = page.locator('h3:has-text("Order Queue")').locator('..');
    await expect(queueColumn.locator('.group')).toHaveCount(1, { timeout: 35000 });
    
    // Move to Preparing
    await queueColumn.locator('button:has-text("Start Preparing")').first().click();
    
    // Verify it moved to Preparing
    const prepColumn = page.locator('h3:has-text("Preparing")').locator('..');
    await expect(prepColumn.locator('.group')).toHaveCount(1, { timeout: 10000 });
    
    // Move to Ready
    await prepColumn.locator('button:has-text("Prepared")').first().click();
    
    // Verify it moved to Ready
    const readyColumn = page.locator('h3:has-text("Ready")').locator('..');
    await expect(readyColumn.locator('.group')).toHaveCount(1, { timeout: 10000 });

    // Mark as Done
    await readyColumn.locator('button:has-text("Mark Done")').first().click();
    
    // Confirm in modal — the modal has a "Ready" confirm button
    await page.getByRole('button', { name: 'Ready', exact: true }).click();
    
    // Verify it is in Done column
    await expect(page.locator('h3:has-text("Done")').locator('..').locator('.group')).toHaveCount(1, { timeout: 10000 });
  });
});
