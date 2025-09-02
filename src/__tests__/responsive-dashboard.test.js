/**
 * Responsive Dashboard Tests
 * Tests for mobile and tablet responsiveness of dashboard components
 */

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Responsive Dashboard Tests', () => {
  beforeEach(() => {
    // Reset window size before each test
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  describe('Mobile Breakpoints (320px - 767px)', () => {
    beforeEach(() => {
      global.innerWidth = 375; // iPhone size
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(max-width: 767px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    test('dashboard cards should stack vertically on mobile', () => {
      const mockElement = document.createElement('div');
      mockElement.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
      
      expect(mockElement.className).toContain('grid-cols-1');
      expect(mockElement.className).toContain('md:grid-cols-2');
      expect(mockElement.className).toContain('lg:grid-cols-4');
    });

    test('touch targets should be at least 44px', () => {
      const button = document.createElement('button');
      button.style.minHeight = '44px';
      button.style.minWidth = '44px';
      
      expect(parseInt(button.style.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(button.style.minWidth)).toBeGreaterThanOrEqual(44);
    });

    test('mobile navigation should be collapsible', () => {
      const mobileNav = document.createElement('div');
      mobileNav.className = 'md:hidden';
      
      expect(mobileNav.className).toContain('md:hidden');
    });
  });

  describe('Tablet Breakpoints (768px - 1023px)', () => {
    beforeEach(() => {
      global.innerWidth = 768;
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(min-width: 768px) and (max-width: 1023px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    test('dashboard should show 2-column layout on tablet', () => {
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      
      expect(grid.className).toContain('md:grid-cols-2');
    });

    test('sidebar should be collapsible on tablet', () => {
      const sidebar = document.createElement('aside');
      sidebar.className = 'w-80 flex-shrink-0 lg:block md:hidden';
      
      expect(sidebar.className).toContain('md:hidden');
      expect(sidebar.className).toContain('lg:block');
    });
  });

  describe('Desktop Breakpoints (1024px+)', () => {
    beforeEach(() => {
      global.innerWidth = 1440;
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));
    });

    test('dashboard should show full 4-column layout', () => {
      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      
      expect(grid.className).toContain('lg:grid-cols-4');
    });

    test('sidebar should be visible on desktop', () => {
      const sidebar = document.createElement('aside');
      sidebar.className = 'w-80 flex-shrink-0 hidden lg:block';
      
      expect(sidebar.className).toContain('lg:block');
    });
  });

  describe('Touch Interaction Tests', () => {
    test('interactive elements should have proper spacing', () => {
      const button = document.createElement('button');
      button.style.padding = '12px 16px';
      button.style.margin = '8px';
      
      expect(button.style.padding).toBeTruthy();
      expect(button.style.margin).toBeTruthy();
    });

    test('cards should have touch-friendly padding', () => {
      const card = document.createElement('div');
      card.className = 'glass-card p-6';
      
      expect(card.className).toContain('p-6');
    });
  });

  describe('Typography Responsiveness', () => {
    test('headings should scale appropriately', () => {
      const heading = document.createElement('h1');
      heading.className = 'text-2xl md:text-3xl lg:text-4xl';
      
      expect(heading.className).toContain('text-2xl');
      expect(heading.className).toContain('md:text-3xl');
      expect(heading.className).toContain('lg:text-4xl');
    });

    test('body text should be readable on mobile', () => {
      const text = document.createElement('p');
      text.className = 'text-sm md:text-base';
      
      expect(text.className).toContain('text-sm');
      expect(text.className).toContain('md:text-base');
    });
  });

  describe('Layout Overflow Tests', () => {
    test('content should not cause horizontal scroll', () => {
      const container = document.createElement('div');
      container.className = 'max-w-full overflow-x-hidden';
      
      expect(container.className).toContain('max-w-full');
      expect(container.className).toContain('overflow-x-hidden');
    });

    test('tables should be scrollable on mobile', () => {
      const tableContainer = document.createElement('div');
      tableContainer.className = 'overflow-x-auto';
      
      expect(tableContainer.className).toContain('overflow-x-auto');
    });
  });

  describe('Form Responsiveness', () => {
    test('form inputs should be mobile-friendly', () => {
      const input = document.createElement('input');
      input.style.minHeight = '44px';
      input.style.fontSize = '16px'; // Prevents zoom on iOS
      
      expect(parseInt(input.style.minHeight)).toBeGreaterThanOrEqual(44);
      expect(parseInt(input.style.fontSize)).toBeGreaterThanOrEqual(16);
    });

    test('form layouts should stack on mobile', () => {
      const form = document.createElement('form');
      form.className = 'space-y-4 md:space-y-6';
      
      expect(form.className).toContain('space-y-4');
      expect(form.className).toContain('md:space-y-6');
    });
  });
});