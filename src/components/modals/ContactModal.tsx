import React, { useState } from 'react';
import { Mail, User, MessageSquare, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sendContactEmail } from '../../services/emailService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { t, isRTL } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await sendContactEmail(formData);
      
      if (result.success) {
        setSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: '', email: '', subject: '', message: '' });
          onClose();
        }, 3000);
      } else {
        setError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={isRTL ? 'font-arabic text-right' : ''}>
            {t('contact.title')}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'font-arabic text-right' : ''}>
            {isRTL ? 'نحن هنا لمساعدتك. أرسل لنا رسالة وسنرد عليك قريباً.' : 'We\'re here to help. Send us a message and we\'ll respond soon.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className={`text-green-600 text-lg font-semibold ${isRTL ? 'font-arabic' : ''}`}>
                Message sent successfully! We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                  <User size={16} className="mr-2" />
                  {t('contact.name')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isRTL ? 'أحمد محمد' : 'John Doe'}
                  className={isRTL ? 'text-right font-arabic' : ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                  <Mail size={16} className="mr-2" />
                  {t('contact.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={isRTL ? 'ahmed@example.com' : 'john@example.com'}
                  className={isRTL ? 'text-right font-arabic' : ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                  <FileText size={16} className="mr-2" />
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={isRTL ? 'موضوع الرسالة' : 'What can we help you with?'}
                  className={isRTL ? 'text-right font-arabic' : ''}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className={`flex items-center ${isRTL ? 'font-arabic' : ''}`}>
                  <MessageSquare size={16} className="mr-2" />
                  {t('contact.message')}
                </Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  className={isRTL ? 'text-right font-arabic' : ''}
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? (isRTL ? 'جاري الإرسال...' : 'Sending...') : t('contact.send')}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};