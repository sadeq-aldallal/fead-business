import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "./button"
import { TouchInteractive } from "./touch-feedback"

// Mobile-optimized action bar for bottom of screen
const actionBarVariants = cva(
  "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40",
  {
    variants: {
      padding: {
        none: "p-0",
        sm: "p-2",
        md: "p-4", 
        lg: "p-6",
      },
      safeArea: {
        true: "pb-[env(safe-area-inset-bottom)]",
        false: "",
      },
    },
    defaultVariants: {
      padding: "md",
      safeArea: true,
    },
  }
)

export interface MobileActionBarProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof actionBarVariants> {
  children: React.ReactNode
}

export const MobileActionBar = React.forwardRef<HTMLDivElement, MobileActionBarProps>(
  ({ className, padding, safeArea, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(actionBarVariants({ padding, safeArea, className }))}
      {...props}
    >
      <div className="flex gap-3 items-center justify-center max-w-screen-sm mx-auto">
        {children}
      </div>
    </div>
  )
)
MobileActionBar.displayName = "MobileActionBar"

// Mobile-specific button that expands to full width on small screens
export interface MobileButtonProps extends ButtonProps {
  expandOnMobile?: boolean
  stackOnMobile?: boolean
}

export const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ className, expandOnMobile = false, stackOnMobile = false, children, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        expandOnMobile && "w-full sm:w-auto",
        stackOnMobile && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
)
MobileButton.displayName = "MobileButton"

// Swipe action button for cards and list items
const swipeActionVariants = cva(
  "flex items-center justify-center min-h-[64px] text-white font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        destructive: "bg-red-500 hover:bg-red-600",
        warning: "bg-yellow-500 hover:bg-yellow-600",
        success: "bg-green-500 hover:bg-green-600",
        primary: "bg-blue-500 hover:bg-blue-600",
        secondary: "bg-gray-500 hover:bg-gray-600",
      },
      side: {
        left: "rounded-r-lg",
        right: "rounded-l-lg", 
      },
      width: {
        sm: "w-16",
        md: "w-20",
        lg: "w-24",
        xl: "w-32",
      },
    },
    defaultVariants: {
      variant: "primary",
      side: "right",
      width: "lg",
    },
  }
)

export interface SwipeActionProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof swipeActionVariants> {
  icon?: React.ReactNode
  label?: string
}

export const SwipeAction = React.forwardRef<HTMLButtonElement, SwipeActionProps>(
  ({ className, variant, side, width, icon, label, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(swipeActionVariants({ variant, side, width, className }))}
      {...props}
    >
      <div className="flex flex-col items-center gap-1">
        {icon && <span className="text-lg" aria-hidden="true">{icon}</span>}
        {label && <span className="text-xs">{label}</span>}
        {children}
      </div>
    </button>
  )
)
SwipeAction.displayName = "SwipeAction"

// Mobile tab bar button
const tabBarButtonVariants = cva(
  "flex flex-col items-center justify-center min-h-[56px] flex-1 text-center transition-all duration-200 touch-manipulation",
  {
    variants: {
      active: {
        true: "text-primary bg-primary/10",
        false: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      },
      size: {
        sm: "min-h-[48px] text-xs",
        md: "min-h-[56px] text-sm",
        lg: "min-h-[64px] text-base",
      },
    },
    defaultVariants: {
      active: false,
      size: "md",
    },
  }
)

export interface TabBarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabBarButtonVariants> {
  icon?: React.ReactNode
  label: string
  badge?: string | number
}

export const TabBarButton = React.forwardRef<HTMLButtonElement, TabBarButtonProps>(
  ({ className, active, size, icon, label, badge, ...props }, ref) => (
    <TouchInteractive
      touchFeedback="scale"
      onPress={() => props.onClick?.(null as any)}
      className="flex-1"
    >
      <button
        ref={ref}
        className={cn(tabBarButtonVariants({ active, size, className }))}
        aria-pressed={active}
        {...props}
      >
        <div className="flex flex-col items-center gap-1">
          {icon && (
            <div className="relative">
              <span aria-hidden="true">{icon}</span>
              {badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </div>
          )}
          <span className="font-medium">{label}</span>
        </div>
      </button>
    </TouchInteractive>
  )
)
TabBarButton.displayName = "TabBarButton"

// Mobile tab bar container
export interface MobileTabBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  position?: "top" | "bottom"
  safeArea?: boolean
}

