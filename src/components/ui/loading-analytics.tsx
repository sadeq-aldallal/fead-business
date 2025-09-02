import * as React from "react"

// Performance timing interface
interface PerformanceTiming {
  key: string
  startTime: number
  endTime?: number
  duration?: number
  phase: 'skeleton' | 'loading' | 'partial' | 'complete' | 'error'
  metadata?: Record<string, any>
}

// Loading analytics context
interface LoadingAnalyticsContextType {
  timings: PerformanceTiming[]
  startTiming: (key: string, phase: PerformanceTiming['phase'], metadata?: Record<string, any>) => void
  endTiming: (key: string) => void
  getTimingsByKey: (key: string) => PerformanceTiming[]
  getAverageLoadTime: (key?: string) => number
  getTotalLoadingTime: () => number
  clearTimings: () => void
  exportAnalytics: () => LoadingAnalyticsReport
}

const LoadingAnalyticsContext = React.createContext<LoadingAnalyticsContextType | null>(null)

// Analytics provider component
export const LoadingAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timings, setTimings] = React.useState<PerformanceTiming[]>([])

  const startTiming = React.useCallback((key: string, phase: PerformanceTiming['phase'], metadata?: Record<string, any>) => {
    const timing: PerformanceTiming = {
      key,
      startTime: performance.now(),
      phase,
      metadata
    }
    
    setTimings(prev => [...prev, timing])
  }, [])

  const endTiming = React.useCallback((key: string) => {
    setTimings(prev => 
      prev.map(timing => 
        timing.key === key && !timing.endTime
          ? {
              ...timing,
              endTime: performance.now(),
              duration: performance.now() - timing.startTime
            }
          : timing
      )
    )
  }, [])

  const getTimingsByKey = React.useCallback((key: string) => {
    return timings.filter(timing => timing.key === key && timing.duration)
  }, [timings])

  const getAverageLoadTime = React.useCallback((key?: string) => {
    const relevantTimings = key 
      ? getTimingsByKey(key)
      : timings.filter(t => t.duration)

    if (relevantTimings.length === 0) return 0

    const totalTime = relevantTimings.reduce((sum, timing) => sum + (timing.duration || 0), 0)
    return totalTime / relevantTimings.length
  }, [timings, getTimingsByKey])

  const getTotalLoadingTime = React.useCallback(() => {
    return timings.reduce((sum, timing) => sum + (timing.duration || 0), 0)
  }, [timings])

  const clearTimings = React.useCallback(() => {
    setTimings([])
  }, [])

  const exportAnalytics = React.useCallback((): LoadingAnalyticsReport => {
    const completedTimings = timings.filter(t => t.duration)
    const byPhase = completedTimings.reduce((acc, timing) => {
      if (!acc[timing.phase]) {
        acc[timing.phase] = []
      }
      acc[timing.phase].push(timing)
      return acc
    }, {} as Record<string, PerformanceTiming[]>)

    const phaseAverages = Object.entries(byPhase).reduce((acc, [phase, phaseTimings]) => {
      acc[phase] = phaseTimings.reduce((sum, t) => sum + (t.duration || 0), 0) / phaseTimings.length
      return acc
    }, {} as Record<string, number>)

    const uniqueKeys = [...new Set(completedTimings.map(t => t.key))]
    const keyAverages = uniqueKeys.reduce((acc, key) => {
      acc[key] = getAverageLoadTime(key)
      return acc
    }, {} as Record<string, number>)

    return {
      totalTimings: completedTimings.length,
      totalLoadTime: getTotalLoadingTime(),
      averageLoadTime: getAverageLoadTime(),
      phaseAverages,
      keyAverages,
      slowestLoads: completedTimings
        .sort((a, b) => (b.duration || 0) - (a.duration || 0))
        .slice(0, 10),
      fastestLoads: completedTimings
        .sort((a, b) => (a.duration || 0) - (b.duration || 0))
        .slice(0, 10),
      timestamp: new Date().toISOString(),
    }
  }, [timings, getAverageLoadTime, getTotalLoadingTime])

  const contextValue = React.useMemo(() => ({
    timings,
    startTiming,
    endTiming,
    getTimingsByKey,
    getAverageLoadTime,
    getTotalLoadingTime,
    clearTimings,
    exportAnalytics,
  }), [
    timings,
    startTiming,
    endTiming,
    getTimingsByKey,
    getAverageLoadTime,
    getTotalLoadingTime,
    clearTimings,
    exportAnalytics,
  ])

  return (
    <LoadingAnalyticsContext.Provider value={contextValue}>
      {children}
    </LoadingAnalyticsContext.Provider>
  )
}

// Hook for using loading analytics
export const useLoadingAnalytics = () => {
  const context = React.useContext(LoadingAnalyticsContext)
  if (!context) {
    throw new Error('useLoadingAnalytics must be used within LoadingAnalyticsProvider')
  }
  return context
}

