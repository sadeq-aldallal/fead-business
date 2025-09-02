import React, { useState, useEffect } from 'react';
import {
  Home,
  FileText,
  Users,
  Building2,
  Instagram,
  Settings,
  Info,
} from 'lucide-react';
import { DocumentationLayout } from './DocumentationLayout';
import { DocumentationContent } from './DocumentationContent';
import { DocSection, DocContent } from '@/types/documentation';
import { getDocumentationContent } from '../data/documentationData';

interface EnhancedDocumentationPageProps {
  onGetStartedClick?: () => void;
  onSignupClick?: () => void;
  onDashboardClick?: () => void;
  onProfileClick?: () => void;
  onHomeClick?: () => void;
  onDocsClick?: () => void;
}

export const EnhancedDocumentationPage: React.FC<EnhancedDocumentationPageProps> = ({
  onGetStartedClick,
  onSignupClick,
  onDashboardClick,
  onProfileClick,
  onHomeClick,
  onDocsClick,
}) => {
  const [currentPath, setCurrentPath] = useState('/docs');

  // Get current path from URL hash
  const getCurrentPath = () => {
    const hash = window.location.hash.replace('#', '');
    return hash ? `/docs/${hash}` : '/docs';
  };

  // Update path when URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(getCurrentPath());
    };

    setCurrentPath(getCurrentPath());
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    if (path === '/docs') {
      window.location.hash = '';
      setCurrentPath('/docs');
    } else {
      const hash = path.replace('/docs/', '');
      window.location.hash = hash;
      setCurrentPath(path);
    }
  };

  // Define documentation structure
  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Home,
      subsections: [
        {
          id: 'requesting-demo',
          title: 'Requesting a Demo',
          path: '/docs/requesting-demo',
        },
        {
          id: 'sign-up-process',
          title: 'Sign Up Process',
          path: '/docs/sign-up-process',
        },
      ],
    },
    {
      id: 'core-concepts',
      title: 'Understanding Core Concepts',
      icon: FileText,
      subsections: [
        {
          id: 'what-is-organization',
          title: 'What is an Organization?',
          path: '/docs/what-is-organization',
        },
        {
          id: 'what-is-business',
          title: 'What is a Business?',
          path: '/docs/what-is-business',
        },
      ],
    },
    {
      id: 'organization-management',
      title: 'Organization Management',
      icon: Users,
      subsections: [
        {
          id: 'creating-organization',
          title: 'Creating Your Organization',
          path: '/docs/creating-organization',
        },
      ],
    },
    {
      id: 'business-management',
      title: 'Business Management',
      icon: Building2,
      subsections: [
        {
          id: 'creating-business',
          title: 'Creating a Business',
          path: '/docs/creating-business',
        },
        {
          id: 'business-types',
          title: 'Business Types Explained',
          path: '/docs/business-types',
        },
        {
          id: 'managing-business',
          title: 'Managing Business Settings',
          path: '/docs/managing-business',
        },
      ],
    },
    {
      id: 'instagram-integration',
      title: 'Instagram Integration',
      icon: Instagram,
      subsections: [
        {
          id: 'connecting-instagram',
          title: 'Connecting Instagram Account',
          path: '/docs/connecting-instagram',
        },
        {
          id: 'test-vs-production',
          title: 'Test vs Production Modes',
          path: '/docs/test-vs-production',
        },
        {
          id: 'managing-test-users',
          title: 'Managing Test Users',
          path: '/docs/managing-test-users',
        },
      ],
    },
    {
      id: 'account-management',
      title: 'Account Management',
      icon: Settings,
      subsections: [
        {
          id: 'user-settings',
          title: 'User Profile Settings',
          path: '/docs/user-settings',
        },
        {
          id: 'deleting-businesses',
          title: 'Deleting Businesses',
          path: '/docs/deleting-businesses',
        },
        {
          id: 'account-deletion',
          title: 'Complete Account Deletion',
          path: '/docs/account-deletion',
        },
      ],
    },
  ];

  // Get content for current path
  const getCurrentContent = (): DocContent => {
    const pathKey = currentPath.replace('/docs/', '').replace('/docs', 'overview');
    return getDocumentationContent(pathKey);
  };

  // Overview content for the main documentation page
  const overviewContent: DocContent = {
    title: 'Fead.app Documentation',
    subtitle: 'Complete guide to setting up and using AI-powered Instagram customer support',
    sections: [
      {
        id: 'overview-intro',
        type: 'text',
        content: `
          <p class="text-lg text-muted-foreground mb-6">
            Welcome to the Fead.app documentation. Here you'll find everything you need to set up and manage your AI-powered Instagram customer support system.
          </p>
        `,
      },
      {
        id: 'overview-alert',
        type: 'alert',
        content: {
          variant: 'info',
          title: 'New to Fead.app?',
          description: 'Start with requesting a demo to see how our AI can transform your Instagram customer support experience.',
          icon: Info,
        },
      },
      {
        id: 'getting-started-cards',
        type: 'text',
        content: `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div class="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div class="mb-4">
                <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Getting Started</h3>
                <p class="text-sm text-muted-foreground mb-4">Learn how to request a demo, sign up, and create your first organization.</p>
              </div>
            </div>
            
            <div class="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div class="mb-4">
                <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Core Concepts</h3>
                <p class="text-sm text-muted-foreground mb-4">Understand organizations, businesses, and how they work together.</p>
              </div>
            </div>
            
            <div class="p-6 border rounded-lg hover:shadow-md transition-shadow">
              <div class="mb-4">
                <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold mb-2">Organization Management</h3>
                <p class="text-sm text-muted-foreground mb-4">Set up and manage your organization profile and settings.</p>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: 'popular-pages',
        type: 'text',
        content: `
          <h2 class="text-2xl font-bold mt-12 mb-6">Popular Pages</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="#requesting-demo" class="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span>Requesting a Demo</span>
            </a>
            <a href="#creating-organization" class="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span>Creating Your Organization</span>
            </a>
            <a href="#creating-business" class="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span>Creating a Business</span>
            </a>
            <a href="#connecting-instagram" class="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted transition-colors">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span>Connecting Instagram</span>
            </a>
          </div>
        `,
      },
      {
        id: 'help-section',
        type: 'text',
        content: `
          <h2 class="text-2xl font-bold mt-12 mb-6">Need More Help?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 border rounded-lg">
              <h3 class="font-semibold mb-2">📧 Email Support</h3>
              <p class="text-sm text-muted-foreground">Get help from our support team for technical issues and questions.</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h3 class="font-semibold mb-2">💬 Live Chat</h3>
              <p class="text-sm text-muted-foreground">Available during business hours for immediate assistance.</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h3 class="font-semibold mb-2">🎥 Video Tutorials</h3>
              <p class="text-sm text-muted-foreground">Watch step-by-step video guides for common tasks.</p>
            </div>
          </div>
        `,
      },
    ],
  };

  const content = currentPath === '/docs' ? overviewContent : getCurrentContent();

  return (
    <DocumentationLayout
      sections={sections}
      currentPath={currentPath}
      onNavigate={handleNavigate}
    >
      <DocumentationContent
        content={content}
        currentPath={currentPath}
      />
    </DocumentationLayout>
  );
};