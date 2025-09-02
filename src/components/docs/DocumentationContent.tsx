import React from 'react';
import { CheckCircle, AlertTriangle, Info, Lightbulb, ArrowRight, ExternalLink, Copy } from 'lucide-react';

// Getting Started Content
export const RequestingDemoContent = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="doc-header">
      <h1 className="doc-title">Requesting a Demo</h1>
      <p className="doc-subtitle">
        Get a personalized demonstration of how Fead.app transforms Instagram customer support for your business.
      </p>
    </div>

    <div className="doc-image-container">
      <img 
        src="/images/docs/request_demo.png" 
        alt="Demo Request Form Interface"
        className="doc-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EZW1vIFJlcXVlc3QgRm9ybTwvdGV4dD4KPC9zdmc+';
        }}
      />
    </div>

    <div className="info-callout">
      <Info className="callout-icon text-blue-400" />
      <div>
        <h3>Why Request a Demo?</h3>
        <p>A personalized demo allows you to see exactly how our AI will handle your specific Instagram customer support needs before committing to the platform.</p>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Step-by-Step Process</h2>
      
      <div className="steps-container">
        <div className="step-item">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Access the Demo Request Form</h3>
            <p>Navigate to the Fead.app homepage and locate the "Request Demo" button. This is typically prominently displayed in the hero section or navigation menu.</p>
            <div className="step-details">
              <strong>Location:</strong> Main homepage, hero section<br/>
              <strong>Button Label:</strong> "Request Demo" or "Get Started"
            </div>
          </div>
        </div>

        <div className="step-item">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Fill Out Your Information</h3>
            <p>Complete the demo request form with accurate information to ensure we can provide the most relevant demonstration.</p>
            
            <div className="form-fields-grid">
              <div className="field-item">
                <strong>Full Name *</strong>
                <p>Your complete professional name as you'd like to be addressed during the demo.</p>
              </div>
              
              <div className="field-item">
                <strong>Email Address *</strong>
                <p>Business email address where we'll send demo details and follow-up information.</p>
              </div>
              
              <div className="field-item">
                <strong>Company Name *</strong>
                <p>Your business or organization name. This helps us understand your context.</p>
              </div>
              
              <div className="field-item">
                <strong>Additional Information</strong>
                <p>Describe your current Instagram support challenges, team size, and specific needs.</p>
                <div className="example-box">
                  <strong>Example:</strong> "We receive 200+ Instagram DMs daily about product inquiries and need to automate responses while maintaining personal touch."
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="step-item">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Submit Your Request</h3>
            <p>Review your information and click "Send" to submit your demo request.</p>
            <div className="success-indicator">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>You'll see a confirmation message once submitted successfully</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">What Happens Next</h2>
      
      <div className="timeline-container">
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h3>Within 4 Hours</h3>
            <p>Our team reviews your request and prepares a customized demo plan based on your specific needs and industry.</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h3>Within 24 Hours</h3>
            <p>You'll receive an email with available demo time slots and a brief questionnaire to maximize your demo experience.</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <h3>Demo Session (30-45 minutes)</h3>
            <p>Live demonstration showing how our AI handles your specific Instagram support scenarios, including:</p>
            <ul className="demo-features-list">
              <li>Real-time response generation</li>
              <li>Custom training for your business</li>
              <li>Integration with your Instagram account</li>
              <li>Analytics and performance tracking</li>
              <li>Team management features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="tip-callout">
      <Lightbulb className="callout-icon text-yellow-400" />
      <div>
        <h3>Pro Tips for a Better Demo</h3>
        <ul>
          <li>Prepare examples of typical customer inquiries you receive</li>
          <li>Have your Instagram business account information ready</li>
          <li>Think about your current response time and volume goals</li>
          <li>Consider inviting team members who will use the platform</li>
        </ul>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Demo Requirements</h2>
      
      <div className="requirements-grid">
        <div className="requirement-item">
          <CheckCircle className="requirement-icon text-green-400" />
          <div>
            <h3>Instagram Business Account</h3>
            <p>You must have an Instagram Business or Creator account to see full integration capabilities.</p>
          </div>
        </div>

        <div className="requirement-item">
          <CheckCircle className="requirement-icon text-green-400" />
          <div>
            <h3>Decision-Making Authority</h3>
            <p>Attendees should have authority to make platform decisions or be primary stakeholders.</p>
          </div>
        </div>

        <div className="requirement-item">
          <CheckCircle className="requirement-icon text-green-400" />
          <div>
            <h3>Stable Internet Connection</h3>
            <p>Ensure reliable internet for screen sharing and live demonstration viewing.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="next-steps-section">
      <h2 className="section-title">After the Demo</h2>
      <p>Following your demonstration, you'll receive:</p>
      <div className="benefits-list">
        <div className="benefit-item">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Custom proposal tailored to your needs</span>
        </div>
        <div className="benefit-item">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Pricing options and package details</span>
        </div>
        <div className="benefit-item">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Implementation timeline and onboarding plan</span>
        </div>
        <div className="benefit-item">
          <ArrowRight className="w-4 h-4 text-green-400" />
          <span>Access to trial account (if applicable)</span>
        </div>
      </div>
    </div>
  </div>
);

