/**
 * Mobile Testing Utilities
 * Helper functions and configurations for mobile UI testing
 */

// Touch simulation utilities
export const touchUtils = {
  /**
   * Simulate a complete touch interaction sequence
   */
  async simulateTouch(page, selector, options = {}) {
    const element = page.locator(selector);
    const box = await element.boundingBox();
    
    if (!box) throw new Error(`Element ${selector} not found`);
    
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    
    const touchOptions = {
      clientX: centerX,
      clientY: centerY,
      ...options
    };
    
    // Simulate complete touch sequence
    await element.dispatchEvent('touchstart', {
      touches: [touchOptions],
      changedTouches: [touchOptions]
    });
    
    await page.waitForTimeout(50); // Brief touch hold
    
    await element.dispatchEvent('touchend', {
      touches: [],
      changedTouches: [touchOptions]
    });
  },

  /**
   * Simulate long press interaction
   */
  async simulateLongPress(page, selector, duration = 500) {
    const element = page.locator(selector);
    const box = await element.boundingBox();
    
    if (!box) throw new Error(`Element ${selector} not found`);
    
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    
    const touchOptions = {
      clientX: centerX,
      clientY: centerY
    };
    
    await element.dispatchEvent('touchstart', {
      touches: [touchOptions],
      changedTouches: [touchOptions]
    });
    
    await page.waitForTimeout(duration);
    
    await element.dispatchEvent('touchend', {
      touches: [],
      changedTouches: [touchOptions]
    });
  },

  /**
   * Simulate swipe gesture
   */
  async simulateSwipe(page, selector, direction = 'left', distance = 100) {
    const element = page.locator(selector);
    const box = await element.boundingBox();
    
    if (!box) throw new Error(`Element ${selector} not found`);
    
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    
    let endX = startX;
    let endY = startY;
    
    switch (direction) {
      case 'left':
        endX = startX - distance;
        break;
      case 'right':
        endX = startX + distance;
        break;
      case 'up':
        endY = startY - distance;
        break;
      case 'down':
        endY = startY + distance;
        break;
    }
    
    // Start touch
    await element.dispatchEvent('touchstart', {
      touches: [{ clientX: startX, clientY: startY }],
      changedTouches: [{ clientX: startX, clientY: startY }]
    });
    
    // Move touch
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const currentX = startX + (endX - startX) * (i / steps);
      const currentY = startY + (endY - startY) * (i / steps);
      
      await element.dispatchEvent('touchmove', {
        touches: [{ clientX: currentX, clientY: currentY }],
        changedTouches: [{ clientX: currentX, clientY: currentY }]
      });
      
      await page.waitForTimeout(10);
    }
    
    // End touch
    await element.dispatchEvent('touchend', {
      touches: [],
      changedTouches: [{ clientX: endX, clientY: endY }]
    });
  }
};

// Accessibility testing utilities
export const a11yUtils = {
  /**
   * Check if element meets WCAG touch target requirements
   */
  async checkTouchTarget(page, selector, minSize = 44) {
    const element = page.locator(selector);
    const box = await element.boundingBox();
    
    if (!box) return false;
    
    return box.width >= minSize && box.height >= minSize;
  },

  /**
   * Get all focusable elements in tab order
   */
  async getFocusableElements(page) {
    return await page.locator(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ).all();
  },

  /**
   * Check if element has proper ARIA attributes
   */
  async checkAriaAttributes(page, selector) {
    const element = page.locator(selector);
    
    const attributes = await element.evaluate(el => ({
      ariaLabel: el.getAttribute('aria-label'),
      ariaDescribedBy: el.getAttribute('aria-describedby'),
      ariaPressed: el.getAttribute('aria-pressed'),
      ariaBusy: el.getAttribute('aria-busy'),
      ariaDisabled: el.getAttribute('aria-disabled'),
      role: el.getAttribute('role'),
      tabIndex: el.getAttribute('tabindex'),
      title: el.getAttribute('title'),
      textContent: el.textContent?.trim()
    }));
    
    // Element should have at least one way to be identified by screen readers
    const hasAccessibleName = !!(
      attributes.ariaLabel ||
      attributes.title ||
      attributes.textContent
    );
    
    return {
      hasAccessibleName,
      attributes
    };
  },

  /**
   * Test keyboard navigation flow
   */
  async testKeyboardNavigation(page, expectedOrder = []) {
    const actualOrder = [];
    
    // Start from body to reset focus
    await page.locator('body').focus();
    
    for (let i = 0; i < expectedOrder.length; i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      const elementInfo = await focusedElement.evaluate(el => ({
        tagName: el.tagName.toLowerCase(),
        id: el.id,
        className: el.className,
        textContent: el.textContent?.trim(),
        ariaLabel: el.getAttribute('aria-label')
      }));
      
      actualOrder.push(elementInfo);
    }
    
    return actualOrder;
  }
};

