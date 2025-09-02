import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'dropdown' | 'simple';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false,
  variant = 'simple'
}) => {
  const { theme, setTheme, actualTheme, isLandingPage } = useTheme();
  const { user } = useAuth();

  // Only show for authenticated users and not on landing pages
  if (!user || isLandingPage) {
    return null;
  }

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

  if (variant === 'dropdown') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`theme-toggle ${className}`}
            aria-label={`Current theme: ${getThemeLabel(theme)}. Click to change theme.`}
          >
            {getThemeIcon(theme)}
            {showLabel && (
              <span className="ml-2">{getThemeLabel(theme)}</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Simple toggle between current theme and opposite
  const toggleTheme = () => {
    if (theme === 'system') {
      // If currently system, switch to opposite of current actual theme
      setTheme(actualTheme === 'dark' ? 'light' : 'dark');
    } else {
      // If explicit theme, switch to opposite
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
      aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {actualTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {showLabel && (
        <span className="ml-2">
          Switch to {actualTheme === 'dark' ? 'Light' : 'Dark'}
        </span>
      )}
    </Button>
  );
};