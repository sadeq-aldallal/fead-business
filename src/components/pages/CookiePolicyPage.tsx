import React from 'react';
import { LegalDocumentPage } from '../legal/LegalDocumentPage';

export const CookiePolicyPage: React.FC = () => {
  return (
    <LegalDocumentPage
      documentType="cookiePolicy"
      title="Cookie Policy"
      description="Understand how fead.app uses cookies and similar technologies to provide, improve, and secure our AI-powered Instagram customer support automation platform with comprehensive privacy controls."
    />
  );
};