import { describe, it, expect } from 'vitest';
import { calculateDiscountedPrice } from '../discountUtils';

describe('calculateDiscountedPrice', () => {
  it('should calculate the correct discounted price', () => {
    expect(calculateDiscountedPrice(100, 20)).toBe('80.00');
    expect(calculateDiscountedPrice(50, 10)).toBe('45.00');
    expect(calculateDiscountedPrice(12.50, 50)).toBe('6.25');
  });

  it('should return the original price if discount is 0 or negative', () => {
    expect(calculateDiscountedPrice(100, 0)).toBe(100);
    expect(calculateDiscountedPrice(100, -10)).toBe(100);
  });

  it('should return the original price if price or discount is not provided', () => {
    expect(calculateDiscountedPrice(null, 10)).toBe(null);
    expect(calculateDiscountedPrice(100, null)).toBe(100);
  });
});
