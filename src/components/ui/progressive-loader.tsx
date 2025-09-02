import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton, SkeletonCard } from "./skeleton-loaders"
import { LoadingTransition, StaggeredList } from "./loading-transitions"

// Progressive loading phases
type LoadingPhase = "initial" | "skeleton" | "partial" | "complete"

// Progressive loader hook
export const useProgressiveLoader = <T,>(
  asyncFn: () => Promise<T>,
  options: {
    phases?: LoadingPhase[]
    phaseDurations?: number[] // Duration to show each phase in ms
    immediate?: boolean
    deps?: React.DependencyList
  } = {}
) => {
  const {
    phases = ["skeleton", "complete"],
    phaseDurations = [800, 0], // Show skeleton for 800ms minimum
    immediate = false,
    deps = []
  } = options

  const [currentPhase, setCurrentPhase] = React.useState<LoadingPhase>("initial")
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [progress, setProgress] = React.useState(0)
  const phaseTimersRef = React.useRef<NodeJS.Timeout[]>([])
  const startTimeRef = React.useRef<number>(0)

  const clearTimers = React.useCallback(() => {
    phaseTimersRef.current.forEach(timer => clearTimeout(timer))
    phaseTimersRef.current = []
  }, [])

  const execute = React.useCallback(async () => {
    try {
      clearTimers()
      setError(null)
      setData(null)
      setProgress(0)
      startTimeRef.current = Date.now()

      // Start phase progression
      const phaseIndex = 0
      setCurrentPhase(phases[phaseIndex] || "skeleton")

      // Progress through phases with minimum durations
      const progressThroughPhases = () => {
        phases.forEach((phase, index) => {
          if (index === 0) return // Skip first phase as it's already set

          const cumulativeDuration = phaseDurations
            .slice(0, index)
            .reduce((sum, duration) => sum + duration, 0)

          const timer = setTimeout(() => {
            setCurrentPhase(phase)
            setProgress(((index + 1) / phases.length) * 90) // Leave 10% for completion
          }, cumulativeDuration)

          phaseTimersRef.current.push(timer)
        })
      }

      progressThroughPhases()

      // Execute the actual async function
      const result = await asyncFn()
      
      // Ensure minimum loading time for better perceived performance
      const elapsedTime = Date.now() - startTimeRef.current
      const totalMinimumTime = phaseDurations.reduce((sum, duration) => sum + duration, 0)
      const remainingTime = Math.max(0, totalMinimumTime - elapsedTime)

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      // Complete loading
      setData(result)
      setProgress(100)
      setCurrentPhase("complete")
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setCurrentPhase("complete") // Show error in complete phase
      throw err
    } finally {
      clearTimers()
    }
  }, [asyncFn, phases, phaseDurations, clearTimers])

  React.useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate, ...deps])

  React.useEffect(() => {
    return clearTimers
  }, [clearTimers])

  return {
    phase: currentPhase,
    data,
    error,
    progress,
    execute,
    isLoading: currentPhase !== "complete" || (!data && !error),
    reset: () => {
      setCurrentPhase("initial")
      setData(null)
      setError(null)
      setProgress(0)
      clearTimers()
    }
  }
}

// Progressive content component
export interface ProgressiveContentProps<T> {
  loader: ReturnType<typeof useProgressiveLoader<T>>
  skeletonContent?: React.ReactNode
  partialContent?: (progress: number) => React.ReactNode
  children: (data: T) => React.ReactNode
  errorContent?: (error: string, retry: () => void) => React.ReactNode
  className?: string
}