export const MobileTabBar = React.forwardRef<HTMLDivElement, MobileTabBarProps>(
  ({ className, children, position = "bottom", safeArea = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40",
        position === "bottom" && "fixed bottom-0 left-0 right-0 z-50 border-t",
        position === "top" && "sticky top-0 z-40 border-b",
        safeArea && position === "bottom" && "pb-[env(safe-area-inset-bottom)]",
        safeArea && position === "top" && "pt-[env(safe-area-inset-top)]",
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  )
)
MobileTabBar.displayName = "MobileTabBar"

// Speed dial / expandable FAB
export interface SpeedDialProps extends React.HTMLAttributes<HTMLDivElement> {
  mainAction: {
    icon: React.ReactNode
    onClick: () => void
    label?: string
  }
  actions: Array<{
    icon: React.ReactNode
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "success" | "warning"
  }>
  position?: "bottom-right" | "bottom-left" | "bottom-center"
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

export const SpeedDial = React.forwardRef<HTMLDivElement, SpeedDialProps>(
  ({ 
    className,
    mainAction,
    actions,
    position = "bottom-right",
    expanded = false,
    onExpandedChange,
    ...props 
  }, ref) => {
    const [internalExpanded, setInternalExpanded] = React.useState(false)
    const isExpanded = expanded !== undefined ? expanded : internalExpanded
    
    const toggleExpanded = () => {
      if (onExpandedChange) {
        onExpandedChange(!isExpanded)
      } else {
        setInternalExpanded(!internalExpanded)
      }
    }

    const positionClasses = {
      "bottom-right": "fixed bottom-6 right-6",
      "bottom-left": "fixed bottom-6 left-6", 
      "bottom-center": "fixed bottom-6 left-1/2 -translate-x-1/2",
    }

    return (
      <div
        ref={ref}
        className={cn("z-50", positionClasses[position], className)}
        {...props}
      >
        {/* Action buttons */}
        <div className="flex flex-col-reverse gap-3 mb-3">
          {actions.map((action, index) => (
            <TouchInteractive
              key={index}
              touchFeedback="scale"
              onPress={action.onClick}
              className={cn(
                "transform transition-all duration-200 origin-bottom",
                isExpanded ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
              )}
              style={{ 
                transitionDelay: isExpanded ? `${index * 50}ms` : `${(actions.length - index - 1) * 50}ms` 
              }}
            >
              <div className="flex items-center gap-3">
                <span className="bg-black/75 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  className={cn(
                    "w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200",
                    action.variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
                    action.variant === "success" && "bg-green-500 text-white hover:bg-green-600", 
                    action.variant === "warning" && "bg-yellow-500 text-white hover:bg-yellow-600",
                    (!action.variant || action.variant === "default") && "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                  aria-label={action.label}
                >
                  {action.icon}
                </button>
              </div>
            </TouchInteractive>
          ))}
        </div>

        {/* Main FAB */}
        <TouchInteractive
          touchFeedback="scale"
          onPress={mainAction.onClick}
          onLongPress={actions.length > 0 ? toggleExpanded : undefined}
        >
          <button
            className={cn(
              "w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200",
              isExpanded && "rotate-45"
            )}
            aria-label={mainAction.label || "Main action"}
            aria-expanded={actions.length > 0 ? isExpanded : undefined}
          >
            {mainAction.icon}
          </button>
        </TouchInteractive>
      </div>
    )
  }
)
SpeedDial.displayName = "SpeedDial"

// Pull-to-refresh button
export interface PullToRefreshProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh: () => Promise<void> | void
  threshold?: number
  disabled?: boolean
  refreshingText?: string
  pullText?: string
  releaseText?: string
}

export const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  ({ 
    children,
    onRefresh,
    threshold = 60,
    disabled = false,
    refreshingText = "Refreshing...",
    pullText = "Pull to refresh",
    releaseText = "Release to refresh",
    className,
    ...props 
  }, ref) => {
    const [pullDistance, setPullDistance] = React.useState(0)
    const [isRefreshing, setIsRefreshing] = React.useState(false)
    const [startY, setStartY] = React.useState(0)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled || isRefreshing) return
      const scrollTop = containerRef.current?.scrollTop || 0
      if (scrollTop === 0) {
        setStartY(e.touches[0].clientY)
      }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      if (disabled || isRefreshing || startY === 0) return
      
      const currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY)
      
      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance * 0.5, threshold * 1.5))
      }
    }

    const handleTouchEnd = async () => {
      if (disabled || isRefreshing) return
      
      if (pullDistance >= threshold) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }
      
      setPullDistance(0)
      setStartY(0)
    }

    const getStatusText = () => {
      if (isRefreshing) return refreshingText
      if (pullDistance >= threshold) return releaseText
      return pullText
    }

    return (
      <div
        ref={ref}
        className={cn("relative overflow-auto", className)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}  
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Pull indicator */}
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center bg-muted/50 text-muted-foreground text-sm transition-all duration-200 z-10"
          style={{ 
            height: `${pullDistance}px`,
            opacity: pullDistance > 0 ? 1 : 0 
          }}
        >
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "w-4 h-4 border-2 border-current border-t-transparent rounded-full transition-transform duration-200",
                isRefreshing && "animate-spin",
                pullDistance >= threshold && !isRefreshing && "rotate-180"
              )}
            />
            <span>{getStatusText()}</span>
          </div>
        </div>

        {/* Content */}
        <div 
          ref={containerRef}
          className="transition-transform duration-200"
          style={{ transform: `translateY(${pullDistance}px)` }}
        >
          {children}
        </div>
      </div>
    )
  }
)
PullToRefresh.displayName = "PullToRefresh"