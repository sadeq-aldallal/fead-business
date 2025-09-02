import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase, authHelpers } from '../lib/supabase'
import { AuthContextType, AuthState, AuthUser } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await authHelpers.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        
        setAuthState({
          user: session?.user as AuthUser || null,
          session,
          loading: false,
          initialized: true
        })
      } catch (error) {
        console.error('Error initializing auth:', error)
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true
        }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setAuthState({
          user: session?.user as AuthUser || null,
          session,
          loading: false,
          initialized: true
        })

        // Handle specific events
        if (event === 'SIGNED_IN') {
          console.log('User signed in successfully')
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    try {
      const userData = fullName ? { full_name: fullName } : undefined
      const { data, error } = await authHelpers.signUp(email, password, userData)
      
      if (error) {
        // Handle email confirmation error specifically
        if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
          setAuthState(prev => ({ ...prev, loading: false }))
          return { 
            error: {
              ...error,
              message: 'Please check your email and click the confirmation link to activate your account. If you don\'t see the email, check your spam folder.'
            }
          }
        }
        setAuthState(prev => ({ ...prev, loading: false }))
        return { error }
      }

      // For email confirmation disabled, user should be signed in immediately
      if (data.user && data.session) {
        setAuthState({
          user: data.user as AuthUser,
          session: data.session,
          loading: false,
          initialized: true
        })
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }

      return { error: null }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    try {
      const { data, error } = await authHelpers.signIn(email, password)
      
      if (error) {
        // Handle email confirmation error specifically
        if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
          setAuthState(prev => ({ ...prev, loading: false }))
          return { 
            error: {
              ...error,
              message: 'Please check your email and click the confirmation link to activate your account before signing in. If you don\'t see the email, check your spam folder.'
            }
          }
        }
        setAuthState(prev => ({ ...prev, loading: false }))
        return { error }
      }

      setAuthState({
        user: data.user as AuthUser,
        session: data.session,
        loading: false,
        initialized: true
      })

      return { error: null }
    } catch (error) {
      setAuthState(prev => ({ ...prev, loading: false }))
      return { error }
    }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    try {
      const { error } = await authHelpers.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
      
      setAuthState({
        user: null,
        session: null,
        loading: false,
        initialized: true
      })
    } catch (error) {
      console.error('Error during sign out:', error)
      setAuthState(prev => ({ ...prev, loading: false }))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await authHelpers.resetPassword(email)
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { data, error } = await authHelpers.updatePassword(password)
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value: AuthContextType = {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}