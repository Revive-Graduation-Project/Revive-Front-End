import { describe, it, expect, beforeEach } from 'vitest';
import { useCustomizeStore } from '../useCustomizeStore';

describe('useCustomizeStore', () => {
  const initialStoreState = useCustomizeStore.getState();

  beforeEach(() => {
    useCustomizeStore.setState(initialStoreState, true);
  });

  const mockPrimaryItem = {
    id: 1,
    name: 'Grilled Chicken Bowl',
    price: 150,
    category: 'chicken',
    nutrients: [
      { name: 'Calories', amount: 350 },
      { name: 'Protein', amount: 40 },
      { name: 'Carbs', amount: 10 },
      { name: 'Fat', amount: 12 },
    ],
  };

  const mockBaseSection = {
    slotName: 'Base',
    isRequired: true,
    maxSelect: 1,
  };

  const mockVegSection = {
    slotName: 'Vegetables',
    isRequired: false,
  };

  const mockBaseItem = {
    id: 10,
    name: 'Brown Rice',
    price: 0.5,
    nutrients: [
      { name: 'Calories', amount: 130 },
      { name: 'Protein', amount: 3 },
      { name: 'Carbs', amount: 28 },
      { name: 'Fat', amount: 1 },
    ],
  };

  const mockVegItem1 = {
    id: 11,
    name: 'Broccoli',
    price: 0.2,
    nutrients: [
      { name: 'Calories', amount: 30 },
      { name: 'Protein', amount: 2 },
      { name: 'Carbs', amount: 6 },
      { name: 'Fat', amount: 0 },
    ],
  };

  it('TC-CUST-001: Select Primary Item and Calculate Price/Nutrition', () => {
    const store = useCustomizeStore.getState();

    store.setPrimaryItem(mockPrimaryItem);
    const updated = useCustomizeStore.getState();

    expect(updated.primaryItem).toEqual(mockPrimaryItem);
    expect(updated.getTotalPrice()).toBe(150);

    const nutrition = updated.getNutrition();
    expect(nutrition.calories).toBe(350);
    expect(nutrition.protein).toBe(40);
  });

  it('TC-CUST-002: Toggle Optional Ingredients and Update Grams', () => {
    const store = useCustomizeStore.getState();
    store.setPrimaryItem(mockPrimaryItem);

    store.toggleItem(mockVegSection, mockVegItem1);

    let updated = useCustomizeStore.getState();
    expect(updated.selectedSections['Vegetables']).toHaveLength(1);
    expect(updated.selectedSections['Vegetables'][0].id).toBe(mockVegItem1.id);
    expect(updated.selectedSections['Vegetables'][0].grams).toBe(50);

    expect(updated.getTotalPrice()).toBe(160);

    updated.updateItemGrams('Vegetables', mockVegItem1.id, 100);
    updated = useCustomizeStore.getState();
    expect(updated.selectedSections['Vegetables'][0].grams).toBe(100);
    expect(updated.getTotalPrice()).toBe(170);

    updated.toggleItem(mockVegSection, mockVegItem1);
    updated = useCustomizeStore.getState();
    expect(updated.selectedSections['Vegetables']).toHaveLength(0);
    expect(updated.getTotalPrice()).toBe(150);
  });

  it('TC-CUST-003: Add Custom Comment', () => {
    useCustomizeStore.getState().setComment('No dressing please');
    expect(useCustomizeStore.getState().comment).toBe('No dressing please');
  });

  it('TC-CUST-004: Validate Selection (Requires Primary Item + At least 2 additions)', () => {
    const store = useCustomizeStore.getState();

    expect(store.isValidSelection()).toBe(false);

    store.setPrimaryItem(mockPrimaryItem);
    expect(store.isValidSelection()).toBe(false);

    store.toggleItem(mockBaseSection, mockBaseItem);
    expect(store.isValidSelection()).toBe(false);

    store.toggleItem(mockVegSection, mockVegItem1);
    expect(store.isValidSelection()).toBe(true);
  });

  it('TC-CUST-005: Reset Customization', () => {
    const store = useCustomizeStore.getState();
    store.setPrimaryItem(mockPrimaryItem);
    store.toggleItem(mockBaseSection, mockBaseItem);
    store.setComment('Test comment');

    store.resetCustomize();

    const resetStore = useCustomizeStore.getState();
    expect(resetStore.primaryItem).toBeNull();
    expect(resetStore.selectedSections).toEqual({});
    expect(resetStore.comment).toBe('');
    expect(resetStore.getTotalPrice()).toBe(0);
  });
});
