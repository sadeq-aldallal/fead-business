import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/loading-states'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  requireAuth = true 
}) => {
  const { user, loading, initialized } = useAuth()

  // Show loading spinner while initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner 
          variant="spinner" 
          size="lg" 
          text="Loading..."
          className="animate-fade-in"
        />
      </div>
    )
  }

  // If auth is required but user is not authenticated
  if (requireAuth && !user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card border border-border rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access this page.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            variant="brand"
            className="px-6 py-2"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  // If auth is not required but user is authenticated, might want to redirect
  if (!requireAuth && user) {
    // Could redirect to dashboard or just show the content
    return <>{children}</>
  }

  return <>{children}</>
}