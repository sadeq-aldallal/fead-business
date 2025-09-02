import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Organization, Business, DashboardState } from '../types/dashboard';
import { useLoadingTracker } from '../components/ui/loading-analytics';

interface DashboardContextType extends DashboardState {
  createOrganization: (data: Omit<Organization, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ error: any }>;
  createBusiness: (name: string, organizationId: string, type?: 'retail' | 'service') => Promise<{ error: any }>;
  updateBusiness: (id: string, data: Partial<Business>) => Promise<{ error: any }>;
  deleteBusiness: (id: string) => Promise<{ error: any }>;
  refreshBusinessData: (businessId: string) => Promise<{ error: any }>;
  setCurrentBusiness: (business: Business | null) => void;
  fetchOrganizationData: () => Promise<void>;
  processInstagramCode: (code: string, businessId: string) => Promise<{ error: any }>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    organization: null,
    businesses: [],
    currentBusiness: null,
    loading: true,
    error: null
  });

  // Loading analytics for dashboard data fetching
  const { start: startDataFetch, end: endDataFetch } = useLoadingTracker('dashboard-data-fetch', {
    onComplete: (duration) => {
      if (duration > 2000) {
        console.warn(`Dashboard data fetch took ${duration.toFixed(0)}ms - consider optimization`);
      }
    }
  });

  const fetchOrganizationData = async () => {
    if (!user) return;

    try {
      startDataFetch('loading');
      setDashboardState(prev => ({ ...prev, loading: true, error: null }));

      // Fetch organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (orgError) {
        throw orgError;
      }

      const organization = orgData && orgData.length > 0 ? orgData[0] : null;

      let businesses: Business[] = [];
      if (organization) {
        // Fetch businesses
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('org_id', organization.id)
          .eq('is_deleted', false)
          .order('created_at', { ascending: false });

        if (businessError) {
          throw businessError;
        }

        businesses = businessData || [];
      }

      setDashboardState(prev => ({
        ...prev,
        organization,
        businesses,
        loading: false
      }));
      endDataFetch();
    } catch (error: any) {
      console.error('Error fetching organization data:', error);
      setDashboardState(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
      endDataFetch();
    }
  };

  const createOrganization = async (data: Omit<Organization, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: { message: 'User not authenticated' } };

    try {
      const { data: orgData, error } = await supabase
        .from('organizations')
        .insert([{ ...data, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setDashboardState(prev => ({
        ...prev,
        organization: orgData
      }));

      return { error: null };
    } catch (error: any) {
      console.error('Error creating organization:', error);
      return { error };
    }
  };

  const createBusiness = async (name: string, organizationId: string, type: 'retail' | 'service' = 'service') => {
    if (!user) return { error: { message: 'User not authenticated' } };

    try {
      const { data: businessData, error } = await supabase
        .from('businesses')
        .insert([{ 
          name, 
          type,
          org_id: organizationId, 
          user_id: user.id,
          permissions: {},
          instagram_status: 'disconnected'
        }])
        .select()
        .single();

      if (error) throw error;

      setDashboardState(prev => ({
        ...prev,
        businesses: [businessData, ...prev.businesses]
      }));

      return { error: null };
    } catch (error: any) {
      console.error('Error creating business:', error);
      return { error };
    }
  };

  const updateBusiness = async (id: string, data: Partial<Business>) => {
    try {
      const { data: businessData, error } = await supabase
        .from('businesses')
        .update(data)
        .eq('id', id)
        .eq('is_deleted', false)
        .select()
        .single();

      if (error) throw error;

      setDashboardState(prev => ({
        ...prev,
        businesses: prev.businesses.map(b => b.id === id ? businessData : b),
        currentBusiness: prev.currentBusiness?.id === id ? businessData : prev.currentBusiness
      }));

      return { error: null };
    } catch (error: any) {
      console.error('Error updating business:', error);
      return { error };
    }
  };

  const deleteBusiness = async (id: string) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      // Remove the business from local state
      setDashboardState(prev => ({
        ...prev,
        businesses: prev.businesses.filter(b => b.id !== id),
        currentBusiness: prev.currentBusiness?.id === id ? null : prev.currentBusiness
      }));

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting business:', error);
      return { error };
    }
  };

  const getCurrentBusiness = async () => {
    if (!dashboardState.currentBusiness) return null;
    
    try {
      const { data: businessData, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', dashboardState.currentBusiness.id)
        .single();

      if (error) throw error;
      return businessData;
    } catch (error) {
      console.error('Error getting current business:', error);
      return null;
    }
  };

  const refreshBusinessData = async (businessId: string) => {
    try {
      const { data: businessData, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .eq('is_deleted', false)
        .single();

      if (error) throw error;

      setDashboardState(prev => ({
        ...prev,
        businesses: prev.businesses.map(b => b.id === businessId ? businessData : b),
        currentBusiness: prev.currentBusiness?.id === businessId ? businessData : prev.currentBusiness
      }));

      return { error: null };
    } catch (error: any) {
      console.error('Error refreshing business data:', error);
      return { error };
    }
  };

  const processInstagramCode = async (code: string, businessId: string) => {
    try {
      console.log('DashboardContext: Processing Instagram OAuth callback:', {
        code: code,
        businessId,
        businessName: dashboardState.businesses.find(b => b.id === businessId)?.name
      });

      // Update business status to connecting
      await updateBusiness(businessId, { instagram_status: 'connecting' });
      
      console.log('DashboardContext: Sending code to n8n webhook...');
      
      // Send code directly to N8N webhook
      const webhookResponse = await fetch('https://fead.app.n8n.cloud/webhook/ig_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code,
          business_id: businessId,
          business_name: dashboardState.businesses.find(b => b.id === businessId)?.name,
          redirect_uri: import.meta.env.VITE_INSTAGRAM_REDIRECT_URL || 'https://fead.app/',
          client_id: import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '1292743865568326',
          env: import.meta.env.VITE_ENV || 'dev'
        })
      });

      console.log('DashboardContext: Webhook response status:', webhookResponse.status);
      
      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('DashboardContext: Webhook error response:', errorText);
        throw new Error(`Webhook request failed: ${webhookResponse.status} - ${errorText}. Make sure your n8n workflow is ACTIVE (not in test mode).`);
      }

      const webhookResult = await webhookResponse.json();
      console.log('DashboardContext: Webhook result:', webhookResult);

      // Check for already_exist status
      if (webhookResult.status === 'already_exist') {
        throw new Error(`This Instagram account (@${webhookResult.ig_account_username}) is already connected to another business. Please disconnect it first or use a different Instagram account.`);
      }

      // Check for success in the response
      if (!webhookResult.success && webhookResult.status !== 'created' && webhookResult.status !== 'connected') {
        throw new Error(`Unexpected webhook response: ${JSON.stringify(webhookResult)}. Check if n8n workflow is active.`);
      }

      console.log('DashboardContext: Webhook request successful, implementing 10-second wait workaround...');
      
      // Implement 10-second wait workaround
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      console.log('DashboardContext: Wait period complete, refetching business data...');
      
      // Refetch business data to check connection status
      const { data: businessData, error: fetchError } = await supabase
        .from('businesses')
        .select('id, name, instagram_status, instagram_username, instagram_account_id, is_webhook_subscribed')
        .eq('id', businessId)
        .single();

      if (fetchError) {
        console.error('DashboardContext: Error refetching business data:', fetchError);
        throw new Error('Failed to verify Instagram connection status');
      }

      console.log('DashboardContext: Refetched business data:', businessData);

      // Update the business in state with refetched data
      setDashboardState(prev => ({
        ...prev,
        businesses: prev.businesses.map(b => b.id === businessId ? businessData : b),
        currentBusiness: prev.currentBusiness?.id === businessId ? businessData : prev.currentBusiness
      }));

      // Validate connection status
      const isConnected = businessData.instagram_status === 'connected';
      const isWebhookSubscribed = businessData.is_webhook_subscribed === true;

      if (!isConnected || !isWebhookSubscribed) {
        console.log('DashboardContext: Connection validation failed:', { isConnected, isWebhookSubscribed });
        throw new Error('Instagram connection was not completed successfully. Please try again.');
      }

      console.log('DashboardContext: Instagram connection validation successful!');
      return { error: null };
    } catch (error: any) {
      console.error('DashboardContext: Error processing Instagram code:', error);
      // Update business status to error on failure
      await updateBusiness(businessId, { instagram_status: 'error' });
      return { error };
    }
  };

  const setCurrentBusiness = (business: Business | null) => {
    setDashboardState(prev => ({
      ...prev,
      currentBusiness: business
    }));
  };

  useEffect(() => {
    if (user) {
      fetchOrganizationData();
    } else {
      setDashboardState({
        organization: null,
        businesses: [],
        currentBusiness: null,
        loading: false,
        error: null
      });
    }
  }, [user]);

  const value: DashboardContextType = {
    ...dashboardState,
    createOrganization,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    refreshBusinessData,
    setCurrentBusiness,
    fetchOrganizationData,
    processInstagramCode
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};