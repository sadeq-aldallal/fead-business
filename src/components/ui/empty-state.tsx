import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "brand" | "brand-outline" | "brand-ghost"
  }
  className?: string
  children?: React.ReactNode
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  children 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      {icon && (
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <div className="h-10 w-10 text-muted-foreground">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button 
          variant={action.variant || "default"}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  )
}