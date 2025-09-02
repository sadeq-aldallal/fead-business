import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  isLandingPage: boolean;
  setIsLandingPage: (isLanding: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLandingPage, setIsLandingPage] = useState(true);

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  };

  // Calculate actual theme based on context
  const getActualTheme = (): 'light' | 'dark' => {
    // Landing page is always dark
    if (isLandingPage) {
      return 'dark';
    }
    
    // Authenticated users can choose theme
    if (user) {
      if (theme === 'system') {
        return getSystemTheme();
      }
      return theme as 'light' | 'dark';
    }
    
    // Default to dark for unauthenticated users
    return 'dark';
  };

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(getActualTheme());

  // Load theme preference from localStorage for authenticated users
  useEffect(() => {
    if (user) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
      } else {
        // Default to system for authenticated users if no preference saved
        setThemeState('system');
        localStorage.setItem('theme', 'system');
      }
    } else {
      // Clear theme preference when user logs out
      setThemeState('system');
    }
  }, [user]);

  // Update actual theme when dependencies change
  useEffect(() => {
    const newActualTheme = getActualTheme();
    setActualTheme(newActualTheme);
    
    // Apply theme to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newActualTheme);
    
    // Debug log to verify theme is being applied
    console.log('Theme applied:', newActualTheme, 'Classes:', root.className);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newActualTheme === 'dark' ? 'hsl(0, 0%, 3.9%)' : 'hsl(0, 0%, 100%)');
    }
  }, [theme, isLandingPage, user]);

  // Listen to system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newActualTheme = getActualTheme();
        setActualTheme(newActualTheme);
        
        // Apply theme to document
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newActualTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, isLandingPage, user]);

  const setTheme = (newTheme: Theme) => {
    // Only authenticated users can change theme
    if (user) {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  const value: ThemeContextValue = {
    theme,
    actualTheme,
    setTheme,
    isLandingPage,
    setIsLandingPage,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};