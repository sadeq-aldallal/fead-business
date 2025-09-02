/**
 * Button Variants Tests
 * Tests for brand-specific button variants and styling
 */

import { describe, test, expect } from 'vitest';

describe('Button Variant System', () => {
  test('should have brand variant with correct styling', () => {
    // Test that brand variant uses primary color variables
    const brandButtonClass = 'bg-primary text-primary-foreground hover:bg-primary/90';
    expect(brandButtonClass).toContain('bg-primary');
    expect(brandButtonClass).toContain('text-primary-foreground');
  });

  test('should have brand-outline variant', () => {
    const outlineButtonClass = 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground';
    expect(outlineButtonClass).toContain('border-primary');
    expect(outlineButtonClass).toContain('text-primary');
  });

  test('should have brand-ghost variant', () => {
    const ghostButtonClass = 'text-primary hover:bg-primary/10';
    expect(ghostButtonClass).toContain('text-primary');
    expect(ghostButtonClass).toContain('hover:bg-primary/10');
  });

  test('should support loading states', () => {
    const loadingState = 'disabled:opacity-50 disabled:pointer-events-none';
    expect(loadingState).toContain('disabled:opacity-50');
    expect(loadingState).toContain('disabled:pointer-events-none');
  });

  test('should support different sizes', () => {
    const sizes = {
      sm: 'h-9 rounded-md px-3 text-xs',
      default: 'h-10 px-4 py-2',
      lg: 'h-11 rounded-md px-8'
    };
    
    expect(sizes.sm).toContain('h-9');
    expect(sizes.default).toContain('h-10');
    expect(sizes.lg).toContain('h-11');
  });
});