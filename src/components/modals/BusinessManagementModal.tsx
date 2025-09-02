import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Users } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { Business } from '../../types/dashboard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

interface BusinessManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
}

export const BusinessManagementModal: React.FC<BusinessManagementModalProps> = ({
  isOpen,
  onClose,
  business
}) => {
  const { updateBusiness, deleteBusiness } = useDashboard();
  const [mode, setMode] = useState<'test' | 'production'>(business.mode || 'test');
  const [testers, setTesters] = useState<string[]>(business.testers || []);
  const [newTester, setNewTester] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleModeToggle = async (newMode: 'test' | 'production') => {
    setLoading(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await updateBusiness(business.id, { mode: newMode });
    
    if (updateError) {
      setError('Failed to update mode');
    } else {
      setMode(newMode);
      setSuccess(`Mode changed to ${newMode}`);
      setTimeout(() => setSuccess(''), 3000);
    }
    
    setLoading(false);
  };

  const handleAddTester = async () => {
    if (!newTester.trim()) return;
    
    // Validate Instagram username format (basic validation)
    const username = newTester.trim().replace('@', '');
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
      setError('Invalid Instagram username format');
      return;
    }

    if (testers.includes(username)) {
      setError('This username is already added');
      return;
    }

    if (testers.length >= 7) {
      setError('Maximum 7 testers allowed in test mode');
      return;
    }

    const updatedTesters = [...testers, username];
    setLoading(true);
    setError('');

    const { error: updateError } = await updateBusiness(business.id, { testers: updatedTesters });
    
    if (updateError) {
      setError('Failed to add tester');
    } else {
      setTesters(updatedTesters);
      setNewTester('');
      setSuccess('Tester added successfully');
      setTimeout(() => setSuccess(''), 3000);
    }
    
    setLoading(false);
  };

  const handleRemoveTester = async (username: string) => {
    const updatedTesters = testers.filter(t => t !== username);
    setLoading(true);
    setError('');

    const { error: updateError } = await updateBusiness(business.id, { testers: updatedTesters });
    
    if (updateError) {
      setError('Failed to remove tester');
    } else {
      setTesters(updatedTesters);
      setSuccess('Tester removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    }
    
    setLoading(false);
  };

  const handleDeleteBusiness = async () => {
    if (deleteConfirmText !== business.name) {
      setError(`Please type "${business.name}" to confirm deletion`);
      return;
    }

    setDeleteLoading(true);
    setError('');

    const { error: deleteError } = await deleteBusiness(business.id);
    
    if (deleteError) {
      setError('Failed to delete business');
      setDeleteLoading(false);
    } else {
      setSuccess('Business deleted successfully.');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleDisconnectInstagram = async () => {
    const confirmMessage = `Are you sure you want to disconnect @${business.instagram_username}?\n\nThis will:\n• Stop all automated responses\n• Remove access to Instagram messages\n• Require reconnection to resume service\n\nThis action cannot be undone automatically.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setDisconnectLoading(true);
    setError('');

    try {
      // Call your n8n webhook to handle Instagram disconnection
      const disconnectResponse = await fetch('https://fead.app.n8n.cloud/webhook/instagram-disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          business_id: business.id,
          instagram_account_id: business.instagram_account_id,
          action: 'disconnect'
        })
      });

      if (!disconnectResponse.ok) {
        throw new Error('Failed to disconnect Instagram account');
      }

      // Update the business status locally
      const { error: updateError } = await updateBusiness(business.id, {
        instagram_status: 'disconnected',
        instagram_username: null,
        instagram_account_id: null,
        access_token: null,
        is_webhook_subscribed: false
      });

      if (updateError) {
        throw new Error('Failed to update business status');
      }

      setSuccess('Instagram account disconnected successfully');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError('Failed to initiate Instagram disconnection');
    } finally {
      setDisconnectLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTester();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Business</DialogTitle>
          <DialogDescription>
            Configure settings for {business.name}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/15 border border-destructive/20 rounded-md p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/15 border border-green-500/20 rounded-md p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Mode Toggle Section */}
          <Card>
            <CardHeader>
              <CardTitle>Mode Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Current Mode</Label>
                  <p className="text-muted-foreground text-sm">
                    {mode === 'test' ? 'Test Mode - Limited to 7 Instagram accounts' : 'Production Mode - Unlimited accounts'}
                  </p>
                </div>
                <div className="flex bg-muted rounded-md p-1">
                  <Button
                    onClick={() => handleModeToggle('test')}
                    disabled={loading}
                    variant={mode === 'test' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Test
                  </Button>
                  <Button
                    onClick={() => handleModeToggle('production')}
                    disabled={loading}
                    variant={mode === 'production' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Production
                  </Button>
                </div>
              </div>

              {/* Test Mode Testers Section */}
              {mode === 'test' && (
                <div className="pt-4 border-t">
                  <div className="flex items-center mb-4">
                    <Users className="w-4 h-4 mr-2" />
                    <Label className="text-base font-medium">Test Instagram Accounts</Label>
                    <Badge variant="secondary" className="ml-2">
                      {testers.length}/7
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    Add Instagram usernames that can interact with your AI agent during testing. 
                    <strong className="text-yellow-600"> Username must exactly match the Instagram username.</strong>
                  </p>

                  {/* Add Tester Input */}
                  <div className="flex space-x-2 mb-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        value={newTester}
                        onChange={(e) => setNewTester(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-8"
                        placeholder="instagram_username"
                        disabled={loading || testers.length >= 7}
                      />
                    </div>
                    <Button
                      onClick={handleAddTester}
                      disabled={loading || !newTester.trim() || testers.length >= 7}
                      size="icon"
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Testers List */}
                  {testers.length > 0 && (
                    <div className="space-y-2">
                      {testers.map((username, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted rounded-md px-3 py-2">
                          <span>@{username}</span>
                          <Button
                            onClick={() => handleRemoveTester(username)}
                            disabled={loading}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {testers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No test accounts added yet</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
            
              {!showDeleteConfirm ? (
                <div>
                  <Label className="text-base font-medium mb-2">Delete Business</Label>
                  <p className="text-muted-foreground text-sm mb-4">
                    This will permanently delete this business and all associated data. This action cannot be undone and there is no way to restore it.
                  </p>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="destructive"
                  >
                    Delete Business
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <AlertTriangle size={48} className="mx-auto text-destructive mb-4" />
                    <Label className="text-destructive font-medium mb-2">Permanently Delete Business</Label>
                    <p className="text-muted-foreground text-sm">
                      This will permanently delete <strong>{business.name}</strong> and all associated data. 
                      This action cannot be undone and there is no way to restore it.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Type "{business.name}" to confirm deletion
                    </Label>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder={business.name}
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
                      onClick={handleDeleteBusiness}
                      disabled={deleteLoading || deleteConfirmText !== business.name}
                      variant="destructive"
                      className="flex-1"
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete Forever'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};