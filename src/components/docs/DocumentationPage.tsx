import React, { useState, useEffect } from 'react';
import { Search, Home, ChevronRight, ChevronDown, ArrowRight, FileText, Users, Building2, Instagram, Settings, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '../layout/Navigation';
import { 
  RequestingDemoContent, 
  CreatingOrganizationContent, 
  CreatingBusinessContent,
  ConnectingInstagramContent,
  DeletingBusinessContent,
  DocumentationNotFound 
} from './DocumentationContent';

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  subsections: DocSubsection[];
}

interface DocSubsection {
  id: string;
  title: string;
  component: React.ComponentType;
  path: string;
}

interface DocumentationPageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onDashboardClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onDocsClick?: () => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({
  onLoginClick,
  onSignupClick,
  onDashboardClick,
  onProfileClick,
  onHomeClick,
  onDocsClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'getting-started': true,
    'core-concepts': false,
    'organization-management': false,
    'business-management': false,
    'instagram-integration': false,
    'account-management': false
  });

  // Get current path from URL
  const getCurrentPath = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'overview';
  };

  const [currentPath, setCurrentPath] = useState(getCurrentPath);

  // Update path when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(getCurrentPath());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const navigateToPage = (path: string, sectionId?: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    
    // Auto-expand the section containing this page
    if (sectionId) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionId]: true
      }));
    }
  };

  const copyCurrentUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}#${currentPath}`;
    navigator.clipboard.writeText(url);
  };

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Home,
      subsections: [
        {
          id: 'requesting-demo',
          title: 'Requesting a Demo',
          component: RequestingDemoContent,
          path: 'requesting-demo'
        },
        {
          id: 'sign-up-process',
          title: 'Sign Up Process',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">Sign Up Process</h1>
                <p className="doc-subtitle">Create your Fead.app account and get started with AI-powered Instagram customer support.</p>
              </div>
              <div className="doc-image-container">
                <img 
                  src="/images/docs/sign_up_process.png" 
                  alt="Account Registration"
                  className="doc-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BY2NvdW50IFJlZ2lzdHJhdGlvbjwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
              <div className="prose-docs">
                <p>After your demo or if you're ready to get started immediately, you can create your account.</p>
                <h3>Authentication options:</h3>
                <ul>
                  <li>Sign up with email and password</li>
                  <li>Continue with Google (recommended for faster setup)</li>
                </ul>
                <h3>Next Steps:</h3>
                <p>After successful registration, you'll be guided to create your first organization.</p>
              </div>
            </div>
          ),
          path: 'sign-up-process'
        }
      ]
    },
    {
      id: 'core-concepts',
      title: 'Understanding Core Concepts',
      icon: FileText,
      subsections: [
        {
          id: 'what-is-organization',
          title: 'What is an Organization?',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">What is an Organization?</h1>
                <p className="doc-subtitle">Understanding the top-level entity structure in Fead.app</p>
              </div>
              <div className="doc-image-container">
                <img 
                  src="/images/docs/organization_concept.png" 
                  alt="Organization Structure"
                  className="doc-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Pcmdhbml6YXRpb24gU3RydWN0dXJlPC90ZXh0Pgo8L3N2Zz4=';
                  }}
                />
              </div>
              <div className="info-callout">
                <div className="callout-content">
                  <h3>Key Definition</h3>
                  <p>An <strong>Organization</strong> is your top-level entity in Fead.app - think of it as your company or main business entity that contains all your individual businesses.</p>
                </div>
              </div>
              {/* Add more comprehensive content here */}
            </div>
          ),
          path: 'what-is-organization'
        },
        {
          id: 'what-is-business',
          title: 'What is a Business?',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">What is a Business?</h1>
                <p className="doc-subtitle">Understanding individual business units within your organization</p>
              </div>
              <div className="doc-image-container">
                <img 
                  src="/images/docs/business_concept.png" 
                  alt="Business Structure"
                  className="doc-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CdXNpbmVzcyBTdHJ1Y3R1cmU8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
              </div>
              <div className="info-callout">
                <div className="callout-content">
                  <h3>Key Definition</h3>
                  <p>A <strong>Business</strong> represents an individual location, brand, or distinct business unit within your organization that has its own Instagram account.</p>
                </div>
              </div>
              {/* Add more comprehensive content here */}
            </div>
          ),
          path: 'what-is-business'
        }
      ]
    },
    {
      id: 'organization-management',
      title: 'Organization Management',
      icon: Users,
      subsections: [
        {
          id: 'creating-organization',
          title: 'Creating Your Organization',
          component: CreatingOrganizationContent,
          path: 'creating-organization'
        }
      ]
    },
    {
      id: 'business-management',
      title: 'Business Management',
      icon: Building2,
      subsections: [
        {
          id: 'creating-business',
          title: 'Creating a Business',
          component: CreatingBusinessContent,
          path: 'creating-business'
        },
        {
          id: 'business-types',
          title: 'Business Types Explained',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">Business Types Explained</h1>
                <p className="doc-subtitle">Understanding the difference between Service and Retail business types</p>
              </div>
              {/* Add business types content */}
            </div>
          ),
          path: 'business-types'
        },
        {
          id: 'managing-business',
          title: 'Managing Business Settings',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">Managing Business Settings</h1>
                <p className="doc-subtitle">Configure and customize your business settings for optimal performance</p>
              </div>
              {/* Add business management content */}
            </div>
          ),
          path: 'managing-business'
        }
      ]
    },
    {
      id: 'instagram-integration',
      title: 'Instagram Integration',
      icon: Instagram,
      subsections: [
        {
          id: 'connecting-instagram',
          title: 'Connecting Instagram Account',
          component: ConnectingInstagramContent,
          path: 'connecting-instagram'
        },
        {
          id: 'test-vs-production',
          title: 'Test vs Production Modes',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">Test vs Production Modes</h1>
                <p className="doc-subtitle">Understanding the difference between test and production environments</p>
              </div>
              {/* Add test vs production content */}
            </div>
          ),
          path: 'test-vs-production'
        },
        {
          id: 'managing-test-users',
          title: 'Managing Test Users',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">Managing Test Users</h1>
                <p className="doc-subtitle">Add and manage Instagram accounts for testing your AI responses</p>
              </div>
              {/* Add test users content */}
            </div>
          ),
          path: 'managing-test-users'
        }
      ]
    },
    {
      id: 'account-management',
      title: 'Account Management',
      icon: Settings,
      subsections: [
        {
          id: 'user-settings',
          title: 'User Profile Settings',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">User Profile Settings</h1>
                <p className="doc-subtitle">Manage your personal profile and account preferences</p>
              </div>
              {/* Add user settings content */}
            </div>
          ),
          path: 'user-settings'
        },
        {
          id: 'deleting-businesses',
          title: 'Deleting Businesses',
          component: DeletingBusinessContent,
          path: 'deleting-businesses'
        },
        {
          id: 'account-deletion',
          title: 'Complete Account Deletion',
          component: () => (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="doc-header">
                <h1 className="doc-title">Complete Account Deletion</h1>
                <p className="doc-subtitle">Permanently remove your entire Fead.app account and all associated data</p>
              </div>
              {/* Add account deletion content */}
            </div>
          ),
          path: 'account-deletion'
        }
      ]
    }
  ];

  // Find current page component
  const getCurrentPageComponent = () => {
    for (const section of sections) {
      const subsection = section.subsections.find(sub => sub.path === currentPath);
      if (subsection) {
        return { Component: subsection.component, section: section.id, title: subsection.title };
      }
    }
    
    if (currentPath === 'overview') {
      return { Component: OverviewPage, section: null, title: 'Documentation Overview' };
    }
    
    return { Component: DocumentationNotFound, section: null, title: 'Page Not Found' };
  };

  const currentPageInfo = getCurrentPageComponent();
  const CurrentComponent = currentPageInfo.Component;

  const filteredSections = sections.filter(section => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = section.title.toLowerCase().includes(query);
    const subsectionMatch = section.subsections.some(subsection => 
      subsection.title.toLowerCase().includes(query)
    );
    
    return titleMatch || subsectionMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
        onDashboardClick={onDashboardClick}
        onProfileClick={onProfileClick}
        onHomeClick={onHomeClick}
        onDocsClick={onDocsClick}
        currentPage="docs"
      />
      
      {/* Documentation Header */}
      <header className="sticky top-16 z-30 glass-nav border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <FileText className="w-5 h-5 text-green-400" />
              <h1 className="text-lg font-bold text-foreground">Documentation</h1>
              {currentPageInfo.title && (
                <div className="hidden md:flex items-center space-x-2 text-muted-foreground">
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-sm">{currentPageInfo.title}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={copyCurrentUrl}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                title="Copy page URL"
              >
                <Copy className="w-4 h-4" />
                <span>Copy URL</span>
              </button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-32">
              <nav className="space-y-2">
                {/* Overview Link */}
                <button
                  onClick={() => navigateToPage('overview')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                    currentPath === 'overview'
                      ? 'bg-green-600/20 text-green-400'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Home size={18} />
                  <span className="font-medium">Overview</span>
                </button>

                {/* Section Navigation */}
                {filteredSections.map((section) => (
                  <div key={section.id} className="space-y-1">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors duration-200 ${
                        currentPageInfo.section === section.id
                          ? 'bg-green-600/20 text-green-400'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <section.icon size={18} />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      {expandedSections[section.id] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    
                    {expandedSections[section.id] && section.subsections && (
                      <div className="ml-6 space-y-1">
                        {section.subsections.map((subsection) => (
                          <button
                            key={subsection.id}
                            onClick={() => navigateToPage(subsection.path, section.id)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              currentPath === subsection.path
                                ? 'bg-green-600/10 text-green-400 border-l-2 border-green-400'
                                : 'text-muted-foreground/70 hover:bg-muted hover:text-muted-foreground'
                            }`}
                          >
                            {subsection.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="glass-card rounded-lg min-h-[600px]">
              <div className="p-8">
                <CurrentComponent />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// Overview Page Component
const OverviewPage: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="doc-header text-center">
      <h1 className="text-4xl font-bold text-foreground mb-4">Fead.app Documentation</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Complete guide to setting up and using AI-powered Instagram customer support
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="doc-overview-card">
        <div className="card-icon">
          <Home className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="card-title">Getting Started</h3>
        <p className="card-description">
          Learn how to request a demo, sign up, and create your first organization.
        </p>
        <div className="card-links">
          <a href="#requesting-demo" className="card-link">
            Requesting a Demo <ExternalLink className="w-4 h-4" />
          </a>
          <a href="#sign-up-process" className="card-link">
            Sign Up Process <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="doc-overview-card">
        <div className="card-icon">
          <FileText className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="card-title">Core Concepts</h3>
        <p className="card-description">
          Understand organizations, businesses, and how they work together.
        </p>
        <div className="card-links">
          <a href="#what-is-organization" className="card-link">
            What is an Organization? <ExternalLink className="w-4 h-4" />
          </a>
          <a href="#what-is-business" className="card-link">
            What is a Business? <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="doc-overview-card">
        <div className="card-icon">
          <Users className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="card-title">Organization Management</h3>
        <p className="card-description">
          Set up and manage your organization profile and settings.
        </p>
        <div className="card-links">
          <a href="#creating-organization" className="card-link">
            Creating Organization <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="doc-overview-card">
        <div className="card-icon">
          <Building2 className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="card-title">Business Management</h3>
        <p className="card-description">
          Create and manage individual business units and their settings.
        </p>
        <div className="card-links">
          <a href="#creating-business" className="card-link">
            Creating a Business <ExternalLink className="w-4 h-4" />
          </a>
          <a href="#business-types" className="card-link">
            Business Types <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="doc-overview-card">
        <div className="card-icon">
          <Instagram className="w-8 h-8 text-pink-400" />
        </div>
        <h3 className="card-title">Instagram Integration</h3>
        <p className="card-description">
          Connect your Instagram accounts and configure AI responses.
        </p>
        <div className="card-links">
          <a href="#connecting-instagram" className="card-link">
            Connecting Instagram <ExternalLink className="w-4 h-4" />
          </a>
          <a href="#test-vs-production" className="card-link">
            Test vs Production <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="doc-overview-card">
        <div className="card-icon">
          <Settings className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="card-title">Account Management</h3>
        <p className="card-description">
          Manage your profile, businesses, and account settings.
        </p>
        <div className="card-links">
          <a href="#user-settings" className="card-link">
            User Settings <ExternalLink className="w-4 h-4" />
          </a>
          <a href="#deleting-businesses" className="card-link">
            Deleting Businesses <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>

    <div className="popular-pages">
      <h2 className="section-title">Popular Pages</h2>
      <div className="popular-links">
        <a href="#requesting-demo" className="popular-link">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Requesting a Demo</span>
        </a>
        <a href="#creating-organization" className="popular-link">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Creating Your Organization</span>
        </a>
        <a href="#creating-business" className="popular-link">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Creating a Business</span>
        </a>
        <a href="#connecting-instagram" className="popular-link">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Connecting Instagram</span>
        </a>
      </div>
    </div>

    <div className="help-section">
      <h2 className="section-title">Need More Help?</h2>
      <div className="help-grid">
        <div className="help-item">
          <h3>📧 Email Support</h3>
          <p>Get help from our support team for technical issues and questions.</p>
        </div>
        <div className="help-item">
          <h3>💬 Live Chat</h3>
          <p>Available during business hours for immediate assistance.</p>
        </div>
        <div className="help-item">
          <h3>🎥 Video Tutorials</h3>
          <p>Watch step-by-step video guides for common tasks.</p>
        </div>
      </div>
    </div>
  </div>
);