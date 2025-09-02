import React, { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { useLanguage } from '../../contexts/LanguageContext';
import { legalDocumentVersioning } from '../../lib/legal-versioning';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const EnhancedCookieConsent: React.FC = () => {
  const { isRTL } = useLanguage();
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
  const [showPreferences, setShowPreferences] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const existingConsent = localStorage.getItem('cookie-consent');
    const existingPreferences = localStorage.getItem('cookie-preferences');

    if (existingConsent && existingPreferences) {
      setHasConsented(true);
      setCookiePreferences(JSON.parse(existingPreferences));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    setCookiePreferences(allAccepted);
    saveCookieConsent(allAccepted);
    setHasConsented(true);

    // Track consent in audit trail
    legalDocumentVersioning.addAuditEntry({
      documentType: 'cookiePolicy',
      action: 'viewed',
      version: 'consent-accepted',
      userId: 'anonymous',
    });
  };

  const handleRejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    setCookiePreferences(essentialOnly);
    saveCookieConsent(essentialOnly);
    setHasConsented(true);

    // Track consent in audit trail
    legalDocumentVersioning.addAuditEntry({
      documentType: 'cookiePolicy',
      action: 'viewed',
      version: 'consent-rejected',
      userId: 'anonymous',
    });
  };

  const handleCustomPreferences = () => {
    saveCookieConsent(cookiePreferences);
    setHasConsented(true);
    setShowPreferences(false);

    // Track consent in audit trail
    legalDocumentVersioning.addAuditEntry({
      documentType: 'cookiePolicy',
      action: 'viewed',
      version: 'consent-customized',
      userId: 'anonymous',
    });
  };

  const saveCookieConsent = (preferences: CookiePreferences) => {
    localStorage.setItem('cookie-consent', 'true');
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());

    // Set actual cookies based on preferences
    if (preferences.analytics) {
      document.cookie = 'analytics_enabled=true; path=/; max-age=31536000; SameSite=Lax';
    }
    if (preferences.marketing) {
      document.cookie = 'marketing_enabled=true; path=/; max-age=31536000; SameSite=Lax';
    }
    if (preferences.preferences) {
      document.cookie = 'preferences_enabled=true; path=/; max-age=31536000; SameSite=Lax';
    }
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setCookiePreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  if (hasConsented) {
    return null;
  }

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accept All Cookies"
        declineButtonText="Reject All"
        enableDeclineButton
        onAccept={handleAcceptAll}
        onDecline={handleRejectAll}
        style={{
          background: 'rgba(0, 0, 0, 0.95)',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'inherit',
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr',
        }}
        buttonStyle={{
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '14px',
          borderRadius: '6px',
          border: 'none',
          padding: '8px 16px',
          marginLeft: isRTL ? '0' : '8px',
          marginRight: isRTL ? '8px' : '0',
        }}
        declineButtonStyle={{
          backgroundColor: 'transparent',
          color: '#d1d5db',
          fontSize: '14px',
          borderRadius: '6px',
          border: '1px solid #4b5563',
          padding: '8px 16px',
          marginLeft: isRTL ? '0' : '8px',
          marginRight: isRTL ? '8px' : '0',
        }}
        expires={365}
      >
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:items-center md:justify-between">
          <div className="flex-1 pr-4">
            <p className="mb-2 font-medium">We value your privacy</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              We use cookies to enhance your experience, analyze site usage, and provide 
              personalized content. You can customize your preferences or accept all cookies 
              to support our AI-powered Instagram customer support platform.
            </p>
            <div className="mt-2">
              <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
                <DialogTrigger asChild>
                  <button 
                    className="text-blue-400 hover:text-blue-300 underline text-sm"
                    onClick={() => setShowPreferences(true)}
                  >
                    Customize Preferences
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className={isRTL ? 'text-right font-arabic' : 'text-left'}>
                      Cookie Preferences
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div className="flex-1">
                          <h4 className="font-medium">Essential Cookies</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Required for basic site functionality, security, and authentication.
                          </p>
                        </div>
                        <Switch 
                          checked={cookiePreferences.essential} 
                          disabled
                          className="ml-4"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div className="flex-1">
                          <h4 className="font-medium">Analytics Cookies</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Help us understand how you use our site to improve performance.
                          </p>
                        </div>
                        <Switch 
                          checked={cookiePreferences.analytics}
                          onCheckedChange={(checked) => updatePreference('analytics', checked)}
                          className="ml-4"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-700">
                        <div className="flex-1">
                          <h4 className="font-medium">Marketing Cookies</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Used to track visitors and display relevant ads and content.
                          </p>
                        </div>
                        <Switch 
                          checked={cookiePreferences.marketing}
                          onCheckedChange={(checked) => updatePreference('marketing', checked)}
                          className="ml-4"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div className="flex-1">
                          <h4 className="font-medium">Preference Cookies</h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Remember your settings like language, theme, and dashboard layout.
                          </p>
                        </div>
                        <Switch 
                          checked={cookiePreferences.preferences}
                          onCheckedChange={(checked) => updatePreference('preferences', checked)}
                          className="ml-4"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowPreferences(false)}
                        className="text-gray-300 border-gray-600 hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCustomPreferences}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <span className="mx-2 text-gray-500">|</span>
              
              <a 
                href="/legal/cookiePolicy" 
                className="text-blue-400 hover:text-blue-300 underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </CookieConsent>
    </>
  );
};