import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        connected: "border-green-200 bg-green-100 text-green-800 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400",
        connecting: "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800/50 dark:bg-yellow-900/20 dark:text-yellow-400",
        error: "border-red-200 bg-red-100 text-red-800 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400",
        setup: "border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-800/50 dark:bg-gray-900/20 dark:text-gray-400",
        pending: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800/50 dark:bg-blue-900/20 dark:text-blue-400",
        success: "border-green-200 bg-green-100 text-green-800 dark:border-green-800/50 dark:bg-green-900/20 dark:text-green-400",
      }
    },
    defaultVariants: {
      variant: "setup",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  icon?: React.ReactNode
  pulse?: boolean
}

function StatusBadge({ className, variant, icon, pulse, children, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {pulse && <span className="mr-2 h-2 w-2 rounded-full bg-current animate-pulse" />}
      {children}
    </div>
  )
}

export { StatusBadge, statusBadgeVariants }