// Organization Management Content
export const CreatingOrganizationContent = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="doc-header">
      <h1 className="doc-title">Creating Your Organization</h1>
      <p className="doc-subtitle">
        Set up your organization profile - the foundation for all your business operations on Fead.app.
      </p>
    </div>

    <div className="doc-image-container">
      <img 
        src="/images/docs/create_organization.png" 
        alt="Organization Creation Form"
        className="doc-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Pcmdhbml6YXRpb24gQ3JlYXRpb24gRm9ybTwvdGV4dD4KPC9zdmc+';
        }}
      />
    </div>

    <div className="warning-callout">
      <AlertTriangle className="callout-icon text-orange-400" />
      <div>
        <h3>One-Time Setup</h3>
        <p>Organization creation is a one-time process that establishes your account foundation. Choose your information carefully as some details may be difficult to change later.</p>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Required Information</h2>
      
      <div className="form-guide">
        <div className="form-field-detailed">
          <div className="field-header">
            <h3>Organization Name *</h3>
            <span className="required-badge">Required</span>
          </div>
          <p className="field-description">
            The official name of your company or business entity. This name will appear on all communications, billing statements, and legal documents.
          </p>
          <div className="field-examples">
            <h4>Examples:</h4>
            <div className="examples-grid">
              <div className="example-item">
                <strong>Single Business:</strong> "Metro Hair Salon"
              </div>
              <div className="example-item">
                <strong>Multi-location:</strong> "ABC Restaurant Group"
              </div>
              <div className="example-item">
                <strong>Agency:</strong> "Digital Marketing Solutions Inc."
              </div>
              <div className="example-item">
                <strong>Franchise:</strong> "QuickFit Gyms Corporate"
              </div>
            </div>
          </div>
          <div className="field-tips">
            <strong>Best Practices:</strong>
            <ul>
              <li>Use your official registered business name</li>
              <li>Avoid abbreviations unless officially registered</li>
              <li>Include legal entity type (LLC, Inc., etc.) if applicable</li>
              <li>Ensure spelling matches your business registration</li>
            </ul>
          </div>
        </div>

        <div className="form-field-detailed">
          <div className="field-header">
            <h3>Phone Number *</h3>
            <span className="required-badge">Required</span>
          </div>
          <p className="field-description">
            Primary business contact number used for account verification, support, and important communications.
          </p>
          <div className="field-format">
            <h4>Format Requirements:</h4>
            <div className="format-examples">
              <div className="format-item">
                <strong>US/Canada:</strong> +1 (555) 123-4567
              </div>
              <div className="format-item">
                <strong>UK:</strong> +44 20 7123 4567
              </div>
              <div className="format-item">
                <strong>UAE:</strong> +971 4 123 4567
              </div>
              <div className="format-item">
                <strong>International:</strong> Include country code
              </div>
            </div>
          </div>
          <div className="field-tips">
            <strong>Important Notes:</strong>
            <ul>
              <li>Use a business line, not personal mobile if possible</li>
              <li>Ensure number can receive SMS for verification</li>
              <li>This number is used for account recovery</li>
              <li>Keep this number active throughout your subscription</li>
            </ul>
          </div>
        </div>

        <div className="form-field-detailed">
          <div className="field-header">
            <h3>Email Address</h3>
            <span className="auto-filled-badge">Auto-filled</span>
          </div>
          <p className="field-description">
            Organization contact email, pre-populated with your account registration email. You can modify this if needed.
          </p>
          <div className="field-options">
            <h4>When to Change:</h4>
            <ul>
              <li>You want to use a dedicated business email</li>
              <li>The current email is personal, not business</li>
              <li>You need a shared email for team access</li>
              <li>Your organization has a specific admin email</li>
            </ul>
          </div>
          <div className="field-tips">
            <strong>Recommendations:</strong>
            <ul>
              <li>Use a monitored business email address</li>
              <li>Avoid personal emails for professional accounts</li>
              <li>Consider emails like admin@, support@, or team@</li>
              <li>Ensure email will remain accessible long-term</li>
            </ul>
          </div>
        </div>

        <div className="form-field-detailed">
          <div className="field-header">
            <h3>Country *</h3>
            <span className="required-badge">Required</span>
          </div>
          <p className="field-description">
            Your organization's primary legal jurisdiction. This affects billing currency, tax calculations, compliance requirements, and available features.
          </p>
          <div className="country-impact">
            <h4>What This Affects:</h4>
            <div className="impact-grid">
              <div className="impact-item">
                <strong>🏦 Billing & Tax</strong>
                <p>Currency, tax rates, and compliance with local tax laws</p>
              </div>
              <div className="impact-item">
                <strong>📋 Legal Compliance</strong>
                <p>GDPR, CCPA, and other regional privacy regulations</p>
              </div>
              <div className="impact-item">
                <strong>🌐 Features</strong>
                <p>Region-specific features and integrations</p>
              </div>
              <div className="impact-item">
                <strong>🕒 Support Hours</strong>
                <p>Customer support availability and response times</p>
              </div>
            </div>
          </div>
          <div className="country-search">
            <h4>Search Functionality:</h4>
            <p>The country dropdown is searchable with 169+ countries available. You can search by:</p>
            <ul>
              <li>Country name (e.g., "United States")</li>
              <li>Country code (e.g., "US")</li>
              <li>Partial names (e.g., "United" will show United States, UAE, UK)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Organization Setup Process</h2>
      
      <div className="setup-steps">
        <div className="setup-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Access Organization Creation</h3>
            <p>After signing up and logging in, you'll be automatically prompted to create your organization if one doesn't exist.</p>
            <div className="step-note">
              <strong>Note:</strong> This modal appears automatically and cannot be dismissed until an organization is created.
            </div>
          </div>
        </div>

        <div className="setup-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Fill Required Fields</h3>
            <p>Complete all required fields marked with asterisks (*). The form will validate each field as you type.</p>
            <div className="validation-info">
              <strong>Real-time Validation:</strong>
              <ul>
                <li>Organization name: Minimum 2 characters</li>
                <li>Phone: Valid international format</li>
                <li>Email: Valid email format</li>
                <li>Country: Must select from dropdown</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="setup-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Review and Submit</h3>
            <p>Double-check all information before clicking "Create Organization". Some details may require contacting support to change.</p>
            <div className="review-checklist">
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <span>Organization name is spelled correctly</span>
              </div>
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <span>Phone number includes country code</span>
              </div>
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <span>Email address is monitored</span>
              </div>
              <div className="checklist-item">
                <input type="checkbox" disabled />
                <span>Country selection is correct</span>
              </div>
            </div>
          </div>
        </div>

        <div className="setup-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Organization Created</h3>
            <p>Upon successful creation, you'll be redirected to your dashboard where you can begin creating businesses.</p>
            <div className="success-features">
              <strong>What's Available Next:</strong>
              <ul>
                <li>Create your first business</li>
                <li>Invite team members</li>
                <li>Configure organization settings</li>
                <li>Set up billing information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Common Use Cases</h2>
      
      <div className="use-cases-grid">
        <div className="use-case-card">
          <h3>Single Business Owner</h3>
          <div className="use-case-example">
            <strong>Example:</strong> Local restaurant owner<br/>
            <strong>Organization Name:</strong> "Mario's Pizzeria LLC"<br/>
            <strong>Structure:</strong> One organization → One business → One Instagram
          </div>
          <div className="use-case-benefits">
            <strong>Benefits:</strong>
            <ul>
              <li>Simple setup and management</li>
              <li>Direct billing and communication</li>
              <li>Focused analytics and reporting</li>
            </ul>
          </div>
        </div>

        <div className="use-case-card">
          <h3>Multi-location Business</h3>
          <div className="use-case-example">
            <strong>Example:</strong> Fitness chain<br/>
            <strong>Organization Name:</strong> "FitZone Gyms Corporate"<br/>
            <strong>Structure:</strong> One organization → Multiple businesses → Multiple Instagrams
          </div>
          <div className="use-case-benefits">
            <strong>Benefits:</strong>
            <ul>
              <li>Centralized billing and management</li>
              <li>Individual location analytics</li>
              <li>Consistent brand messaging</li>
            </ul>
          </div>
        </div>

        <div className="use-case-card">
          <h3>Agency Management</h3>
          <div className="use-case-example">
            <strong>Example:</strong> Digital marketing agency<br/>
            <strong>Organization Name:</strong> "Digital Solutions Inc."<br/>
            <strong>Structure:</strong> One organization → Client businesses → Client Instagrams
          </div>
          <div className="use-case-benefits">
            <strong>Benefits:</strong>
            <ul>
              <li>Manage multiple client accounts</li>
              <li>Separate billing per client</li>
              <li>White-label capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="troubleshooting-section">
      <h2 className="section-title">Troubleshooting</h2>
      
      <div className="faq-container">
        <div className="faq-item">
          <h3>Organization name already exists</h3>
          <p>Organization names must be unique across the platform. Try adding your location, business type, or legal entity designation.</p>
          <div className="solution">
            <strong>Solutions:</strong>
            <ul>
              <li>Add location: "Mario's Pizzeria NYC"</li>
              <li>Add type: "Mario's Pizzeria Restaurant"</li>
              <li>Add entity: "Mario's Pizzeria LLC"</li>
            </ul>
          </div>
        </div>

        <div className="faq-item">
          <h3>Phone number not accepted</h3>
          <p>Ensure you're including the correct country code and using a valid format.</p>
          <div className="solution">
            <strong>Common Issues:</strong>
            <ul>
              <li>Missing country code (add +1, +44, etc.)</li>
              <li>Invalid format (use international format)</li>
              <li>VoIP numbers may not work for verification</li>
            </ul>
          </div>
        </div>

        <div className="faq-item">
          <h3>Country not appearing in search</h3>
          <p>Try different search terms or check the spelling. All UN-recognized countries are included.</p>
          <div className="solution">
            <strong>Search Tips:</strong>
            <ul>
              <li>Use official country names</li>
              <li>Try alternative names (e.g., "USA" vs "United States")</li>
              <li>Check for special characters or spelling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Business Management Content  
