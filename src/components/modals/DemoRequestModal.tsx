import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/Input';
import { sendDemoRequestEmail } from '../../services/emailService';

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoRequestModal: React.FC<DemoRequestModalProps> = ({ isOpen, onClose }) => {
  const { isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await sendDemoRequestEmail(formData);
      
      if (result.success) {
        setSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: '', email: '', company: '', message: '' });
          onClose();
        }, 3000);
      } else {
        setError(result.error || 'Failed to send demo request. Please try again.');
      }
    } catch (err) {
      setError('Failed to send demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 glass-overlay flex items-center justify-center z-50 p-4">
      <div className="glass-modal rounded-lg max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className={`text-2xl font-bold text-foreground mb-2 ${isRTL ? 'font-arabic text-right' : ''}`}>
            Request Demo
          </h2>
          <p className={`text-muted-foreground ${isRTL ? 'font-arabic text-right' : ''}`}>
            See how our AI can transform your Instagram customer support
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className={`text-green-400 text-lg font-semibold mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              Demo Request Sent Successfully!
            </p>
            <p className={`text-muted-foreground text-sm ${isRTL ? 'font-arabic' : ''}`}>
              We'll get back to you within 24 hours to schedule your personalized demo.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className={`block text-sm font-medium text-muted-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-3 pr-3 py-2 glass-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium text-muted-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-3 pr-3 py-2 glass-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className={`block text-sm font-medium text-muted-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              Company Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full pl-3 pr-3 py-2 glass-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder="Enter your company name"
                required
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className={`block text-sm font-medium text-muted-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              Additional Information
            </label>
            <textarea
              className="w-full px-3 py-2 glass-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your Instagram support needs..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            variant="brand"
            className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
          </form>
        )}

        {/* Footer */}
        {!success && (
          <div className="mt-6 text-center">
            <p className={`text-sm text-muted-foreground ${isRTL ? 'font-arabic' : ''}`}>
              We'll get back to you within 24 hours
            </p>
          </div>
        )}
      </div>
    </div>
  );
};