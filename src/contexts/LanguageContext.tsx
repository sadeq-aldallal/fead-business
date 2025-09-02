import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.challenges': 'Challenges',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.getStarted': 'Get Started',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    
    // Hero Section
    'hero.title': 'Automate Instagram Customer Support with AI',
    'hero.subtitle': 'Transform your Instagram business with intelligent AI agents that provide 24/7 customer support, increase sales, and never miss an opportunity.',
    'hero.cta': 'Start Free Trial',
    'hero.watchDemo': 'Watch Demo',
    'hero.contactUs': 'Contact Us',
    'hero.ourServices': 'Our Services',
    'hero.mainTitle': 'Championing AI for Instagram Customer Excellence',
    'hero.mainSubtitle': 'Experience the pinnacle of efficiency in Instagram customer support with AI at the helm, driving excellence in every operation.',
    'hero.newTitle': 'Never Miss a Customer',
    'hero.newSubtitle': 'From first touch to after-sales, our 24/7 Artifiual In ensures no missed inquiries, delays, or unhappy customers.',
    'hero.badge': 'AI DATA PROCESSING',
    
    // Pain Points
    'pain.title': 'Current Challenges',
    'pain.subtitle': 'Manual Instagram support is costing your business more than you think',
    'pain.cost.title': 'High Staffing Costs',
    'pain.cost.desc': 'Hiring multiple agents for 24/7 coverage drains your budget',
    'pain.availability.title': 'Limited Availability',
    'pain.availability.desc': 'Missing customer inquiries during off-hours loses sales',
    'pain.speed.title': 'Slow Response Times',
    'pain.speed.desc': 'Delayed responses during peak hours frustrate customers',
    'pain.context.title': 'Context Confusion',
    'pain.context.desc': 'Agents struggle to maintain conversation context across shifts',
    'pain.coverage.title': 'Coverage Gaps',
    'pain.coverage.desc': 'Vacations and sick days leave customers unattended',
    'pain.manual.title': 'Manual Work Inefficiency',
    'pain.manual.desc': 'Agents always do manual work which costs your business time and inaccuracy',
    
    // Solutions
    'solution.title': 'Your AI-Powered Instagram Support Solution',
    'solution.subtitle': 'Transform your Instagram customer support with intelligent automation that works around the clock',
    'solution.badge': 'AI-Powered Solution',
    'solution.cost.title': '90% Cost Reduction',
    'solution.cost.desc': 'Replace multiple human agents with one intelligent AI system',
    'solution.availability.title': '24/7 Availability',
    'solution.availability.desc': 'Never miss a customer inquiry, day or night',
    'solution.speed.title': 'Instant Responses',
    'solution.speed.desc': 'Handle unlimited conversations simultaneously',
    'solution.context.title': 'Perfect Context',
    'solution.context.desc': 'AI maintains full conversation history and context',
    'solution.focus.title': 'Human Focus',
    'solution.focus.desc': 'Free your team to handle complex inquiries and strategy',
    
    // About
    'about.badge': 'ABOUT US',
    'about.title': 'Crafting Tomorrow\'s Innovative Solutions',
    'about.subtitle': 'We pioneer the future of Instagram customer engagement through cutting-edge AI technology, delivering unprecedented efficiency and customer satisfaction for businesses worldwide.',
    
    // Client Logos
    'clients.title': 'BUSINESSES RELY ON US FOR CONSUMER ENGAGEMENT',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signupLink': 'Sign up here',
    'auth.loginLink': 'Login here',
    'auth.loading': 'Please wait...',
    
    // Dashboard
    'dashboard.title': 'Agent Dashboard',
    'dashboard.overview': 'Overview',
    'dashboard.agents': 'AI Agents',
    'dashboard.instagram': 'Instagram Accounts',
    'dashboard.analytics': 'Analytics',
    'dashboard.settings': 'Settings',
    
    // Footer
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All rights reserved',
    
    // Language
    'language.english': 'English',
    'language.arabic': 'العربية',
    
    // Contact Form
    'contact.title': 'Contact Us',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.success': 'Your message has been sent successfully!',
    
    // Mobile Login Message
    'mobile.loginMessage': 'To login, please use a laptop or tablet',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.features': 'المميزات',
    'nav.challenges': 'التحديات',
    'nav.pricing': 'الأسعار',
    'nav.contact': 'اتصل بنا',
    'nav.getStarted': 'ابدأ الآن',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.dashboard': 'لوحة التحكم',
    'nav.logout': 'تسجيل الخروج',
    
    // Hero Section
    'hero.title': 'أتمتة دعم العملاء على إنستغرام بالذكاء الاصطناعي',
    'hero.subtitle': 'حوّل أعمالك على إنستغرام مع وكلاء ذكيين يوفرون دعماً للعملاء على مدار الساعة، ويزيدون المبيعات، ولا يفوتون أي فرصة.',
    'hero.cta': 'ابدأ التجربة المجانية',
    'hero.watchDemo': 'شاهد العرض التوضيحي',
    'hero.contactUs': 'اتصل بنا',
    'hero.ourServices': 'خدماتنا',
    'hero.mainTitle': 'ريادة الذكاء الاصطناعي لتميز إنستغرام',
    'hero.mainSubtitle': 'اختبر قمة الكفاءة في دعم عملاء إنستغرام مع الذكاء الاصطناعي في المقدمة، يقود التميز في كل عملية.',
    'hero.newTitle': 'لا تفوت أي عميل أبداً',
    'hero.newSubtitle': 'من اللمسة الأولى إلى ما بعد البيع، يضمن الذكاء الاصطناعي لدينا على مدار الساعة عدم تفويت أي استفسارات أو تأخير أو عملاء غير راضين.',
    'hero.badge': 'معالجة البيانات بالذكاء الاصطناعي',
    
    // Pain Points
    'pain.title': 'التحديات الحالية',
    'pain.subtitle': 'دعم إنستغرام اليدوي يكلف عملك أكثر مما تعتقد',
    'pain.cost.title': 'تكاليف توظيف عالية',
    'pain.cost.desc': 'توظيف عدة وكلاء للتغطية على مدار الساعة يستنزف ميزانيتك',
    'pain.availability.title': 'توفر محدود',
    'pain.availability.desc': 'تفويت استفسارات العملاء خارج ساعات العمل يفقد المبيعات',
    'pain.speed.title': 'أوقات استجابة بطيئة',
    'pain.speed.desc': 'التأخير في الردود خلال ساعات الذروة يحبط العملاء',
    'pain.context.title': 'التباس في السياق',
    'pain.context.desc': 'الوكلاء يكافحون للحفاظ على سياق المحادثة عبر النوبات',
    'pain.coverage.title': 'فجوات في التغطية',
    'pain.coverage.desc': 'الإجازات والمرض يتركان العملاء دون اهتمام',
    'pain.manual.title': 'عدم كفاءة العمل اليدوي',
    'pain.manual.desc': 'الوكلاء يقومون دائماً بالعمل اليدوي مما يكلف عملك وقتاً وعدم دقة',
    
    // Solutions
    'solution.title': 'حلول دعم إنستغرام المدعومة بالذكاء الاصطناعي',
    'solution.subtitle': 'حوّل دعم عملاء إنستغرام مع الأتمتة الذكية التي تعمل على مدار الساعة',
    'solution.badge': 'حل مدعوم بالذكاء الاصطناعي',
    'solution.cost.title': 'تقليل التكلفة بنسبة 90%',
    'solution.cost.desc': 'استبدل عدة وكلاء بشريين بنظام ذكي واحد',
    'solution.availability.title': 'متاح على مدار الساعة',
    'solution.availability.desc': 'لا تفوت أي استفسار من العملاء، ليلاً أو نهاراً',
    'solution.speed.title': 'ردود فورية',
    'solution.speed.desc': 'تعامل مع محادثات غير محدودة في نفس الوقت',
    'solution.context.title': 'سياق مثالي',
    'solution.context.desc': 'الذكاء الاصطناعي يحتفظ بتاريخ المحادثة والسياق الكامل',
    'solution.focus.title': 'تركيز بشري',
    'solution.focus.desc': 'حرر فريقك للتعامل مع الاستفسارات المعقدة والاستراتيجية',
    
    // About
    'about.badge': 'من نحن',
    'about.title': 'صناعة حلول الغد المبتكرة',
    'about.subtitle': 'نحن رواد مستقبل تفاعل عملاء إنستغرام من خلال تقنية الذكاء الاصطناعي المتطورة، نقدم كفاءة ورضا عملاء لا مثيل لهما للشركات في جميع أنحاء العالم.',
    
    // Client Logos
    'clients.title': 'الشركات تعتمد علينا في تفاعل المستهلكين',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.signupLink': 'سجل هنا',
    'auth.loginLink': 'سجل الدخول هنا',
    'auth.loading': 'يرجى الانتظار...',
    
    // Dashboard
    'dashboard.title': 'لوحة تحكم الوكيل',
    'dashboard.overview': 'نظرة عامة',
    'dashboard.agents': 'وكلاء الذكاء الاصطناعي',
    'dashboard.instagram': 'حسابات إنستغرام',
    'dashboard.analytics': 'التحليلات',
    'dashboard.settings': 'الإعدادات',
    
    // Footer
    'footer.privacy': 'سياسة الخصوصية',
    'footer.contact': 'اتصل بنا',
    'footer.rights': 'جميع الحقوق محفوظة',
    
    // Language
    'language.english': 'English',
    'language.arabic': 'العربية',
    
    // Contact Form
    'contact.title': 'اتصل بنا',
    'contact.name': 'الاسم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    'contact.success': 'تم إرسال رسالتك بنجاح!',
    
    // Mobile Login Message
    'mobile.loginMessage': 'لتسجيل الدخول، يرجى استخدام جهاز كمبيوتر محمول أو جهاز لوحي',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  useEffect(() => {
    const savedLang = localStorage.getItem('fead_language');
    if (savedLang) {
      const lang = languages.find(l => l.code === savedLang);
      if (lang) setCurrentLanguage(lang);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('fead_language', language.code);
    document.documentElement.dir = language.code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language.code;
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code][key as keyof typeof translations.en] || key;
  };

  const isRTL = currentLanguage.code === 'ar';

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};