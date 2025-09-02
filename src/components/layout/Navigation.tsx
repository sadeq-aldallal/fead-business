import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, FileText, Home } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface NavigationProps {
  onGetStartedClick: () => void;
  onSignupClick: () => void;
  onDashboardClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onDocsClick?: () => void;
  currentPage: 'home' | 'dashboard' | 'profile' | 'docs';
}

export const Navigation: React.FC<NavigationProps> = ({ 
  onGetStartedClick, 
  onSignupClick, 
  onDashboardClick, 
  onProfileClick, 
  onHomeClick,
  onDocsClick,
  currentPage 
}) => {
  const { t, currentLanguage, setLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'ar' as const, name: 'العربية', flag: '🇸🇦' },
  ];

  const handleLanguageChange = (langCode: 'en' | 'ar') => {
    const newLang = languages.find(l => l.code === langCode);
    if (newLang) {
      setLanguage(newLang);
    }
    setShowLanguageDropdown(false);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Return focus to hamburger button when menu closes
    setTimeout(() => {
      hamburgerButtonRef.current?.focus();
    }, 100);
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    // Focus first menu item when menu opens
    setTimeout(() => {
      firstMenuItemRef.current?.focus();
    }, 150);
  };

  const handleLogout = () => {
    signOut();
    onHomeClick?.();
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobileMenuOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeMobileMenu();
          break;
        case 'Tab':
          // Focus trap within mobile menu
          const focusableElements = mobileMenuRef.current?.querySelectorAll(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey) {
              // Shift + Tab - go to previous element
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              // Tab - go to next element
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
          break;
      }
    };

    const handleClickOutside = (e: Event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        overlayRef.current &&
        overlayRef.current.contains(e.target as Node)
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      // Add aria-hidden to main content when menu is open
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
      }
    } else {
      document.body.style.overflow = 'unset';
      // Remove aria-hidden from main content when menu closes
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
      }
    };
  }, [isMobileMenuOpen]);

  const isDashboard = currentPage === 'dashboard';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 ${isDashboard ? 'bg-background/95 border-b border-border' : 'glass-nav'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left side */}
            <div className="flex items-center">
              <img 
                src="/fead.app_logo.png" 
                alt="fead.app" 
                className="h-10 w-auto md:h-12"
              />
            </div>

            {/* Center Navigation Links - Only show on home page */}
            {!isDashboard && (
              <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
                <a
                  href="/#home"
                  className={`nav-item text-foreground/80 hover:text-primary transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('nav.home')}
                </a>
                <a
                  href="#challenges"
                  className={`nav-item text-foreground/80 hover:text-primary transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('nav.challenges')}
                </a>
                <a
                  href="#features"
                  className={`nav-item text-foreground/80 hover:text-primary transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('nav.features')}
                </a>
                <a
                  href="/#contact"
                  className={`nav-item text-foreground/80 hover:text-primary transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('nav.contact')}
                </a>
                <Button
                  variant="ghost"
                  onClick={onDocsClick}
                  className={`text-foreground/80 hover:text-primary transition-colors duration-200 ${isRTL ? 'font-arabic' : ''} ${currentPage === 'docs' ? 'text-primary' : ''}`}
                >
                  Docs
                </Button>
              </div>
            )}

            {/* Right side - Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!isDashboard && !user && (
                <>
                  <Button
                    variant="outline"
                    onClick={onGetStartedClick}
                    className={`${isRTL ? 'font-arabic' : ''}`}
                  >
                    Get Started
                  </Button>
                  <Button 
                    onClick={onSignupClick}
                    variant="brand"
                    className={`${isRTL ? 'font-arabic' : ''}`}
                  >
                    Request Demo
                  </Button>
                </>
              )}
              
              {isDashboard && user && (
                <>
                  {/* Theme toggle button for dashboard */}
                  <ThemeToggle />
                </>
              )}
              
              {!isDashboard && user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary text-sm font-medium">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Manage your account
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDashboardClick?.()}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>{t('nav.dashboard')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Hamburger Button - Only visible on mobile */}
            <div className="md:hidden mr-4">
              <Button
                ref={hamburgerButtonRef}
                variant="ghost"
                onClick={toggleMobileMenu}
                className="h-12 w-12 text-foreground/80 hover:text-foreground hover:bg-foreground/10 active:bg-foreground/20 active:scale-95 transition-all duration-150 touch-target touch-ripple touch-select-none"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="hamburger-icon open" />
                ) : (
                  <Menu size={24} className="hamburger-icon" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Only visible when menu is open */}
      {isMobileMenuOpen && (
        <div 
          ref={overlayRef}
          className="mobile-menu-overlay fixed inset-0 z-40 md:hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Background overlay */}
          <div 
            className={`fixed inset-0 glass-overlay ${isMobileMenuOpen ? 'overlay-enter-active' : 'overlay-exit-active'}`}
            onClick={closeMobileMenu}
          ></div>
          
          {/* Mobile menu content */}
          <div 
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className={`mobile-menu-content fixed top-16 left-0 right-0 glass-mobile-menu mx-4 mt-4 rounded-lg ${isRTL ? 'text-right' : 'text-left'} ${isMobileMenuOpen ? 'mobile-menu-enter-active' : 'mobile-menu-exit-active'}`}
          >
            <div className="p-6 space-y-6">
              {/* Hidden title for screen readers */}
              <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
              
              {/* Navigation Links */}
              <div className="space-y-4" role="menu" aria-labelledby="mobile-menu-title">
                {!isDashboard && (
                  <>
                    <a
                      ref={firstMenuItemRef}
                      href="/#home"
                      onClick={closeMobileMenu}
                      role="menuitem"
                      className={`mobile-nav-item block text-lg font-medium text-foreground/90 hover:text-foreground active:text-foreground focus:text-foreground focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted active:bg-muted/80 active:scale-[0.98] touch-target ${isRTL ? 'font-arabic' : ''}`}
                    >
                      {t('nav.home')}
                    </a>
                    <a
                      href="#challenges"
                      onClick={closeMobileMenu}
                      role="menuitem"
                      className={`mobile-nav-item block text-lg font-medium text-foreground/90 hover:text-foreground active:text-foreground focus:text-foreground focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted active:bg-muted/80 active:scale-[0.98] touch-target ${isRTL ? 'font-arabic' : ''}`}
                    >
                      {t('nav.challenges')}
                    </a>
                    <a
                      href="#features"
                      onClick={closeMobileMenu}
                      role="menuitem"
                      className={`mobile-nav-item block text-lg font-medium text-foreground/90 hover:text-foreground active:text-foreground focus:text-foreground focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted active:bg-muted/80 active:scale-[0.98] touch-target ${isRTL ? 'font-arabic' : ''}`}
                    >
                      {t('nav.features')}
                    </a>
                    <a
                      href="/#contact"
                      onClick={closeMobileMenu}
                      role="menuitem"
                      className={`mobile-nav-item block text-lg font-medium text-foreground/90 hover:text-foreground active:text-foreground focus:text-foreground focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 py-3 px-4 rounded-lg hover:bg-muted active:bg-muted/80 active:scale-[0.98] touch-target ${isRTL ? 'font-arabic' : ''}`}
                    >
                      {t('nav.contact')}
                    </a>
                  </>
                )}
              </div>


              {/* Login Message */}
              <div className="border-t border-white/10 pt-4">
                {!user ? (
                  !isDashboard && (
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          onGetStartedClick();
                          closeMobileMenu();
                        }}
                        className={`w-full ${isRTL ? 'font-arabic' : ''}`}
                      >
                        Get Started
                      </Button>
                      <Button 
                        onClick={() => {
                          onSignupClick();
                          closeMobileMenu();
                        }}
                        variant="brand"
                        className={`w-full ${isRTL ? 'font-arabic' : ''}`}
                      >
                        Request Demo
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="space-y-2">
                    {!isDashboard && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onDashboardClick?.();
                          closeMobileMenu();
                        }}
                        className="w-full justify-start text-foreground/80 hover:text-foreground hover:bg-foreground/10 focus:text-foreground focus:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-foreground/20 active:scale-[0.98] transition-all duration-150 touch-target"
                      >
                        {t('nav.dashboard')}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        closeMobileMenu();
                      }}
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive/50 active:bg-destructive/20 active:scale-[0.98] transition-all duration-150 touch-target"
                    >
                      {t('nav.logout')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};