export const CreatingBusinessContent = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="doc-header">
      <h1 className="doc-title">Creating a Business</h1>
      <p className="doc-subtitle">
        Add individual business units to your organization, each representing a unique Instagram account and customer support operation.
      </p>
    </div>

    <div className="doc-image-container">
      <img 
        src="/images/docs/create_business.png" 
        alt="Business Creation Form"
        className="doc-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CdXNpbmVzcyBDcmVhdGlvbiBGb3JtPC90ZXh0Pgo8L3N2Zz4=';
        }}
      />
    </div>

    <div className="info-callout">
      <Info className="callout-icon text-blue-400" />
      <div>
        <h3>Business vs Organization</h3>
        <p>While your Organization is the parent entity, each Business represents a specific Instagram account with its own AI training, analytics, and customer interactions.</p>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Business Creation Form</h2>
      
      <div className="form-guide">
        <div className="form-field-detailed">
          <div className="field-header">
            <h3>Business Name *</h3>
            <span className="required-badge">Required</span>
          </div>
          <p className="field-description">
            A descriptive name that identifies this specific business unit within your organization. This name appears in your dashboard and helps you manage multiple businesses.
          </p>
          <div className="field-examples">
            <h4>Naming Examples by Organization Type:</h4>
            <div className="examples-grid">
              <div className="example-category">
                <strong>Multi-location Restaurant:</strong>
                <ul>
                  <li>"Downtown Location"</li>
                  <li>"Mall Branch"</li>
                  <li>"Airport Terminal"</li>
                </ul>
              </div>
              <div className="example-category">
                <strong>Fitness Chain:</strong>
                <ul>
                  <li>"FitZone Manhattan"</li>
                  <li>"FitZone Brooklyn"</li>
                  <li>"FitZone Queens"</li>
                </ul>
              </div>
              <div className="example-category">
                <strong>Agency Client Management:</strong>
                <ul>
                  <li>"Client: Fashion Boutique"</li>
                  <li>"Client: Local Cafe"</li>
                  <li>"Client: Tech Startup"</li>
                </ul>
              </div>
              <div className="example-category">
                <strong>Brand Variants:</strong>
                <ul>
                  <li>"Premium Collection"</li>
                  <li>"Budget Line"</li>
                  <li>"Seasonal Store"</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="field-tips">
            <strong>Best Practices:</strong>
            <ul>
              <li>Use descriptive names that clearly identify the business</li>
              <li>Include location for multi-location businesses</li>
              <li>Keep names concise but meaningful</li>
              <li>Avoid generic names like "Business 1" or "Main"</li>
              <li>Consider how the name will appear in reports and dashboards</li>
            </ul>
          </div>
        </div>

        <div className="form-field-detailed">
          <div className="field-header">
            <h3>Business Type *</h3>
            <span className="required-badge">Required</span>
          </div>
          <p className="field-description">
            Select the business type that best describes your operation. This choice affects how the AI is trained and what types of responses it generates.
          </p>
          
          <div className="business-types-detailed">
            <div className="business-type-card service-type">
              <div className="type-header">
                <h4>Service Business</h4>
                <span className="type-badge service">Service-Based</span>
              </div>
              <p className="type-description">
                Businesses that provide services, consultations, or appointment-based offerings.
              </p>
              
              <div className="type-details">
                <div className="detail-section">
                  <strong>Best For:</strong>
                  <ul>
                    <li>Hair salons and barbershops</li>
                    <li>Fitness trainers and gyms</li>
                    <li>Consultants and coaches</li>
                    <li>Repair services</li>
                    <li>Educational services</li>
                    <li>Healthcare providers</li>
                    <li>Equipment rental</li>
                    <li>Professional services</li>
                  </ul>
                </div>

                <div className="detail-section">
                  <strong>AI Training Focus:</strong>
                  <ul>
                    <li>Appointment booking and scheduling</li>
                    <li>Service descriptions and pricing</li>
                    <li>Availability and time slots</li>
                    <li>Consultation inquiries</li>
                    <li>Service area and locations</li>
                    <li>Staff qualifications</li>
                  </ul>
                </div>

                <div className="detail-section">
                  <strong>Common Customer Questions:</strong>
                  <div className="question-examples">
                    <div className="question-item">
                      <strong>Q:</strong> "What are your hours?"
                    </div>
                    <div className="question-item">
                      <strong>Q:</strong> "Can I book an appointment for tomorrow?"
                    </div>
                    <div className="question-item">
                      <strong>Q:</strong> "What services do you offer?"
                    </div>
                    <div className="question-item">
                      <strong>Q:</strong> "How much does a consultation cost?"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="business-type-card retail-type">
              <div className="type-header">
                <h4>Retail Business</h4>
                <span className="type-badge retail">Product-Based</span>
              </div>
              <p className="type-description">
                Businesses that sell physical or digital products to customers.
              </p>
              
              <div className="type-details">
                <div className="detail-section">
                  <strong>Best For:</strong>
                  <ul>
                    <li>Clothing and fashion stores</li>
                    <li>Restaurants and food businesses</li>
                    <li>Electronics and gadgets</li>
                    <li>Beauty and cosmetics</li>
                    <li>Home and garden supplies</li>
                    <li>Bookstores and media</li>
                    <li>Online marketplaces</li>
                    <li>Specialty retailers</li>
                  </ul>
                </div>

                <div className="detail-section">
                  <strong>AI Training Focus:</strong>
                  <ul>
                    <li>Product information and specifications</li>
                    <li>Inventory and stock availability</li>
                    <li>Order processing and tracking</li>
                    <li>Shipping and delivery details</li>
                    <li>Returns and exchanges</li>
                    <li>Product recommendations</li>
                  </ul>
                </div>

                <div className="detail-section">
                  <strong>Common Customer Questions:</strong>
                  <div className="question-examples">
                    <div className="question-item">
                      <strong>Q:</strong> "Do you have this in size medium?"
                    </div>
                    <div className="question-item">
                      <strong>Q:</strong> "When will my order arrive?"
                    </div>
                    <div className="question-item">
                      <strong>Q:</strong> "What's your return policy?"
                    </div>
                    <div className="question-item">
                      <strong>Q:</strong> "Can you recommend something similar?"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Business Creation Process</h2>
      
      <div className="creation-steps">
        <div className="creation-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Access Business Creation</h3>
            <p>From your organization dashboard, click the "Add Business" button. This opens the business creation modal.</p>
            <div className="access-methods">
              <strong>Ways to Access:</strong>
              <ul>
                <li>Click "Add Business" button on empty organization dashboard</li>
                <li>Use "+" button in business list view</li>
                <li>Access through organization management menu</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="creation-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Enter Business Information</h3>
            <p>Fill in the business name and select the appropriate business type from the dropdown.</p>
            <div className="form-validation">
              <strong>Validation Rules:</strong>
              <ul>
                <li>Business name: 2-100 characters</li>
                <li>No duplicate names within same organization</li>
                <li>Business type must be selected</li>
                <li>Special characters allowed in names</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="creation-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Review Business Type Selection</h3>
            <p>The business type dropdown shows detailed descriptions. Make sure you select the type that best matches your operation.</p>
            <div className="selection-tips">
              <strong>Selection Guidelines:</strong>
              <ul>
                <li>Consider your primary customer interactions</li>
                <li>Think about what customers typically ask</li>
                <li>Choose based on main business model</li>
                <li>Type can be changed later if needed</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="creation-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Create Business</h3>
            <p>Click "Create Business" to finalize the setup. The business will appear in your dashboard immediately.</p>
            <div className="post-creation">
              <strong>After Creation:</strong>
              <ul>
                <li>Business appears in your dashboard</li>
                <li>Ready for Instagram connection</li>
                <li>Default settings applied based on type</li>
                <li>Analytics tracking begins</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Understanding Business Architecture</h2>
      
      <div className="architecture-diagram">
        <h3>Organization Structure</h3>
        <div className="structure-visual">
          <div className="org-level">
            <div className="org-box">
              <strong>Organization</strong>
              <span>ABC Company</span>
            </div>
          </div>
          <div className="business-level">
            <div className="business-box">
              <strong>Business 1</strong>
              <span>Downtown Store</span>
              <div className="instagram-connection">@abc_downtown</div>
            </div>
            <div className="business-box">
              <strong>Business 2</strong>
              <span>Mall Location</span>
              <div className="instagram-connection">@abc_mall</div>
            </div>
            <div className="business-box">
              <strong>Business 3</strong>
              <span>Online Shop</span>
              <div className="instagram-connection">@abc_online</div>
            </div>
          </div>
        </div>
      </div>

      <div className="architecture-benefits">
        <h3>Benefits of This Structure</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <strong>Separate AI Training</strong>
            <p>Each business has its own AI model trained on location-specific data and customer interactions.</p>
          </div>
          <div className="benefit-item">
            <strong>Individual Analytics</strong>
            <p>Track performance metrics separately for each business unit or location.</p>
          </div>
          <div className="benefit-item">
            <strong>Centralized Management</strong>
            <p>Manage all businesses from one organization dashboard with unified billing.</p>
          </div>
          <div className="benefit-item">
            <strong>Scalable Growth</strong>
            <p>Add new businesses as you expand without affecting existing operations.</p>
          </div>
        </div>
      </div>
    </div>

    <div className="next-steps-section">
      <h2 className="section-title">Next Steps After Business Creation</h2>
      
      <div className="next-steps-flow">
        <div className="next-step-item">
          <div className="step-icon">1</div>
          <div className="step-content">
            <h3>Connect Instagram Account</h3>
            <p>Link your business Instagram account to enable AI customer support.</p>
            <a href="#connecting-instagram" className="step-link">
              Learn how to connect Instagram <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="next-step-item">
          <div className="step-icon">2</div>
          <div className="step-content">
            <h3>Configure Business Settings</h3>
            <p>Set up response preferences, test mode, and AI training parameters.</p>
            <a href="#business-settings" className="step-link">
              Configure settings <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="next-step-item">
          <div className="step-icon">3</div>
          <div className="step-content">
            <h3>Train Your AI</h3>
            <p>Provide business-specific information to improve AI response accuracy.</p>
            <a href="#ai-training" className="step-link">
              Start AI training <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="next-step-item">
          <div className="step-icon">4</div>
          <div className="step-content">
            <h3>Go Live</h3>
            <p>Switch from test mode to production and start handling real customer inquiries.</p>
            <a href="#production-mode" className="step-link">
              Switch to production <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Instagram Integration Content
