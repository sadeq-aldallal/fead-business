import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  LegalTemplateEngine, 
  DEFAULT_COMPANY_INFO, 
  CompanyInfo,
  LegalDocumentTemplate 
} from '../legal-templates';
import { format } from 'date-fns';

describe('LegalTemplateEngine', () => {
  let engine: LegalTemplateEngine;
  let mockDate: Date;

  beforeEach(() => {
    // Mock current date for consistent testing
    mockDate = new Date('2025-08-28T10:00:00.000Z');
    vi.setSystemTime(mockDate);
    engine = new LegalTemplateEngine();
  });

  describe('Constructor and Initialization', () => {
    it('should initialize with default company info', () => {
      expect(engine).toBeInstanceOf(LegalTemplateEngine);
    });

    it('should accept custom company info', () => {
      const customInfo: CompanyInfo = {
        name: 'Test Company',
        chamberNumber: '12345678',
        ceoName: 'John Doe',
        country: 'Germany',
        registeredAddress: 'Berlin, Germany',
        contactEmail: 'contact@test.com',
        privacyEmail: 'privacy@test.com',
        dpoEmail: 'dpo@test.com',
        legalEmail: 'legal@test.com',
      };

      const customEngine = new LegalTemplateEngine(customInfo);
      const privacyPolicy = customEngine.generatePrivacyPolicy();

      expect(privacyPolicy.content).toContain('Test Company');
      expect(privacyPolicy.content).toContain('12345678');
      expect(privacyPolicy.content).toContain('John Doe');
      expect(privacyPolicy.content).toContain('Germany');
    });
  });

  describe('Variable Replacement', () => {
    it('should replace all company variables correctly', () => {
      const privacyPolicy = engine.generatePrivacyPolicy();
      
      expect(privacyPolicy.content).toContain(DEFAULT_COMPANY_INFO.name);
      expect(privacyPolicy.content).toContain(DEFAULT_COMPANY_INFO.chamberNumber);
      expect(privacyPolicy.content).toContain(DEFAULT_COMPANY_INFO.ceoName);
      expect(privacyPolicy.content).toContain(DEFAULT_COMPANY_INFO.country);
      expect(privacyPolicy.content).toContain(DEFAULT_COMPANY_INFO.privacyEmail);
      expect(privacyPolicy.content).toContain(DEFAULT_COMPANY_INFO.dpoEmail);
    });

    it('should replace date variables correctly', () => {
      const document = engine.generatePrivacyPolicy();
      
      expect(document.lastUpdated).toBe('2025-08-28');
      expect(document.content).toContain(format(mockDate, 'yyyy')); // Current year
    });

    it('should not leave unreplaced template variables', () => {
      const documents = engine.generateAllDocuments();
      
      Object.values(documents).forEach(doc => {
        expect(doc.content).not.toMatch(/\{\{[A-Z_]+\}\}/);
      });
    });
  });

  describe('Privacy Policy Generation', () => {
    let privacyPolicy: LegalDocumentTemplate;

    beforeEach(() => {
      privacyPolicy = engine.generatePrivacyPolicy();
    });

    it('should generate privacy policy with correct structure', () => {
      expect(privacyPolicy.title).toBe('Privacy Policy');
      expect(privacyPolicy.version).toBe('1.0.0');
      expect(privacyPolicy.lastUpdated).toBe('2025-08-28');
      expect(privacyPolicy.content).toBeTruthy();
    });

    it('should include GDPR compliance sections', () => {
      expect(privacyPolicy.content).toContain('Data Subject Rights');
      expect(privacyPolicy.content).toContain('GDPR');
      expect(privacyPolicy.content).toContain('Standard Contractual Clauses');
      expect(privacyPolicy.content).toContain('Data minimization');
    });

    it('should include Meta/Instagram compliance information', () => {
      expect(privacyPolicy.content).toContain('Meta');
      expect(privacyPolicy.content).toContain('Instagram');
      expect(privacyPolicy.content).toContain('Developer Policies');
      expect(privacyPolicy.content).toContain('AI agents interact');
    });

    it('should include AI data processing standards', () => {
      expect(privacyPolicy.content).toContain('AI Data Processing Standards');
      expect(privacyPolicy.content).toContain('ethical guidelines');
      expect(privacyPolicy.content).toContain('Human oversight');
      expect(privacyPolicy.content).toContain('automated decision-making');
    });

    it('should include comprehensive security measures', () => {
      expect(privacyPolicy.content).toContain('TLS 1.3 encryption');
      expect(privacyPolicy.content).toContain('AES-256 encryption');
      expect(privacyPolicy.content).toContain('Multi-factor authentication');
      expect(privacyPolicy.content).toContain('security audits');
    });

    it('should specify data retention periods', () => {
      expect(privacyPolicy.content).toContain('2 years');
      expect(privacyPolicy.content).toContain('30 days');
      expect(privacyPolicy.content).toContain('irreversible');
    });
  });

  describe('Terms of Service Generation', () => {
    let termsOfService: LegalDocumentTemplate;

    beforeEach(() => {
      termsOfService = engine.generateTermsOfService();
    });

    it('should generate terms of service with correct structure', () => {
      expect(termsOfService.title).toBe('Terms of Service');
      expect(termsOfService.version).toBe('1.0.0');
      expect(termsOfService.lastUpdated).toBe('2025-08-28');
      expect(termsOfService.content).toBeTruthy();
    });

    it('should include AI agent disclosure requirements', () => {
      expect(termsOfService.content).toContain('AI Agent Disclosure Requirements');
      expect(termsOfService.content).toContain('AI-generated');
      expect(termsOfService.content).toContain('24 hours');
      expect(termsOfService.content).toContain('human agent escalation');
      expect(termsOfService.content).toContain('automated vs. human responses');
    });

    it('should include Meta/Instagram compliance section', () => {
      expect(termsOfService.content).toContain('Meta/Instagram Compliance');
      expect(termsOfService.content).toContain('Instagram Community Guidelines');
      expect(termsOfService.content).toContain('Meta Developer Policies');
      expect(termsOfService.content).toContain('Tech Provider requirements');
      expect(termsOfService.content).toContain('Business API usage');
    });

    it('should include SaaS subscription terms', () => {
      expect(termsOfService.content).toContain('SaaS Subscription Terms');
      expect(termsOfService.content).toContain('subscription basis');
      expect(termsOfService.content).toContain('Automatic renewal');
      expect(termsOfService.content).toContain('Usage limits');
    });

    it('should include account responsibilities', () => {
      expect(termsOfService.content).toContain('Account Responsibilities');
      expect(termsOfService.content).toContain('accurate account');
      expect(termsOfService.content).toContain('secure credentials');
      expect(termsOfService.content).toContain('legitimate customer support');
    });

    it('should include dispute resolution', () => {
      expect(termsOfService.content).toContain('Dispute Resolution');
      expect(termsOfService.content).toContain('Netherlands law');
      expect(termsOfService.content).toContain('arbitration');
    });
  });

  describe('Cookie Policy Generation', () => {
    let cookiePolicy: LegalDocumentTemplate;

    beforeEach(() => {
      cookiePolicy = engine.generateCookiePolicy();
    });

    it('should generate cookie policy with correct structure', () => {
      expect(cookiePolicy.title).toBe('Cookie Policy');
      expect(cookiePolicy.version).toBe('1.0.0');
      expect(cookiePolicy.lastUpdated).toBe('2025-08-28');
      expect(cookiePolicy.content).toBeTruthy();
    });

    it('should include different types of cookies', () => {
      expect(cookiePolicy.content).toContain('Essential Cookies');
      expect(cookiePolicy.content).toContain('Analytics Cookies');
      expect(cookiePolicy.content).toContain('Preference Cookies');
      expect(cookiePolicy.content).toContain('Marketing Cookies');
    });

    it('should include cookie management options', () => {
      expect(cookiePolicy.content).toContain('Cookie Management');
      expect(cookiePolicy.content).toContain('Browser settings');
      expect(cookiePolicy.content).toContain('consent banner');
      expect(cookiePolicy.content).toContain('privacy settings');
      expect(cookiePolicy.content).toContain('Opt-out options');
    });

    it('should include third-party cookie information', () => {
      expect(cookiePolicy.content).toContain('Third-Party Cookies');
      expect(cookiePolicy.content).toContain('trusted partners');
      expect(cookiePolicy.content).toContain('Analytics providers');
      expect(cookiePolicy.content).toContain('Security services');
    });

    it('should specify cookie retention periods', () => {
      expect(cookiePolicy.content).toContain('Cookie Retention');
      expect(cookiePolicy.content).toContain('Session cookies');
      expect(cookiePolicy.content).toContain('Persistent cookies');
      expect(cookiePolicy.content).toContain('12-24 months');
    });
  });

  describe('Data Processing Agreement Generation', () => {
    let dpa: LegalDocumentTemplate;

    beforeEach(() => {
      dpa = engine.generateDataProcessingAgreement();
    });

    it('should generate DPA with correct structure', () => {
      expect(dpa.title).toBe('Data Processing Agreement');
      expect(dpa.version).toBe('1.0.0');
      expect(dpa.lastUpdated).toBe('2025-08-28');
      expect(dpa.content).toBeTruthy();
    });

    it('should define data controller and processor roles', () => {
      expect(dpa.content).toContain('Data Controller');
      expect(dpa.content).toContain('Data Processor');
      expect(dpa.content).toContain('Customer organization');
      expect(dpa.content).toContain('fead.app');
    });

    it('should include scope of processing', () => {
      expect(dpa.content).toContain('Scope of Processing');
      expect(dpa.content).toContain('Instagram customer conversation');
      expect(dpa.content).toContain('AI-powered response generation');
      expect(dpa.content).toContain('Performance analytics');
    });

    it('should include comprehensive security measures', () => {
      expect(dpa.content).toContain('Security Measures');
      expect(dpa.content).toContain('End-to-end encryption');
      expect(dpa.content).toContain('AES-256 encryption');
      expect(dpa.content).toContain('Multi-factor authentication');
      expect(dpa.content).toContain('security audits');
    });

    it('should address international data transfers', () => {
      expect(dpa.content).toContain('International Data Transfers');
      expect(dpa.content).toContain('Standard Contractual Clauses');
      expect(dpa.content).toContain('Adequacy decision');
      expect(dpa.content).toContain('Transfer impact assessments');
    });

    it('should include data subject rights support', () => {
      expect(dpa.content).toContain('Data Subject Rights');
      expect(dpa.content).toContain('Access requests within 30 days');
      expect(dpa.content).toContain('right to be forgotten');
      expect(dpa.content).toContain('Data portability');
      expect(dpa.content).toContain('automated decision-making');
    });

    it('should address sub-processing', () => {
      expect(dpa.content).toContain('Sub-Processing');
      expect(dpa.content).toContain('Authorized sub-processors');
      expect(dpa.content).toContain('30 days advance notice');
      expect(dpa.content).toContain('Cloud infrastructure');
    });

    it('should include breach notification procedures', () => {
      expect(dpa.content).toContain('Data Breach Notification');
      expect(dpa.content).toContain('24 hours');
      expect(dpa.content).toContain('72 hours');
      expect(dpa.content).toContain('Incident documentation');
    });

    it('should address termination and data return', () => {
      expect(dpa.content).toContain('Termination and Data Return');
      expect(dpa.content).toContain('Data export');
      expect(dpa.content).toContain('Secure deletion');
      expect(dpa.content).toContain('Certification of deletion');
    });
  });

  describe('Generate All Documents', () => {
    it('should generate all four legal documents', () => {
      const documents = engine.generateAllDocuments();
      
      expect(Object.keys(documents)).toHaveLength(4);
      expect(documents.privacyPolicy).toBeDefined();
      expect(documents.termsOfService).toBeDefined();
      expect(documents.cookiePolicy).toBeDefined();
      expect(documents.dataProcessingAgreement).toBeDefined();
    });

    it('should have consistent versioning across all documents', () => {
      const documents = engine.generateAllDocuments();
      
      Object.values(documents).forEach(doc => {
        expect(doc.version).toBe('1.0.0');
        expect(doc.lastUpdated).toBe('2025-08-28');
      });
    });

    it('should have no template variables left unresolved', () => {
      const documents = engine.generateAllDocuments();
      
      Object.values(documents).forEach(doc => {
        expect(doc.content).not.toMatch(/\{\{[A-Z_]+\}\}/);
      });
    });
  });

  describe('Meta Compliance Requirements', () => {
    it('should include required AI disclosure elements in terms', () => {
      const terms = engine.generateTermsOfService();
      
      expect(terms.content).toContain('AI-generated');
      expect(terms.content).toContain('24 hours');
      expect(terms.content).toContain('human agent escalation');
      expect(terms.content).toContain('automated vs. human');
    });

    it('should include Meta developer policy compliance', () => {
      const terms = engine.generateTermsOfService();
      const privacy = engine.generatePrivacyPolicy();
      
      expect(terms.content).toContain('Meta Developer Policies');
      expect(privacy.content).toContain('Instagram Platform Policy');
      expect(privacy.content).toContain('Meta\'s data use policies');
    });

    it('should include business API usage terms', () => {
      const terms = engine.generateTermsOfService();
      
      expect(terms.content).toContain('Business API');
      expect(terms.content).toContain('Tech Provider');
      expect(terms.content).toContain('Instagram Business Account');
    });
  });

  describe('Netherlands Legal Compliance', () => {
    it('should include Netherlands company information', () => {
      const documents = engine.generateAllDocuments();
      
      Object.values(documents).forEach(doc => {
        expect(doc.content).toContain('Netherlands');
        expect(doc.content).toContain('97935557');
        expect(doc.content).toContain('Sadeq Al-Dallal');
      });
    });

    it('should specify Netherlands law governing terms', () => {
      const terms = engine.generateTermsOfService();
      const dpa = engine.generateDataProcessingAgreement();
      
      expect(terms.content).toContain('Netherlands law');
      expect(dpa.content).toContain('Netherlands law');
    });
  });
});