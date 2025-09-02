import { format } from 'date-fns';

export interface CompanyInfo {
  name: string;
  chamberNumber: string;
  ceoName: string;
  country: string;
  registeredAddress: string;
  contactEmail: string;
  privacyEmail: string;
  dpoEmail: string;
  legalEmail: string;
}

export interface LegalDocumentTemplate {
  title: string;
  lastUpdated: string;
  content: string;
  version: string;
}

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'fead.app',
  chamberNumber: '97935557',
  ceoName: 'Sadeq Al-Dallal',
  country: 'Netherlands',
  registeredAddress: 'Amsterdam, Netherlands',
  contactEmail: 'support@fead.app',
  privacyEmail: 'privacy@fead.app',
  dpoEmail: 'dpo@fead.app',
  legalEmail: 'legal@fead.app',
};

export class LegalTemplateEngine {
  private companyInfo: CompanyInfo;

  constructor(companyInfo: CompanyInfo = DEFAULT_COMPANY_INFO) {
    this.companyInfo = companyInfo;
  }

  private replaceVariables(template: string): string {
    return template
      .replace(/\{\{COMPANY_NAME\}\}/g, this.companyInfo.name)
      .replace(/\{\{CHAMBER_NUMBER\}\}/g, this.companyInfo.chamberNumber)
      .replace(/\{\{CEO_NAME\}\}/g, this.companyInfo.ceoName)
      .replace(/\{\{COUNTRY\}\}/g, this.companyInfo.country)
      .replace(/\{\{REGISTERED_ADDRESS\}\}/g, this.companyInfo.registeredAddress)
      .replace(/\{\{CONTACT_EMAIL\}\}/g, this.companyInfo.contactEmail)
      .replace(/\{\{PRIVACY_EMAIL\}\}/g, this.companyInfo.privacyEmail)
      .replace(/\{\{DPO_EMAIL\}\}/g, this.companyInfo.dpoEmail)
      .replace(/\{\{LEGAL_EMAIL\}\}/g, this.companyInfo.legalEmail)
      .replace(/\{\{CURRENT_DATE\}\}/g, format(new Date(), 'MMMM dd, yyyy'))
      .replace(/\{\{CURRENT_YEAR\}\}/g, format(new Date(), 'yyyy'));
  }

  generatePrivacyPolicy(): LegalDocumentTemplate {
    const template = `
**Company Information** 
{{COMPANY_NAME}} is a company registered in {{COUNTRY}} ({{CURRENT_YEAR}}) with Chamber of Commerce number {{CHAMBER_NUMBER}}, operated under the leadership of CEO {{CEO_NAME}}.

**Data Collection and Processing**
At {{COMPANY_NAME}}, we collect and process personal data necessary for providing our AI-powered Instagram customer support automation services. This includes:

- Account information (email, username, organization details)
- Instagram Business Account data through official API integrations
- Customer conversation data for AI analysis and automated responses
- Usage analytics and performance metrics

**International Data Transfers**
As a {{COUNTRY}}-based company serving international customers, we ensure all data transfers comply with GDPR requirements through Standard Contractual Clauses (SCCs) and adequate protection measures.

**Data Subject Rights**
Under GDPR and applicable privacy laws, you have the right to:
- Access your personal data
- Rectify inaccurate information  
- Request data deletion
- Data portability
- Restrict processing
- Object to automated decision-making

**AI Data Processing Standards**
Our AI systems process data according to strict ethical guidelines:
- Data minimization: Only necessary data is processed
- Purpose limitation: Data used solely for customer support automation
- Accuracy: Continuous monitoring ensures AI response quality
- Human oversight: Qualified personnel review AI operations

**Meta/Instagram Integration Compliance**
Our platform complies with Meta's Developer Policies, Instagram Platform Policy requirements, and Instagram's Terms of Service. We process Instagram data only for approved customer support purposes, adhere to Meta's data use policies, and maintain proper disclosure when AI agents interact with customers.

**Data Security**
We implement enterprise-grade security measures:
- TLS 1.3 encryption for data transmission
- AES-256 encryption for data at rest
- Multi-factor authentication
- Regular security audits
- Automated threat detection

**Data Retention and Deletion**
- Conversation data: Retained for up to 2 years, then securely deleted
- Account data: Retained until deletion is requested
- Analytics data: Anonymized within 30 days
- Complete account deletion is irreversible and removes all personal data

**Contact Information**
For privacy inquiries: {{PRIVACY_EMAIL}}
Data Protection Officer: {{DPO_EMAIL}}
General support: {{CONTACT_EMAIL}}

**Updates to This Policy**
We may update this policy to reflect service changes or legal requirements. Material changes will be communicated via email and account notifications.
    `;

    return {
      title: 'Privacy Policy',
      lastUpdated: format(new Date(), 'yyyy-MM-dd'),
      content: this.replaceVariables(template.trim()),
      version: '1.0.0',
    };
  }

