import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation resources
import en from './locales/en.json';
import ar from './locales/ar.json';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

// Language detection configuration with Arabic country bias
const languageDetectionOptions = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'fead-app-language',
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  
  // Custom language detection logic for Arabic countries
  checkWhitelist: true,
  
  // Arabic country codes that should default to Arabic
  arabicCountries: [
    'SA', 'AE', 'EG', 'JO', 'LB', 'SY', 'IQ', 'KW', 'QA', 'BH',
    'OM', 'YE', 'LY', 'TN', 'DZ', 'MA', 'SD', 'DJ', 'SO', 'MR'
  ],
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection
    detection: languageDetectionOptions,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // RTL support
    supportedLngs: ['en', 'ar'],
    nonExplicitSupportedLngs: true,
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // React configuration
    react: {
      useSuspense: false,
    },
  });

// Custom language detection for Arabic countries
const detectUserLocation = async () => {
  try {
    // Try to detect user's country
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code && languageDetectionOptions.arabicCountries.includes(data.country_code)) {
      i18n.changeLanguage('ar');
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    }
  } catch (error) {
    console.log('Could not detect user location, using default language detection');
  }
};

// Initialize location detection if no language is stored
if (!localStorage.getItem('fead-app-language')) {
  detectUserLocation();
}

// Set initial direction and language attributes
const setDocumentAttributes = (language: string) => {
  const isRTL = language === 'ar';
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
  
  // Add/remove RTL class for styling
  if (isRTL) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
};

// Listen for language changes
i18n.on('languageChanged', setDocumentAttributes);

// Set initial attributes
setDocumentAttributes(i18n.language);

export default i18n;