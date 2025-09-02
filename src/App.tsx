import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './styles/landing.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Navigation } from './components/layout/Navigation';
import { HeroSection } from './components/sections/HeroSection';
import { ClientLogosSection } from './components/sections/ClientLogosSection';
import { AboutSection } from './components/sections/AboutSection';
import { PainPointsSection } from './components/sections/PainPointsSection';
import { SolutionSection } from './components/sections/SolutionSection';
import { Footer } from './components/sections/Footer';
import { ContactModal } from './components/modals/ContactModal';
import { DemoRequestModal } from './components/modals/DemoRequestModal';
import { CookieConsentModal } from './components/modals/CookieConsentModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OrganizationView } from './components/dashboard/OrganizationView';
import { BusinessView } from './components/dashboard/BusinessView';
import { OrganizationModal } from './components/modals/OrganizationModal';
import { UserProfile } from './components/auth/UserProfile';
import { LoginWelcomePage } from './components/auth/LoginWelcomePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useDashboard } from './contexts/DashboardContext';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsAndConditions } from './components/legal/TermsAndConditions';
import { AccountDeletionPolicy } from './components/legal/AccountDeletionPolicy';
import { EnhancedDocumentationPage } from './components/docs/enhanced/EnhancedDocumentationPage';
import { LoadingAnalyticsProvider } from './components/ui/loading-analytics';

