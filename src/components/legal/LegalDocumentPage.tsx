import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../contexts/LanguageContext';
import { legalTemplateEngine, LegalDocumentTemplate } from '../../lib/legal-templates';
import { legalDocumentVersioning } from '../../lib/legal-versioning';

interface LegalDocumentPageProps {
  documentType: 'privacyPolicy' | 'termsOfService' | 'cookiePolicy' | 'dataProcessingAgreement';
  title: string;
  description: string;
}

export const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({ 
  documentType, 
  title, 
  description 
}) => {
  const { isRTL } = useLanguage();
  const [document, setDocument] = useState<LegalDocumentTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const documents = legalTemplateEngine.generateAllDocuments();
      const currentDoc = documents[documentType];
      
      if (currentDoc) {
        setDocument(currentDoc);
        
        // Track document view
        legalDocumentVersioning.trackDocumentView(
          documentType, 
          currentDoc.version, 
          'anonymous'
        );
        
        // Create or update version if needed
        const existingVersion = legalDocumentVersioning.getLatestVersion(documentType);
        if (!existingVersion || existingVersion.content !== currentDoc.content) {
          legalDocumentVersioning.createVersion(
            documentType,
            currentDoc,
            ['Auto-generated from template engine'],
            'system'
          );
        }
      } else {
        setError('Document not found');
      }
    } catch (err) {
      setError('Failed to load document');
      console.error('Error loading legal document:', err);
    } finally {
      setLoading(false);
    }
  }, [documentType]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "dateModified": document?.lastUpdated,
    "version": document?.version,
    "publisher": {
      "@type": "Organization",
      "name": "fead.app",
      "url": "https://fead.app"
    },
    "mainEntity": {
      "@type": "Article",
      "headline": title,
      "datePublished": document?.lastUpdated,
      "dateModified": document?.lastUpdated,
      "author": {
        "@type": "Organization",
        "name": "fead.app"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <>
        <Helmet>
          <title>Error - {title} | fead.app</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Document Not Available</h1>
            <p className="text-white/80 text-lg">
              {error || 'The requested legal document could not be found.'}
            </p>
          </div>
        </div>
      </>
    );
  }

  const formattedContent = document.content.split('\n\n').map((paragraph, index) => {
    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
      // Header
      const headerText = paragraph.slice(2, -2);
      return (
        <h2 
          key={index} 
          className={`text-2xl font-bold text-white mt-8 mb-4 ${isRTL ? 'font-arabic text-right' : 'text-left'}`}
        >
          {headerText}
        </h2>
      );
    } else if (paragraph.startsWith('- ')) {
      // List items
      const items = paragraph.split('\n').filter(item => item.trim().startsWith('- '));
      return (
        <ul key={index} className={`list-disc ml-6 space-y-2 mb-6 ${isRTL ? 'mr-6 ml-0' : ''}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="text-white/80">
              {item.slice(2)}
            </li>
          ))}
        </ul>
      );
    } else {
      // Regular paragraph
      return (
        <p key={index} className="text-white/80 leading-relaxed mb-6">
          {paragraph}
        </p>
      );
    }
  });

  return (
    <>
      <Helmet>
        <title>{title} | fead.app</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="privacy policy, terms of service, legal, GDPR, compliance, AI, Instagram, customer support" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="fead.app" />
        <meta name="language" content={isRTL ? 'ar' : 'en'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://fead.app/legal/${documentType}`} />
        <meta property="og:site_name" content="fead.app" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://fead.app/legal/${documentType}`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="en" href={`https://fead.app/en/legal/${documentType}`} />
        <link rel="alternate" hrefLang="ar" href={`https://fead.app/ar/legal/${documentType}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://fead.app/legal/${documentType}`} />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`prose prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
            <header className="mb-8 border-b border-white/20 pb-8">
              <h1 className={`text-4xl font-bold text-white mb-4 ${isRTL ? 'font-arabic' : ''}`}>
                {document.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-white/60 text-sm">
                <div>
                  <strong>Last updated:</strong> {document.lastUpdated}
                </div>
                <div>
                  <strong>Version:</strong> {document.version}
                </div>
                <div>
                  <strong>Document ID:</strong> {documentType}
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <p className="text-white/80 text-sm leading-relaxed">
                  This document is legally binding and automatically generated using our compliance 
                  template system. It complies with GDPR, Meta Developer Policies, and Netherlands law. 
                  Changes are tracked with full audit trails for regulatory compliance.
                </p>
              </div>
            </header>

            <main className="legal-content">
              <div className="space-y-6">
                {formattedContent}
              </div>
            </main>

            <footer className="mt-12 pt-8 border-t border-white/20">
              <div className="text-white/60 text-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Contact Information</h3>
                    <ul className="space-y-1">
                      <li>Email: support@fead.app</li>
                      <li>Privacy: privacy@fead.app</li>
                      <li>Legal: legal@fead.app</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Company Details</h3>
                    <ul className="space-y-1">
                      <li>fead.app B.V.</li>
                      <li>Netherlands Chamber: 97935557</li>
                      <li>CEO: Sadeq Al-Dallal</li>
                    </ul>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <p>
                    © {new Date().getFullYear()} fead.app. All rights reserved. 
                    This document is protected by copyright and international treaties.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};