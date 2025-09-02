import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Base skeleton component with shimmer animation
const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-muted",
        card: "bg-card border border-border",
        text: "bg-muted rounded-sm",
        avatar: "bg-muted rounded-full",
        button: "bg-muted rounded-md",
      },
      animation: {
        pulse: "animate-pulse",
        shimmer: "animate-shimmer bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:400%_100%]",
        wave: "animate-wave",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "shimmer",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number
  height?: string | number
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, animation, width, height, style, ...props }, ref) => {
    const combinedStyle = {
      width,
      height,
      ...style,
    }

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, animation, className }))}
        style={combinedStyle}
        aria-hidden="true"
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Skeleton text lines component
export interface SkeletonTextProps {
  lines?: number
  className?: string
  lastLineWidth?: string
  spacing?: "tight" | "normal" | "loose"
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, lastLineWidth = "60%", spacing = "normal" }, ref) => {
    const spacingClasses = {
      tight: "gap-1",
      normal: "gap-2",
      loose: "gap-3",
    }

    return (
      <div
        ref={ref}
        className={cn("flex flex-col", spacingClasses[spacing], className)}
        aria-hidden="true"
      >
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            className="h-4"
            style={{
              width: index === lines - 1 ? lastLineWidth : "100%",
            }}
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = "SkeletonText"

// Avatar skeleton with different sizes
export interface SkeletonAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}

export const SkeletonAvatar = React.forwardRef<HTMLDivElement, SkeletonAvatarProps>(
  ({ size = "md", className }, ref) => {
    const sizeClasses = {
      xs: "w-6 h-6",
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
    }

    return (
      <Skeleton
        ref={ref}
        variant="avatar"
        className={cn(sizeClasses[size], className)}
      />
    )
  }
)
SkeletonAvatar.displayName = "SkeletonAvatar"

// Button skeleton
export interface SkeletonButtonProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  fullWidth?: boolean
  className?: string
}

export const SkeletonButton = React.forwardRef<HTMLDivElement, SkeletonButtonProps>(
  ({ size = "md", fullWidth = false, className }, ref) => {
    const sizeClasses = {
      xs: "h-8 px-3",
      sm: "h-9 px-4",
      md: "h-10 px-6",
      lg: "h-11 px-8",
      xl: "h-12 px-10",
    }

    return (
      <Skeleton
        ref={ref}
        variant="button"
        className={cn(
          sizeClasses[size],
          fullWidth ? "w-full" : "w-20",
          className
        )}
      />
    )
  }
)
SkeletonButton.displayName = "SkeletonButton"

// Card skeleton for dashboard items
export interface SkeletonCardProps {
  showAvatar?: boolean
  showActions?: boolean
  textLines?: number
  className?: string
}

export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ showAvatar = false, showActions = false, textLines = 3, className }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 space-y-4", className)}
      aria-hidden="true"
    >
      {/* Header with optional avatar */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {showAvatar && <SkeletonAvatar size="md" />}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        )}
      </div>

      {/* Content */}
      <SkeletonText lines={textLines} spacing="normal" />

      {/* Footer */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
)
SkeletonCard.displayName = "SkeletonCard"

// Table skeleton
export interface SkeletonTableProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  className?: string
}

export const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 5, columns = 4, showHeader = true, className }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} aria-hidden="true">
      {/* Table Header */}
      {showHeader && (
        <div className="flex gap-4 pb-2 border-b border-border">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={`header-${index}`}
              className="h-4 flex-1"
              style={{ maxWidth: `${100 / columns}%` }}
            />
          ))}
        </div>
      )}

      {/* Table Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className="h-4 flex-1"
                style={{ maxWidth: `${100 / columns}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
)
SkeletonTable.displayName = "SkeletonTable"

// Form skeleton
export interface SkeletonFormProps {
  fields?: number
  showButtons?: boolean
  className?: string
}

export const SkeletonForm = React.forwardRef<HTMLDivElement, SkeletonFormProps>(
  ({ fields = 4, showButtons = true, className }, ref) => (
    <div ref={ref} className={cn("space-y-6", className)} aria-hidden="true">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={`field-${index}`} className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
        </div>
      ))}
      
      {showButtons && (
        <div className="flex gap-3 pt-4">
          <SkeletonButton size="lg" className="w-32" />
          <SkeletonButton size="lg" className="w-24" />
        </div>
      )}
    </div>
  )
)
SkeletonForm.displayName = "SkeletonForm"

// Dashboard grid skeleton
export interface SkeletonDashboardProps {
  cards?: number
  columns?: number
  className?: string
}

export const SkeletonDashboard = React.forwardRef<HTMLDivElement, SkeletonDashboardProps>(
  ({ cards = 6, columns = 3, className }, ref) => {
    const gridClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-6",
          gridClasses[columns as keyof typeof gridClasses] || gridClasses[3],
          className
        )}
        aria-hidden="true"
      >
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={`dashboard-card-${index}`}
            className="bg-card border border-border rounded-lg"
          >
            <SkeletonCard
              showAvatar={index % 3 === 0}
              showActions={index % 2 === 0}
              textLines={Math.floor(Math.random() * 3) + 2}
            />
          </div>
        ))}
      </div>
    )
  }
)
SkeletonDashboard.displayName = "SkeletonDashboard"

// List item skeleton
export interface SkeletonListItemProps {
  showAvatar?: boolean
  showActions?: boolean
  showDescription?: boolean
  className?: string
}

export const SkeletonListItem = React.forwardRef<HTMLDivElement, SkeletonListItemProps>(
  ({ showAvatar = false, showActions = false, showDescription = true, className }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 p-4", className)}
      aria-hidden="true"
    >
      {showAvatar && <SkeletonAvatar size="md" />}
      
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        {showDescription && <Skeleton className="h-3 w-32" />}
      </div>

      {showActions && (
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      )}
    </div>
  )
)
SkeletonListItem.displayName = "SkeletonListItem"

// Navigation skeleton
export const SkeletonNavigation = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-between p-4", className)}
      aria-hidden="true"
    >
      {/* Logo */}
      <Skeleton className="h-8 w-24" />

      {/* Navigation items */}
      <div className="hidden md:flex items-center gap-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-18" />
      </div>

      {/* User section */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-20 rounded-md" />
        <SkeletonAvatar size="sm" />
      </div>
    </div>
  )
)
SkeletonNavigation.displayName = "SkeletonNavigation"

export {
  skeletonVariants,
}