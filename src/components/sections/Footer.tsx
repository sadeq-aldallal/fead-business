import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/Input';

interface FooterProps {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onAccountDeletionClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onPrivacyClick, 
  onTermsClick, 
  onAccountDeletionClick 
}) => {
  const { t, isRTL } = useLanguage();
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setShowContactModal(false);
    setContactForm({ name: '', email: '', company: '', message: '' });
  };

  return (
    <>
      <footer id="contact" className="glass-nav border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center">
              <img 
                src="/fead.app_logo.png" 
                alt="fead.app" 
                className="h-10 w-auto md:h-12"
              />
              </div>
              <p className={`text-muted-foreground mb-4 max-w-md ${isRTL ? 'font-arabic text-right' : ''}`}>
                Automate your Instagram customer support with intelligent AI agents that work 24/7.
              </p>
              <div className="flex space-x-3">
                {/* Facebook */}
                <a href="https://www.facebook.com/profile.php?id=61570444176973" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/fead.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`text-foreground font-semibold mb-4 ${isRTL ? 'font-arabic text-right' : ''}`}>
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className={`text-muted-foreground hover:text-foreground transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('nav.home')}
                  </a>
                </li>
                <li>
                  <a href="#challenges" className={`text-muted-foreground hover:text-foreground transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('nav.challenges')}
                  </a>
                </li>
                <li>
                  <a href="#features" className={`text-muted-foreground hover:text-foreground transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}>
                    {t('nav.features')}
                  </a>
                </li>
                <li>
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className={`text-muted-foreground hover:text-foreground transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
                  >
                    Contact us
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={`text-foreground font-semibold mb-4 ${isRTL ? 'font-arabic text-right' : ''}`}>
                Get In Touch
              </h3>
              <div className="space-y-3">
                <p className={`text-muted-foreground ${isRTL ? 'font-arabic text-right' : ''}`}>
                  Have questions or need support?
                </p>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className={`flex items-center text-primary hover:text-primary/80 transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
                >
                  <Mail size={16} className={`${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span>Use our contact form</span>
                </button>
                <p className={`text-muted-foreground text-sm ${isRTL ? 'font-arabic text-right' : ''}`}>
                  We'll respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className={`text-muted-foreground text-sm ${isRTL ? 'font-arabic' : ''}`}>
              © 2025 fead.app. {t('footer.rights')}.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button 
                onClick={() => onPrivacyClick?.()}
                className={`text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => onTermsClick?.()}
                className={`text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
              >
                Terms of Service
              </button>
              <button 
                onClick={() => onAccountDeletionClick?.()}
                className={`text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 ${isRTL ? 'font-arabic' : ''}`}
              >
                Account Deletion
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 glass-overlay flex items-center justify-center z-50 p-4">
          <div className="glass-modal rounded-lg max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold text-foreground mb-2 ${isRTL ? 'font-arabic text-right' : ''}`}>
                Contact Us
              </h2>
              <p className={`text-muted-foreground ${isRTL ? 'font-arabic text-right' : ''}`}>
                Get in touch with our team for any questions or support
              </p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              {/* Full Name */}
              <Input
                label="Full Name"
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="Enter your email address"
                required
              />

              {/* Company Name */}
              <Input
                label="Company Name"
                type="text"
                value={contactForm.company}
                onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                placeholder="Enter your company name"
                required
              />

              {/* Message */}
              <div>
                <label className={`block text-sm font-medium text-muted-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  Message
                </label>
                <textarea
                  className="w-full px-3 py-2 glass-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="brand"
                className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Send
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
                We'll get back to you within 24 hours
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};