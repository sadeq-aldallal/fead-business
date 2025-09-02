/**
 * Form Submission Verification for Touch Devices
 * Manual verification checklist and automated helpers
 */

// =============================================================================
// TOUCH DEVICE FORM VERIFICATION CHECKLIST
// =============================================================================

const VERIFICATION_CHECKLIST = {
  // Touch Interaction Requirements
  touchTargets: {
    'Submit buttons meet 44px minimum': false,
    'Password toggles meet 44px minimum': false,
    'Select dropdowns meet 44px minimum': false,
    'Close buttons meet 44px minimum': false,
    'All interactive elements have touch feedback': false
  },
  
  // Form Validation
  validation: {
    'Real-time validation debounced to 500ms': false,
    'Error messages positioned above keyboard': false,
    'Required field validation on submit': false,
    'Email format validation working': false,
    'Password strength validation working': false,
    'Phone number format validation working': false
  },
  
  // Form Submission
  submission: {
    'Loading states prevent double-submission': false,
    'Success feedback clearly displayed': false,
    'Error feedback clearly displayed': false,
    'Form clears after successful submission': false,
    'Network error handling works': false,
    'Submit button accessible during keyboard display': false
  },
  
  // Keyboard Optimization
  keyboard: {
    'Email fields show email keyboard': false,
    'Phone fields show numeric keyboard': false,
    'Password fields disable predictive text': false,
    'Enter key hints work correctly': false,
    'Auto-capitalization works for names': false,
    'AutoComplete attributes function correctly': false
  },
  
  // Accessibility
  accessibility: {
    'Screen reader announces form errors': false,
    'Focus management works correctly': false,
    'Tab navigation flows properly': false,
    'ARIA labels and descriptions present': false,
    'Error summary focuses when errors appear': false,
    'Form instructions read by screen readers': false
  },
  
  // Performance
  performance: {
    'Touch response time < 16ms': false,
    'Validation execution time < 50ms': false,
    'Form submission time reasonable': false,
    'No memory leaks during interactions': false,
    'Smooth animations at 60fps': false
  },
  
  // Cross-Platform
  crossPlatform: {
    'Works on iOS Safari': false,
    'Works on Chrome Mobile': false,
    'Works on Samsung Browser': false,
    'Works with different keyboards': false,
    'Portrait and landscape orientations': false,
    'Different screen sizes (320px - 1024px)': false
  }
};

// =============================================================================
// VERIFICATION FUNCTIONS
// =============================================================================

/**
 * Check if element meets minimum touch target requirements
 */
const verifyTouchTarget = (element) => {
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  
  const minHeight = Math.max(rect.height, parseInt(computedStyle.minHeight) || 0);
  const minWidth = Math.max(rect.width, parseInt(computedStyle.minWidth) || 0);
  
  return {
    element: element,
    width: minWidth,
    height: minHeight,
    meetsWCAG: minWidth >= 44 && minHeight >= 44,
    recommendation: minWidth < 44 || minHeight < 44 ? 
      `Increase size to at least 44px (current: ${minWidth}x${minHeight}px)` : 
      'Meets WCAG 2.1 AA requirements'
  };
};

/**
 * Verify form keyboard attributes
 */
const verifyKeyboardAttributes = (formElement) => {
  const inputs = formElement.querySelectorAll('input, textarea, select');
  const results = [];
  
  inputs.forEach(input => {
    const result = {
      element: input,
      label: input.labels?.[0]?.textContent || input.getAttribute('aria-label'),
      type: input.type,
      inputMode: input.getAttribute('inputMode'),
      enterKeyHint: input.getAttribute('enterKeyHint'),
      autoComplete: input.getAttribute('autoComplete'),
      recommendations: []
    };
    
    // Check for optimal keyboard configuration
    if (input.type === 'email' && input.getAttribute('inputMode') !== 'email') {
      result.recommendations.push('Add inputMode="email" for better mobile keyboard');
    }
    
    if (input.type === 'tel' && input.getAttribute('inputMode') !== 'tel') {
      result.recommendations.push('Add inputMode="tel" for numeric keyboard');
    }
    
    if (input.type === 'email' && !input.getAttribute('autoComplete')) {
      result.recommendations.push('Add autoComplete="email" for better UX');
    }
    
    if (!input.getAttribute('enterKeyHint')) {
      result.recommendations.push('Add enterKeyHint for better keyboard UX');
    }
    
    results.push(result);
  });
  
  return results;
};

/**
 * Verify form accessibility attributes
 */
const verifyAccessibilityAttributes = (formElement) => {
  const inputs = formElement.querySelectorAll('input, textarea, select');
  const results = [];
  
  inputs.forEach(input => {
    const result = {
      element: input,
      id: input.id,
      hasLabel: !!input.labels?.length || !!input.getAttribute('aria-label'),
      hasAriaDescribedBy: !!input.getAttribute('aria-describedby'),
      hasAriaRequired: input.hasAttribute('required') && input.getAttribute('aria-required') === 'true',
      hasAriaInvalid: input.hasAttribute('aria-invalid'),
      recommendations: []
    };
    
    if (!result.hasLabel) {
      result.recommendations.push('Add proper label or aria-label');
    }
    
    if (input.hasAttribute('required') && !result.hasAriaRequired) {
      result.recommendations.push('Add aria-required="true" for required fields');
    }
    
    if (!result.hasAriaInvalid) {
      result.recommendations.push('Add aria-invalid attribute for validation states');
    }
    
    results.push(result);
  });
  
  return results;
};

/**
 * Measure form submission performance
 */
