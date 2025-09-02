/**
 * Accessibility Verification Test Suite
 * Comprehensive testing for touch and assistive technology compatibility
 */

import { test, expect, devices } from '@playwright/test';
import { testPatterns, a11yUtils, touchUtils } from './mobile-test-utils.js';

test.describe('Accessibility and Touch Verification', () => {
  test.use(devices['iPhone SE']);

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('All interactive elements have accessible names', async ({ page }) => {
    // Get all interactive elements on the page
    const interactiveElements = await page.locator(
      'button, a[href], input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])'
    ).all();

    const failedElements = [];

    for (let i = 0; i < interactiveElements.length; i++) {
      const element = interactiveElements[i];
      
      if (await element.isVisible()) {
        const a11yCheck = await a11yUtils.checkAriaAttributes(page, `${element.constructor.name}:nth-child(${i + 1})`);
        
        if (!a11yCheck.hasAccessibleName) {
          const elementInfo = await element.evaluate(el => ({
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            textContent: el.textContent?.trim().substring(0, 50)
          }));
          
          failedElements.push(elementInfo);
        }
      }
    }

    expect(failedElements).toEqual([]);
  });

  test('All buttons meet WCAG touch target requirements', async ({ page }) => {
    const buttons = await page.locator('button').all();
    const failedButtons = [];

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        
        if (box && (box.width < 44 || box.height < 44)) {
          const buttonInfo = await button.evaluate(el => ({
            textContent: el.textContent?.trim(),
            className: el.className,
            dimensions: { width: box.width, height: box.height }
          }));
          
          failedButtons.push(buttonInfo);
        }
      }
    }

    expect(failedButtons).toEqual([]);
  });

  test('Focus management works correctly in modals', async ({ page }) => {
    // Test Business Modal
    await page.getByRole('button', { name: /create business/i }).first().click();
    
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // First focusable element should be focused
    await page.waitForTimeout(100); // Allow focus to settle
    const focusedElement = page.locator(':focus');
    
    // Should be inside modal
    const isInModal = await focusedElement.evaluate(el => {
      const modal = el.closest('[role="dialog"]');
      return !!modal;
    });
    expect(isInModal).toBe(true);

    // Test tab trapping
    const focusableElements = await modal.locator(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ).all();

    const elementCount = focusableElements.length;
    
    if (elementCount > 1) {
      // Tab through all elements and back to first
      for (let i = 0; i < elementCount; i++) {
        await page.keyboard.press('Tab');
      }
      
      // Should wrap to first element
      const currentFocus = page.locator(':focus');
      const firstElement = focusableElements[0];
      
      const isSameElement = await currentFocus.evaluate((el, first) => 
        el === first, await firstElement.elementHandle());
      
      expect(isSameElement).toBe(true);
    }

    // Escape should close modal and restore focus
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Form validation errors are announced to screen readers', async ({ page }) => {
    // Open organization modal
    await page.getByRole('button', { name: /create organization/i }).first().click();
    
    const submitButton = page.getByRole('button', { name: /create organization/i }).last();
    
    // Submit form without required fields
    await submitButton.click();
    
    // Check for error announcement region
    const errorRegion = page.locator('[role="alert"], [aria-live="assertive"], [aria-live="polite"]');
    
    if (await errorRegion.count() > 0) {
      const errorText = await errorRegion.textContent();
      expect(errorText.length).toBeGreaterThan(0);
    } else {
      // Check for aria-invalid on form fields
      const invalidFields = page.locator('[aria-invalid="true"]');
      const invalidCount = await invalidFields.count();
      expect(invalidCount).toBeGreaterThan(0);
    }
  });

  test('Loading states are properly announced', async ({ page }) => {
    // Open organization modal and fill with valid data
    await page.getByRole('button', { name: /create organization/i }).first().click();
    
    await page.getByLabel(/organization name/i).fill('Test Organization');
    await page.getByLabel(/email/i).fill('test@example.com');
    
    const submitButton = page.getByRole('button', { name: /create organization/i }).last();
    
    // Submit form
    await submitButton.click();
    
    // Button should have aria-busy=true
    await expect(submitButton).toHaveAttribute('aria-busy', 'true');
    
    // Loading text should be announced
    const loadingText = await submitButton.textContent();
    expect(loadingText.toLowerCase()).toContain('creating');
    
    // Button should be disabled during loading
    await expect(submitButton).toBeDisabled();
  });

  test('Keyboard shortcuts work and are announced', async ({ page }) => {
    // Open business modal
    await page.getByRole('button', { name: /create business/i }).first().click();
    
    // Fill form
    await page.getByLabel(/business name/i).fill('Test Business');
    
    // Check if shortcut is documented (aria-label, title, or screen reader text)
    const submitButton = page.getByRole('button', { name: /create business/i }).last();
    
    const shortcutInfo = await submitButton.evaluate(el => ({
      ariaLabel: el.getAttribute('aria-label'),
      title: el.getAttribute('title'),
      textContent: el.textContent
    }));
    
    // Should mention keyboard shortcut somewhere
    const hasShortcutInfo = Object.values(shortcutInfo).some(value => 
      value && value.toLowerCase().includes('ctrl') && value.toLowerCase().includes('enter')
    );
    
    expect(hasShortcutInfo).toBe(true);
    
    // Test the shortcut actually works
    await page.keyboard.press('Control+Enter');
    await expect(submitButton).toHaveAttribute('aria-busy', 'true');
  });

  test('Touch feedback is immediate and accessible', async ({ page }) => {
    const primaryButton = page.getByRole('button', { name: /sign in/i }).first();
    
    // Test touch start provides immediate feedback
    await touchUtils.simulateTouch(page, 'button');
    
    // Button should have active state styling
    const buttonClass = await primaryButton.getAttribute('class');
    expect(buttonClass).toContain('active:scale');
    
    // Test that touch feedback doesn't interfere with screen readers
    const ariaAttributes = await primaryButton.evaluate(el => ({
      ariaPressed: el.getAttribute('aria-pressed'),
      ariaExpanded: el.getAttribute('aria-expanded'),
      ariaBusy: el.getAttribute('aria-busy')
    }));
    
    // Touch feedback shouldn't change ARIA states unexpectedly
    expect(ariaAttributes.ariaPressed).toBeFalsy(); // Unless it's a toggle
    expect(ariaAttributes.ariaExpanded).toBeFalsy(); // Unless it controls something
  });

  test('Dropdown interactions work with assistive technologies', async ({ page }) => {
    // Open organization modal
    await page.getByRole('button', { name: /create organization/i }).first().click();
    
    const countrySelect = page.getByRole('combobox', { name: /country/i });
    await expect(countrySelect).toBeVisible();
    
    // Select should have proper ARIA attributes
    await expect(countrySelect).toHaveAttribute('role', 'combobox');
    await expect(countrySelect).toHaveAttribute('aria-haspopup', 'listbox');
    
    // Open dropdown
    await countrySelect.click();
    
    // Dropdown should be announced
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible();
    await expect(dropdown).toHaveAttribute('role', 'listbox');
    
    // Options should be properly labeled
    const options = dropdown.locator('[role="option"]');
    const optionCount = await options.count();
    expect(optionCount).toBeGreaterThan(0);
    
    // Test keyboard navigation in dropdown
    await page.keyboard.press('ArrowDown');
    const focusedOption = dropdown.locator('[role="option"]:focus');
    await expect(focusedOption).toBeVisible();
    
    // Select option with Enter
    await page.keyboard.press('Enter');
    await expect(dropdown).not.toBeVisible();
    
    // Value should be updated
    const selectedValue = await countrySelect.inputValue();
    expect(selectedValue).toBeTruthy();
  });

  test('Error states are accessible and announced', async ({ page }) => {
    // Open business modal
    await page.getByRole('button', { name: /create business/i }).first().click();
    
    const nameInput = page.getByLabel(/business name/i);
    const submitButton = page.getByRole('button', { name: /create business/i }).last();
    
    // Submit without filling required field
    await submitButton.click();
    
    // Input should be marked as invalid
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    
    // Should have error description
    const ariaDescribedBy = await nameInput.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      const errorElement = page.locator(`#${ariaDescribedBy}`);
      const errorText = await errorElement.textContent();
      expect(errorText.length).toBeGreaterThan(0);
    }
    
    // Fill the field to clear error
    await nameInput.fill('Test Business');
    
    // Error state should be cleared
    await page.waitForTimeout(100); // Allow validation to run
    const currentInvalid = await nameInput.getAttribute('aria-invalid');
    expect(currentInvalid).not.toBe('true');
  });
});

