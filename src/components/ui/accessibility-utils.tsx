import * as React from "react"
import { cn } from "@/lib/utils"

// Hook for managing keyboard shortcuts
export const useKeyboardShortcut = (
  key: string,
  callback: () => void,
  options: {
    ctrlKey?: boolean
    altKey?: boolean
    shiftKey?: boolean
    metaKey?: boolean
    enabled?: boolean
  } = {}
) => {
  const { ctrlKey = false, altKey = false, shiftKey = false, metaKey = false, enabled = true } = options

  React.useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const isModifierMatch = 
        event.ctrlKey === ctrlKey &&
        event.altKey === altKey &&
        event.shiftKey === shiftKey &&
        event.metaKey === metaKey

      if (event.key.toLowerCase() === key.toLowerCase() && isModifierMatch) {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, ctrlKey, altKey, shiftKey, metaKey, enabled])
}

// Hook for managing focus trap in modals/dialogs
export const useFocusTrap = (isActive: boolean = true) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      if (!containerRef.current) return []
      
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ].join(', ')

      return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[]
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Let parent components handle escape
        event.stopPropagation()
      }
    }

    // Focus the first focusable element
    const focusableElements = getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keydown', handleEscapeKey)
      
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}

// Hook for announcing content to screen readers
export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = React.useState<string>('')
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('')
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Small delay to ensure screen reader notices the change
    timeoutRef.current = setTimeout(() => {
      setAnnouncement(message)
      
      // Clear announcement after it's been read
      timeoutRef.current = setTimeout(() => {
        setAnnouncement('')
      }, 1000)
    }, 100)
  }, [])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const AnnouncementRegion = React.useMemo(() => 
    React.forwardRef<HTMLDivElement, { priority?: 'polite' | 'assertive' }>(
      ({ priority = 'polite' }, ref) => (
        <div
          ref={ref}
          role="status"
          aria-live={priority}
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </div>
      )
    ), [announcement])

  AnnouncementRegion.displayName = "AnnouncementRegion"

  return { announce, AnnouncementRegion }
}

// Component for skip links (accessibility navigation)
export interface SkipLinksProps {
  links: Array<{
    href: string
    label: string
  }>
  className?: string
}

export const SkipLinks = React.forwardRef<HTMLDivElement, SkipLinksProps>(
  ({ links, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 left-0 z-[9999] flex flex-col gap-2 p-4 translate-y-[-100%] focus-within:translate-y-0 transition-transform duration-200",
        className
      )}
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="bg-primary text-primary-foreground px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring text-sm font-medium"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
)
SkipLinks.displayName = "SkipLinks"

// Component for accessible button groups with keyboard navigation
export interface AccessibleButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  label?: string
  description?: string
}

export const AccessibleButtonGroup = React.forwardRef<HTMLDivElement, AccessibleButtonGroupProps>(
  ({ children, orientation = 'horizontal', label, description, className, ...props }, ref) => {
    const groupRef = React.useRef<HTMLDivElement>(null)
    const [focusedIndex, setFocusedIndex] = React.useState(0)

    React.useEffect(() => {
      const group = groupRef.current
      if (!group) return

      const buttons = Array.from(group.querySelectorAll('button:not([disabled])')) as HTMLButtonElement[]

      const handleKeyDown = (event: KeyboardEvent) => {
        const isHorizontal = orientation === 'horizontal'
        const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
        const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

        if ([nextKey, prevKey, 'Home', 'End'].includes(event.key)) {
          event.preventDefault()
          
          let newIndex = focusedIndex
          
          switch (event.key) {
            case nextKey:
              newIndex = (focusedIndex + 1) % buttons.length
              break
            case prevKey:
              newIndex = focusedIndex === 0 ? buttons.length - 1 : focusedIndex - 1
              break
            case 'Home':
              newIndex = 0
              break
            case 'End':
              newIndex = buttons.length - 1
              break
          }
          
          setFocusedIndex(newIndex)
          buttons[newIndex]?.focus()
        }
      }

      group.addEventListener('keydown', handleKeyDown)
      return () => group.removeEventListener('keydown', handleKeyDown)
    }, [orientation, focusedIndex])

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        role="group"
        aria-label={label}
        aria-describedby={description ? `${props.id}-description` : undefined}
        {...props}
      >
        {description && (
          <div id={`${props.id}-description`} className="sr-only">
            {description}
          </div>
        )}
        <div ref={groupRef} className={cn(
          "flex",
          orientation === 'horizontal' ? 'flex-row gap-2' : 'flex-col gap-2'
        )}>
          {children}
        </div>
      </div>
    )
  }
)
AccessibleButtonGroup.displayName = "AccessibleButtonGroup"

// Hook for managing reduced motion preferences
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Component for accessible loading states
export interface AccessibleLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean
  loadingText?: string
  children: React.ReactNode
  loadingSpinner?: React.ReactNode
}

export const AccessibleLoading = React.forwardRef<HTMLDivElement, AccessibleLoadingProps>(
  ({ isLoading, loadingText = "Loading...", children, loadingSpinner, className, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {isLoading && (
        <div role="status" aria-live="polite" className="sr-only">
          {loadingText}
        </div>
      )}
      <div aria-hidden={isLoading}>
        {children}
      </div>
      {isLoading && loadingSpinner && (
        <div className="flex items-center justify-center" aria-hidden="true">
          {loadingSpinner}
        </div>
      )}
    </div>
  )
)
AccessibleLoading.displayName = "AccessibleLoading"

// Helper function to format shortcut keys for display
export const formatShortcut = (shortcut: {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
}) => {
  const parts: string[] = []
  
  if (shortcut.metaKey) parts.push('⌘')
  if (shortcut.ctrlKey) parts.push('Ctrl')
  if (shortcut.altKey) parts.push('Alt')
  if (shortcut.shiftKey) parts.push('Shift')
  
  parts.push(shortcut.key.toUpperCase())
  
  return parts.join('+')
}