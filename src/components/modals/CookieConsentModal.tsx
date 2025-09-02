import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface CookieConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({ 
  isOpen, 
  onAccept, 
  onDecline 
}) => {
  const { isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-modal rounded-lg p-6 relative">
          {/* Close Button */}
          <button
            onClick={onDecline}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <X size={20} />
          </button>

          <div className="pr-8">
            {/* Header */}
            <div className="mb-4">
              <h3 className={`text-lg font-semibold text-foreground mb-2 ${isRTL ? 'font-arabic text-right' : ''}`}>
                We use cookies
              </h3>
              <p className={`text-muted-foreground text-sm leading-relaxed ${isRTL ? 'font-arabic text-right' : ''}`}>
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more about our cookie policy.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={onAccept}
                variant="brand"
                className="shadow-lg hover:shadow-xl transition-all duration-200 px-6"
              >
                Accept All
              </Button>
              <Button
                onClick={onDecline}
                variant="brand-outline"
                className="px-6"
              >
                Decline
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};