const AppContent: React.FC = () => {
  // Initialize currentPage based on the current URL to avoid race conditions
  const getInitialPage = (): 'home' | 'dashboard' | 'profile' | 'docs' | 'privacy-policy' | 'terms-and-conditions' | 'account-deletion-policy' => {
    const path = window.location.pathname;
    if (path === '/docs') return 'docs';
    if (path === '/privacy-policy') return 'privacy-policy';
    if (path === '/terms-and-conditions') return 'terms-and-conditions';
    if (path === '/account-deletion-policy') return 'account-deletion-policy';
    return 'home';
  };
  
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard' | 'profile' | 'docs' | 'privacy-policy' | 'terms-and-conditions' | 'account-deletion-policy'>(getInitialPage());
  const [dashboardView, setDashboardView] = useState<'organization' | 'business'>('organization');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showOrganizationModal, setShowOrganizationModal] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const { user, loading, initialized } = useAuth();
  const { 
    organization, 
    businesses, 
    currentBusiness, 
    loading: dashboardLoading, 
    processInstagramCode,
    setCurrentBusiness 
  } = useDashboard();
  const { setIsLandingPage } = useTheme();
  
  // Ref to track if OAuth code has been processed to prevent duplicate processing
  const processedOAuthCodeRef = useRef(false);
  
  // Auto-dismiss Instagram error after 10 seconds
  useEffect(() => {
    if (instagramError) {
      const timer = setTimeout(() => {
        setInstagramError(null);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [instagramError]);
  
  // Centralized Instagram OAuth callback handling
  useEffect(() => {
    const handleInstagramCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      // Handle OAuth errors first
      if (error) {
        console.error('Instagram OAuth Error:', { error, errorDescription });
        // Clean URL and show error (you might want to show a toast/modal here)
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
      
      // Process OAuth code if present and conditions are met
      if (code && 
          user && 
          organization && 
          businesses.length > 0 && 
          !dashboardLoading && 
          !processedOAuthCodeRef.current) {
        
        console.log('Processing Instagram OAuth code:', {
          code: code.substring(0, 10) + '...',
          businessCount: businesses.length,
          currentBusiness: currentBusiness?.name
        });
        
        // Mark as processed to prevent duplicate processing
        processedOAuthCodeRef.current = true;
        
        try {
          // Determine target business (prefer currentBusiness, fallback to first business)
          const targetBusiness = currentBusiness || businesses[0];
          
          if (!targetBusiness) {
            throw new Error('No business available for Instagram connection');
          }
          
          // Set current business if not already set
          if (!currentBusiness) {
            setCurrentBusiness(targetBusiness);
          }
          
          // Process the Instagram OAuth code
          const { error: processError } = await processInstagramCode(code, targetBusiness.id);
          
          if (processError) {
            console.error('Error processing Instagram code:', processError);
            // Show user-friendly error message
            setInstagramError(processError.message || 'Failed to connect Instagram account. Please try again.');
            // Reset the flag so user can retry
            processedOAuthCodeRef.current = false;
          } else {
            console.log('Instagram OAuth code processed successfully');
            // Clear any previous errors
            setInstagramError(null);
          }
          
        } catch (error) {
          console.error('Error in OAuth processing:', error);
          // Show user-friendly error message
          setInstagramError(error instanceof Error ? error.message : 'Failed to connect Instagram account. Please try again.');
          // Reset the flag so user can retry
          processedOAuthCodeRef.current = false;
        } finally {
          // Clean URL after processing (success or failure)
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Ensure we're on the dashboard business view
          setCurrentPage('dashboard');
          setDashboardView('business');
        }
      } else if (code && user && organization) {
        // Code present but conditions not met yet (still loading)
        console.log('OAuth code detected but waiting for data to load:', {
          hasUser: !!user,
          hasOrganization: !!organization,
          businessCount: businesses.length,
          dashboardLoading,
          alreadyProcessed: processedOAuthCodeRef.current
        });
        
        // Redirect to dashboard to show loading state
        setCurrentPage('dashboard');
        setDashboardView('business');
      }
    };
    
    handleInstagramCallback();
  }, [user, organization, businesses, currentBusiness, dashboardLoading, processInstagramCode, setCurrentBusiness]);

  // No need for initial URL routing useEffect since state is initialized correctly

  // Handle browser navigation (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/docs') {
        setCurrentPage('docs');
      } else if (path === '/privacy-policy') {
        setCurrentPage('privacy-policy');
      } else if (path === '/terms-and-conditions') {
        setCurrentPage('terms-and-conditions');
      } else if (path === '/account-deletion-policy') {
        setCurrentPage('account-deletion-policy');
      } else if (path === '/') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update URL when page changes
  useEffect(() => {
    const path = currentPage === 'home' ? '/' : `/${currentPage}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentPage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Update landing page state for theme context
  useEffect(() => {
    const isOnLandingPage = currentPage === 'home' || 
                           currentPage === 'docs' || 
                           currentPage === 'privacy-policy' || 
                           currentPage === 'terms-and-conditions' || 
                           currentPage === 'account-deletion-policy';
    setIsLandingPage(isOnLandingPage);
  }, [currentPage, setIsLandingPage]);

  // Handle scrolling to sections when hash is present
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash && currentPage === 'home') {
        // Try multiple times with increasing delays to ensure DOM is ready
        const tryScroll = (attempt = 0) => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else if (attempt < 10) {
            // If element not found, try again with longer delay
            setTimeout(() => tryScroll(attempt + 1), 100 * (attempt + 1));
          }
        };
        
        setTimeout(() => tryScroll(), 300); // Initial delay for page load
      }
    };

    // Handle initial load with hash
    handleHashScroll();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, [currentPage]);

  // Auto-redirect to dashboard when user logs in
  useEffect(() => {
    // Check if there's an OAuth code being processed
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthCode = urlParams.get('code');
    
    const legalPages = ['privacy-policy', 'terms-and-conditions', 'account-deletion-policy'];
    
    // Only auto-redirect if no OAuth code is present (to avoid interfering with OAuth processing)
    if (user && (currentPage === 'home' || currentPage === 'docs') && !hasOAuthCode) {
      setCurrentPage('dashboard');
    } else if (!user && currentPage !== 'home' && !legalPages.includes(currentPage) && currentPage !== 'docs') {
      // Only redirect to home if user is not authenticated AND not on a legal page or docs page
      setCurrentPage('home');
    }
  }, [user]); // Only run when user authentication state changes

  // Check for organization and show modal if needed
  useEffect(() => {
    if (user && currentPage === 'dashboard' && !dashboardLoading && !organization) {
      setShowOrganizationModal(true);
    } else if (organization && showOrganizationModal) {
      // Close modal when organization becomes available
      setShowOrganizationModal(false);
    }
  }, [user, currentPage, dashboardLoading, organization, showOrganizationModal]);

  // Check for first-time visit and show cookie consent
  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('cookieConsent');
    if (!hasAcceptedCookies) {
      setShowCookieConsent(true);
    }
  }, []);
  const handleGetStartedClick = () => {
    setCurrentPage('dashboard');
    // Update URL without page reload
    window.history.pushState({}, '', '/dashboard');
  };

  const handleSignupClick = () => {
    // CHANGED: Open demo request instead of signup
    setShowDemoModal(true);
  };

  const handleNavigateToLegalPage = (page: 'privacy-policy' | 'terms-and-conditions' | 'account-deletion-policy') => {
    setCurrentPage(page);
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookieConsent(false);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowCookieConsent(false);
  };
  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="landing-gradient-bg min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  // Show documentation page (not protected)
  if (currentPage === 'docs') {
    return (
      <div className="landing-gradient-bg landing-page-container">
        <Navigation 
          onGetStartedClick={handleGetStartedClick}
          onSignupClick={handleSignupClick}
          onDashboardClick={() => setCurrentPage('dashboard')}
          onProfileClick={() => setCurrentPage('profile')}
          onHomeClick={() => setCurrentPage('home')}
          onDocsClick={() => setCurrentPage('docs')}
          currentPage={currentPage}
        />
        <EnhancedDocumentationPage 
          onGetStartedClick={handleGetStartedClick}
          onSignupClick={handleSignupClick}
          onDashboardClick={() => setCurrentPage('dashboard')}
          onProfileClick={() => setCurrentPage('profile')}
          onHomeClick={() => setCurrentPage('home')}
          onDocsClick={() => setCurrentPage('docs')}
        />
        
        <DemoRequestModal 
          isOpen={showDemoModal} 
          onClose={() => setShowDemoModal(false)} 
        />
        
        <CookieConsentModal
          isOpen={showCookieConsent}
          onAccept={handleAcceptCookies}
          onDecline={handleDeclineCookies}
        />
      </div>
    );
  }

  // Show legal pages (not protected)
  if (currentPage === 'privacy-policy') {
    return (
      <div className="landing-gradient-bg landing-page-container">
        <Navigation 
          onGetStartedClick={handleGetStartedClick}
          onSignupClick={handleSignupClick}
          onDashboardClick={() => setCurrentPage('dashboard')}
          onProfileClick={() => setCurrentPage('profile')}
          onHomeClick={() => setCurrentPage('home')}
          onDocsClick={() => setCurrentPage('docs')}
          currentPage={currentPage}
        />
        <PrivacyPolicy />
        
        <DemoRequestModal 
          isOpen={showDemoModal} 
          onClose={() => setShowDemoModal(false)} 
        />
        
        <CookieConsentModal
          isOpen={showCookieConsent}
          onAccept={handleAcceptCookies}
          onDecline={handleDeclineCookies}
        />
      </div>
    );
  }

  if (currentPage === 'terms-and-conditions') {
    return (
      <div className="landing-gradient-bg landing-page-container">
        <Navigation 
          onGetStartedClick={handleGetStartedClick}
          onSignupClick={handleSignupClick}
          onDashboardClick={() => setCurrentPage('dashboard')}
          onProfileClick={() => setCurrentPage('profile')}
          onHomeClick={() => setCurrentPage('home')}
          onDocsClick={() => setCurrentPage('docs')}
          currentPage={currentPage}
        />
        <TermsAndConditions />
        
        <DemoRequestModal 
          isOpen={showDemoModal} 
          onClose={() => setShowDemoModal(false)} 
        />
        
        <CookieConsentModal
          isOpen={showCookieConsent}
          onAccept={handleAcceptCookies}
          onDecline={handleDeclineCookies}
        />
      </div>
    );
  }

  if (currentPage === 'account-deletion-policy') {
    return (
      <div className="landing-gradient-bg landing-page-container">
        <Navigation 
          onGetStartedClick={handleGetStartedClick}
          onSignupClick={handleSignupClick}
          onDashboardClick={() => setCurrentPage('dashboard')}
          onProfileClick={() => setCurrentPage('profile')}
          onHomeClick={() => setCurrentPage('home')}
          onDocsClick={() => setCurrentPage('docs')}
          currentPage={currentPage}
        />
        <AccountDeletionPolicy />
        
        <DemoRequestModal 
          isOpen={showDemoModal} 
          onClose={() => setShowDemoModal(false)} 
        />
        
        <CookieConsentModal
          isOpen={showCookieConsent}
          onAccept={handleAcceptCookies}
          onDecline={handleDeclineCookies}
        />
      </div>
    );
  }
  // Show user profile
  if (currentPage === 'profile') {
    return (
      <ProtectedRoute>
        <div className="relative">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="fixed top-4 left-4 z-50 glass-card rounded-lg px-4 py-2 text-foreground hover:bg-card/90 transition-colors duration-200"
          >
            ← Back
          </button>
          <UserProfile />
        </div>
      </ProtectedRoute>
    );
  }

  // Show login/welcome page when accessing dashboard without authentication
  if (currentPage === 'dashboard' && !user) {
    return (
      <LoginWelcomePage
        onHomeClick={() => {
          setCurrentPage('home');
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  // Show dashboard
  if (currentPage === 'dashboard' && user) {
    return (
      <ProtectedRoute>
        <DashboardLayout
          currentView={dashboardView}
          onViewChange={setDashboardView}
          onDocsClick={() => setCurrentPage('docs')}
        >
          {/* Instagram Error Notification */}
          {instagramError && (
            <div className="fixed top-4 right-4 z-50 max-w-md">
              <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg border border-red-500">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-200 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Instagram Connection Failed</p>
                      <p className="mt-1 text-sm text-red-200">{instagramError}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInstagramError(null)}
                    className="flex-shrink-0 ml-4 text-red-200 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {dashboardView === 'organization' ? <OrganizationView /> : <BusinessView />}
        </DashboardLayout>
        
        <OrganizationModal
          isOpen={showOrganizationModal}
          onClose={() => setShowOrganizationModal(false)}
        />
      </ProtectedRoute>
    );
  }

  // Main landing page
  return (
    <div className="landing-gradient-bg min-h-screen landing-page-container">
      <Navigation 
        onGetStartedClick={handleGetStartedClick}
        onSignupClick={handleSignupClick}
        onDashboardClick={() => setCurrentPage('dashboard')}
        onProfileClick={() => setCurrentPage('profile')}
        onHomeClick={() => setCurrentPage('home')}
        onDocsClick={() => setCurrentPage('docs')}
        currentPage={currentPage}
      />
      
      <HeroSection 
        onGetStarted={handleSignupClick}
      />
      <PainPointsSection />
      <SolutionSection />
      <AboutSection />
      <Footer 
        onPrivacyClick={() => setCurrentPage('privacy-policy')}
        onTermsClick={() => setCurrentPage('terms-and-conditions')}
        onAccountDeletionClick={() => setCurrentPage('account-deletion-policy')}
      />
      
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
      
      <DemoRequestModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)} 
      />
      
      {/* Cookie Consent Modal */}
      <CookieConsentModal
        isOpen={showCookieConsent}
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
      />
    </div>
  );
};

function App() {
  return (
    <LoadingAnalyticsProvider>
      <AuthProvider>
        <DashboardProvider>
          <LanguageProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </LanguageProvider>
        </DashboardProvider>
      </AuthProvider>
    </LoadingAnalyticsProvider>
  );
}

export default App;