  generateTermsOfService(): LegalDocumentTemplate {
    const template = `
**Service Provider Information**
{{COMPANY_NAME}}, registered in {{COUNTRY}} (Chamber of Commerce: {{CHAMBER_NUMBER}}), CEO: {{CEO_NAME}}, provides AI-powered Instagram customer support automation services.

**Service Description**
Our platform offers:
- AI-powered automated customer support for Instagram Business Account holders
- Natural language processing and response generation
- 24/7 customer interaction management
- Analytics and performance reporting
- Multi-language support capabilities

**AI Agent Disclosure Requirements**
In compliance with Meta's policies and ethical AI standards:
- All automated responses clearly identify as AI-generated
- Customers can request human agent escalation within 24 hours
- AI interactions maintain conversation context and quality standards
- Transparency is maintained about automated vs. human responses

**Meta/Instagram Compliance**
Our services comply with:
- Instagram Community Guidelines and Terms of Use
- Meta Developer Policies for Business API usage  
- Tech Provider requirements for business data access
- Data use policies for social media integration

**SaaS Subscription Terms**
- Services provided on subscription basis with various tiers
- Automatic renewal unless cancelled before renewal date
- Usage limits apply based on subscription level
- Billing cycles and payment terms as specified in account

**Account Responsibilities**
Users must:
- Provide accurate account and business information
- Maintain secure credentials and authentication
- Comply with Instagram and Meta terms of service
- Use services only for legitimate customer support purposes
- Not engage in spam, fraud, or unauthorized activities

**Service Availability**
While we strive for high availability:
- Service level targets outlined in subscription agreement
- Scheduled maintenance may cause temporary interruptions
- Third-party dependencies may affect service availability
- Service credits provided for significant disruptions

**Intellectual Property**
- {{COMPANY_NAME}} retains ownership of platform technology and AI models
- Users retain ownership of their content and business data
- Limited license granted for service use only
- Feedback and suggestions may be used for improvements

**Data Protection and Privacy**
Comprehensive data protection measures include:
- GDPR compliance for EU customer data
- Secure data processing and storage
- User rights for data access, rectification, and deletion
- Privacy by design in all service operations

**Account Termination**
- Users may cancel subscriptions at any time
- Data export opportunities provided upon termination
- Violations may result in service suspension
- Data deletion follows our privacy policy requirements

**Limitation of Liability**
Services provided "as is" with limitations on liability for:
- Third-party service dependencies
- Data processing delays or interruptions
- Customer business decisions based on AI recommendations
- Force majeure events beyond our control

**Dispute Resolution**
- Governed by {{COUNTRY}} law
- Initial resolution through customer support
- Binding arbitration for unresolved disputes
- Legal proceedings in appropriate {{COUNTRY}} courts

**Contact Information**
Legal matters: {{LEGAL_EMAIL}}
General support: {{CONTACT_EMAIL}}
Business address: {{REGISTERED_ADDRESS}}

**Updates and Modifications**
Terms may be updated to reflect:
- Service improvements and new features
- Legal and regulatory changes
- Policy clarifications and improvements
- Material changes require user notification and acceptance
    `;

    return {
      title: 'Terms of Service',
      lastUpdated: format(new Date(), 'yyyy-MM-dd'),
      content: this.replaceVariables(template.trim()),
      version: '1.0.0',
    };
  }

  generateCookiePolicy(): LegalDocumentTemplate {
    const template = `
**About This Cookie Policy**
{{COMPANY_NAME}}, a company registered in {{COUNTRY}} (Chamber of Commerce: {{CHAMBER_NUMBER}}), uses cookies and similar technologies to provide, improve, and secure our AI-powered Instagram customer support automation platform.

**What Are Cookies**
Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, analyze site usage, and provide personalized experiences.

**Types of Cookies We Use**

**Essential Cookies** (Always Active)
- Authentication and security cookies
- Session management for logged-in users
- Load balancing and performance optimization
- Security tokens and CSRF protection

**Analytics Cookies** (Optional)
- Website usage statistics and performance metrics
- User interaction tracking for service improvements
- Error logging and debugging information
- A/B testing for feature optimization

**Preference Cookies** (Optional)
- Language and region settings
- Theme and display preferences
- Dashboard customizations
- Notification preferences

**Marketing Cookies** (Optional)
- Service usage insights for product improvements
- Feature adoption tracking
- User engagement metrics
- Conversion tracking for business optimization

**Cookie Management**
You can control cookie preferences through:
- Browser settings for global cookie management
- Our cookie consent banner on first visit
- Account privacy settings for logged-in users
- Opt-out options for non-essential cookies

**Third-Party Cookies**
We may use cookies from trusted partners:
- Analytics providers for usage insights
- Security services for fraud protection
- Performance monitoring services
- Customer support tools

**Cookie Retention**
- Session cookies: Deleted when browser closes
- Persistent cookies: Retained based on type and purpose
- Essential cookies: Retained as long as necessary for service
- Analytics cookies: Typically retained for 12-24 months

**Data Protection**
Cookie data is processed according to:
- Our Privacy Policy requirements
- GDPR and applicable privacy laws
- Industry security standards
- Minimal data collection principles

**Updates to Cookie Policy**
We may update this policy to reflect:
- Changes in cookie usage
- New regulatory requirements
- Service improvements
- Technology updates

**Contact Information**
Cookie-related questions: {{PRIVACY_EMAIL}}
General privacy inquiries: {{DPO_EMAIL}}
Technical support: {{CONTACT_EMAIL}}
Company CEO: {{CEO_NAME}}
    `;

    return {
      title: 'Cookie Policy',
      lastUpdated: format(new Date(), 'yyyy-MM-dd'),
      content: this.replaceVariables(template.trim()),
      version: '1.0.0',
    };
  }

