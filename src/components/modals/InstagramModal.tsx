import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmedProfessional, setConfirmedProfessional] = useState(false);

  const handleConnect = () => {
    if (acceptedTerms && confirmedProfessional) {
      console.log('Instagram connection initiated');
      onConnect();
    }
  };

  const canConnect = acceptedTerms && confirmedProfessional;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Instagram Account</DialogTitle>
          <DialogDescription>
            Please review and accept the following requirements before connecting your Instagram account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Legal Compliance Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={setAcceptedTerms}
            />
            <Label 
              htmlFor="terms" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I accept the{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Privacy Policy
              </a>
              ,{' '}
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Terms and Conditions
              </a>
              , and{' '}
              <a href="/account-deletion-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Account Deletion Policy
              </a>
            </Label>
          </div>

          {/* Professional Account Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="professional"
              checked={confirmedProfessional}
              onCheckedChange={setConfirmedProfessional}
            />
            <Label 
              htmlFor="professional" 
              className="text-sm leading-relaxed cursor-pointer"
            >
              I confirm my Instagram account is a professional account (Business or Creator).{' '}
              <a 
                href="https://help.instagram.com/502981923235522" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                Learn how to convert to professional account
                <ExternalLink size={14} className="ml-1" />
              </a>
            </Label>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h3 className="text-yellow-600 font-medium mb-2">Important Notice</h3>
            <p className="text-yellow-700 text-sm">
              Your Instagram account must be a Business or Creator account to use our services. 
              Personal accounts are not supported by Instagram's Business API.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              onClick={handleConnect}
              disabled={!canConnect}
              size="lg"
              className="px-8"
            >
              Connect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};