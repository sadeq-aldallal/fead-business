import React, { useState, useEffect } from 'react';
import './styles/landing.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OrganizationView } from './components/dashboard/OrganizationView';
import { BusinessView } from './components/dashboard/BusinessView';
import { OrganizationModal } from './components/modals/OrganizationModal';
import { UserProfile } from './components/auth/UserProfile';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useDashboard } from './contexts/DashboardContext';
import { LoadingAnalyticsProvider } from './components/ui/loading-analytics';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [dashboardView, setDashboardView] = useState<'organization' | 'business'>('organization');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOrganizationModal, setShowOrganizationModal] = useState(false);
  
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

  // Set this as a business app, not landing page
  useEffect(() => {
    setIsLandingPage(false);
  }, [setIsLandingPage]);

  // Handle authentication state changes
  useEffect(() => {
    if (initialized && !loading) {
      if (!user) {
        // Show login modal instead of redirecting
        setShowAuthModal(true);
      } else {
        // User is authenticated, hide auth modal
        setShowAuthModal(false);
      }
    }
  }, [user, initialized, loading]);

  // Check for organization and show modal if needed
  useEffect(() => {
    if (user && !dashboardLoading && !organization) {
      setShowOrganizationModal(true);
    } else if (organization && showOrganizationModal) {
      setShowOrganizationModal(false);
    }
  }, [user, dashboardLoading, organization, showOrganizationModal]);

  // Handle Instagram OAuth callback (same as before but stay in business context)
  useEffect(() => {
    const handleInstagramCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        console.error('Instagram OAuth Error:', error);
        // Clean URL and stay in business context
        window.history.replaceState({}, document.title, '/business/');
        return;
      }
      
      if (code && user && organization && businesses.length > 0 && !dashboardLoading) {
        try {
          const targetBusiness = currentBusiness || businesses[0];
          if (!targetBusiness) {
            throw new Error('No business available for Instagram connection');
          }
          
          if (!currentBusiness) {
            setCurrentBusiness(targetBusiness);
          }
          
          await processInstagramCode(code, targetBusiness.id);
          setDashboardView('business');
          
        } catch (error) {
          console.error('Error in OAuth processing:', error);
        } finally {
          // Clean URL and stay in business context
          window.history.replaceState({}, document.title, '/business/');
        }
      }
    };
    
    handleInstagramCallback();
  }, [user, organization, businesses, currentBusiness, dashboardLoading, processInstagramCode, setCurrentBusiness]);

  // Show loading while auth is initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show profile view
  if (currentView === 'profile' && user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-6 flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Dashboard
            </button>
            <UserProfile />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Show dashboard (authenticated users)
  if (user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <DashboardLayout
            currentView={dashboardView}
            onViewChange={setDashboardView}
            onDocsClick={() => window.open('/docs', '_blank')}
          >
            {dashboardView === 'organization' ? <OrganizationView /> : <BusinessView />}
          </DashboardLayout>
          
          <OrganizationModal
            isOpen={showOrganizationModal}
            onClose={() => setShowOrganizationModal(false)}
          />
        </div>
      </ProtectedRoute>
    );
  }

  // Show business dashboard with login modal (unauthenticated users)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* Business Dashboard Welcome Screen */}
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            fead.app Business Dashboard
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your business dashboard and manage your social media presence.
          </p>
        </div>
        
        <button
          onClick={() => setShowAuthModal(true)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Sign In to Dashboard
        </button>
        
        <p className="mt-6 text-sm text-muted-foreground">
          New to fead.app?{' '}
          <a 
            href="/" 
            className="text-primary hover:underline"
          >
            Learn more about our platform
          </a>
        </p>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signin"
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