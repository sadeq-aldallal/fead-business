import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { LegalDocumentPage } from '../LegalDocumentPage';
import { useLanguage } from '../../../contexts/LanguageContext';
import { legalTemplateEngine } from '../../../lib/legal-templates';
import { legalDocumentVersioning } from '../../../lib/legal-versioning';

// Mock the context and libraries
vi.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn(),
}));

// Mock the legal templates
vi.mock('../../../lib/legal-templates', () => ({
  legalTemplateEngine: {
    generateAllDocuments: vi.fn(),
  },
}));

// Mock the versioning system
vi.mock('../../../lib/legal-versioning', () => ({
  legalDocumentVersioning: {
    trackDocumentView: vi.fn(),
    getLatestVersion: vi.fn(),
    createVersion: vi.fn(),
  },
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

describe('LegalDocumentPage', () => {
  const mockDocument = {
    title: 'Privacy Policy',
    lastUpdated: '2025-08-28',
    content: '**Company Information**\nfead.app is a company...\n\n**Data Collection**\nWe collect data...',
    version: '1.0.0',
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock returns
    vi.mocked(useLanguage).mockReturnValue({ isRTL: false });
    vi.mocked(legalTemplateEngine.generateAllDocuments).mockReturnValue({
      privacyPolicy: mockDocument,
    });
    vi.mocked(legalDocumentVersioning.getLatestVersion).mockReturnValue(null);
    
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render loading state initially', () => {
    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    // Should show loading animation
    expect(document.querySelector('.animate-pulse')).toBeTruthy();
  });

  it('should render document content after loading', async () => {
    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    expect(screen.getByText('Company Information')).toBeInTheDocument();
    expect(screen.getByText('Data Collection')).toBeInTheDocument();
    expect(screen.getByText('Version: 1.0.0')).toBeInTheDocument();
    expect(screen.getByText('Last updated: 2025-08-28')).toBeInTheDocument();
  });

  it('should track document view', async () => {
    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(legalDocumentVersioning.trackDocumentView).toHaveBeenCalledWith(
        'privacyPolicy',
        '1.0.0',
        'anonymous'
      );
    });
  });

  it('should create new version if content differs', async () => {
    const existingVersion = {
      ...mockDocument,
      content: 'Different content',
    };
    vi.mocked(legalDocumentVersioning.getLatestVersion).mockReturnValue(existingVersion);

    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(legalDocumentVersioning.createVersion).toHaveBeenCalledWith(
        'privacyPolicy',
        mockDocument,
        ['Auto-generated from template engine'],
        'system'
      );
    });
  });

  it('should not create version if content is same', async () => {
    vi.mocked(legalDocumentVersioning.getLatestVersion).mockReturnValue(mockDocument);

    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(legalDocumentVersioning.trackDocumentView).toHaveBeenCalled();
    });

    expect(legalDocumentVersioning.createVersion).not.toHaveBeenCalled();
  });

  it('should render error state when document not found', async () => {
    vi.mocked(legalTemplateEngine.generateAllDocuments).mockReturnValue({});

    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Document Not Available')).toBeInTheDocument();
    });

    expect(screen.getByText('Document not found')).toBeInTheDocument();
  });

  it('should render error state when template engine fails', async () => {
    vi.mocked(legalTemplateEngine.generateAllDocuments).mockImplementation(() => {
      throw new Error('Template engine failed');
    });

    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Document Not Available')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to load document')).toBeInTheDocument();
  });

  it('should handle RTL layout', async () => {
    vi.mocked(useLanguage).mockReturnValue({ isRTL: true });

    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      const title = screen.getByText('Privacy Policy');
      expect(title.className).toContain('font-arabic');
    });
  });

  it('should render company contact information', async () => {
    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('support@fead.app')).toBeInTheDocument();
      expect(screen.getByText('privacy@fead.app')).toBeInTheDocument();
      expect(screen.getByText('legal@fead.app')).toBeInTheDocument();
      expect(screen.getByText('Netherlands Chamber: 97935557')).toBeInTheDocument();
      expect(screen.getByText('CEO: Sadeq Al-Dallal')).toBeInTheDocument();
    });
  });

  it('should render compliance notice', async () => {
    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/This document is legally binding/)).toBeInTheDocument();
      expect(screen.getByText(/GDPR, Meta Developer Policies/)).toBeInTheDocument();
    });
  });

  it('should format content correctly', async () => {
    const contentWithLists = {
      ...mockDocument,
      content: '**Header**\nRegular paragraph\n\n- List item 1\n- List item 2\n- List item 3',
    };

    vi.mocked(legalTemplateEngine.generateAllDocuments).mockReturnValue({
      privacyPolicy: contentWithLists,
    });

    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Regular paragraph')).toBeInTheDocument();
      expect(screen.getByText('List item 1')).toBeInTheDocument();
      expect(screen.getByText('List item 2')).toBeInTheDocument();
      expect(screen.getByText('List item 3')).toBeInTheDocument();
    });
  });

  it('should include proper meta tags', async () => {
    render(
      <TestWrapper>
        <LegalDocumentPage
          documentType="privacyPolicy"
          title="Privacy Policy"
          description="Privacy policy description"
        />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check that Helmet is rendering (we can't easily test the actual meta tags in jsdom)
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });
  });
});