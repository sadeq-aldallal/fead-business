import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ActionMenuItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  label?: string
  triggerClassName?: string
  contentClassName?: string
}

export function ActionMenu({ 
  items, 
  label = "Actions", 
  triggerClassName,
  contentClassName 
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn("h-8 w-8 p-0", triggerClassName)}
          aria-label={label}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn("w-[160px]", contentClassName)}
      >
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className={cn(
              "flex items-center cursor-pointer",
              item.destructive && "text-destructive focus:text-destructive"
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}