const measureFormPerformance = async (formElement) => {
  return new Promise((resolve) => {
    const metrics = {
      touchResponseTime: null,
      validationTime: null,
      submissionTime: null
    };
    
    // Measure touch response time
    const button = formElement.querySelector('button[type="submit"]');
    if (button) {
      const touchStartTime = performance.now();
      
      button.addEventListener('touchstart', () => {
        metrics.touchResponseTime = performance.now() - touchStartTime;
      }, { once: true });
      
      button.addEventListener('click', () => {
        metrics.touchResponseTime = metrics.touchResponseTime || performance.now() - touchStartTime;
      }, { once: true });
    }
    
    // Measure validation time (if validation function is available)
    const emailInput = formElement.querySelector('input[type="email"]');
    if (emailInput && typeof validateEmail === 'function') {
      const validationStartTime = performance.now();
      validateEmail('test@example.com');
      metrics.validationTime = performance.now() - validationStartTime;
    }
    
    // Return metrics after short delay
    setTimeout(() => resolve(metrics), 100);
  });
};

// =============================================================================
// AUTOMATED VERIFICATION RUNNER
// =============================================================================

/**
 * Run comprehensive form verification
 */
const runFormVerification = async (modalSelector = '[role="dialog"]') => {
  console.log('🧪 Starting Form Verification for Touch Devices...\n');
  
  const modal = document.querySelector(modalSelector);
  if (!modal) {
    console.error('❌ Modal not found. Please open a form modal first.');
    return;
  }
  
  const form = modal.querySelector('form');
  if (!form) {
    console.error('❌ Form not found in modal.');
    return;
  }
  
  console.log('✅ Form found. Running verification tests...\n');
  
  // 1. Touch Target Verification
  console.log('🎯 Checking Touch Targets:');
  const interactiveElements = form.querySelectorAll('button, input, select, [role="button"]');
  interactiveElements.forEach((element, index) => {
    const result = verifyTouchTarget(element);
    const status = result.meetsWCAG ? '✅' : '❌';
    console.log(`  ${status} Element ${index + 1}: ${result.width}x${result.height}px - ${result.recommendation}`);
  });
  console.log('');
  
  // 2. Keyboard Attributes Verification
  console.log('⌨️ Checking Keyboard Attributes:');
  const keyboardResults = verifyKeyboardAttributes(form);
  keyboardResults.forEach((result, index) => {
    const status = result.recommendations.length === 0 ? '✅' : '⚠️';
    console.log(`  ${status} ${result.label || 'Input ' + (index + 1)}: ${result.type}`);
    if (result.recommendations.length > 0) {
      result.recommendations.forEach(rec => console.log(`    - ${rec}`));
    }
  });
  console.log('');
  
  // 3. Accessibility Verification
  console.log('♿ Checking Accessibility:');
  const a11yResults = verifyAccessibilityAttributes(form);
  a11yResults.forEach((result, index) => {
    const status = result.recommendations.length === 0 ? '✅' : '❌';
    console.log(`  ${status} Input ${index + 1}: ${result.hasLabel ? 'Labeled' : 'Missing label'}`);
    if (result.recommendations.length > 0) {
      result.recommendations.forEach(rec => console.log(`    - ${rec}`));
    }
  });
  console.log('');
  
  // 4. Performance Verification
  console.log('⚡ Checking Performance:');
  const perfMetrics = await measureFormPerformance(form);
  console.log(`  Touch Response: ${perfMetrics.touchResponseTime?.toFixed(2) || 'N/A'}ms (target: <16ms)`);
  console.log(`  Validation Time: ${perfMetrics.validationTime?.toFixed(2) || 'N/A'}ms (target: <50ms)`);
  console.log('');
  
  // 5. Summary
  console.log('📊 Verification Summary:');
  console.log('  Run the VERIFICATION_CHECKLIST manually for complete validation.');
  console.log('  Use browser dev tools to test different screen sizes and orientations.');
  console.log('  Test on actual mobile devices for accurate touch behavior.');
  console.log('\n✅ Automated verification complete!');
  
  return {
    touchTargets: interactiveElements.length,
    keyboardOptimized: keyboardResults,
    accessibilityIssues: a11yResults.filter(r => r.recommendations.length > 0),
    performance: perfMetrics
  };
};

// =============================================================================
// USAGE INSTRUCTIONS
// =============================================================================

const USAGE_INSTRUCTIONS = `
🧪 FORM VERIFICATION USAGE INSTRUCTIONS

1. Open the application in a browser
2. Open DevTools console
3. Navigate to a form (AuthModal, BusinessModal, etc.)
4. Run: runFormVerification()
5. Check the console output for verification results
6. Address any issues found
7. Test on actual mobile devices

Example:
  // Open sign in modal first
  runFormVerification('[role="dialog"]')
  
  // Check specific modal
  runFormVerification('.auth-modal')
  
Manual Testing Checklist available in VERIFICATION_CHECKLIST object.
`;

// Export for console use
if (typeof window !== 'undefined') {
  window.runFormVerification = runFormVerification;
  window.VERIFICATION_CHECKLIST = VERIFICATION_CHECKLIST;
  window.verifyTouchTarget = verifyTouchTarget;
  window.verifyKeyboardAttributes = verifyKeyboardAttributes;
  window.verifyAccessibilityAttributes = verifyAccessibilityAttributes;
  
  console.log(USAGE_INSTRUCTIONS);
}

// Export for testing framework use
export {
  runFormVerification,
  VERIFICATION_CHECKLIST,
  verifyTouchTarget,
  verifyKeyboardAttributes,
  verifyAccessibilityAttributes,
  measureFormPerformance
};