export const ConnectingInstagramContent = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="doc-header">
      <h1 className="doc-title">Connecting Your Instagram Account</h1>
      <p className="doc-subtitle">
        Integrate your Instagram Business account with Fead.app to enable AI-powered customer support automation.
      </p>
    </div>

    <div className="doc-image-container">
      <img 
        src="/images/docs/connect_instagram.png" 
        alt="Instagram Connection Interface"
        className="doc-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbnN0YWdyYW0gQ29ubmVjdGlvbiBJbnRlcmZhY2U8L3RleHQ+Cjwvc3ZnPg==';
        }}
      />
    </div>

    <div className="warning-callout">
      <AlertTriangle className="callout-icon text-red-400" />
      <div>
        <h3>Prerequisites Required</h3>
        <p>Your Instagram account must meet specific requirements before connection is possible. Review all prerequisites carefully.</p>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Pre-Connection Requirements</h2>
      
      <div className="requirements-checklist">
        <div className="requirement-item critical">
          <div className="requirement-status">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="requirement-content">
            <h3>Instagram Business or Creator Account</h3>
            <p className="requirement-description">
              Your Instagram account must be converted to a Business or Creator account type. Personal accounts cannot be connected to third-party services.
            </p>
            <div className="requirement-details">
              <h4>How to Convert to Business Account:</h4>
              <ol>
                <li>Open Instagram app and go to your profile</li>
                <li>Tap the menu button (three lines) in top right</li>
                <li>Select "Settings and Privacy"</li>
                <li>Tap "Account type and tools"</li>
                <li>Select "Switch to professional account"</li>
                <li>Choose "Business" or "Creator"</li>
                <li>Follow the setup prompts</li>
              </ol>
            </div>
            <div className="requirement-verification">
              <strong>How to Verify:</strong>
              <p>Your profile should show business contact options (email, phone, address) and you should see "Professional Dashboard" in your settings.</p>
            </div>
          </div>
        </div>

        <div className="requirement-item critical">
          <div className="requirement-status">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="requirement-content">
            <h3>Meta Business Account</h3>
            <p className="requirement-description">
              Your Instagram Business account must be connected to a Meta (Facebook) Business Account for API access.
            </p>
            <div className="requirement-details">
              <h4>Setting Up Meta Business Account:</h4>
              <ol>
                <li>Visit business.facebook.com</li>
                <li>Create a Business Account if you don't have one</li>
                <li>Connect your Instagram Business account</li>
                <li>Verify your business information</li>
                <li>Accept Meta's terms of service</li>
              </ol>
            </div>
            <div className="requirement-note">
              <strong>Note:</strong> You don't need an active Facebook page, just a Meta Business Account.
            </div>
          </div>
        </div>

        <div className="requirement-item important">
          <div className="requirement-status">
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </div>
          <div className="requirement-content">
            <h3>Account in Good Standing</h3>
            <p className="requirement-description">
              Your Instagram account must be active, not restricted, and in compliance with Instagram's community guidelines.
            </p>
            <div className="requirement-details">
              <h4>Account Health Checklist:</h4>
              <ul>
                <li>No recent violations or restrictions</li>
                <li>Account is not disabled or suspended</li>
                <li>Regular posting activity (not dormant)</li>
                <li>Follows Instagram's terms of service</li>
                <li>No pending appeals or issues</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="requirement-item recommended">
          <div className="requirement-status">
            <CheckCircle className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="requirement-content">
            <h3>Admin Access Permissions</h3>
            <p className="requirement-description">
              Ensure you have full admin access to the Instagram account and associated Meta Business Account.
            </p>
            <div className="requirement-details">
              <h4>Required Permissions:</h4>
              <ul>
                <li>Instagram account admin rights</li>
                <li>Meta Business Account admin access</li>
                <li>Ability to authorize third-party applications</li>
                <li>Permission to manage Instagram messaging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Connection Process</h2>
      
      <div className="connection-steps">
        <div className="connection-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Initiate Connection</h3>
            <p>From your business dashboard, locate the business you want to connect and click the "Connect Instagram" button.</p>
            <div className="step-locations">
              <strong>Where to Find Connect Button:</strong>
              <ul>
                <li>Business card on organization dashboard</li>
                <li>Business management panel</li>
                <li>Business settings page</li>
              </ul>
            </div>
            <div className="step-visual">
              <div className="business-card-preview">
                <div className="card-header">Business Name</div>
                <div className="card-status">Status: Not Connected</div>
                <div className="card-button">Connect Instagram</div>
              </div>
            </div>
          </div>
        </div>

        <div className="connection-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Review Requirements</h3>
            <p>A modal will appear showing the connection requirements. Review and confirm that your account meets all prerequisites.</p>
            <div className="requirements-modal-preview">
              <div className="modal-header">Connect Instagram Account</div>
              <div className="modal-content">
                <div className="requirement-check">
                  <input type="checkbox" disabled />
                  <span>Professional Account Required</span>
                </div>
                <div className="requirement-check">
                  <input type="checkbox" disabled />
                  <span>Legal Compliance Acceptance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="connection-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Meta OAuth Authentication</h3>
            <p>Click "Connect Instagram Account" to be redirected to Meta's secure authentication page.</p>
            <div className="oauth-process">
              <strong>What Happens:</strong>
              <ol>
                <li>Redirect to Meta's secure login page</li>
                <li>Log in with your Meta account credentials</li>
                <li>Review requested permissions</li>
                <li>Authorize Fead.app access</li>
                <li>Return to Fead.app dashboard</li>
              </ol>
            </div>
            <div className="security-note">
              <strong>Security:</strong> Authentication uses Meta's secure OAuth 2.0 protocol. Fead.app never sees your password.
            </div>
          </div>
        </div>

        <div className="connection-step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Permission Authorization</h3>
            <p>Meta will show you the permissions Fead.app is requesting. Review and approve these permissions.</p>
            <div className="permissions-list">
              <strong>Requested Permissions:</strong>
              <div className="permission-item">
                <strong>Basic Account Info:</strong> Access to account name, username, and profile picture
              </div>
              <div className="permission-item">
                <strong>Instagram Messaging:</strong> Read and respond to direct messages
              </div>
              <div className="permission-item">
                <strong>Page Management:</strong> Manage Instagram Business account on your behalf
              </div>
              <div className="permission-item">
                <strong>Webhooks:</strong> Receive real-time notifications of new messages
              </div>
            </div>
          </div>
        </div>

        <div className="connection-step">
          <div className="step-number">5</div>
          <div className="step-content">
            <h3>Connection Confirmation</h3>
            <p>After successful authorization, you'll return to Fead.app where the connection will be finalized.</p>
            <div className="connection-success">
              <div className="success-indicator">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <span>Instagram Connected Successfully</span>
              </div>
              <div className="connected-info">
                <strong>Account:</strong> @yourbusiness<br/>
                <strong>Status:</strong> Connected<br/>
                <strong>Mode:</strong> Test Mode (Default)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Connection Status Indicators</h2>
      
      <div className="status-indicators">
        <div className="status-item connected">
          <div className="status-dot green"></div>
          <div className="status-content">
            <h3>Connected</h3>
            <p>Instagram account is successfully connected and operational. AI can receive and respond to messages.</p>
            <div className="status-actions">
              <strong>Available Actions:</strong> Manage settings, view analytics, disconnect
            </div>
          </div>
        </div>

        <div className="status-item connecting">
          <div className="status-dot yellow"></div>
          <div className="status-content">
            <h3>Connecting</h3>
            <p>Connection process is in progress. This typically takes 10-30 seconds to complete.</p>
            <div className="status-actions">
              <strong>What to Do:</strong> Wait for process to complete, do not refresh page
            </div>
          </div>
        </div>

        <div className="status-item error">
          <div className="status-dot red"></div>
          <div className="status-content">
            <h3>Connection Error</h3>
            <p>Connection failed due to an issue. Check error message and try again.</p>
            <div className="status-actions">
              <strong>Common Solutions:</strong> Verify account requirements, check permissions, contact support
            </div>
          </div>
        </div>

        <div className="status-item setup">
          <div className="status-dot gray"></div>
          <div className="status-content">
            <h3>Setup Required</h3>
            <p>Instagram account not yet connected. Click "Connect Instagram" to begin setup.</p>
            <div className="status-actions">
              <strong>Next Step:</strong> Click Connect Instagram button
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Troubleshooting Connection Issues</h2>
      
      <div className="troubleshooting-guide">
        <div className="issue-category">
          <h3>Authentication Problems</h3>
          <div className="issue-item">
            <h4>"Account not authorized" error</h4>
            <div class="issue-solution">
              <strong>Cause:</strong> Meta account doesn't have admin access to Instagram account.<br/>
              <strong>Solution:</strong> Ensure the Meta account you're logging in with is the owner/admin of the Instagram Business account.
            </div>
          </div>
          
          <div class="issue-item">
            <h4>"Personal account detected" error</h4>
            <div class="issue-solution">
              <strong>Cause:</strong> Trying to connect a personal Instagram account.<br/>
              <strong>Solution:</strong> Convert to Business or Creator account first, then retry connection.
            </div>
          </div>
        </div>

        <div class="issue-category">
          <h3>Permission Issues</h3>
          <div class="issue-item">
            <h4>"Insufficient permissions" error</h4>
            <div class="issue-solution">
              <strong>Cause:</strong> Required permissions were denied during authorization.<br/>
              <strong>Solution:</strong> Disconnect and reconnect, ensuring all permissions are granted.
            </div>
          </div>
        </div>

        <div class="issue-category">
          <h3>Account Restrictions</h3>
          <div class="issue-item">
            <h4>"Account restricted" error</h4>
            <div class="issue-solution">
              <strong>Cause:</strong> Instagram account has violations or restrictions.<br/>
              <strong>Solution:</strong> Resolve any account issues with Instagram before connecting.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-section">
      <h2 class="section-title">After Successful Connection</h2>
      
      <div class="post-connection-steps">
        <div class="post-step">
          <h3>1. Verify Connection</h3>
          <p>Confirm your Instagram account shows as "Connected" in the business dashboard.</p>
        </div>
        
        <div class="post-step">
          <h3>2. Configure Settings</h3>
          <p>Access business management to configure AI responses, test mode, and other preferences.</p>
        </div>
        
        <div class="post-step">
          <h3>3. Test Functionality</h3>
          <p>Send a test message to your Instagram account to verify AI responses are working.</p>
        </div>
        
        <div class="post-step">
          <h3>4. Train Your AI</h3>
          <p>Provide business-specific information to improve response accuracy and relevance.</p>
        </div>
      </div>
    </div>
  </div>
);

