import React, { useState } from 'react';
import { User, Mail, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/Input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { authHelpers } from '../../lib/supabase';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await authHelpers.updateProfile({
        full_name: formData.name,
        email: formData.email
      });

      if (error) {
        setError(error.message || 'Failed to update profile');
        return;
      }

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await authHelpers.deleteAccount();
      
      if (error) {
        console.error('Account deletion failed:', error);
        
        if (error.critical) {
          setError(`${error.message}\n\nThis affects app compliance. Please contact support immediately.`);
        } else {
          setError(error.message || 'Failed to delete account. Please try again or contact support.');
        }
        
        setLoading(false);
        return;
      }

      // Account deleted successfully - compliance requirement met
      console.log('Account deletion successful - user being redirected');
      
      // Show brief success message before redirect
      setSuccess('Account deleted successfully. Redirecting...');
      
      setTimeout(() => {
        // Force reload to ensure clean state and redirect to landing page
        window.location.href = '/';
      }, 1500);
      
    } catch (err) {
      console.error('Unexpected error during account deletion:', err);
      setError('An unexpected error occurred. Please contact support to ensure your account is properly deleted for compliance.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account information and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Success Message */}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription style={{ whiteSpace: 'pre-line' }}>{error}</AlertDescription>
            </Alert>
          )}

          {!showDeleteConfirm ? (
            <>
              {/* Profile Update Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center">
                    <User size={16} className="mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </form>

              {/* Danger Zone */}
              <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                <h3 className="text-sm font-semibold text-destructive mb-2 flex items-center">
                  <AlertTriangle size={18} className="mr-2" />
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  leftIcon={<Trash2 size={16} />}
                >
                  Delete Account
                </Button>
              </div>
            </>
          ) : (
            /* Delete Confirmation */
            <div className="space-y-4">
              <div className="text-center">
                <AlertTriangle size={48} className="mx-auto text-destructive mb-4" />
                <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete your account and all associated data (organization, businesses) from our system. 
                  You will be signed out immediately. This action cannot be undone.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-delete">
                  Type "DELETE MY ACCOUNT" to confirm
                </Label>
                <Input
                  id="confirm-delete"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                    setError('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  disabled={loading || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                  variant="destructive"
                  className="flex-1"
                >
                  {loading ? 'Deleting...' : 'Delete Forever'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};