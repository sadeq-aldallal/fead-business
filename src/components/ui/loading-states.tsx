import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"
import { 
  Skeleton, 
  SkeletonCard, 
  SkeletonDashboard, 
  SkeletonForm, 
  SkeletonTable,
  SkeletonText
} from "./skeleton-loaders"

// Loading state variants
const loadingVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        spinner: "gap-3",
        pulse: "",
        dots: "gap-1",
        skeleton: "w-full",
        overlay: "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        inline: "gap-2 py-2",
        minimal: "gap-2",
      },
      size: {
        xs: "text-xs py-1",
        sm: "text-sm py-2",
        md: "text-base py-4",
        lg: "text-lg py-6",
        xl: "text-xl py-8",
      },
    },
    defaultVariants: {
      variant: "spinner",
      size: "md",
    },
  }
)

// Loading spinner component
export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
  showText?: boolean
  icon?: React.ReactNode
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, variant, size, text = "Loading...", showText = true, icon, ...props }, ref) => {
    const defaultIcon = <Loader2 className="animate-spin" />
    const displayIcon = icon || defaultIcon

    if (variant === "skeleton") {
      return <Skeleton className={cn("h-20 w-full", className)} ref={ref} />
    }

    if (variant === "dots") {
      return (
        <div
          ref={ref}
          className={cn(loadingVariants({ variant, size, className }))}
          role="status"
          aria-label={text}
          {...props}
        >
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          </div>
          {showText && (
            <span className="text-muted-foreground">{text}</span>
          )}
        </div>
      )
    }

    if (variant === "pulse") {
      return (
        <div
          ref={ref}
          className={cn(loadingVariants({ variant, size, className }), "animate-pulse")}
          role="status"
          aria-label={text}
          {...props}
        >
          <div className="w-4 h-4 bg-primary rounded-full" />
          {showText && (
            <span className="text-muted-foreground ml-3">{text}</span>
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(loadingVariants({ variant, size, className }))}
        role="status"
        aria-label={text}
        {...props}
      >
        {displayIcon}
        {showText && (
          <span className="text-muted-foreground">{text}</span>
        )}
      </div>
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

// Enhanced loading overlay
export interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  text?: string
  className?: string
  overlay?: boolean
  blur?: boolean
  spinner?: React.ReactNode
}

export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    isLoading, 
    children, 
    text = "Loading...", 
    className, 
    overlay = true,
    blur = true,
    spinner
  }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)}>
        {children}
        
        {isLoading && overlay && (
          <div className={cn(
            "absolute inset-0 z-10 flex items-center justify-center",
            blur ? "bg-background/80 backdrop-blur-sm" : "bg-background/60"
          )}>
            <LoadingSpinner
              text={text}
              icon={spinner}
              className="bg-card border border-border rounded-lg p-6 shadow-lg"
            />
          </div>
        )}
        
        {isLoading && !overlay && (
          <div className="py-8">
            <LoadingSpinner text={text} icon={spinner} />
          </div>
        )}
      </div>
    )
  }
)
LoadingOverlay.displayName = "LoadingOverlay"

// Progressive loading wrapper
export interface ProgressiveLoadingProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  skeleton?: React.ReactNode
  isLoading: boolean
  error?: string | null
  retry?: () => void
  className?: string
  staggered?: boolean
  delay?: number
}

