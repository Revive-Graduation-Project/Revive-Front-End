import { describe, it, expect, beforeEach } from 'vitest';
import { useCustomizeStore } from '../useCustomizeStore';

describe('useCustomizeStore', () => {
  const initialStoreState = useCustomizeStore.getState();

  beforeEach(() => {
    useCustomizeStore.setState(initialStoreState, true);
  });

  const mockMeal = {
    id: 1,
    name: 'Burger',
    sections: [
      { type: 'base', required: true, maxSelect: 1 },
      { type: 'ingredients', required: false },
    ],
  };

  const mockBase = { id: 10, name: 'Beef Base', price: 50, calories: 300 };
  const mockIngredient1 = { id: 11, name: 'Cheese', price: 10, calories: 50 };
  const mockIngredient2 = { id: 12, name: 'Bacon', price: 15, calories: 100 };

  it('TC-CUST-001: Select Base Meal', () => {
    const store = useCustomizeStore.getState();
    
    // Set meal
    store.setMeal(mockMeal);
    expect(useCustomizeStore.getState().selectedMeal).toEqual(mockMeal);
    
    // Set base
    useCustomizeStore.getState().setBase(mockBase);
    const updatedStore = useCustomizeStore.getState();
    expect(updatedStore.selectedBase).toEqual(mockBase);
    
    // Check price and nutrition
    expect(updatedStore.getTotalPrice()).toBe(50);
    const nutrition = updatedStore.getNutrition();
    expect(nutrition.calories).toBe(300);
  });

  it('TC-CUST-002: Toggle Optional Ingredients', () => {
    const store = useCustomizeStore.getState();
    store.setMeal(mockMeal);
    store.setBase(mockBase);

    // Toggle ingredient 1 on
    useCustomizeStore.getState().toggleItem({ type: 'ingredients' }, mockIngredient1);
    
    let updatedStore = useCustomizeStore.getState();
    expect(updatedStore.selectedSections['ingredients']).toContainEqual(mockIngredient1);
    expect(updatedStore.getTotalPrice()).toBe(60); // 50 + 10
    expect(updatedStore.getNutrition().calories).toBe(350); // 300 + 50

    // Toggle ingredient 2 on
    updatedStore.toggleItem({ type: 'ingredients' }, mockIngredient2);
    updatedStore = useCustomizeStore.getState();
    expect(updatedStore.selectedSections['ingredients']).toContainEqual(mockIngredient2);
    expect(updatedStore.getTotalPrice()).toBe(75); // 60 + 15

    // Toggle ingredient 1 off
    updatedStore.toggleItem({ type: 'ingredients' }, mockIngredient1);
    updatedStore = useCustomizeStore.getState();
    expect(updatedStore.selectedSections['ingredients']).not.toContainEqual(mockIngredient1);
    expect(updatedStore.getTotalPrice()).toBe(65); // 50 + 15
  });

  it('TC-CUST-003: Add Custom Comment', () => {
    useCustomizeStore.getState().setComment('No onions please');
    expect(useCustomizeStore.getState().comment).toBe('No onions please');
  });

  it('TC-CUST-004: Validate Selection (Required Sections)', () => {
    const store = useCustomizeStore.getState();
    store.setMeal(mockMeal);
    
    // Missing base, should be invalid
    expect(store.isValidSelection()).toBe(false);

    // Add base (which fulfills the required 'base' section in our mock setup)
    // Wait, our mock base section expects it to be in `selectedSections['base']` based on `isValidSelection` logic!
    // Let's check `isValidSelection` logic:
    // for (const section of selectedMeal.sections) {
    //   if (section.required) {
    //     const selected = selectedSections[section.type] || [];
    //     if (selected.length === 0) return false;
    //   }
    // }
    
    store.setBase(mockBase);
    useCustomizeStore.getState().toggleItem({ type: 'base' }, mockBase);
    
    expect(useCustomizeStore.getState().isValidSelection()).toBe(true);
  });

  it('TC-CUST-005: Reset Customization', () => {
    const store = useCustomizeStore.getState();
    store.setMeal(mockMeal);
    store.setBase(mockBase);
    store.setComment('Test comment');
    
    store.resetCustomize();
    
    const resetStore = useCustomizeStore.getState();
    expect(resetStore.selectedMeal).toBeNull();
    expect(resetStore.selectedBase).toBeNull();
    expect(resetStore.comment).toBe('');
    expect(resetStore.getTotalPrice()).toBe(0);
  });
});