// Hook for tracking loading operations
export const useLoadingTracker = (
  key: string,
  options: {
    autoStart?: boolean
    metadata?: Record<string, any>
    onComplete?: (duration: number) => void
  } = {}
) => {
  const { startTiming, endTiming, getTimingsByKey } = useLoadingAnalytics()
  const { autoStart = false, metadata, onComplete } = options
  const [isTracking, setIsTracking] = React.useState(false)

  const start = React.useCallback((phase: PerformanceTiming['phase'] = 'loading') => {
    if (!isTracking) {
      startTiming(key, phase, metadata)
      setIsTracking(true)
    }
  }, [key, startTiming, metadata, isTracking])

  const end = React.useCallback(() => {
    if (isTracking) {
      endTiming(key)
      setIsTracking(false)
      
      // Get the completed timing and call onComplete
      setTimeout(() => {
        const timings = getTimingsByKey(key)
        const latestTiming = timings[timings.length - 1]
        if (latestTiming?.duration && onComplete) {
          onComplete(latestTiming.duration)
        }
      }, 0)
    }
  }, [key, endTiming, isTracking, onComplete, getTimingsByKey])

  React.useEffect(() => {
    if (autoStart) {
      start()
    }
    
    return () => {
      if (isTracking) {
        end()
      }
    }
  }, [autoStart, start, end, isTracking])

  return { start, end, isTracking }
}

// Performance monitoring component
export interface LoadingMonitorProps {
  children: React.ReactNode
  trackKey: string
  phase?: PerformanceTiming['phase']
  metadata?: Record<string, any>
  onLoadComplete?: (duration: number) => void
  threshold?: {
    warning: number // ms
    critical: number // ms
  }
}

export const LoadingMonitor: React.FC<LoadingMonitorProps> = ({
  children,
  trackKey,
  phase = 'loading',
  metadata,
  onLoadComplete,
  threshold = { warning: 1000, critical: 3000 }
}) => {
  const { start, end } = useLoadingTracker(trackKey, {
    autoStart: true,
    metadata: {
      ...metadata,
      threshold
    },
    onComplete: (duration) => {
      // Log performance warnings
      if (duration > threshold.critical) {
        console.warn(`🐌 Slow loading detected for "${trackKey}": ${duration.toFixed(2)}ms (Critical: >${threshold.critical}ms)`)
      } else if (duration > threshold.warning) {
        console.warn(`⚠️ Loading warning for "${trackKey}": ${duration.toFixed(2)}ms (Warning: >${threshold.warning}ms)`)
      }
      
      onLoadComplete?.(duration)
    }
  })

  React.useEffect(() => {
    start(phase)
    
    return () => {
      end()
    }
  }, [start, end, phase])

  return <>{children}</>
}

// Real User Monitoring (RUM) hook
export const useRealUserMonitoring = () => {
  const [metrics, setMetrics] = React.useState<{
    cls: number // Cumulative Layout Shift
    fid: number // First Input Delay  
    lcp: number // Largest Contentful Paint
    ttfb: number // Time to First Byte
  }>({
    cls: 0,
    fid: 0,
    lcp: 0,
    ttfb: 0
  })

  React.useEffect(() => {
    // Measure TTFB
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationEntry) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigationEntry.responseStart - navigationEntry.requestStart
        }))
      }
    }

    // Measure other Core Web Vitals using web-vitals library if available
    if (typeof window !== 'undefined') {
      // Placeholder for web-vitals integration
      // In a real implementation, you would use the web-vitals library
      // import { getCLS, getFID, getLCP } from 'web-vitals'
    }
  }, [])

  return metrics
}

// Analytics report interface
export interface LoadingAnalyticsReport {
  totalTimings: number
  totalLoadTime: number
  averageLoadTime: number
  phaseAverages: Record<string, number>
  keyAverages: Record<string, number>
  slowestLoads: PerformanceTiming[]
  fastestLoads: PerformanceTiming[]
  timestamp: string
}

// Analytics dashboard component (for development)
export const LoadingAnalyticsDashboard: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const analytics = useLoadingAnalytics()
  const [report, setReport] = React.useState<LoadingAnalyticsReport | null>(null)

  React.useEffect(() => {
    if (isOpen) {
      setReport(analytics.exportAnalytics())
    }
  }, [isOpen, analytics])

  if (!isOpen || !report) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 bg-card border border-border rounded-lg overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Loading Analytics Dashboard</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Timings</h3>
              <p className="text-3xl font-bold text-primary">{report.totalTimings}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Average Load Time</h3>
              <p className="text-3xl font-bold text-primary">
                {report.averageLoadTime.toFixed(0)}ms
              </p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Load Time</h3>
              <p className="text-3xl font-bold text-primary">
                {(report.totalLoadTime / 1000).toFixed(2)}s
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Phase Averages</h3>
              <div className="space-y-2">
                {Object.entries(report.phaseAverages).map(([phase, avg]) => (
                  <div key={phase} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="capitalize">{phase}</span>
                    <span className="font-mono">{avg.toFixed(0)}ms</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Component Averages</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {Object.entries(report.keyAverages)
                  .sort(([,a], [,b]) => b - a)
                  .map(([key, avg]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-muted/30 rounded text-sm">
                      <span className="truncate mr-2">{key}</span>
                      <span className="font-mono text-nowrap">{avg.toFixed(0)}ms</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Slowest Loads</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {report.slowestLoads.map((timing, index) => (
                <div key={`${timing.key}-${timing.startTime}`} className="flex justify-between items-center p-2 bg-destructive/10 rounded text-sm">
                  <span className="truncate mr-2">#{index + 1}: {timing.key}</span>
                  <span className="font-mono text-nowrap">{timing.duration?.toFixed(0)}ms</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => {
                analytics.clearTimings()
                setReport(analytics.exportAnalytics())
              }}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              Clear Analytics
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(report, null, 2)
                const dataBlob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(dataBlob)
                const link = document.createElement('a')
                link.href = url
                link.download = `loading-analytics-${Date.now()}.json`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}