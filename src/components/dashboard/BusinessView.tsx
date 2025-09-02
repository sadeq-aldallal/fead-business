import React, { useState, useEffect } from 'react';
import { Instagram, RefreshCw, AlertCircle, CheckCircle, ExternalLink, HelpCircle, Clock, PartyPopper } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { InstagramModal } from '../modals/InstagramModal';
import { Button } from '@/components/ui/button';
import { redirectToInstagramAuth } from '../../utils/instagramAuth';

export const BusinessView: React.FC = () => {
  const { currentBusiness, refreshBusinessData } = useDashboard();
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isProcessingConnection, setIsProcessingConnection] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  
  // Check if we're currently processing OAuth (business status is 'connecting')
  const isProcessingOAuth = currentBusiness?.instagram_status === 'connecting';

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (showCountdown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showCountdown, countdown]);

  const handleInstagramConnect = () => {
    setIsProcessingConnection(true);
    setError('');
    setSuccess('');
    
    redirectToInstagramAuth();
  };

  // Listen for successful Instagram connections
  useEffect(() => {
    if (currentBusiness?.instagram_status === 'connected' && 
        currentBusiness?.is_webhook_subscribed === true && 
        isProcessingConnection) {
      setSuccess('Hooray! Your Instagram account has successfully connected');
      setIsProcessingConnection(false);
      setError('');
      setShowCountdown(false);
      setCountdown(0);
    }
  }, [currentBusiness, isProcessingConnection]);

  const handleRefreshInstagramData = async () => {
    if (!currentBusiness) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: refreshError } = await refreshBusinessData(currentBusiness.id);
      
      if (refreshError) {
        throw new Error(refreshError.message);
      }

      if (currentBusiness.instagram_username) {
        setSuccess('Instagram account data refreshed successfully!');
      } else {
        setError('Instagram account data not yet available. Please wait a moment and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to refresh Instagram data');
    } finally {
      setLoading(false);
    }
  };

  const startCountdownAndRefresh = async () => {
    setShowCountdown(true);
    setCountdown(10);
    
    // Wait for countdown to complete
    await new Promise(resolve => {
      const checkCountdown = () => {
        if (countdown === 0 && !showCountdown) {
          resolve(void 0);
        } else {
          setTimeout(checkCountdown, 100);
        }
      };
      checkCountdown();
    });
    
    // Refresh data after countdown
    await handleRefreshInstagramData();
  };
  if (!currentBusiness) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 mb-4">
          <Instagram size={48} className="mx-auto mb-4" />
          <p>Please select a business from the organization view</p>
        </div>
      </div>
    );
  }

  const isConnected = currentBusiness.instagram_status === 'connected';
  const isConnecting = currentBusiness.instagram_status === 'connecting';
  const hasError = currentBusiness.instagram_status === 'error';
  const isPending = isProcessingOAuth || isConnecting;

  return (
    <div className="space-y-8">
      {/* Business Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{currentBusiness.name}</h1>
        <p className="text-white/70">Manage your Instagram integration and business settings</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="error-message flex items-center">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <div>
            <p>{error}</p>
            <p className="text-sm mt-1">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="success-message flex items-center">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <div className="flex items-center">
            {success.includes('Hooray') && (
              <PartyPopper size={20} className="mr-2 text-green-400" />
            )}
            <p>{success}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="success-message flex items-center">
          <CheckCircle size={20} className="mr-2 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Instagram Integration Section */}
      <div className="business-card">
        <div className="business-card-header">
          <h2 className="business-card-title">Instagram Integration</h2>
        </div>

        {isConnected ? (
          /* Connected State */
          <div className="instagram-account-card">
            <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center">
              <Instagram size={40} className="text-pink-400" />
            </div>
            <div className="instagram-account-info flex-1">
              <h3>@{currentBusiness.instagram_username}</h3>
              <p>Account ID: {currentBusiness.instagram_account_id}</p>
              <p className="text-green-400 text-sm mt-2">✓ Successfully connected</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleRefreshInstagramData}
                disabled={loading}
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw size={16} className={loading ? 'animate-spin' : ''} />}
              >
                Refresh
              </Button>
              <Button
                onClick={() => setShowInstagramModal(true)}
                variant="outline"
                size="sm"
              >
                Reconnect
              </Button>
            </div>
          </div>
        ) : isConnecting ? (
          /* Connecting State */
          <div className="instagram-connection">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center relative">
                <RefreshCw size={32} className="text-yellow-400 animate-spin" />
                <div className="absolute inset-0 rounded-full border-2 border-yellow-400/30 animate-ping"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Processing Instagram Connection</h3>
            <p className="text-white/70 mb-6">
              We're setting up your Instagram account. This usually takes a few moments.
            </p>
            
            {/* Countdown Display */}
            {showCountdown && (
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-4 border-blue-400/30">
                    <span className="text-3xl font-bold text-blue-400">{countdown}</span>
                  </div>
                </div>
                <p className="text-blue-400 text-center font-medium">
                  Checking connection status in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
                <div className="mt-4 bg-blue-500/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-400 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <Button
              onClick={showCountdown ? undefined : startCountdownAndRefresh}
              disabled={loading || showCountdown}
              variant="outline"
              leftIcon={<RefreshCw size={16} className={loading || showCountdown ? 'animate-spin' : ''} />}
            >
              {showCountdown ? 'Checking...' : 'Check Status'}
            </Button>
          </div>
        ) : isPending || isProcessingConnection ? (
          /* OAuth Processing State */
          <div className="instagram-connection">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center relative">
                <Clock size={32} className="text-orange-400" />
                <div className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-ping"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              {isProcessingConnection ? 'Finalizing Instagram Connection' : 'Processing OAuth Connection'}
            </h3>
            <p className="text-white/70 mb-6">
              {isProcessingConnection 
                ? 'We\'re finalizing your Instagram connection and setting up webhooks. This may take a few moments...'
                : 'We\'re processing your Instagram authorization. Please wait while we establish the connection.'}
            </p>
            
            {/* Countdown Display for Processing */}
            {showCountdown && isProcessingConnection && (
              <div className="mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center border-4 border-orange-400/30">
                    <span className="text-3xl font-bold text-orange-400">{countdown}</span>
                  </div>
                </div>
                <p className="text-orange-400 text-center font-medium">
                  Finalizing connection in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
                <div className="mt-4 bg-orange-500/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-orange-400 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-2 text-orange-400">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : hasError ? (
          /* Error State */
          <div className="instagram-connection">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Connection Failed</h3>
            <p className="text-white/70 mb-6">
              We apologize, but we couldn't connect your Instagram account. Please try again or contact support if the problem persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowInstagramModal(true)}
                className="bg-green-600 hover:bg-green-700"
                leftIcon={<Instagram size={20} />}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                leftIcon={<HelpCircle size={20} />}
              >
                Get Help
              </Button>
            </div>
          </div>
        ) : (
          /* Not Connected State */
          <div className="instagram-connection">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center">
                <Instagram size={32} className="text-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Connect Your Instagram Account</h3>
            <p className="text-white/70 mb-6">
              Connect your Instagram Business or Creator account to start automating your customer support with AI.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => setShowInstagramModal(true)}
                className="bg-green-600 hover:bg-green-700"
                leftIcon={<Instagram size={20} />}
              >
                Connect Instagram
              </Button>
              <p className="text-white/60 text-sm">
                Make sure your Instagram account is set to Business or Creator mode before connecting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Business Settings */}
      <div className="business-card">
        <div className="business-card-header">
          <h2 className="business-card-title">Business Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="form-label">Business Name</label>
            <p className="text-white">{currentBusiness.name}</p>
          </div>
          <div>
            <label className="form-label">Business Type</label>
            <p className="text-white capitalize">{currentBusiness.type}</p>
          </div>
          <div>
            <label className="form-label">Status</label>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                currentBusiness.instagram_status === 'connected' ? 'bg-green-400' :
                currentBusiness.instagram_status === 'connecting' ? 'bg-yellow-400' :
                currentBusiness.instagram_status === 'error' ? 'bg-red-400' :
                'bg-gray-400'
              }`}></div>
              <span className={`text-sm ${
                currentBusiness.instagram_status === 'connected' ? 'status-connected' :
                currentBusiness.instagram_status === 'connecting' ? 'status-connecting' :
                currentBusiness.instagram_status === 'error' ? 'status-error' :
                'status-disconnected'
              }`}>
                {currentBusiness.instagram_status === 'connected' ? 'Instagram Connected' :
                 currentBusiness.instagram_status === 'connecting' ? 'Connecting to Instagram...' :
                 currentBusiness.instagram_status === 'error' ? 'Instagram Connection Error' :
                 'Instagram Not Connected'}
              </span>
            </div>
          </div>
          <div>
            <label className="form-label">Created</label>
            <p className="text-white">{new Date(currentBusiness.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="form-label">Last Updated</label>
            <p className="text-white">{new Date(currentBusiness.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <InstagramModal
        isOpen={showInstagramModal}
        onClose={() => setShowInstagramModal(false)}
        onConnect={handleInstagramConnect}
      />
    </div>
  );
};