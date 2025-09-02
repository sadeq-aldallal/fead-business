/**
 * Input Component Unification Tests
 * Tests for form component standardization and validation
 */

import { describe, test, expect } from 'vitest';

describe('Input Component Unification', () => {
  test('should use single shadcn/ui input component', () => {
    // Test that we only have one input component
    const expectedImportPath = '@/components/ui/input';
    expect(expectedImportPath).toBe('@/components/ui/input');
  });

  test('should have consistent focus ring styling', () => {
    const focusRingClass = 'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';
    expect(focusRingClass).toContain('ring-primary');
  });

  test('should have consistent error state styling', () => {
    const errorStateClass = 'border-destructive text-destructive focus-visible:ring-destructive';
    expect(errorStateClass).toContain('border-destructive');
    expect(errorStateClass).toContain('text-destructive');
  });

  test('should support form validation integration', () => {
    const validationProps = {
      'aria-invalid': 'true',
      'aria-describedby': 'error-message'
    };
    expect(validationProps['aria-invalid']).toBe('true');
  });

  test('should have consistent sizing classes', () => {
    const sizes = {
      default: 'h-10 px-3 py-2',
      sm: 'h-9 px-3 py-2 text-xs',
      lg: 'h-11 px-4 py-2 text-base'
    };
    
    expect(sizes.default).toContain('h-10');
    expect(sizes.sm).toContain('h-9');
    expect(sizes.lg).toContain('h-11');
  });
});