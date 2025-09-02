/**
 * Mobile Button Interactions Test Suite
 * Tests touch interactions, accessibility, and mobile-specific features
 */

import { test, expect, devices } from '@playwright/test';

// Device configurations for mobile testing
const mobileDevices = [
  {
    name: 'iPhone SE',
    ...devices['iPhone SE'],
    viewport: { width: 375, height: 667 }
  },
  {
    name: 'Samsung Galaxy S21',
    ...devices['Galaxy S21'],
    viewport: { width: 360, height: 800 }
  },
  {
    name: 'iPad',
    ...devices['iPad'],
    viewport: { width: 768, height: 1024 }
  }
];

// Test each device configuration
for (const device of mobileDevices) {
  test.describe(`Mobile Button Tests - ${device.name}`, () => {
    test.use({ ...device });

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('Primary buttons meet touch target requirements', async ({ page }) => {
      // Test Create Business button in Business Modal
      await page.getByRole('button', { name: /create business/i }).first().click();
      
      const submitButton = page.getByRole('button', { name: /create business/i }).last();
      await expect(submitButton).toBeVisible();
      
      // Verify minimum touch target size (44px for WCAG AA)
      const buttonBox = await submitButton.boundingBox();
      expect(buttonBox.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox.width).toBeGreaterThanOrEqual(44);
      
      // Verify button has proper accessibility attributes
      await expect(submitButton).toHaveAttribute('type', 'submit');
      await expect(submitButton).toHaveAttribute('aria-label', /.+/);
    });

    test('Buttons provide immediate touch feedback', async ({ page }) => {
      const signInButton = page.getByRole('button', { name: /sign in/i }).first();
      
      // Test touch start event triggers visual feedback
      await signInButton.dispatchEvent('touchstart');
      
      // Button should have active state classes
      const buttonClass = await signInButton.getAttribute('class');
      expect(buttonClass).toContain('active:scale-');
      
      // Test touch end resets state
      await signInButton.dispatchEvent('touchend');
    });

    test('Loading states work correctly on mobile', async ({ page }) => {
      // Open organization modal and test form submission
      await page.getByRole('button', { name: /create organization/i }).first().click();
      
      // Fill form with valid data
      await page.getByLabel(/organization name/i).fill('Test Organization');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/phone/i).fill('+1234567890');
      
      const submitButton = page.getByRole('button', { name: /create organization/i }).last();
      
      // Click submit and verify loading state
      await submitButton.click();
      
      // Button should show loading state
      await expect(submitButton).toHaveAttribute('aria-busy', 'true');
      await expect(submitButton).toContainText('Creating...');
      
      // Button should be disabled during loading
      await expect(submitButton).toBeDisabled();
    });

    test('Keyboard shortcuts work on mobile', async ({ page }) => {
      // Open business modal
      await page.getByRole('button', { name: /create business/i }).first().click();
      
      // Fill business name
      await page.getByLabel(/business name/i).fill('Test Business');
      
      // Test Ctrl+Enter shortcut
      await page.keyboard.press('Control+Enter');
      
      // Should trigger form submission
      const submitButton = page.getByRole('button', { name: /create business/i }).last();
      await expect(submitButton).toHaveAttribute('aria-busy', 'true');
    });

    test('Focus states are visible for keyboard navigation', async ({ page }) => {
      // Test tab navigation through buttons
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Focused element should have visible focus indicator
      const elementClass = await focusedElement.getAttribute('class');
      expect(elementClass).toContain('focus-visible:ring');
    });

    test('Modal buttons handle escape key', async ({ page }) => {
      // Open modal
      await page.getByRole('button', { name: /create business/i }).first().click();
      
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
      
      // Press escape to close
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    });

    test('Button hover states only apply on hover devices', async ({ page }) => {
      const button = page.getByRole('button', { name: /sign in/i }).first();
      
      // For mobile devices, hover effects should be minimal or none
      await button.hover();
      
      const buttonStyles = await button.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          transform: computed.transform,
          boxShadow: computed.boxShadow
        };
      });
      
      // On mobile, transform should be minimal (no hover lift effect)
      expect(buttonStyles.transform).not.toContain('translateY(-');
    });

    test('Dropdown buttons work with touch', async ({ page }) => {
      // Open organization modal to test country dropdown
      await page.getByRole('button', { name: /create organization/i }).first().click();
      
      // Find and click country selector
      const countrySelect = page.getByRole('combobox', { name: /country/i });
      await countrySelect.click();
      
      // Verify dropdown opens
      const dropdown = page.locator('[role="listbox"]');
      await expect(dropdown).toBeVisible();
      
      // Test selecting an option
      const firstOption = dropdown.locator('[role="option"]').first();
      await firstOption.click();
      
      // Dropdown should close and value should be selected
      await expect(dropdown).not.toBeVisible();
      await expect(countrySelect).not.toHaveValue('');
    });

    test('Confirmation buttons prevent accidental actions', async ({ page }) => {
      // Create a button with confirmation (if implemented)
      const dangerButton = page.getByRole('button', { name: /delete/i }).first();
      
      if (await dangerButton.isVisible()) {
        // First click should show confirmation
        await dangerButton.click();
        
        // Button text should change to confirm action
        await expect(dangerButton).toContainText(/confirm|sure|delete/i);
        
        // Second click should execute action
        await dangerButton.click();
      }
    });

    test('Form validation shows button states correctly', async ({ page }) => {
      // Open business modal
      await page.getByRole('button', { name: /create business/i }).first().click();
      
      const submitButton = page.getByRole('button', { name: /create business/i }).last();
      
      // Button should be clickable but form invalid
      await expect(submitButton).toBeEnabled();
      
      // Try to submit empty form
      await submitButton.click();
      
      // Should show validation errors, button should not be in loading state
      await expect(submitButton).not.toHaveAttribute('aria-busy', 'true');
    });
  });
}

