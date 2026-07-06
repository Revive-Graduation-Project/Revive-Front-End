import { test, expect } from '@playwright/test';

test.describe('Customization Page - USDA Category Mapping', () => {
  test('should fetch meals and correctly categorize ingredients based on USDA foodCategory', async ({ page }) => {
    
    // Intercept the API call to /menu and provide mock data with USDA categories
    await page.route('**/menu', async route => {
      const json = [
        {
          id: 1,
          name: 'Custom Salad Bowl',
          price: 15.0,
          mealIngredients: [
            {
              ingredient: {
                id: 101,
                name: 'Grilled Chicken Breast',
                category: 'Poultry Products', // Maps to 'protein'
                nutrients: [
                  { nutrientName: 'Protein', value: 30 },
                  { nutrientName: 'Energy', value: 150 }
                ]
              }
            },
            {
              ingredient: {
                id: 102,
                name: 'Romaine Lettuce',
                category: 'Vegetables and Vegetable Products', // Maps to 'veggies'
                nutrients: [
                  { nutrientName: 'Carbohydrate', value: 5 }
                ]
              }
            },
            {
              ingredient: {
                id: 103,
                name: 'Cheddar Cheese',
                category: 'Dairy and Egg Products', // Maps to 'cheese'
                nutrients: []
              }
            },
            {
              ingredient: {
                id: 104,
                name: 'Olive Oil',
                category: 'Fats and Oils', // Maps to 'sauces'
                nutrients: []
              }
            },
            {
              ingredient: {
                id: 105,
                name: 'Black Pepper',
                category: 'Spices and Herbs', // Maps to 'extras'
                nutrients: []
              }
            }
          ]
        }
      ];
      await route.fulfill({ json });
    });

    // Navigate to the customization page
    await page.goto('/customize');

    // Wait for the meal to be loaded and displayed in the BaseSelector
    await expect(page.getByText('Custom Salad Bowl')).toBeVisible();

    // Select the meal to reveal the ingredient sections
    await page.getByText('Custom Salad Bowl').click();

    // Select the base size
    await expect(page.getByText('Choose Your Size')).toBeVisible();
    await page.getByText('Regular').click();

    // Verify that the UI successfully mapped the USDA categories to the correct sections
    
    // 1. Protein Section
    const proteinSection = page.locator('div').filter({ hasText: /^Protein\*/ }).first();
    await expect(proteinSection).toBeVisible();
    await expect(proteinSection.getByText('Grilled Chicken Breast')).toBeVisible();
    
    // 2. Veggies Section
    const veggiesSection = page.locator('div').filter({ hasText: /^Veggies\*/ }).first();
    await expect(veggiesSection).toBeVisible();
    await expect(veggiesSection.getByText('Romaine Lettuce')).toBeVisible();

    // 3. Cheese Section
    const cheeseSection = page.locator('div').filter({ hasText: /^Cheese/ }).first();
    await expect(cheeseSection).toBeVisible();
    await expect(cheeseSection.getByText('Cheddar Cheese')).toBeVisible();

    // 4. Sauces Section
    const saucesSection = page.locator('div').filter({ hasText: /^Sauces/ }).first();
    await expect(saucesSection).toBeVisible();
    await expect(saucesSection.getByText('Olive Oil')).toBeVisible();

    // 5. Extras Section
    const extrasSection = page.locator('div').filter({ hasText: /^Extras/ }).first();
    await expect(extrasSection).toBeVisible();
    await expect(extrasSection.getByText('Black Pepper')).toBeVisible();

    // Verify interaction and store calculation (nutrients should update based on what we select)
    await proteinSection.getByText('Grilled Chicken Breast').click(); // Toggle it on
    await veggiesSection.getByText('Romaine Lettuce').click(); // Toggle it on

    // Verify the summary box updates with correct nutrition logic
    // Chicken: 30 Protein, 150 Calories. Lettuce: 5 Carbs. 
    // Wait for the summary box to show updated values
    await expect(page.locator('.bg-white.rounded-3xl').getByText('150kcal', { exact: true })).toBeVisible();
    await expect(page.locator('.bg-white.rounded-3xl').getByText('30g', { exact: true }).first()).toBeVisible();
    await expect(page.locator('.bg-white.rounded-3xl').getByText('5g', { exact: true }).first()).toBeVisible();
  });
});