  generateDataProcessingAgreement(): LegalDocumentTemplate {
    const template = `
**Data Processing Agreement (DPA)**
This agreement governs data processing activities between {{COMPANY_NAME}} and enterprise customers regarding AI-powered customer support services.

**Parties and Roles**
- Data Controller: Customer organization using {{COMPANY_NAME}} services
- Data Processor: {{COMPANY_NAME}} (Chamber: {{CHAMBER_NUMBER}}, {{COUNTRY}})
- Data Protection Officer: {{DPO_EMAIL}}

**Scope of Processing**
Processing activities include:
- Instagram customer conversation analysis
- AI-powered response generation
- Customer support automation
- Performance analytics and reporting
- Service improvement and optimization

**Categories of Personal Data**
- Customer identifiers (Instagram usernames, message IDs)
- Conversation content and context
- Interaction timestamps and metadata
- Business communication preferences
- Support request classifications

**Data Subject Categories**
- End customers contacting businesses via Instagram
- Business account holders and authorized users
- Instagram users engaging with automated support

**Processing Purposes**
- Automated customer support delivery
- AI model training and improvement
- Service quality monitoring
- Analytics and business intelligence
- Regulatory compliance and audit

**Security Measures**
Technical safeguards:
- End-to-end encryption for data transmission
- AES-256 encryption for data storage
- Multi-factor authentication systems
- Regular security audits and testing
- Automated threat detection and response

Organizational measures:
- Staff training on data protection
- Access controls and authorization systems
- Incident response procedures
- Regular privacy impact assessments
- Compliance monitoring and reporting

**International Data Transfers**
When transferring data outside the EEA:
- Standard Contractual Clauses (SCCs) implementation
- Adequacy decision reliance where applicable
- Additional safeguards for high-risk transfers
- Transfer impact assessments as required

**Data Subject Rights**
Support for data subject requests:
- Access requests within 30 days
- Rectification of inaccurate data
- Erasure requests ("right to be forgotten")
- Data portability in standard formats
- Processing restriction where applicable
- Objection to automated decision-making

**Sub-Processing**
Authorized sub-processors:
- Cloud infrastructure providers
- AI/ML service providers
- Security and monitoring services
- Analytics and reporting tools

Changes to sub-processors require:
- 30 days advance notice to customers
- Opportunity to object to new sub-processors
- Alternative arrangements if objections raised
- Updated sub-processor lists maintenance

**Data Breach Notification**
Breach response procedures:
- Discovery and containment within 24 hours
- Customer notification within 72 hours
- Regulatory notification as required
- Incident documentation and reporting
- Remediation and prevention measures

**Audit and Compliance**
Regular compliance activities:
- Annual third-party security audits
- Privacy impact assessments
- Data flow mapping and documentation
- Staff training and certification
- Continuous monitoring and improvement

**Termination and Data Return**
Upon service termination:
- Data export in standard formats
- Secure deletion of processed data
- Certification of deletion provided
- Backup data removal procedures
- Transition support as needed

**Liability and Indemnification**
- Joint liability for GDPR violations
- Indemnification for processor breaches
- Insurance coverage for data incidents
- Limitation of liability clauses
- Regulatory fine allocation

**Contact Information**
Data Protection Officer: {{DPO_EMAIL}}
Legal department: {{LEGAL_EMAIL}}
Technical support: {{CONTACT_EMAIL}}
Business address: {{REGISTERED_ADDRESS}}
Company CEO: {{CEO_NAME}}

**Governing Law**
This agreement is governed by {{COUNTRY}} law and applicable EU data protection regulations.
    `;

    return {
      title: 'Data Processing Agreement',
      lastUpdated: format(new Date(), 'yyyy-MM-dd'),
      content: this.replaceVariables(template.trim()),
      version: '1.0.0',
    };
  }

  generateAllDocuments(): Record<string, LegalDocumentTemplate> {
    return {
      privacyPolicy: this.generatePrivacyPolicy(),
      termsOfService: this.generateTermsOfService(),
      cookiePolicy: this.generateCookiePolicy(),
      dataProcessingAgreement: this.generateDataProcessingAgreement(),
    };
  }
}

export const legalTemplateEngine = new LegalTemplateEngine();