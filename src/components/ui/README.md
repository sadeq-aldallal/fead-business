# Component Usage Guidelines

This document outlines the standardized component patterns for fead.app, ensuring consistent design and implementation across the application.

## Design System Overview

Our component system is built on **shadcn/ui** with brand-specific customizations:
- **Primary Color**: Brand Green (#00D4AA / HSL: 174 100% 42%)
- **Typography**: Responsive scaling with proper contrast
- **Spacing**: Consistent padding and margin patterns
- **Dark Mode**: Full support with automatic color switching

## Core Components

### Button Component

The Button component supports multiple variants including brand-specific styling.

```tsx
import { Button } from '@/components/ui/button'

// Basic usage
<Button>Default Button</Button>

// Brand variants
<Button variant="brand">Brand Primary</Button>
<Button variant="brand-outline">Brand Outline</Button>
<Button variant="brand-ghost">Brand Ghost</Button>

// Sizes and states
<Button size="sm" disabled>Small Disabled</Button>
<Button size="lg">Large Button</Button>
```

**Available Variants:**
- `default` - Standard button with primary colors
- `brand` - Brand green styling with optimal contrast
- `brand-outline` - Brand outline with hover effects
- `brand-ghost` - Subtle brand styling for secondary actions
- `destructive` - Red styling for delete/remove actions
- `outline` - Neutral outline button
- `secondary` - Muted background button
- `ghost` - No background, hover effects only
- `link` - Link-styled button

### Input Component

Enhanced input with label, error states, and optional icons.

```tsx
import { Input } from '../ui/Input'

// Basic usage
<Input 
  label="Email Address"
  type="email"
  placeholder="Enter your email"
/>

// With password toggle
<Input
  label="Password"
  type="password"
  showPasswordToggle
/>

// With error state
<Input
  label="Username"
  error="Username is required"
/>

// With icons
<Input
  label="Search"
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
/>
```

**Props Interface:**
```typescript
interface InputProps {
  label?: string
  error?: string
  showPasswordToggle?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  // Standard HTML input props...
}
```

### Status Badge Component

Standardized status indicators for connection states and system status.

```tsx
import { StatusBadge } from '@/components/ui/status-badge'

// Connection status
<StatusBadge variant="connected">Live</StatusBadge>
<StatusBadge variant="connecting" pulse>Syncing</StatusBadge>
<StatusBadge variant="error">Issue</StatusBadge>
<StatusBadge variant="setup">Setup Required</StatusBadge>

// With custom icons
<StatusBadge variant="success" icon={<CheckIcon />}>
  Verified
</StatusBadge>
```

**Available Variants:**
- `connected` - Green styling for active connections
- `connecting` - Yellow styling with optional pulse animation
- `error` - Red styling for error states
- `setup` - Gray styling for inactive/setup states
- `pending` - Blue styling for pending operations
- `success` - Green styling for completed operations

### Action Menu Component

Consistent dropdown menus for table rows and card actions.

```tsx
import { ActionMenu } from '@/components/ui/action-menu'
import { EditIcon, DeleteIcon } from 'lucide-react'

<ActionMenu
  items={[
    {
      label: 'Edit Business',
      onClick: () => handleEdit(),
      icon: <EditIcon size={14} />
    },
    {
      label: 'Delete',
      onClick: () => handleDelete(),
      icon: <DeleteIcon size={14} />,
      destructive: true
    }
  ]}
/>
```

**Item Interface:**
```typescript
interface ActionMenuItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean
}
```

### Data Table Components

Standardized table layouts with consistent styling.

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/data-table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Business Name</TableCell>
      <TableCell>
        <StatusBadge variant="connected">Live</StatusBadge>
      </TableCell>
      <TableCell>
        <ActionMenu items={menuItems} />
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Empty State Component

Consistent empty state presentations with optional actions.

```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { PlusIcon, BuildingIcon } from 'lucide-react'

<EmptyState
  icon={<BuildingIcon />}
  title="No businesses yet"
  description="Create your first business to get started with Instagram automation"
  action={{
    label: "Add Business",
    onClick: () => openBusinessModal(),
    variant: "brand"
  }}
/>
```

### Loading Skeletons

Pre-built loading states for different content types.

```tsx
import { 
  Skeleton, 
  BusinessCardSkeleton,
  DashboardSkeleton 
} from '@/components/ui/loading-skeleton'

// Basic skeleton
<Skeleton className="h-4 w-[250px]" />

// Business card loading
<BusinessCardSkeleton />

// Full dashboard loading
<DashboardSkeleton />
```

## Usage Patterns

### Form Composition

```tsx
<form className="space-y-4">
  <Input
    label="Business Name"
    error={errors.name}
    {...register('name')}
  />
  
  <Button 
    type="submit"
    variant="brand"
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Saving...' : 'Save Business'}
  </Button>
</form>
```

### Card with Actions

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BuildingIcon size={20} className="text-primary" />
        </div>
        <div>
          <CardTitle>{business.name}</CardTitle>
          <CardDescription>{business.type}</CardDescription>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <StatusBadge variant="connected">Live</StatusBadge>
        <ActionMenu items={actionItems} />
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

### Modal Patterns

```tsx
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>
        Modal description text
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4">
      {/* Modal content */}
    </div>
    
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="brand" onClick={onConfirm}>
        Confirm
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

## Color System Reference

### CSS Variables
```css
/* Primary brand colors */
--primary: 174 100% 42%        /* Brand Green */
--primary-foreground: 0 0% 100% /* White text */

/* Brand variations */
--brand-primary: 174 100% 42%
--brand-primary-hover: 174 100% 38%
--brand-primary-foreground: 0 0% 100%
```

### Usage in Components
```tsx
// Use semantic color classes
className="bg-primary text-primary-foreground"
className="border-primary text-primary"
className="hover:bg-primary/10"

// For specific brand styling
className="bg-brand-primary hover:bg-brand-primary-hover"
```

## Best Practices

1. **Always use provided components** instead of custom implementations
2. **Follow the established patterns** for consistency
3. **Use semantic color classes** (`primary`, `muted-foreground`) over custom colors
4. **Include proper TypeScript types** for all props and interfaces
5. **Test components** with both light and dark themes
6. **Use loading states** for async operations
7. **Provide empty states** for data lists and grids
8. **Include proper ARIA labels** for accessibility

## Migration Checklist

When updating existing components:

- [ ] Replace custom button classes with `Button` component variants
- [ ] Update input fields to use the standardized `Input` component
- [ ] Convert status indicators to `StatusBadge` components
- [ ] Replace custom dropdown menus with `ActionMenu`
- [ ] Add loading states using skeleton components
- [ ] Include empty states for data lists
- [ ] Update color classes to use design system tokens
- [ ] Test with both light and dark themes
- [ ] Verify TypeScript types are properly defined

## Questions or Issues?

For questions about component usage or to request new patterns, please refer to the component source code in `src/components/ui/` or create documentation updates as needed.