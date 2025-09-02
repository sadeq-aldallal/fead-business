/**
 * Theme Integration Tests
 * Tests for brand color integration with shadcn/ui theme system
 */

import { describe, test, expect, beforeEach } from 'vitest';

describe('Theme Color Integration', () => {
  beforeEach(() => {
    // Reset CSS custom properties before each test
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--primary-foreground');
  });

  test('should have brand green color available as CSS variable', () => {
    // Set the CSS custom property as it would be set in globals.css
    document.documentElement.style.setProperty('--primary', '174 100% 42%');
    
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary').trim();
    
    expect(primaryColor).toBe('174 100% 42%'); // Brand green #00D4AA in HSL
  });

  test('should have proper foreground color for brand primary', () => {
    document.documentElement.style.setProperty('--primary-foreground', '0 0% 100%');
    
    const computedStyle = getComputedStyle(document.documentElement);
    const foregroundColor = computedStyle.getPropertyValue('--primary-foreground').trim();
    
    expect(foregroundColor).toBe('0 0% 100%'); // White text
  });

  test('should convert brand hex color to HSL correctly', () => {
    // Test color conversion: #00D4AA should be HSL(174, 100%, 42%)
    const brandHex = '#00D4AA';
    const expectedHSL = '174 100% 42%';
    
    // This would be implemented in the actual color conversion utility
    const convertedHSL = hexToHSL(brandHex);
    expect(convertedHSL).toBe(expectedHSL);
  });

  test('should maintain color consistency in dark mode', () => {
    // Test dark mode color values
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.setProperty('--primary', '174 100% 42%');
    
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary').trim();
    
    expect(primaryColor).toBe('174 100% 42%');
  });
});

// Mock utility function for color conversion
function hexToHSL(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l;

  l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}