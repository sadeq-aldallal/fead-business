/**
 * Component TypeScript Interfaces
 * Standardized types for UI components
 */

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonVariantProps {
  variant?: 
    | "default" 
    | "destructive" 
    | "outline" 
    | "secondary" 
    | "ghost" 
    | "link"
    | "brand"
    | "brand-outline"
    | "brand-ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export interface StatusBadgeProps extends BaseComponentProps {
  variant: "connected" | "connecting" | "error" | "setup" | "pending" | "success";
  icon?: React.ReactNode;
  pulse?: boolean;
}

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export interface ActionMenuProps {
  items: ActionMenuItem[];
  label?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export interface EmptyStateProps extends BaseComponentProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonVariantProps['variant'];
  };
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
}

export interface LoadingSkeletonProps extends BaseComponentProps {
  columns?: number; // For table row skeletons
}

// Dashboard-specific interfaces
export interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    type: string;
    instagram_status: 'connected' | 'connecting' | 'error' | 'setup';
    instagram_username?: string;
    created_at: string;
  };
  onManage: (business: BusinessCardProps['business']) => void;
  onConnect: (business: BusinessCardProps['business']) => void;
}

export interface StatusIndicatorProps {
  status: 'connected' | 'connecting' | 'error' | 'setup';
  showLabel?: boolean;
  showPulse?: boolean;
}

// Form validation types
export interface FormFieldState {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

// Theme-related types
export interface ThemeColors {
  primary: string;
  'primary-foreground': string;
  'brand-primary': string;
  'brand-primary-hover': string;
  'brand-primary-foreground': string;
}

export interface ComponentTheme {
  colors: ThemeColors;
  radius: string;
  fontFamily: {
    sans: string[];
    mono: string[];
    arabic?: string[];
  };
}

// Modal and dialog types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
}

export interface ConfirmationModalProps extends ModalProps {
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

// Data table types
export interface TableColumn<T = any> {
  id: string;
  label: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: EmptyStateProps;
  onRowClick?: (item: T) => void;
  className?: string;
}

// Navigation and layout types
export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  badge?: {
    content: string | number;
    variant: StatusBadgeProps['variant'];
  };
}

export interface SidebarProps extends BaseComponentProps {
  items: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// Responsive design types
export interface ResponsiveProps {
  xs?: boolean | string | number;
  sm?: boolean | string | number;
  md?: boolean | string | number;
  lg?: boolean | string | number;
  xl?: boolean | string | number;
  '2xl'?: boolean | string | number;
}

// Animation and transition types
export interface AnimationProps {
  animate?: boolean;
  duration?: number;
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
}

// Utility types for component composition
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type ComponentState = 'default' | 'loading' | 'disabled' | 'error' | 'success';

// Event handler types
export interface ComponentEventHandlers {
  onClick?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onChange?: (event: React.ChangeEvent) => void;
  onSubmit?: (event: React.FormEvent) => void;
}

// Accessibility types
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-disabled'?: boolean;
  role?: string;
  tabIndex?: number;
}