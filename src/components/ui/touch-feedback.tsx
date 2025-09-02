import * as React from "react"
import { cn } from "@/lib/utils"

// Enhanced ripple effect component for touch feedback
export interface RippleProps extends React.HTMLAttributes<HTMLDivElement> {
  rippleColor?: string
  rippleDuration?: number
  rippleSize?: number
}

export const Ripple = React.forwardRef<HTMLDivElement, RippleProps>(
  ({ 
    className, 
    rippleColor = "currentColor", 
    rippleDuration = 600,
    rippleSize = 100,
    children, 
    ...props 
  }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number; size: number }>>([])

    const addRipple = React.useCallback((event: React.MouseEvent | React.TouchEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in event) {
        // Touch event
        const touch = event.touches[0] || event.changedTouches[0]
        clientX = touch.clientX
        clientY = touch.clientY
      } else {
        // Mouse event
        clientX = event.clientX
        clientY = event.clientY
      }

      const x = clientX - rect.left
      const y = clientY - rect.top
      const size = Math.max(rect.width, rect.height) * (rippleSize / 100)

      const newRipple = {
        id: Date.now(),
        x,
        y,
        size,
      }

      setRipples(prev => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, rippleDuration)
    }, [rippleSize, rippleDuration])

    const handleInteraction = (event: React.MouseEvent | React.TouchEvent) => {
      addRipple(event)
    }

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onMouseDown={handleInteraction}
        onTouchStart={handleInteraction}
        {...props}
      >
        {children}
        <div
          ref={containerRef}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute rounded-full opacity-30 animate-ping pointer-events-none"
              style={{
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
                backgroundColor: rippleColor,
                animationDuration: `${rippleDuration}ms`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)
Ripple.displayName = "Ripple"

// Touch feedback wrapper for interactive elements
export interface TouchFeedbackProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement
  feedback?: "scale" | "ripple" | "glow" | "bounce" | "none"
  intensity?: "subtle" | "medium" | "strong"
  disabled?: boolean
}

export const TouchFeedback = React.forwardRef<HTMLElement, TouchFeedbackProps>(
  ({ children, feedback = "scale", intensity = "medium", disabled = false, className, ...props }, ref) => {
    if (disabled) return children

    const feedbackClasses = {
      scale: {
        subtle: "active:scale-[0.98] transition-transform duration-100 ease-out",
        medium: "active:scale-[0.96] transition-transform duration-150 ease-out", 
        strong: "active:scale-[0.94] transition-transform duration-200 ease-out",
      },
      ripple: {
        subtle: "touch-ripple",
        medium: "touch-ripple", 
        strong: "touch-ripple",
      },
      glow: {
        subtle: "active:shadow-sm transition-shadow duration-200",
        medium: "active:shadow-md transition-shadow duration-300",
        strong: "active:shadow-lg active:shadow-primary/25 transition-shadow duration-400",
      },
      bounce: {
        subtle: "active:animate-pulse",
        medium: "active:animate-bounce",
        strong: "active:animate-bounce",
      },
      none: {
        subtle: "",
        medium: "",
        strong: "",
      },
    }

    const feedbackClass = feedbackClasses[feedback][intensity]

    if (feedback === "ripple") {
      return (
        <Ripple className={cn(feedbackClass, className)} {...props}>
          {children}
        </Ripple>
      )
    }

    return React.cloneElement(children, {
      className: cn(children.props.className, feedbackClass, className),
      ...props,
    })
  }
)
TouchFeedback.displayName = "TouchFeedback"

// Haptic feedback hook for supported devices
export const useHapticFeedback = () => {
  const triggerHaptic = React.useCallback((type: "light" | "medium" | "heavy" | "selection" = "light") => {
    if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50,
        selection: [10, 10],
      }
      
      navigator.vibrate(patterns[type])
    }
  }, [])

  return { triggerHaptic }
}

// Touch-optimized interactive wrapper
export interface TouchInteractiveProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onPress?: () => void
  onLongPress?: () => void
  longPressDelay?: number
  hapticFeedback?: boolean
  touchFeedback?: "scale" | "ripple" | "glow" | "none"
  disabled?: boolean
}

export const TouchInteractive = React.forwardRef<HTMLDivElement, TouchInteractiveProps>(
  ({ 
    children, 
    onPress, 
    onLongPress,
    longPressDelay = 500,
    hapticFeedback = false,
    touchFeedback = "scale",
    disabled = false,
    className,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false)
    const longPressTimerRef = React.useRef<NodeJS.Timeout>()
    const { triggerHaptic } = useHapticFeedback()

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
      if (disabled) return

      setIsPressed(true)
      
      if (hapticFeedback) {
        triggerHaptic("light")
      }

      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          if (hapticFeedback) {
            triggerHaptic("medium")
          }
          onLongPress()
        }, longPressDelay)
      }

      props.onTouchStart?.(e)
    }, [disabled, hapticFeedback, onLongPress, longPressDelay, triggerHaptic, props])

    const handleTouchEnd = React.useCallback((e: React.TouchEvent) => {
      if (disabled) return

      setIsPressed(false)

      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }

      if (onPress && !e.defaultPrevented) {
        onPress()
      }

      props.onTouchEnd?.(e)
    }, [disabled, onPress, props])

    const handleTouchCancel = React.useCallback((e: React.TouchEvent) => {
      setIsPressed(false)
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }

      props.onTouchCancel?.(e)
    }, [props])

    React.useEffect(() => {
      return () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current)
        }
      }
    }, [])

    return (
      <TouchFeedback feedback={touchFeedback} disabled={disabled}>
        <div
          ref={ref}
          className={cn(
            "select-none touch-manipulation",
            disabled && "pointer-events-none opacity-50",
            isPressed && "transform",
            className
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          {...props}
        >
          {children}
        </div>
      </TouchFeedback>
    )
  }
)
TouchInteractive.displayName = "TouchInteractive"