// Performance testing utilities
export const performanceUtils = {
  /**
   * Measure animation performance
   */
  async measureAnimationPerformance(page, triggerAction) {
    const metrics = await page.evaluate(async (action) => {
      const startTime = performance.now();
      
      // Execute the animation trigger
      await action();
      
      // Wait for animation frame
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const endTime = performance.now();
      
      return {
        duration: endTime - startTime,
        timestamp: Date.now()
      };
    }, triggerAction);
    
    return metrics;
  },

  /**
   * Monitor memory usage during interactions
   */
  async monitorMemoryUsage(page, interactions = []) {
    const initialMemory = await page.evaluate(() => ({
      usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
      totalJSHeapSize: performance.memory?.totalJSHeapSize || 0,
      jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0
    }));
    
    // Execute interactions
    for (const interaction of interactions) {
      await interaction();
      await page.waitForTimeout(100); // Allow GC
    }
    
    const finalMemory = await page.evaluate(() => ({
      usedJSHeapSize: performance.memory?.usedJSHeapSize || 0,
      totalJSHeapSize: performance.memory?.totalJSHeapSize || 0,
      jsHeapSizeLimit: performance.memory?.jsHeapSizeLimit || 0
    }));
    
    return {
      initial: initialMemory,
      final: finalMemory,
      increase: finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize,
      percentageIncrease: ((finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize) / initialMemory.usedJSHeapSize) * 100
    };
  },

  /**
   * Check for performance bottlenecks
   */
  async checkPerformanceBottlenecks(page, selector) {
    const metrics = await page.evaluate(async (sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        return entries;
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      
      // Trigger interaction
      element.click();
      
      // Wait for performance entries
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const entries = performance.getEntriesByType('measure');
      
      return {
        measureEntries: entries.length,
        navigationTiming: performance.getEntriesByType('navigation')[0],
        paintTiming: performance.getEntriesByType('paint')
      };
    }, selector);
    
    return metrics;
  }
};

// Device-specific testing configurations
export const deviceConfigs = {
  // Standard mobile device configurations
  iPhoneSE: {
    name: 'iPhone SE',
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  
  iPhone12: {
    name: 'iPhone 12',
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  
  galaxyS21: {
    name: 'Samsung Galaxy S21',
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
  },
  
  iPad: {
    name: 'iPad',
    viewport: { width: 768, height: 1024 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  }
};

// Common test patterns
export const testPatterns = {
  /**
   * Standard button interaction test
   */
  async testButtonInteraction(page, selector, expectedBehavior = {}) {
    const button = page.locator(selector);
    
    // Verify button is visible and enabled
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    
    // Check touch target size
    const isTouchCompliant = await a11yUtils.checkTouchTarget(page, selector);
    expect(isTouchCompliant).toBe(true);
    
    // Check accessibility attributes
    const a11yCheck = await a11yUtils.checkAriaAttributes(page, selector);
    expect(a11yCheck.hasAccessibleName).toBe(true);
    
    // Test touch interaction
    await touchUtils.simulateTouch(page, selector);
    
    // Verify expected behavior
    if (expectedBehavior.shouldShowLoading) {
      await expect(button).toHaveAttribute('aria-busy', 'true');
    }
    
    if (expectedBehavior.shouldNavigate) {
      await page.waitForNavigation();
    }
    
    if (expectedBehavior.shouldOpenModal) {
      const modal = page.getByRole('dialog');
      await expect(modal).toBeVisible();
    }
    
    return true;
  },

  /**
   * Standard form submission test
   */
  async testFormSubmission(page, formSelector, submitButtonSelector, formData = {}) {
    const form = page.locator(formSelector);
    const submitButton = page.locator(submitButtonSelector);
    
    // Fill form with provided data
    for (const [field, value] of Object.entries(formData)) {
      await page.getByLabel(new RegExp(field, 'i')).fill(value);
    }
    
    // Test keyboard shortcut
    await page.keyboard.press('Control+Enter');
    await expect(submitButton).toHaveAttribute('aria-busy', 'true');
    
    return true;
  },

  /**
   * Standard modal interaction test
   */
  async testModalInteraction(page, triggerSelector, modalTestFn) {
    // Open modal
    await page.locator(triggerSelector).click();
    
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Test focus trap
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    const isInModal = await focusedElement.evaluate(el => {
      const modal = el.closest('[role="dialog"]');
      return !!modal;
    });
    expect(isInModal).toBe(true);
    
    // Run custom modal tests
    if (modalTestFn) {
      await modalTestFn(page, modal);
    }
    
    // Test escape key closes modal
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
    
    return true;
  }
};

export default {
  touchUtils,
  a11yUtils,
  performanceUtils,
  deviceConfigs,
  testPatterns
};