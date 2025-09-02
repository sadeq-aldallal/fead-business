import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonGroupVariants = cva(
  "inline-flex items-center",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
      spacing: {
        none: "gap-0",
        sm: "gap-2",
        md: "gap-3",
        lg: "gap-4",
        xl: "gap-6",
      },
      variant: {
        default: "",
        attached: "divide-x divide-border [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none",
        "attached-vertical": "divide-y divide-border [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none",
      },
      fullWidth: {
        true: "w-full [&>*]:flex-1",
        false: "",
      },
    },
    compoundVariants: [
      {
        orientation: "vertical",
        variant: "attached",
        className: "divide-x-0 divide-y divide-border [&>*:first-child]:rounded-b-none [&>*:first-child]:rounded-r-md [&>*:last-child]:rounded-t-none [&>*:last-child]:rounded-l-md [&>*:not(:first-child):not(:last-child)]:rounded-none",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      spacing: "md",
      variant: "default",
      fullWidth: false,
    },
  }
)

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation, spacing, variant, fullWidth, ...props }, ref) => (
    <div
      className={cn(buttonGroupVariants({ orientation, spacing, variant, fullWidth, className }))}
      ref={ref}
      role="group"
      {...props}
    />
  )
)
ButtonGroup.displayName = "ButtonGroup"

// Mobile-optimized button stack component
const buttonStackVariants = cva(
  "flex w-full",
  {
    variants: {
      direction: {
        column: "flex-col",
        "column-reverse": "flex-col-reverse",
        row: "flex-row sm:flex-row",
        "row-reverse": "flex-row-reverse sm:flex-row-reverse",
        responsive: "flex-col sm:flex-row",
        "responsive-reverse": "flex-col sm:flex-row-reverse",
      },
      spacing: {
        none: "gap-0",
        sm: "gap-2 sm:gap-2",
        md: "gap-3 sm:gap-3",
        lg: "gap-4 sm:gap-3",
        xl: "gap-6 sm:gap-4",
      },
      alignment: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
    },
    defaultVariants: {
      direction: "responsive",
      spacing: "md",
      alignment: "stretch",
      justify: "start",
    },
  }
)

export interface ButtonStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonStackVariants> {}

const ButtonStack = React.forwardRef<HTMLDivElement, ButtonStackProps>(
  ({ className, direction, spacing, alignment, justify, ...props }, ref) => (
    <div
      className={cn(buttonStackVariants({ direction, spacing, alignment, justify, className }))}
      ref={ref}
      role="group"
      {...props}
    />
  )
)
ButtonStack.displayName = "ButtonStack"

// Floating Action Button for mobile
const fabVariants = cva(
  "fixed z-50 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-95",
  {
    variants: {
      size: {
        sm: "h-12 w-12",
        md: "h-14 w-14", 
        lg: "h-16 w-16",
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6", 
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "top-center": "top-6 left-1/2 -translate-x-1/2",
      },
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", 
        accent: "bg-accent text-accent-foreground hover:bg-accent/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
    defaultVariants: {
      size: "md",
      position: "bottom-right", 
      variant: "primary",
    },
  }
)

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  icon: React.ReactNode
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ className, size, position, variant, icon, children, ...props }, ref) => (
    <button
      className={cn(fabVariants({ size, position, variant }), "rounded-full flex items-center justify-center", className)}
      ref={ref}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
      {children && <span className="sr-only">{children}</span>}
    </button>
  )
)
FloatingActionButton.displayName = "FloatingActionButton"

export { ButtonGroup, buttonGroupVariants, ButtonStack, buttonStackVariants, FloatingActionButton, fabVariants }