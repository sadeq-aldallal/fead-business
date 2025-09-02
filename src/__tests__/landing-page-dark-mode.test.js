// Comprehensive landing page dark mode tests

/**
 * Test: Landing page dark mode enforcement
 * This test verifies that the landing page consistently enforces dark mode
 */
export const testLandingPageDarkMode = () => {
  const results = [];
  
  // Test 1: HTML root element has dark class
  const htmlElement = document.documentElement;
  const hasDarkClass = htmlElement.classList.contains('dark');
  
  results.push({
    test: 'HTML root element has dark class applied',
    expected: true,
    actual: hasDarkClass,
    passed: hasDarkClass
  });
  
  // Test 2: Landing page container class exists
  const landingContainers = document.querySelectorAll('.landing-page-container');
  const hasLandingContainer = landingContainers.length > 0;
  
  results.push({
    test: 'Landing page containers are properly marked',
    expected: 'greater than 0',
    actual: landingContainers.length,
    passed: hasLandingContainer
  });
  
  // Test 3: Meta theme-color is set for mobile
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const hasMetaTag = metaThemeColor !== null;
  const correctColor = metaThemeColor?.getAttribute('content') === '#0a0a0a';
  
  results.push({
    test: 'Meta theme-color is set for mobile browsers',
    expected: '#0a0a0a',
    actual: metaThemeColor?.getAttribute('content') || 'not found',
    passed: hasMetaTag && correctColor
  });
  
  // Test 4: Theme toggle is hidden on landing pages (if user is authenticated)
  const themeToggle = document.querySelector('.theme-toggle');
  const isThemeToggleHidden = !themeToggle || themeToggle.style.display === 'none' || 
                              themeToggle.closest('.landing-page-container') && 
                              window.getComputedStyle(themeToggle).display === 'none';
  
  results.push({
    test: 'Theme toggle is properly hidden on landing pages',
    expected: true,
    actual: isThemeToggleHidden,
    passed: isThemeToggleHidden
  });
  
  return results;
};

/**
 * Test: CSS variable consistency
 */
export const testCSSVariableConsistency = () => {
  const results = [];
  
  // Test 1: CSS custom properties are applied correctly
  const rootStyles = getComputedStyle(document.documentElement);
  const backgroundVar = rootStyles.getPropertyValue('--background');
  const foregroundVar = rootStyles.getPropertyValue('--foreground');
  
  results.push({
    test: 'Dark mode CSS variables are properly set',
    expected: 'non-empty strings',
    actual: `background: "${backgroundVar.trim()}", foreground: "${foregroundVar.trim()}"`,
    passed: backgroundVar.trim() !== '' && foregroundVar.trim() !== ''
  });
  
  // Test 2: Landing page containers override light mode
  const landingContainer = document.querySelector('.landing-page-container');
  if (landingContainer) {
    const containerStyles = getComputedStyle(landingContainer);
    const colorScheme = containerStyles.getPropertyValue('color-scheme');
    
    results.push({
      test: 'Landing page container enforces dark color scheme',
      expected: 'dark',
      actual: colorScheme.trim(),
      passed: colorScheme.includes('dark')
    });
  } else {
    results.push({
      test: 'Landing page container exists for CSS testing',
      expected: 'element found',
      actual: 'no landing container found',
      passed: false
    });
  }
  
  return results;
};

/**
 * Test: Cross-browser compatibility checks
 */
export const testCrossBrowserCompatibility = () => {
  const results = [];
  
  // Test 1: Check if CSS custom properties are supported
  const supportsCustomProperties = CSS.supports('color', 'var(--test-color)');
  
  results.push({
    test: 'Browser supports CSS custom properties',
    expected: true,
    actual: supportsCustomProperties,
    passed: supportsCustomProperties
  });
  
  // Test 2: Check if prefers-color-scheme media query is supported
  const supportsColorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)').matches !== undefined;
  
  results.push({
    test: 'Browser supports prefers-color-scheme media queries',
    expected: true,
    actual: supportsColorSchemeQuery,
    passed: supportsColorSchemeQuery
  });
  
  // Test 3: Check browser info
  const userAgent = navigator.userAgent;
  const isModernBrowser = !userAgent.includes('MSIE') && !userAgent.includes('Trident');
  
  results.push({
    test: 'Modern browser detected (not IE)',
    expected: true,
    actual: isModernBrowser,
    passed: isModernBrowser
  });
  
  return results;
};

// Run all landing page dark mode tests
export const runLandingPageTests = () => {
  console.log('🌙 Running Landing Page Dark Mode Tests...\n');
  
  const allTests = [
    ...testLandingPageDarkMode(),
    ...testCSSVariableConsistency(),
    ...testCrossBrowserCompatibility()
  ];
  
  const passedTests = allTests.filter(test => test.passed);
  const failedTests = allTests.filter(test => !test.passed);
  
  console.log('📊 Test Results:');
  allTests.forEach(test => {
    const status = test.passed ? '✅' : '❌';
    console.log(`${status} ${test.test}`);
    if (!test.passed) {
      console.log(`   Expected: ${test.expected}, Got: ${test.actual}`);
    }
  });
  
  console.log(`\n🎯 Summary: ${passedTests.length}/${allTests.length} tests passed`);
  
  if (failedTests.length === 0) {
    console.log('🎉 All landing page dark mode tests passed!');
    console.log('✨ Landing page is consistently enforcing dark mode!');
  } else {
    console.log('🚨 Some tests failed. Please review the implementation.');
  }
  
  return {
    total: allTests.length,
    passed: passedTests.length,
    failed: failedTests.length,
    success: failedTests.length === 0
  };
};

// Auto-run tests if accessed directly in browser
if (typeof window !== 'undefined' && window.location) {
  // Allow manual triggering via console
  window.runLandingPageTests = runLandingPageTests;
  console.log('Landing page dark mode tests available. Run: runLandingPageTests()');
}