export const ProgressiveLoading = React.forwardRef<HTMLDivElement, ProgressiveLoadingProps>(
  ({ 
    children, 
    fallback, 
    skeleton, 
    isLoading, 
    error, 
    retry, 
    className,
    staggered = false,
    delay = 0
  }, ref) => {
    const [showContent, setShowContent] = React.useState(false)
    const [showError, setShowError] = React.useState(false)

    React.useEffect(() => {
      if (!isLoading && !error) {
        const timer = setTimeout(() => {
          setShowContent(true)
        }, delay)
        return () => clearTimeout(timer)
      } else if (error) {
        const timer = setTimeout(() => {
          setShowError(true)
        }, 100)
        return () => clearTimeout(timer)
      } else {
        setShowContent(false)
        setShowError(false)
      }
    }, [isLoading, error, delay])

    if (error && showError) {
      return (
        <div ref={ref} className={cn("text-center py-8", className)}>
          <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto animate-fade-in">
            <AlertCircle className="w-12 h-12 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Failed to load</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {typeof error === 'string' ? error : 'Something went wrong. Please try again.'}
              </p>
            </div>
            {retry && (
              <button
                onClick={retry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div ref={ref} className={cn("animate-fade-in", className)}>
          {skeleton || fallback || (
            <div className="space-y-4">
              <SkeletonCard showAvatar showActions textLines={3} />
              <SkeletonCard showActions textLines={2} />
              <SkeletonCard showAvatar textLines={4} />
            </div>
          )}
        </div>
      )
    }

    if (showContent) {
      return (
        <div 
          ref={ref} 
          className={cn(
            "animate-fade-in",
            staggered && "stagger-animation",
            className
          )}
        >
          {children}
        </div>
      )
    }

    return null
  }
)
ProgressiveLoading.displayName = "ProgressiveLoading"

// Loading state context for managing app-wide loading
interface LoadingState {
  [key: string]: boolean
}

interface LoadingContextType {
  loadingStates: LoadingState
  setLoading: (key: string, loading: boolean) => void
  isLoading: (key: string) => boolean
  isAnyLoading: () => boolean
  clearAll: () => void
}

const LoadingContext = React.createContext<LoadingContextType | null>(null)

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = React.useState<LoadingState>({})

  const setLoading = React.useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }))
  }, [])

  const isLoading = React.useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const isAnyLoading = React.useCallback(() => {
    return Object.values(loadingStates).some(Boolean)
  }, [loadingStates])

  const clearAll = React.useCallback(() => {
    setLoadingStates({})
  }, [])

  const contextValue = React.useMemo(() => ({
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    clearAll,
  }), [loadingStates, setLoading, isLoading, isAnyLoading, clearAll])

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = React.useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

// Smart loading hook for async operations
export const useAsyncLoading = (
  asyncFn: () => Promise<any>,
  deps: React.DependencyList = [],
  options: {
    key?: string
    immediate?: boolean
    onSuccess?: (data: any) => void
    onError?: (error: Error) => void
  } = {}
) => {
  const [localLoading, setLocalLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<any>(null)
  const loadingContext = React.useContext(LoadingContext)
  
  const { key, immediate = false, onSuccess, onError } = options
  
  const isLoading = key && loadingContext ? loadingContext.isLoading(key) : localLoading

  const execute = React.useCallback(async () => {
    try {
      setError(null)
      
      if (key && loadingContext) {
        loadingContext.setLoading(key, true)
      } else {
        setLocalLoading(true)
      }

      const result = await asyncFn()
      setData(result)
      onSuccess?.(result)
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
      throw err
    } finally {
      if (key && loadingContext) {
        loadingContext.setLoading(key, false)
      } else {
        setLocalLoading(false)
      }
    }
  }, [asyncFn, key, loadingContext, onSuccess, onError])

  React.useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate, ...deps])

  return {
    loading: isLoading,
    error,
    data,
    execute,
    reset: () => {
      setError(null)
      setData(null)
    }
  }
}

// Data loading component for common patterns
export interface DataLoaderProps<T> {
  data: T | null
  loading: boolean
  error: string | null
  children: (data: T) => React.ReactNode
  loadingSkeleton?: React.ReactNode
  emptyState?: React.ReactNode
  errorRetry?: () => void
  className?: string
}

export function DataLoader<T>({ 
  data, 
  loading, 
  error, 
  children, 
  loadingSkeleton, 
  emptyState,
  errorRetry,
  className 
}: DataLoaderProps<T>) {
  if (loading) {
    return (
      <div className={cn("animate-fade-in", className)}>
        {loadingSkeleton || <SkeletonDashboard cards={3} columns={2} />}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="inline-flex flex-col items-center gap-4 max-w-md mx-auto animate-fade-in">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div>
            <h3 className="text-lg font-semibold mb-2">Failed to load data</h3>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
          </div>
          {errorRetry && (
            <button
              onClick={errorRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={cn("text-center py-12", className)}>
        {emptyState || (
          <div className="animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground">There's nothing to show here yet.</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("animate-fade-in", className)}>
      {children(data)}
    </div>
  )
}

export { loadingVariants }