// Account Management Content
export const DeletingBusinessContent = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="doc-header">
      <h1 className="doc-title">Deleting Businesses</h1>
      <p className="doc-subtitle">
        Permanently remove a business from your organization. This action cannot be undone and will delete all associated data.
      </p>
    </div>

    <div className="doc-image-container">
      <img 
        src="/images/docs/delete_business.png" 
        alt="Business Deletion Process"
        className="doc-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMUYyOTM3Ii8+CjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9Ijc4MCIgaGVpZ2h0PSI0MzAiIHN0cm9rZT0iIzM3NEE1OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiLz4KPHR5cGUgZmlsbD0iIzZCNzI4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIHg9IjQwMCIgeT0iMjI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CdXNpbmVzcyBEZWxldGlvbiBQcm9jZXNzPC90ZXh0Pgo8L3N2Zz4=';
        }}
      />
    </div>

    <div className="danger-callout">
      <AlertTriangle className="callout-icon text-red-400" />
      <div>
        <h3>⚠️ CRITICAL WARNING</h3>
        <p><strong>Business deletion is permanent and irreversible.</strong> Once deleted, all data associated with this business will be permanently destroyed and cannot be recovered.</p>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">What Gets Permanently Deleted</h2>
      
      <div className="deletion-items">
        <div className="deletion-category">
          <h3>🔗 Instagram Integration</h3>
          <ul>
            <li>Instagram account connection and authorization</li>
            <li>Webhook configurations and message routing</li>
            <li>Account access tokens and permissions</li>
            <li>Integration history and connection logs</li>
          </ul>
        </div>

        <div className="deletion-category">
          <h3>💬 Conversation Data</h3>
          <ul>
            <li>All customer conversation histories</li>
            <li>Message logs and interaction records</li>
            <li>Customer contact information and profiles</li>
            <li>Response templates and saved replies</li>
          </ul>
        </div>

        <div className="deletion-category">
          <h3>🤖 AI Training Data</h3>
          <ul>
            <li>Business-specific AI model and training</li>
            <li>Custom response patterns and preferences</li>
            <li>Knowledge base entries and FAQs</li>
            <li>Machine learning optimization data</li>
          </ul>
        </div>

        <div className="deletion-category">
          <h3>📊 Analytics & Reports</h3>
          <ul>
            <li>Performance metrics and statistics</li>
            <li>Response time and satisfaction data</li>
            <li>Usage reports and trend analysis</li>
            <li>Historical performance comparisons</li>
          </ul>
        </div>

        <div className="deletion-category">
          <h3>⚙️ Configuration Settings</h3>
          <ul>
            <li>Business preferences and customizations</li>
            <li>Test mode configurations and user lists</li>
            <li>Notification and alert settings</li>
            <li>Team access and permission settings</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Before You Delete: Important Considerations</h2>
      
      <div className="pre-deletion-checklist">
        <div className="consideration-item critical">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <div>
            <h3>Data Export</h3>
            <p><strong>Recommended:</strong> Export any important data before deletion.</p>
            <div className="export-options">
              <h4>What You Can Export:</h4>
              <ul>
                <li>Conversation transcripts and customer interactions</li>
                <li>Performance analytics and reports</li>
                <li>Custom response templates and knowledge base</li>
                <li>Customer contact information and profiles</li>
              </ul>
            </div>
            <div className="export-process">
              <strong>How to Export:</strong>
              <ol>
                <li>Access Business Management → Reports</li>
                <li>Select data range and export type</li>
                <li>Download CSV or PDF reports</li>
                <li>Save files to secure location</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="consideration-item important">
          <Info className="w-6 h-6 text-blue-400" />
          <div>
            <h3>Team Notification</h3>
            <p>Inform team members about the pending deletion to prevent disruption.</p>
            <div className="notification-checklist">
              <ul>
                <li>Notify team members with business access</li>
                <li>Update any external documentation or procedures</li>
                <li>Inform customers about potential service changes</li>
                <li>Plan alternative customer support methods</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="consideration-item moderate">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <div>
            <h3>Alternative: Disconnect Instead of Delete</h3>
            <p>Consider disconnecting Instagram instead of full business deletion.</p>
            <div className="disconnect-benefits">
              <h4>Benefits of Disconnecting:</h4>
              <ul>
                <li>Preserves all historical data and analytics</li>
                <li>Maintains AI training and customizations</li>
                <li>Allows easy reconnection in the future</li>
                <li>Keeps business structure intact</li>
              </ul>
            </div>
            <div className="disconnect-process">
              <strong>How to Disconnect:</strong>
              <p>Business Management → Instagram Settings → Disconnect Account</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Step-by-Step Deletion Process</h2>
      
      <div className="deletion-process">
        <div className="deletion-step">
          <div className="step-number danger">1</div>
          <div className="step-content">
            <h3>Access Business Management</h3>
            <p>Navigate to the business you want to delete and open its management panel.</p>
            <div className="access-methods">
              <strong>Ways to Access:</strong>
              <ul>
                <li>Click settings icon on business card</li>
                <li>Use "Manage" button from business list</li>
                <li>Access via organization dashboard menu</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="deletion-step">
          <div className="step-number danger">2</div>
          <div className="step-content">
            <h3>Locate the Dangerous Zone</h3>
            <p>Scroll down to the bottom of the business management page to find the "Dangerous Zone" section.</p>
            <div className="dangerous-zone-preview">
              <div className="zone-header">⚠️ Dangerous Zone</div>
              <div className="zone-content">
                <div className="danger-item">Delete Business</div>
                <p>Once you delete this business, it will be permanently removed...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deletion-step">
          <div className="step-number danger">3</div>
          <div className="step-content">
            <h3>Initiate Deletion</h3>
            <p>Click the "Delete Business" button to begin the deletion process.</p>
            <div className="first-warning">
              <strong>First Confirmation:</strong>
              <p>A confirmation dialog will appear explaining the consequences of deletion.</p>
            </div>
          </div>
        </div>

        <div className="deletion-step">
          <div className="step-number danger">4</div>
          <div className="step-content">
            <h3>Type Business Name for Confirmation</h3>
            <p>To prevent accidental deletions, you must type the exact business name to confirm.</p>
            <div className="confirmation-example">
              <div className="confirmation-modal">
                <h4>⚠️ Permanently Delete Business</h4>
                <p>This will permanently delete <strong>"Downtown Store"</strong> and all associated data.</p>
                <div className="confirmation-input">
                  <label>Type "Downtown Store" to confirm deletion</label>
                  <input type="text" placeholder="Downtown Store" disabled />
                </div>
              </div>
            </div>
            <div className="typing-requirements">
              <strong>Requirements:</strong>
              <ul>
                <li>Must match exact business name including capitalization</li>
                <li>Include all spaces and special characters</li>
                <li>No extra spaces before or after</li>
                <li>Delete button only becomes active when name matches</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="deletion-step">
          <div className="step-number danger">5</div>
          <div className="step-content">
            <h3>Final Deletion Confirmation</h3>
            <p>Click "Delete Forever" to permanently remove the business and all its data.</p>
            <div className="final-warning">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <strong>Last Chance:</strong>
                <p>This is your final opportunity to cancel. Once you click "Delete Forever", the process cannot be reversed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="deletion-step">
          <div className="step-number success">6</div>
          <div className="step-content">
            <h3>Deletion Complete</h3>
            <p>The business has been permanently deleted and removed from your organization.</p>
            <div className="completion-notice">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <strong>Deletion Successful</strong>
                <p>Business and all associated data have been permanently removed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">After Deletion</h2>
      
      <div className="post-deletion-info">
        <div className="immediate-effects">
          <h3>Immediate Effects</h3>
          <ul>
            <li>Business disappears from your dashboard</li>
            <li>Instagram connection is severed</li>
            <li>AI stops responding to messages</li>
            <li>All associated data becomes inaccessible</li>
          </ul>
        </div>

        <div className="billing-impact">
          <h3>Billing Impact</h3>
          <ul>
            <li>Business is removed from next billing cycle</li>
            <li>Pro-rated credits may apply (contact support)</li>
            <li>Usage stops immediately</li>
            <li>Historical billing records remain available</li>
          </ul>
        </div>

        <div className="recovery-options">
          <h3>Recovery Options</h3>
          <p><strong>None Available:</strong> Business deletion is permanent with no recovery options.</p>
          <div className="no-recovery">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span>No backup, restore, or recovery features available</span>
          </div>
        </div>
      </div>
    </div>

    <div className="doc-section">
      <h2 className="section-title">Frequently Asked Questions</h2>
      
      <div className="faq-container">
        <div className="faq-item">
          <h3>Can I recover a deleted business?</h3>
          <p><strong>No.</strong> Business deletion is permanent and irreversible. There are no recovery options available.</p>
        </div>

        <div className="faq-item">
          <h3>What happens to my Instagram account?</h3>
          <p>Your Instagram account remains unchanged. Only the connection to Fead.app is removed. You can reconnect the same Instagram account to a new business if needed.</p>
        </div>

        <div className="faq-item">
          <h3>Will I be refunded for unused time?</h3>
          <p>Contact our support team regarding pro-rated refunds for unused subscription time. Refund policies vary by subscription type.</p>
        </div>

        <div className="faq-item">
          <h3>Can I delete multiple businesses at once?</h3>
          <p>No, businesses must be deleted individually. Each deletion requires its own confirmation process.</p>
        </div>

        <div className="faq-item">
          <h3>What if I accidentally delete the wrong business?</h3>
          <p>Unfortunately, there's no way to recover an accidentally deleted business. Always double-check the business name during confirmation.</p>
        </div>

        <div className="faq-item">
          <h3>How long does deletion take?</h3>
          <p>Business deletion is immediate. The business and all data are permanently removed within seconds of confirmation.</p>
        </div>
      </div>
    </div>

    <div className="alternatives-section">
      <h2 className="section-title">Safer Alternatives to Deletion</h2>
      
      <div className="alternatives-grid">
        <div className="alternative-option">
          <h3>🔗 Disconnect Instagram</h3>
          <p>Remove Instagram connection while preserving all data and settings.</p>
          <div className="option-benefits">
            <strong>Benefits:</strong>
            <ul>
              <li>Preserves all historical data</li>
              <li>Maintains AI training</li>
              <li>Easy to reconnect later</li>
              <li>No permanent data loss</li>
            </ul>
          </div>
        </div>

        <div className="alternative-option">
          <h3>⏸️ Pause/Deactivate</h3>
          <p>Temporarily disable the business without losing data.</p>
          <div className="option-benefits">
            <strong>Benefits:</strong>
            <ul>
              <li>Stops billing charges</li>
              <li>Preserves all data</li>
              <li>Can reactivate anytime</li>
              <li>Maintains business structure</li>
            </ul>
          </div>
        </div>

        <div className="alternative-option">
          <h3>📁 Archive Business</h3>
          <p>Move business to archived state for long-term storage.</p>
          <div className="option-benefits">
            <strong>Benefits:</strong>
            <ul>
              <li>Removes from active dashboard</li>
              <li>Preserves all data for compliance</li>
              <li>Lower or no ongoing costs</li>
              <li>Can restore if needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DocumentationNotFound = () => (
  <div className="max-w-2xl mx-auto text-center space-y-6 py-16">
    <div className="text-6xl text-gray-400 mb-4">📖</div>
    <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
    <p className="text-gray-400">
      The documentation page you're looking for doesn't exist or has been moved.
    </p>
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
    >
      <ArrowRight className="w-4 h-4 rotate-180" />
      <span>Go Back</span>
    </button>
  </div>
);