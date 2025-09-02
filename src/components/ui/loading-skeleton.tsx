import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Common skeleton patterns for different use cases

function CardSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-3 p-6", className)} {...props}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

function TableRowSkeleton({ columns = 4, className, ...props }: SkeletonProps & { columns?: number }) {
  return (
    <div className={cn("flex space-x-4 p-4", className)} {...props}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  )
}

function BusinessCardSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-4 p-6 border rounded-lg", className)} {...props}>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  )
}

function DashboardSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Card skeleton */}
      <div className="border rounded-lg">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </div>
      </div>

      {/* Business cards grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <BusinessCardSkeleton />
        <BusinessCardSkeleton />
        <BusinessCardSkeleton />
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  CardSkeleton, 
  TableRowSkeleton, 
  BusinessCardSkeleton, 
  DashboardSkeleton 
}