import { createClient } from '@supabase/supabase-js'

// Get environment variables and validate them
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// For development, use mock values if environment variables are not set
const defaultUrl = 'https://mock-project.supabase.co'
const defaultKey = 'mock-anon-key'

// Use provided values or fallback to defaults
const finalUrl = supabaseUrl && supabaseUrl !== 'https://your-project-ref.supabase.co' ? supabaseUrl : defaultUrl
const finalKey = supabaseAnonKey && supabaseAnonKey !== 'your-anon-public-key-here' ? supabaseAnonKey : defaultKey

// Only show warning if using mock values
if (finalUrl === defaultUrl || finalKey === defaultKey) {
  console.warn('⚠️  Using mock Supabase credentials. Authentication will not work.')
  console.warn('📝 To enable authentication:')
  console.warn('   1. Create a Supabase project at https://supabase.com')
  console.warn('   2. Get your Project URL and anon key from Settings > API')
  console.warn('   3. Update your .env.local file with real credentials')
  console.warn('   4. Restart your development server')
}

console.log('Supabase client initialized with URL:', finalUrl.substring(0, 30) + '...')

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
})

// Auth helper functions
export const authHelpers = {
  signUp: async (email: string, password: string, userData?: any) => {
    if (finalUrl === defaultUrl) {
      return { data: null, error: { message: 'Authentication disabled: Please configure Supabase credentials' } }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: userData
      }
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    if (finalUrl === defaultUrl) {
      return { data: null, error: { message: 'Authentication disabled: Please configure Supabase credentials' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    if (finalUrl === defaultUrl) {
      return { error: null }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  resetPassword: async (email: string) => {
    if (finalUrl === defaultUrl) {
      return { data: null, error: { message: 'Authentication disabled: Please configure Supabase credentials' } }
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  updatePassword: async (password: string) => {
    if (finalUrl === defaultUrl) {
      return { data: null, error: { message: 'Authentication disabled: Please configure Supabase credentials' } }
    }
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  getCurrentUser: async () => {
    if (finalUrl === defaultUrl) {
      return { user: null, error: null }
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  getSession: async () => {
    if (finalUrl === defaultUrl) {
      return { session: null, error: null }
    }
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  updateProfile: async (userData: { full_name?: string; email?: string }) => {
    if (finalUrl === defaultUrl) {
      return { data: null, error: { message: 'Authentication disabled: Please configure Supabase credentials' } }
    }
    const { data, error } = await supabase.auth.updateUser({
      email: userData.email,
      data: { full_name: userData.full_name }
    })
    return { data, error }
  },

  deleteAccount: async () => {
    if (finalUrl === defaultUrl) {
      return { error: { message: 'Authentication disabled: Please configure Supabase credentials' } }
    }
    
    try {
      // Get the current user
      const { data: { user }, error: getUserError } = await supabase.auth.getUser()
      if (getUserError || !user) {
        return { error: { message: 'No authenticated user found' } }
      }

      // Call n8n webhook for complete user deletion (Facebook compliance requirement)
      console.log('Initiating account deletion via webhook for user:', user.id);
      
      const deleteResponse = await fetch('https://fead.app.n8n.cloud/webhook/delete-user-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Fead-App-Account-Deletion/1.0'
        },
        body: JSON.stringify({
          user_id: user.id,
          email: user.email,
          action: 'delete_account',
          timestamp: new Date().toISOString(),
          source: 'user_settings_modal'
        }),
        // Add timeout for reliability
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!deleteResponse.ok) {
        const errorText = await deleteResponse.text();
        console.error('Account deletion webhook failed:', {
          status: deleteResponse.status,
          statusText: deleteResponse.statusText,
          error: errorText
        });
        throw new Error(`Account deletion failed: Server returned ${deleteResponse.status}. This is required for compliance.`);
      }

      const result = await deleteResponse.json();
      
      if (!result.success) {
        console.error('Account deletion webhook returned failure:', result);
        throw new Error(result.error || 'Account deletion was not completed successfully. This is required for compliance.');
      }

      console.log('Account deletion completed successfully:', {
        user_id: user.id,
        email: user.email,
        deleted_at: new Date().toISOString()
      });

      // Sign out the user after successful deletion
      await supabase.auth.signOut()
      
      return { error: null }
    } catch (err) {
      console.error('Critical account deletion error:', err)
      
      // For Facebook compliance, we must report deletion failures clearly
      return { 
        error: { 
          message: err instanceof Error ? err.message : 'Account deletion failed. Please contact support for manual deletion to maintain compliance.',
          critical: true
        } 
      }
    }
  }
}