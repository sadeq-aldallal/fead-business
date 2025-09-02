import React from 'react';
import { LegalDocumentPage } from '../legal/LegalDocumentPage';

export const EnhancedPrivacyPolicy: React.FC = () => {
  return (
    <LegalDocumentPage
      documentType="privacyPolicy"
      title="Privacy Policy"
      description="Learn how fead.app collects, processes, and protects your personal data in compliance with GDPR, Meta policies, and international privacy laws for our AI-powered Instagram customer support platform."
    />
  );
};