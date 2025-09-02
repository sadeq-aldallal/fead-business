import { DocContent } from '@/types/documentation';
import { Info, AlertTriangle, Lightbulb } from 'lucide-react';

// This function returns content for each documentation page
export const getDocumentationContent = (pathKey: string): DocContent => {
  const contentMap: Record<string, DocContent> = {
    'overview': {
      title: 'Fead.app Documentation',
      subtitle: 'Complete guide to setting up and using AI-powered Instagram customer support',
      sections: [],
    },
    
    'requesting-demo': {
      title: 'Requesting a Demo',
      subtitle: 'Get a personalized demonstration of how Fead.app transforms Instagram customer support for your business.',
      sections: [
        {
          id: 'why-demo',
          type: 'alert',
          content: {
            variant: 'info',
            title: 'Why Request a Demo?',
            description: 'A personalized demo allows you to see exactly how our AI will handle your specific Instagram customer support needs before committing to the platform.',
            icon: Info,
          },
        },
        {
          id: 'demo-process',
          type: 'steps',
          title: 'Step-by-Step Process',
          content: {
            steps: [
              {
                number: 1,
                title: 'Access the Demo Request Form',
                description: 'Navigate to the Fead.app homepage and locate the "Request Demo" button.',
                details: [
                  'Location: Main homepage, hero section',
                  'Button Label: "Request Demo" or "Get Started"'
                ],
              },
              {
                number: 2,
                title: 'Fill Out Your Information',
                description: 'Complete the demo request form with accurate information.',
                details: [
                  'Full Name: Your complete professional name',
                  'Email Address: Business email for demo details',
                  'Company Name: Your business or organization name',
                  'Additional Information: Describe your Instagram support challenges'
                ],
              },
              {
                number: 3,
                title: 'Submit Your Request',
                description: 'Review your information and click "Send" to submit your demo request.',
                details: [
                  'You\'ll see a confirmation message once submitted successfully'
                ],
              },
            ],
          },
        },
        {
          id: 'what-happens-next',
          type: 'text',
          title: 'What Happens Next',
          content: `
            <div class="space-y-6">
              <div class="flex items-start space-x-4 p-4 border rounded-lg">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">1</div>
                <div>
                  <h4 class="font-medium">Within 4 Hours</h4>
                  <p class="text-sm text-muted-foreground">Our team reviews your request and prepares a customized demo plan.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 p-4 border rounded-lg">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">2</div>
                <div>
                  <h4 class="font-medium">Within 24 Hours</h4>
                  <p class="text-sm text-muted-foreground">You'll receive an email with available demo time slots.</p>
                </div>
              </div>
              <div class="flex items-start space-x-4 p-4 border rounded-lg">
                <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">3</div>
                <div>
                  <h4 class="font-medium">Demo Session (30-45 minutes)</h4>
                  <p class="text-sm text-muted-foreground">Live demonstration showing how our AI handles your specific scenarios.</p>
                </div>
              </div>
            </div>
          `,
        },
        {
          id: 'pro-tips',
          type: 'alert',
          content: {
            variant: 'success',
            title: 'Pro Tips for a Better Demo',
            description: 'Prepare examples of typical customer inquiries, have your Instagram business account information ready, and consider inviting team members who will use the platform.',
            icon: Lightbulb,
          },
        },
      ],
    },
    
    'creating-organization': {
      title: 'Creating Your Organization',
      subtitle: 'Set up your organization profile - the foundation for all your business operations on Fead.app.',
      sections: [
        {
          id: 'one-time-setup',
          type: 'alert',
          content: {
            variant: 'warning',
            title: 'One-Time Setup',
            description: 'Organization creation is a one-time process that establishes your account foundation. Choose your information carefully as some details may be difficult to change later.',
            icon: AlertTriangle,
          },
        },
        {
          id: 'required-information',
          type: 'text',
          title: 'Required Information',
          content: `
            <div class="space-y-6">
              <div class="p-6 border rounded-lg">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold">Organization Name</h4>
                  <span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded border">Required</span>
                </div>
                <p class="text-muted-foreground mb-4">The official name of your company or business entity. This name will appear on all communications, billing statements, and legal documents.</p>
                <div class="bg-muted p-4 rounded-lg">
                  <strong class="block mb-2">Examples:</strong>
                  <ul class="space-y-1 text-sm">
                    <li><strong>Single Business:</strong> "Metro Hair Salon"</li>
                    <li><strong>Multi-location:</strong> "ABC Restaurant Group"</li>
                    <li><strong>Agency:</strong> "Digital Marketing Solutions Inc."</li>
                  </ul>
                </div>
              </div>
              
              <div class="p-6 border rounded-lg">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold">Phone Number</h4>
                  <span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded border">Required</span>
                </div>
                <p class="text-muted-foreground mb-4">Primary business contact number used for account verification, support, and important communications.</p>
                <div class="bg-muted p-4 rounded-lg">
                  <strong class="block mb-2">Format Examples:</strong>
                  <ul class="space-y-1 text-sm">
                    <li><strong>US/Canada:</strong> +1 (555) 123-4567</li>
                    <li><strong>UK:</strong> +44 20 7123 4567</li>
                    <li><strong>International:</strong> Include country code</li>
                  </ul>
                </div>
              </div>
            </div>
          `,
        },
      ],
    },
    
    'connecting-instagram': {
      title: 'Connecting Your Instagram Account',
      subtitle: 'Integrate your Instagram Business account with Fead.app to enable AI-powered customer support automation.',
      sections: [
        {
          id: 'prerequisites',
          type: 'alert',
          content: {
            variant: 'error',
            title: 'Prerequisites Required',
            description: 'Your Instagram account must meet specific requirements before connection is possible. Review all prerequisites carefully.',
            icon: AlertTriangle,
          },
        },
        {
          id: 'requirements',
          type: 'text',
          title: 'Pre-Connection Requirements',
          content: `
            <div class="space-y-6">
              <div class="flex items-start space-x-4 p-6 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10 rounded-r-lg">
                <div class="w-6 h-6 text-green-600 flex-shrink-0 mt-1">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">Instagram Business or Creator Account</h4>
                  <p class="text-green-800 dark:text-green-200 text-sm mb-3">Your Instagram account must be converted to a Business or Creator account type. Personal accounts cannot be connected to third-party services.</p>
                  <div class="bg-white dark:bg-gray-800 p-4 rounded border">
                    <strong class="block mb-2">How to Convert:</strong>
                    <ol class="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Open Instagram app and go to your profile</li>
                      <li>Tap the menu button (three lines) in top right</li>
                      <li>Select "Settings and Privacy"</li>
                      <li>Tap "Account type and tools"</li>
                      <li>Select "Switch to professional account"</li>
                      <li>Choose "Business" or "Creator"</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start space-x-4 p-6 border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10 rounded-r-lg">
                <div class="w-6 h-6 text-green-600 flex-shrink-0 mt-1">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">Meta Business Account</h4>
                  <p class="text-green-800 dark:text-green-200 text-sm">Your Instagram Business account must be connected to a Meta (Facebook) Business Account for API access.</p>
                </div>
              </div>
            </div>
          `,
        },
      ],
    },
    
    'deleting-businesses': {
      title: 'Deleting Businesses',
      subtitle: 'Permanently remove a business from your organization. This action cannot be undone and will delete all associated data.',
      sections: [
        {
          id: 'critical-warning',
          type: 'alert',
          content: {
            variant: 'error',
            title: '⚠️ CRITICAL WARNING',
            description: 'Business deletion is permanent and irreversible. Once deleted, all data associated with this business will be permanently destroyed and cannot be recovered.',
            icon: AlertTriangle,
          },
        },
        {
          id: 'what-gets-deleted',
          type: 'text',
          title: 'What Gets Permanently Deleted',
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 border rounded-lg">
                <h4 class="font-semibold mb-3 flex items-center">
                  <span class="mr-2">🔗</span> Instagram Integration
                </h4>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li>• Instagram account connection and authorization</li>
                  <li>• Webhook configurations and message routing</li>
                  <li>• Account access tokens and permissions</li>
                </ul>
              </div>
              
              <div class="p-4 border rounded-lg">
                <h4 class="font-semibold mb-3 flex items-center">
                  <span class="mr-2">💬</span> Conversation Data
                </h4>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li>• All customer conversation histories</li>
                  <li>• Message logs and interaction records</li>
                  <li>• Customer contact information and profiles</li>
                </ul>
              </div>
              
              <div class="p-4 border rounded-lg">
                <h4 class="font-semibold mb-3 flex items-center">
                  <span class="mr-2">🤖</span> AI Training Data
                </h4>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li>• Business-specific AI model and training</li>
                  <li>• Custom response patterns and preferences</li>
                  <li>• Knowledge base entries and FAQs</li>
                </ul>
              </div>
              
              <div class="p-4 border rounded-lg">
                <h4 class="font-semibold mb-3 flex items-center">
                  <span class="mr-2">📊</span> Analytics & Reports
                </h4>
                <ul class="space-y-1 text-sm text-muted-foreground">
                  <li>• Performance metrics and statistics</li>
                  <li>• Response time and satisfaction data</li>
                  <li>• Usage reports and trend analysis</li>
                </ul>
              </div>
            </div>
          `,
        },
      ],
    },
  };

  // Add more comprehensive pages
  const additionalContent: Record<string, DocContent> = {
    'sign-up-process': {
      title: 'Sign Up Process',
      subtitle: 'Complete guide to creating your Fead.app account after your demo session.',
      sections: [
        {
          id: 'requirement-alert',
          type: 'alert',
          content: {
            variant: 'info',
            title: 'Prerequisites',
            description: 'You must complete a demo session before signing up. Check your email for the personalized sign-up link.',
            icon: Info,
          },
        },
        {
          id: 'signup-steps',
          type: 'steps',
          title: 'Account Creation Steps',
          content: {
            steps: [
              {
                number: 1,
                title: 'Access Your Sign-Up Link',
                description: 'Use the personalized link sent to your email after the demo.',
                details: [
                  'Check your inbox for "Welcome to Fead.app - Complete Setup"',
                  'Click the secure sign-up link',
                  'Link expires in 7 days'
                ],
              },
              {
                number: 2,
                title: 'Create Account Credentials',
                description: 'Set up your login credentials and basic profile.',
                details: [
                  'Use the same email from your demo request',
                  'Create a strong password (8+ characters)',
                  'Confirm password and accept terms'
                ],
              },
            ],
          },
        },
      ],
    },
    
    'what-is-organization': {
      title: 'What is an Organization?',
      subtitle: 'Understanding the organizational structure in Fead.app and how it manages your business operations.',
      sections: [
        {
          id: 'definition',
          type: 'text',
          content: `
            <div class="prose prose-gray dark:prose-invert max-w-none">
              <p class="text-lg mb-6">An <strong>Organization</strong> in Fead.app is the top-level entity that represents your company or business entity. It serves as the central hub for managing multiple businesses, users, billing, and administrative functions.</p>
              
              <h3 class="text-xl font-semibold mb-4">Key Characteristics</h3>
              <ul class="space-y-3 mb-6">
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Single Owner:</strong> Each organization has one primary owner who has full administrative control</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Multiple Businesses:</strong> Can contain multiple Instagram business accounts</span>
                </li>
                <li class="flex items-start space-x-3">
                  <div class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Billing Entity:</strong> All subscription charges are billed to the organization level</span>
                </li>
              </ul>
            </div>
          `,
        },
        {
          id: 'hierarchy-visual',
          type: 'text',
          title: 'Organization Hierarchy',
          content: `
            <div class="bg-muted/30 rounded-lg p-6 my-6">
              <div class="text-center space-y-4">
                <div class="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 max-w-sm mx-auto">
                  <strong class="text-primary">Your Organization</strong>
                  <div class="text-sm text-muted-foreground mt-1">Central management hub</div>
                </div>
                
                <div class="flex items-center justify-center">
                  <div class="h-8 w-0.5 bg-border"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <strong class="text-green-800 dark:text-green-200">Business 1</strong>
                    <div class="text-sm text-green-600 dark:text-green-300 mt-1">@instagram_account_1</div>
                  </div>
                  <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <strong class="text-green-800 dark:text-green-200">Business 2</strong>
                    <div class="text-sm text-green-600 dark:text-green-300 mt-1">@instagram_account_2</div>
                  </div>
                  <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <strong class="text-green-800 dark:text-green-200">Business 3</strong>
                    <div class="text-sm text-green-600 dark:text-green-300 mt-1">@instagram_account_3</div>
                  </div>
                </div>
              </div>
            </div>
          `,
        },
      ],
    },
    
    'what-is-business': {
      title: 'What is a Business?',
      subtitle: 'Understanding businesses in Fead.app and how they connect to your Instagram accounts.',
      sections: [
        {
          id: 'business-definition',
          type: 'text',
          content: `
            <p class="text-lg mb-6">A <strong>Business</strong> represents a single Instagram account connected to your organization. Each business has its own AI agent, customer conversations, and settings.</p>
          `,
        },
        {
          id: 'business-alert',
          type: 'alert',
          content: {
            variant: 'info',
            title: 'One Instagram Account Per Business',
            description: 'Each business in Fead.app connects to exactly one Instagram Business account. You cannot connect multiple Instagram accounts to a single business.',
            icon: Info,
          },
        },
      ],
    },
    
    'test-vs-production': {
      title: 'Test vs Production Modes',
      subtitle: 'Understanding the difference between test and production modes for your Instagram AI integration.',
      sections: [
        {
          id: 'modes-overview',
          type: 'text',
          title: 'Two Operating Modes',
          content: `
            <p class="mb-6">Fead.app operates in two distinct modes to ensure safe testing before going live with your customers:</p>
          `,
        },
        {
          id: 'test-mode-alert',
          type: 'alert',
          content: {
            variant: 'warning',
            title: 'Test Mode Protection',
            description: 'Test mode restricts AI responses to approved testers only, preventing accidental interactions with real customers during setup.',
            icon: AlertTriangle,
          },
        },
        {
          id: 'mode-comparison',
          type: 'text',
          title: 'Mode Comparison',
          content: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div class="border-2 border-orange-200 dark:border-orange-800 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
                <h4 class="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center">
                  <span class="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
                  Test Mode
                </h4>
                <ul class="space-y-3 text-orange-800 dark:text-orange-200">
                  <li class="flex items-start space-x-2">
                    <span class="text-orange-600">•</span>
                    <span>AI only responds to test users</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-orange-600">•</span>
                    <span>Safe environment for training</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-orange-600">•</span>
                    <span>Test unlimited scenarios</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-orange-600">•</span>
                    <span>No risk to real customers</span>
                  </li>
                </ul>
              </div>
              
              <div class="border-2 border-green-200 dark:border-green-800 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                <h4 class="text-xl font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                  <span class="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  Production Mode
                </h4>
                <ul class="space-y-3 text-green-800 dark:text-green-200">
                  <li class="flex items-start space-x-2">
                    <span class="text-green-600">•</span>
                    <span>AI responds to all customers</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-green-600">•</span>
                    <span>Live customer interactions</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-green-600">•</span>
                    <span>Full automation active</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <span class="text-green-600">•</span>
                    <span>Real business impact</span>
                  </li>
                </ul>
              </div>
            </div>
          `,
        },
      ],
    },
  };

  return {...contentMap, ...additionalContent}[pathKey] || {
    title: 'Page Not Found',
    subtitle: 'The documentation page you\'re looking for doesn\'t exist.',
    sections: [
      {
        id: 'not-found',
        type: 'alert',
        content: {
          variant: 'warning',
          title: 'Page Not Found',
          description: 'The documentation page you\'re looking for doesn\'t exist or has been moved.',
          icon: AlertTriangle,
        },
      },
    ],
  };
};