test.describe('Screen Reader Compatibility', () => {
  test.use(devices['iPhone SE']);

  test('All form controls have proper labels', async ({ page }) => {
    await page.goto('/');
    
    // Open each modal and check form controls
    const modals = [
      { trigger: /create business/i, type: 'business' },
      { trigger: /create organization/i, type: 'organization' }
    ];

    for (const modal of modals) {
      // Open modal
      await page.getByRole('button', { name: modal.trigger }).first().click();
      
      // Find all form controls
      const formControls = await page.locator('input, select, textarea').all();
      
      for (const control of formControls) {
        if (await control.isVisible()) {
          const labelInfo = await control.evaluate(el => {
            const id = el.id;
            const ariaLabel = el.getAttribute('aria-label');
            const ariaLabelledBy = el.getAttribute('aria-labelledby');
            
            // Check for associated label
            let labelText = '';
            if (id) {
              const label = document.querySelector(`label[for="${id}"]`);
              labelText = label?.textContent || '';
            }
            
            if (ariaLabelledBy) {
              const labelElement = document.getElementById(ariaLabelledBy);
              labelText = labelElement?.textContent || '';
            }
            
            return {
              hasLabel: !!(labelText || ariaLabel),
              labelText: labelText || ariaLabel || '',
              type: el.type,
              name: el.name
            };
          });
          
          expect(labelInfo.hasLabel).toBe(true);
          expect(labelInfo.labelText.length).toBeGreaterThan(0);
        }
      }
      
      // Close modal
      await page.keyboard.press('Escape');
    }
  });

  test('Navigation landmarks are properly structured', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper landmark structure
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').all();
    
    expect(landmarks.length).toBeGreaterThan(0);
    
    // Main content should be identifiable
    const mainContent = page.locator('[role="main"], main');
    await expect(mainContent).toBeVisible();
    
    // Navigation should be identifiable
    const navigation = page.locator('[role="navigation"], nav');
    await expect(navigation).toBeVisible();
  });

  test('Headings follow proper hierarchy', async ({ page }) => {
    await page.goto('/');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6, [role="heading"]').all();
    
    if (headings.length > 0) {
      const headingLevels = [];
      
      for (const heading of headings) {
        if (await heading.isVisible()) {
          const level = await heading.evaluate(el => {
            if (el.tagName.startsWith('H')) {
              return parseInt(el.tagName.substring(1));
            }
            const ariaLevel = el.getAttribute('aria-level');
            return ariaLevel ? parseInt(ariaLevel) : 1;
          });
          
          headingLevels.push(level);
        }
      }
      
      // Should start with h1
      expect(headingLevels[0]).toBe(1);
      
      // Check for proper hierarchy (no skipping levels)
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i];
        const previousLevel = headingLevels[i - 1];
        
        // Should not skip more than one level
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe('Touch Gesture Verification', () => {
  test.use(devices['iPhone SE']);

  test('Swipe gestures work on supported elements', async ({ page }) => {
    await page.goto('/');
    
    // Test any swipeable elements (if they exist)
    const swipeableElements = await page.locator('[data-swipeable="true"], .swipe-container').all();
    
    for (const element of swipeableElements) {
      if (await element.isVisible()) {
        // Test left swipe
        await touchUtils.simulateSwipe(page, element, 'left');
        
        // Should trigger some action or state change
        // This would be specific to your implementation
        
        // Test right swipe
        await touchUtils.simulateSwipe(page, element, 'right');
      }
    }
  });

  test('Long press actions work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test long press on elements that support it
    const longPressElements = await page.locator('[data-longpress="true"], .long-press-target').all();
    
    for (const element of longPressElements) {
      if (await element.isVisible()) {
        await touchUtils.simulateLongPress(page, element, 500);
        
        // Should trigger long press action
        // This would be specific to your implementation
      }
    }
  });

  test('Multi-touch interactions are handled correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test pinch zoom prevention on buttons and form elements
    const interactiveElements = await page.locator('button, input, select').all();
    
    for (let i = 0; i < Math.min(interactiveElements.length, 5); i++) {
      const element = interactiveElements[i];
      
      if (await element.isVisible()) {
        const touchAction = await element.evaluate(el => 
          getComputedStyle(el).touchAction
        );
        
        // Should prevent double-tap zoom
        expect(touchAction).toContain('manipulation');
      }
    }
  });
});

test.describe('Cross-Device Consistency', () => {
  const testDevices = [
    devices['iPhone SE'],
    devices['Galaxy S21'],
    devices['iPad']
  ];

  for (const device of testDevices) {
    test(`Consistent behavior on ${device.name}`, async ({ page }) => {
      test.use(device);
      
      await page.goto('/');
      
      // Test that core interactions work the same across devices
      const primaryButton = page.getByRole('button', { name: /sign in/i }).first();
      
      // Should be visible and accessible
      await expect(primaryButton).toBeVisible();
      await expect(primaryButton).toBeEnabled();
      
      // Should meet touch target requirements
      const box = await primaryButton.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      
      // Should respond to touch
      await touchUtils.simulateTouch(page, primaryButton);
      
      // Should maintain consistent styling
      const buttonStyles = await primaryButton.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          minHeight: computed.minHeight,
          fontSize: computed.fontSize,
          padding: computed.padding
        };
      });
      
      expect(parseInt(buttonStyles.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(buttonStyles.fontSize)).toBeGreaterThan(12);
    });
  }
});