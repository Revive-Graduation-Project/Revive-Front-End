/**
 * Tests for src/Layout/index.js
 * Verifies that DashboardLayout is exported alongside the existing AppLayout
 * and AuthLayout exports added in this PR.
 */
import { describe, test, expect } from 'vitest';
import * as LayoutExports from '../../../Layout/index.js';

describe('Layout/index.js exports', () => {
  test('exports AppLayout', () => {
    expect(LayoutExports.AppLayout).toBeDefined();
    expect(typeof LayoutExports.AppLayout).toBe('function');
  });

  test('exports AuthLayout', () => {
    expect(LayoutExports.AuthLayout).toBeDefined();
    expect(typeof LayoutExports.AuthLayout).toBe('function');
  });

  test('exports DashboardLayout (new in this PR)', () => {
    expect(LayoutExports.DashboardLayout).toBeDefined();
    expect(typeof LayoutExports.DashboardLayout).toBe('function');
  });

  test('exports exactly 3 layout components', () => {
    const keys = Object.keys(LayoutExports);
    expect(keys).toHaveLength(3);
    expect(keys).toContain('AppLayout');
    expect(keys).toContain('AuthLayout');
    expect(keys).toContain('DashboardLayout');
  });
});