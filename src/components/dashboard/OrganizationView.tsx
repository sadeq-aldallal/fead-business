import React, { useState } from 'react';
import { Plus, Building2, Settings } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import { InstagramModal } from '../modals/InstagramModal';
import { BusinessModal } from '../modals/BusinessModal';
import { BusinessManagementModal } from '../modals/BusinessManagementModal';
import { Button } from '@/components/ui/button';
import { Business } from '../../types/dashboard';
import { redirectToInstagramAuth } from '../../utils/instagramAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { ActionMenu } from '@/components/ui/action-menu';
import { TouchInteractive } from '@/components/ui/touch-feedback';
import { 
  SkeletonCard, 
  SkeletonDashboard, 
  Skeleton, 
  SkeletonText, 
  SkeletonButton 
} from '@/components/ui/skeleton-loaders';
import { LoadingSpinner, DataLoader } from '@/components/ui/loading-states';
import { CriticalLoader, LazyLoader } from '@/components/ui/progressive-loader';
import { LoadingTransition, StaggeredList } from '@/components/ui/loading-transitions';
import { LoadingMonitor } from '@/components/ui/loading-analytics';

export const OrganizationView: React.FC = () => {
  const { organization, businesses, setCurrentBusiness, loading, error, fetchOrganizationData } = useDashboard();
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  const handleConnectInstagram = (business) => {
    setSelectedBusiness(business);
    setCurrentBusiness(business);
    setShowInstagramModal(true);
  };

  const handleManageBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentBusiness(business);
    setShowManagementModal(true);
  };

  const handleInstagramConnect = () => {
    redirectToInstagramAuth();
  };

  // Custom loading skeleton for organization view
  const organizationLoadingSkeleton = (
    <div className="space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <SkeletonButton size="lg" className="w-32" />
      </div>

      {/* Organization Details Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <SkeletonButton size="md" className="w-28" />
        </div>
        <SkeletonDashboard cards={3} columns={2} />
      </div>
    </div>
  );

  // Empty state when no organization exists
  const emptyState = (
    <div className="text-center py-12 animate-fade-in">
      <div className="text-muted-foreground mb-4">
        <Building2 size={48} className="mx-auto mb-4" />
        <p>No organization found</p>
      </div>
    </div>
  );

  return (
    <LoadingMonitor
      trackKey="organization-view"
      phase="complete"
      onLoadComplete={(duration) => {
        console.log(`Organization view rendered in ${duration.toFixed(0)}ms`);
      }}
      threshold={{ warning: 1000, critical: 2500 }}
    >
      <DataLoader
        data={organization}
        loading={loading}
        error={error}
        loadingSkeleton={organizationLoadingSkeleton}
        emptyState={emptyState}
        errorRetry={fetchOrganizationData}
      >
        {(org) => (
          <div className="space-y-8">
      {/* Organization Header */}
      <CriticalLoader priority="critical">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-responsive-3xl font-bold text-foreground mb-2">{org.name}</h1>
            <p className="text-muted-foreground">Manage your businesses and settings</p>
          </div>
          {businesses.length > 0 && (
            <div className="flex-shrink-0">
              <LoadingTransition
                isLoading={loading}
                enter="scale"
                fallback={<SkeletonButton size="lg" />}
              >
                <Button
                  onClick={() => setShowBusinessModal(true)}
                  variant="outline"
                  leftIcon={<Plus size={20} />}
                >
                  <span className="hidden md:inline">Add Business</span>
                </Button>
              </LoadingTransition>
            </div>
          )}
        </div>
      </CriticalLoader>

      {/* Organization Details */}
      <LazyLoader
        fallback={
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        }
        rootMargin="100px"
      >
        <Card>
          <CardHeader>
            <CardTitle>Organization Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Organization Name</label>
                <p className="text-foreground mt-1">{org.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-foreground mt-1">{org.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground mt-1">{org.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-foreground mt-1">{org.country}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </LazyLoader>

      {/* Businesses Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Businesses</h2>
        
        {businesses.length === 0 ? (
          /* No businesses - Center the create section */
          <div className="flex justify-center">
            <Card className="p-8 text-center max-w-md">
              <CardContent className="flex flex-col items-center space-y-4">
                <TouchInteractive
                  onPress={() => setShowBusinessModal(true)}
                  touchFeedback="scale"
                  hapticFeedback={true}
                >
                  <Button
                    size="lg"
                    className="w-20 h-20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    aria-label="Create Your First Business"
                  >
                    <Plus size={32} />
                  </Button>
                </TouchInteractive>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Create Your First Business</h3>
                  <p className="text-sm text-muted-foreground">Get started by adding a business to your organization</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Has businesses - Show grid */
          <StaggeredList 
            isLoading={loading}
            staggerDelay={150}
            loadingItems={3}
            itemSkeleton={<SkeletonCard showAvatar showActions textLines={3} />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {businesses.map((business) => (
              <TouchInteractive
                key={business.id}
                onPress={() => handleManageBusiness(business)}
                touchFeedback="scale"
                hapticFeedback={true}
                className="w-full"
              >
                <Card className="relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2 size={20} className="text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{business.name}</CardTitle>
                        <CardDescription>{business.type}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <StatusBadge
                        variant={
                          business.instagram_status === 'connected' ? 'connected' :
                          business.instagram_status === 'connecting' ? 'connecting' :
                          business.instagram_status === 'error' ? 'error' :
                          'setup'
                        }
                        pulse={business.instagram_status === 'connecting'}
                      >
                        {business.instagram_status === 'connected' ? 'Live' :
                         business.instagram_status === 'connecting' ? 'Syncing' :
                         business.instagram_status === 'error' ? 'Issue' :
                         'Setup'}
                      </StatusBadge>
                      <ActionMenu
                        items={[
                          {
                            label: 'Manage Business',
                            onClick: () => handleManageBusiness(business),
                            icon: <Settings size={14} />
                          },
                          {
                            label: 'Connect Instagram',
                            onClick: () => handleConnectInstagram(business),
                            disabled: business.instagram_status === 'connected'
                          }
                        ]}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Since</p>
                      <p className="font-medium">{new Date(business.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                    </div>
                    {business.instagram_username && (
                      <div>
                        <p className="text-muted-foreground">Instagram</p>
                        <p className="font-medium">@{business.instagram_username}</p>
                      </div>
                    )}
                  </div>
                </CardContent>

                {business.instagram_status !== 'connected' && (
                  <CardFooter>
                    <Button
                      onClick={() => handleConnectInstagram(business)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Connect Instagram
                    </Button>
                  </CardFooter>
                )}
              </Card>
              </TouchInteractive>
            ))}
            </div>
          </StaggeredList>
        )}
      </div>

          <BusinessModal
            isOpen={showBusinessModal}
            onClose={() => setShowBusinessModal(false)}
          />

          <InstagramModal
            isOpen={showInstagramModal}
            onClose={() => setShowInstagramModal(false)}
            onConnect={handleInstagramConnect}
          />

          {selectedBusiness && (
            <BusinessManagementModal
              isOpen={showManagementModal}
              onClose={() => setShowManagementModal(false)}
              business={selectedBusiness}
            />
          )}
        </div>
        )}
      </DataLoader>
    </LoadingMonitor>
  );
};