export function ProgressiveContent<T>({
  loader,
  skeletonContent,
  partialContent,
  children,
  errorContent,
  className
}: ProgressiveContentProps<T>) {
  const { phase, data, error, progress, execute } = loader

  if (error) {
    return (
      <div className={cn("animate-fade-in", className)}>
        {errorContent ? (
          errorContent(error, execute)
        ) : (
          <div className="text-center py-8">
            <div className="text-destructive mb-2">Error loading content</div>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <button 
              onClick={execute}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    )
  }

  switch (phase) {
    case "skeleton":
      return (
        <div className={cn("animate-fade-in", className)}>
          {skeletonContent || (
            <div className="space-y-4">
              <SkeletonCard showAvatar showActions textLines={3} />
              <SkeletonCard showActions textLines={2} />
            </div>
          )}
        </div>
      )

    case "partial":
      return (
        <div className={cn("animate-slide-in", className)}>
          {partialContent ? (
            partialContent(progress)
          ) : (
            <div className="space-y-4">
              <div className="h-2 bg-muted rounded">
                <div 
                  className="h-full bg-primary rounded transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Loading... {Math.round(progress)}%
              </div>
            </div>
          )}
        </div>
      )

    case "complete":
      if (data) {
        return (
          <div className={cn("animate-fade-in", className)}>
            {children(data)}
          </div>
        )
      }
      break

    case "initial":
    default:
      return (
        <div className={cn("animate-pulse opacity-50", className)}>
          Initializing...
        </div>
      )
  }

  return null
}

// Critical content loader - prioritizes above-the-fold content
export interface CriticalLoaderProps {
  children: React.ReactNode
  priority?: "critical" | "high" | "normal" | "low"
  delay?: number
  className?: string
}

export const CriticalLoader = React.forwardRef<HTMLDivElement, CriticalLoaderProps>(
  ({ children, priority = "normal", delay = 0, className }, ref) => {
    const [shouldRender, setShouldRender] = React.useState(priority === "critical")
    
    React.useEffect(() => {
      if (priority === "critical") {
        setShouldRender(true)
        return
      }

      const priorityDelays = {
        high: 0,
        normal: 100,
        low: 300
      }

      const totalDelay = delay + (priorityDelays[priority] || 0)
      
      const timer = setTimeout(() => {
        setShouldRender(true)
      }, totalDelay)

      return () => clearTimeout(timer)
    }, [priority, delay])

    if (!shouldRender) {
      return (
        <div ref={ref} className={cn("animate-pulse opacity-0", className)}>
          <div className="h-20 bg-muted rounded" />
        </div>
      )
    }

    return (
      <div 
        ref={ref} 
        className={cn("animate-fade-in", className)}
        style={{
          animationDelay: priority === "critical" ? "0ms" : "50ms"
        }}
      >
        {children}
      </div>
    )
  }
)
CriticalLoader.displayName = "CriticalLoader"

// Lazy loading component with intersection observer
export interface LazyLoaderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
  className?: string
  onVisible?: () => void
}

export const LazyLoader = React.forwardRef<HTMLDivElement, LazyLoaderProps>(
  ({ 
    children, 
    fallback, 
    rootMargin = "50px", 
    threshold = 0.1, 
    className,
    onVisible 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const [hasLoaded, setHasLoaded] = React.useState(false)
    const elementRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const element = elementRef.current
      if (!element || hasLoaded) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            setHasLoaded(true)
            onVisible?.()
            observer.disconnect()
          }
        },
        {
          rootMargin,
          threshold
        }
      )

      observer.observe(element)

      return () => observer.disconnect()
    }, [hasLoaded, rootMargin, threshold, onVisible])

    React.useImperativeHandle(ref, () => elementRef.current!, [])

    return (
      <div ref={elementRef} className={className}>
        {isVisible || hasLoaded ? (
          <div className="animate-fade-in">
            {children}
          </div>
        ) : (
          fallback || (
            <div className="h-32 bg-muted rounded animate-pulse" />
          )
        )}
      </div>
    )
  }
)
LazyLoader.displayName = "LazyLoader"

// Batch loader for handling multiple async operations
export const useBatchLoader = <T,>(
  operations: (() => Promise<T>)[],
  options: {
    batchSize?: number
    delay?: number
    onBatchComplete?: (results: T[]) => void
    onAllComplete?: (allResults: T[][]) => void
  } = {}
) => {
  const { batchSize = 3, delay = 100, onBatchComplete, onAllComplete } = options
  
  const [results, setResults] = React.useState<T[][]>([])
  const [currentBatch, setCurrentBatch] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const execute = React.useCallback(async () => {
    setIsLoading(true)
    setResults([])
    setCurrentBatch(0)
    setProgress(0)

    const batches: (() => Promise<T>)[][] = []
    for (let i = 0; i < operations.length; i += batchSize) {
      batches.push(operations.slice(i, i + batchSize))
    }

    const allResults: T[][] = []

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      setCurrentBatch(batchIndex)
      
      const batchResults = await Promise.all(
        batches[batchIndex].map(op => op())
      )
      
      allResults.push(batchResults)
      setResults(prev => [...prev, batchResults])
      
      const progressPercent = ((batchIndex + 1) / batches.length) * 100
      setProgress(progressPercent)
      
      onBatchComplete?.(batchResults)
      
      // Add delay between batches to improve perceived performance
      if (batchIndex < batches.length - 1 && delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    onAllComplete?.(allResults)
    setIsLoading(false)
  }, [operations, batchSize, delay, onBatchComplete, onAllComplete])

  return {
    execute,
    results,
    currentBatch,
    totalBatches: Math.ceil(operations.length / batchSize),
    isLoading,
    progress,
    isComplete: progress === 100 && !isLoading
  }
}