// Accessibility-focused tests
test.describe('Button Accessibility Tests', () => {
  test.use(devices['iPhone SE']);

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Test that buttons have proper ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        // Every visible button should have accessible text
        const accessibleName = await button.evaluate(el => 
          el.getAttribute('aria-label') || 
          el.getAttribute('title') || 
          el.textContent?.trim()
        );
        
        expect(accessibleName).toBeTruthy();
        expect(accessibleName.length).toBeGreaterThan(0);
      }
    }
  });

  test('Button states announced to screen readers', async ({ page }) => {
    await page.goto('/');
    
    // Open modal and test button state changes
    await page.getByRole('button', { name: /create organization/i }).first().click();
    
    const submitButton = page.getByRole('button', { name: /create organization/i }).last();
    
    // Initially should not be busy
    await expect(submitButton).not.toHaveAttribute('aria-busy', 'true');
    
    // Fill form to make it valid
    await page.getByLabel(/organization name/i).fill('Test Org');
    await page.getByLabel(/email/i).fill('test@test.com');
    
    // Submit and verify aria-busy is set
    await submitButton.click();
    await expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  test('Keyboard navigation order is logical', async ({ page }) => {
    await page.goto('/');
    
    const tabOrder = [];
    
    // Navigate through first 10 focusable elements
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      const elementInfo = await focusedElement.evaluate(el => ({
        tagName: el.tagName.toLowerCase(),
        text: el.textContent?.trim() || el.getAttribute('aria-label') || '',
        type: el.getAttribute('type'),
        role: el.getAttribute('role')
      }));
      
      if (elementInfo.text) {
        tabOrder.push(elementInfo);
      }
    }
    
    // Verify we have a logical sequence of interactive elements
    expect(tabOrder.length).toBeGreaterThan(3);
    
    // Primary navigation should come first
    const navElements = tabOrder.slice(0, 3);
    const hasNavigation = navElements.some(el => 
      el.text.toLowerCase().includes('home') || 
      el.text.toLowerCase().includes('dashboard') ||
      el.text.toLowerCase().includes('sign')
    );
    
    expect(hasNavigation).toBe(true);
  });
});

// Performance and responsiveness tests
test.describe('Button Performance Tests', () => {
  test.use(devices['iPhone SE']);

  test('Button animations run at 60fps', async ({ page }) => {
    await page.goto('/');
    
    // Enable performance monitoring
    await page.coverage.startJSCoverage();
    
    const button = page.getByRole('button', { name: /sign in/i }).first();
    
    // Measure animation performance
    const animationMetrics = await page.evaluate(async (button) => {
      const startTime = performance.now();
      
      // Trigger button press animation
      button.dispatchEvent(new TouchEvent('touchstart', { touches: [{ clientX: 100, clientY: 100 }] }));
      
      // Wait for animation frame
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const endTime = performance.now();
      
      return {
        duration: endTime - startTime,
        hasAnimation: button.style.transform !== ''
      };
    }, await button.elementHandle());
    
    // Animation should start within one frame (16.67ms for 60fps)
    expect(animationMetrics.duration).toBeLessThan(20);
  });

  test('Button memory usage is stable', async ({ page }) => {
    await page.goto('/');
    
    // Get initial memory usage
    const initialMetrics = await page.evaluate(() => ({
      usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
      totalJSHeapSize: performance.memory?.totalJSHeapSize || 0
    }));
    
    // Interact with buttons multiple times
    for (let i = 0; i < 10; i++) {
      const button = page.getByRole('button').first();
      await button.click();
      await page.waitForTimeout(100);
    }
    
    // Check memory after interactions
    const finalMetrics = await page.evaluate(() => ({
      usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
      totalJSHeapSize: performance.memory?.totalJSHeapSize || 0
    }));
    
    // Memory usage shouldn't grow significantly (allow 10% increase)
    const memoryIncrease = (finalMetrics.usedJSHeapSize - initialMetrics.usedJSHeapSize) / initialMetrics.usedJSHeapSize;
    expect(memoryIncrease).toBeLessThan(0.1);
  });
});

// Cross-browser mobile compatibility
test.describe('Cross-Browser Mobile Tests', () => {
  const browsers = [
    { name: 'Safari iOS', ...devices['iPhone 12'] },
    { name: 'Chrome Android', ...devices['Pixel 5'] }
  ];

  for (const browser of browsers) {
    test.describe(`${browser.name}`, () => {
      test.use(browser);

      test('Touch events work consistently', async ({ page }) => {
        await page.goto('/');
        
        const button = page.getByRole('button', { name: /sign in/i }).first();
        
        // Test touch sequence
        await button.dispatchEvent('touchstart');
        await button.dispatchEvent('touchmove');
        await button.dispatchEvent('touchend');
        
        // Button should respond to touch events
        expect(await button.isVisible()).toBe(true);
        expect(await button.isEnabled()).toBe(true);
      });

      test('Button styling is consistent', async ({ page }) => {
        await page.goto('/');
        
        const button = page.getByRole('button', { name: /sign in/i }).first();
        
        const styles = await button.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            minHeight: computed.minHeight,
            padding: computed.padding,
            borderRadius: computed.borderRadius,
            fontSize: computed.fontSize
          };
        });
        
        // Verify consistent styling across browsers
        expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(44);
        expect(styles.borderRadius).toBeTruthy();
        expect(parseInt(styles.fontSize)).toBeGreaterThan(12);
      });
    });
  }
});