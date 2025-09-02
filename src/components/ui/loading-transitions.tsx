import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Transition variants for different loading states
const transitionVariants = cva("", {
  variants: {
    enter: {
      fade: "transition-all duration-300 ease-out data-[state=open]:animate-fade-in",
      slide: "transition-all duration-300 ease-out data-[state=open]:animate-slide-in",
      scale: "transition-all duration-200 ease-out data-[state=open]:animate-scale-in",
      blur: "transition-all duration-400 ease-out data-[state=open]:backdrop-blur-sm",
    },
    exit: {
      fade: "transition-all duration-200 ease-in data-[state=closed]:opacity-0",
      slide: "transition-all duration-200 ease-in data-[state=closed]:translate-x-[-10px] data-[state=closed]:opacity-0",
      scale: "transition-all duration-150 ease-in data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
      blur: "transition-all duration-300 ease-in data-[state=closed]:backdrop-blur-none",
    },
    loading: {
      pulse: "animate-pulse",
      shimmer: "animate-shimmer",
      wave: "animate-wave",
      bounce: "animate-bounce",
    },
  },
  defaultVariants: {
    enter: "fade",
    exit: "fade",
  },
})

// Smooth loading transition wrapper
export interface LoadingTransitionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof transitionVariants> {
  children: React.ReactNode
  isLoading: boolean
  fallback?: React.ReactNode
  delay?: number
  duration?: number
  staggerChildren?: boolean
  staggerDelay?: number
}

export const LoadingTransition = React.forwardRef<HTMLDivElement, LoadingTransitionProps>(
  ({ 
    className, 
    children, 
    isLoading, 
    fallback, 
    enter, 
    exit,
    delay = 0,
    duration = 300,
    staggerChildren = false,
    staggerDelay = 100,
    ...props 
  }, ref) => {
    const [showContent, setShowContent] = React.useState(!isLoading)
    const [showFallback, setShowFallback] = React.useState(isLoading)
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (isLoading) {
        setShowContent(false)
        timeoutRef.current = setTimeout(() => {
          setShowFallback(true)
        }, delay)
      } else {
        setShowFallback(false)
        timeoutRef.current = setTimeout(() => {
          setShowContent(true)
        }, delay)
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [isLoading, delay])

    const containerClasses = cn(
      "relative",
      className
    )

    const contentClasses = cn(
      transitionVariants({ enter, exit }),
      staggerChildren && "stagger-animation"
    )

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={{
          '--transition-duration': `${duration}ms`,
          '--stagger-delay': `${staggerDelay}ms`,
        } as React.CSSProperties}
        {...props}
      >
        {showFallback && isLoading && (
          <div 
            className={cn(
              "absolute inset-0 z-10",
              transitionVariants({ enter })
            )}
            data-state="open"
          >
            {fallback}
          </div>
        )}
        
        {showContent && !isLoading && (
          <div
            className={contentClasses}
            data-state={isLoading ? "closed" : "open"}
          >
            {children}
          </div>
        )}
      </div>
    )
  }
)
LoadingTransition.displayName = "LoadingTransition"

// Page transition component for route changes
export interface PageTransitionProps {
  children: React.ReactNode
  isLoading: boolean
  className?: string
  direction?: "up" | "down" | "left" | "right"
  duration?: number
}

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, isLoading, className, direction = "up", duration = 400 }, ref) => {
    const [displayChildren, setDisplayChildren] = React.useState(children)
    const [phase, setPhase] = React.useState<"entering" | "entered" | "exiting">("entered")

    React.useEffect(() => {
      if (isLoading) {
        setPhase("exiting")
        
        const exitTimer = setTimeout(() => {
          setDisplayChildren(children)
          setPhase("entering")
          
          const enterTimer = setTimeout(() => {
            setPhase("entered")
          }, 50)
          
          return () => clearTimeout(enterTimer)
        }, duration / 2)
        
        return () => clearTimeout(exitTimer)
      } else {
        setPhase("entered")
        setDisplayChildren(children)
      }
    }, [children, isLoading, duration])

    const getDirectionClasses = () => {
      const baseClasses = "transition-all ease-out"
      const durationClass = `duration-[${duration}ms]`
      
      switch (direction) {
        case "up":
          return {
            base: `${baseClasses} ${durationClass}`,
            entering: "translate-y-4 opacity-0",
            entered: "translate-y-0 opacity-100",
            exiting: "translate-y-[-4px] opacity-0"
          }
        case "down":
          return {
            base: `${baseClasses} ${durationClass}`,
            entering: "translate-y-[-4px] opacity-0",
            entered: "translate-y-0 opacity-100",
            exiting: "translate-y-4 opacity-0"
          }
        case "left":
          return {
            base: `${baseClasses} ${durationClass}`,
            entering: "translate-x-4 opacity-0",
            entered: "translate-x-0 opacity-100",
            exiting: "translate-x-[-4px] opacity-0"
          }
        case "right":
          return {
            base: `${baseClasses} ${durationClass}`,
            entering: "translate-x-[-4px] opacity-0",
            entered: "translate-x-0 opacity-100",
            exiting: "translate-x-4 opacity-0"
          }
        default:
          return {
            base: `${baseClasses} ${durationClass}`,
            entering: "opacity-0",
            entered: "opacity-100",
            exiting: "opacity-0"
          }
      }
    }

    const directionClasses = getDirectionClasses()

    return (
      <div
        ref={ref}
        className={cn(
          directionClasses.base,
          directionClasses[phase],
          className
        )}
      >
        {displayChildren}
      </div>
    )
  }
)
PageTransition.displayName = "PageTransition"

