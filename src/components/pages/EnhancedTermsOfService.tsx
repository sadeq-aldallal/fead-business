import React from 'react';
import { LegalDocumentPage } from '../legal/LegalDocumentPage';

export const EnhancedTermsOfService: React.FC = () => {
  return (
    <LegalDocumentPage
      documentType="termsOfService"
      title="Terms of Service"
      description="Terms and conditions for using fead.app's AI-powered Instagram customer support automation platform, including Meta compliance, SaaS subscription terms, and AI agent disclosure requirements."
    />
  );
};