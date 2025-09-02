import * as React from "react"
import { cn } from "@/lib/utils"

// Hook to detect touch capability
export const useIsTouch = () => {
  const [isTouch, setIsTouch] = React.useState(false)

  React.useEffect(() => {
    // Check for touch capability
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 ||
                      navigator.maxTouchPoints > 0

      // Also check media queries for more accurate detection
      const touchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches
      const hybridDevice = window.matchMedia('(hover: hover) and (pointer: coarse)').matches
      
      setIsTouch(hasTouch || touchOnly || hybridDevice)
    }

    checkTouch()
    
    // Listen for touch events to update state dynamically
    const handleFirstTouch = () => {
      setIsTouch(true)
      document.removeEventListener('touchstart', handleFirstTouch)
    }

    document.addEventListener('touchstart', handleFirstTouch)
    
    // Listen for mouse events to detect when not using touch
    const handleFirstMouse = () => {
      if (!window.matchMedia('(hover: none)').matches) {
        setIsTouch(false)
      }
    }

    document.addEventListener('mouseenter', handleFirstMouse, true)

    return () => {
      document.removeEventListener('touchstart', handleFirstTouch)
      document.removeEventListener('mouseenter', handleFirstMouse, true)
    }
  }, [])

  return isTouch
}

// Touch-aware interactive component
export interface TouchAwareProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverClass?: string
  touchClass?: string
  focusClass?: string
  disableHoverOnTouch?: boolean
}

export const TouchAware = React.forwardRef<HTMLDivElement, TouchAwareProps>(
  ({ 
    children, 
    hoverClass = "", 
    touchClass = "",
    focusClass = "",
    disableHoverOnTouch = true,
    className,
    ...props 
  }, ref) => {
    const isTouch = useIsTouch()

    const computedClassName = cn(
      className,
      // Apply touch-specific classes
      isTouch && touchClass,
      // Apply focus classes
      focusClass,
      // Only apply hover classes if not a touch device or hover is allowed
      (!isTouch || !disableHoverOnTouch) && hoverClass
    )

    return (
      <div
        ref={ref}
        className={computedClassName}
        data-touch={isTouch}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TouchAware.displayName = "TouchAware"

// Button wrapper with touch-optimized hover states
export interface TouchAwareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  hoverEffect?: "lift" | "scale" | "glow" | "none"
  touchEffect?: "scale" | "none"
}

export const TouchAwareButton = React.forwardRef<HTMLButtonElement, TouchAwareButtonProps>(
  ({ 
    children, 
    hoverEffect = "lift",
    touchEffect = "scale",
    className,
    ...props 
  }, ref) => {
    const isTouch = useIsTouch()

    const hoverClasses = {
      lift: "hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200",
      scale: "hover:scale-105 transition-transform duration-200", 
      glow: "hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-200",
      none: ""
    }

    const touchClasses = {
      scale: "active:scale-95 transition-transform duration-100",
      none: ""
    }

    const computedClassName = cn(
      className,
      // Base touch optimization
      "touch-manipulation select-none",
      // Apply hover effects only on non-touch devices
      !isTouch && hoverClasses[hoverEffect],
      // Apply touch effects
      isTouch && touchClasses[touchEffect],
      // Focus states for accessibility
      "focus:outline-none focus:ring-2 focus:ring-primary/50"
    )

    return (
      <button
        ref={ref}
        className={computedClassName}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TouchAwareButton.displayName = "TouchAwareButton"

// Card wrapper with touch-optimized hover states  
export interface TouchAwareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverEffect?: "lift" | "scale" | "glow" | "border" | "none"
  pressEffect?: "scale" | "none"
  interactive?: boolean
}

export const TouchAwareCard = React.forwardRef<HTMLDivElement, TouchAwareCardProps>(
  ({ 
    children, 
    hoverEffect = "lift",
    pressEffect = "scale", 
    interactive = false,
    className,
    ...props 
  }, ref) => {
    const isTouch = useIsTouch()

    const hoverClasses = {
      lift: "hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-200",
      scale: "hover:scale-[1.02] transition-transform duration-200",
      glow: "hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-200", 
      border: "hover:border-primary/50 transition-colors duration-200",
      none: ""
    }

    const pressClasses = {
      scale: "active:scale-[0.98] transition-transform duration-100",
      none: ""
    }

    const computedClassName = cn(
      className,
      // Base card styling
      "transition-all duration-200",
      // Interactive states
      interactive && "cursor-pointer touch-manipulation select-none",
      // Apply hover effects only on non-touch devices
      !isTouch && interactive && hoverClasses[hoverEffect],
      // Apply press effects on touch devices
      isTouch && interactive && pressClasses[pressEffect],
      // Focus states for accessibility
      interactive && "focus:outline-none focus:ring-2 focus:ring-primary/50"
    )

    return (
      <div
        ref={ref}
        className={computedClassName}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TouchAwareCard.displayName = "TouchAwareCard"

// Link wrapper with touch-optimized hover states
export interface TouchAwareLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  hoverEffect?: "underline" | "color" | "background" | "none"
}

export const TouchAwareLink = React.forwardRef<HTMLAnchorElement, TouchAwareLinkProps>(
  ({ 
    children, 
    hoverEffect = "underline",
    className,
    ...props 
  }, ref) => {
    const isTouch = useIsTouch()

    const hoverClasses = {
      underline: "hover:underline hover:decoration-2 transition-all duration-200",
      color: "hover:text-primary transition-colors duration-200",
      background: "hover:bg-primary/10 transition-colors duration-200 px-2 py-1 rounded",
      none: ""
    }

    const computedClassName = cn(
      className,
      // Base link styling
      "touch-manipulation",
      // Apply hover effects only on non-touch devices
      !isTouch && hoverClasses[hoverEffect],
      // Focus states for accessibility
      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1"
    )

    return (
      <a
        ref={ref}
        className={computedClassName}
        {...props}
      >
        {children}
      </a>
    )
  }
)
TouchAwareLink.displayName = "TouchAwareLink"