// Staggered list animation for loading states
export interface StaggeredListProps {
  children: React.ReactNode
  isLoading: boolean
  staggerDelay?: number
  className?: string
  loadingItems?: number
  itemSkeleton?: React.ReactNode
}

export const StaggeredList = React.forwardRef<HTMLDivElement, StaggeredListProps>(
  ({ 
    children, 
    isLoading, 
    staggerDelay = 100, 
    className, 
    loadingItems = 5,
    itemSkeleton 
  }, ref) => {
    const childArray = React.Children.toArray(children)

    if (isLoading) {
      return (
        <div ref={ref} className={cn("space-y-3", className)}>
          {Array.from({ length: loadingItems }).map((_, index) => (
            <div
              key={`loading-${index}`}
              className="animate-fade-in"
              style={{
                animationDelay: `${index * staggerDelay}ms`,
                animationFillMode: "both"
              }}
            >
              {itemSkeleton || (
                <div className="h-20 bg-muted rounded-lg animate-pulse" />
              )}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        {childArray.map((child, index) => (
          <div
            key={index}
            className="animate-slide-in"
            style={{
              animationDelay: `${index * staggerDelay}ms`,
              animationFillMode: "both"
            }}
          >
            {child}
          </div>
        ))}
      </div>
    )
  }
)
StaggeredList.displayName = "StaggeredList"

// Loading overlay with smooth backdrop
export interface LoadingBackdropProps {
  isVisible: boolean
  children?: React.ReactNode
  blur?: boolean
  className?: string
  onClose?: () => void
  closeOnClick?: boolean
}

export const LoadingBackdrop = React.forwardRef<HTMLDivElement, LoadingBackdropProps>(
  ({ isVisible, children, blur = true, className, onClose, closeOnClick = false }, ref) => {
    const [shouldRender, setShouldRender] = React.useState(isVisible)
    const timeoutRef = React.useRef<NodeJS.Timeout>()

    React.useEffect(() => {
      if (isVisible) {
        setShouldRender(true)
      } else {
        timeoutRef.current = setTimeout(() => {
          setShouldRender(false)
        }, 300)
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [isVisible])

    if (!shouldRender) return null

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (closeOnClick && e.target === e.currentTarget) {
        onClose?.()
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
          blur && "backdrop-blur-sm",
          isVisible 
            ? "bg-background/80 opacity-100" 
            : "bg-transparent opacity-0 pointer-events-none",
          className
        )}
        onClick={handleBackdropClick}
        aria-hidden={!isVisible}
      >
        {children}
      </div>
    )
  }
)
LoadingBackdrop.displayName = "LoadingBackdrop"

// Progress loading component with smooth transitions
export interface ProgressLoaderProps {
  progress: number
  isLoading: boolean
  children: React.ReactNode
  className?: string
  showProgress?: boolean
}

export const ProgressLoader = React.forwardRef<HTMLDivElement, ProgressLoaderProps>(
  ({ progress, isLoading, children, className, showProgress = true }, ref) => {
    const [displayProgress, setDisplayProgress] = React.useState(0)

    React.useEffect(() => {
      if (isLoading) {
        const timer = setTimeout(() => {
          setDisplayProgress(progress)
        }, 100)
        return () => clearTimeout(timer)
      } else {
        setDisplayProgress(100)
      }
    }, [progress, isLoading])

    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)}>
        {isLoading && (
          <>
            {showProgress && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
            )}
            <div
              className="absolute inset-0 bg-muted/50 backdrop-blur-[1px] transition-all duration-300 ease-out flex items-center justify-center"
              style={{ opacity: isLoading ? 1 : 0 }}
            >
              <div className="text-center space-y-2">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                {showProgress && (
                  <div className="text-sm text-muted-foreground">
                    {Math.round(displayProgress)}%
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        <div
          className={cn(
            "transition-all duration-300",
            isLoading && "blur-[1px] scale-[0.98]"
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
ProgressLoader.displayName = "ProgressLoader"

// Loading dots animation
export const LoadingDots: React.FC<{
  size?: "sm" | "md" | "lg"
  className?: string
}> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2", 
    lg: "w-3 h-3",
  }

  const dotClass = sizeClasses[size]

  return (
    <div className={cn("flex gap-1 items-center", className)}>
      <div className={cn(dotClass, "bg-current rounded-full animate-bounce [animation-delay:-0.3s]")} />
      <div className={cn(dotClass, "bg-current rounded-full animate-bounce [animation-delay:-0.15s]")} />
      <div className={cn(dotClass, "bg-current rounded-full animate-bounce")} />
    </div>
  )
}

export { transitionVariants }