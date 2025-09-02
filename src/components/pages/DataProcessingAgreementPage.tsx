import React from 'react';
import { LegalDocumentPage } from '../legal/LegalDocumentPage';

export const DataProcessingAgreementPage: React.FC = () => {
  return (
    <LegalDocumentPage
      documentType="dataProcessingAgreement"
      title="Data Processing Agreement"
      description="Legal framework governing data processing activities between fead.app and enterprise customers for GDPR-compliant AI-powered Instagram customer support automation services."
    />
  );
};