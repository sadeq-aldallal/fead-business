import { LucideIcon } from 'lucide-react';

export interface DocSection {
  id: string;
  title: string;
  icon?: LucideIcon;
  subsections: DocSubsection[];
}

export interface DocSubsection {
  id: string;
  title: string;
  path: string;
  content?: DocContent;
}

export interface DocContent {
  title: string;
  subtitle?: string;
  sections: ContentSection[];
}

export interface ContentSection {
  id: string;
  type: 'text' | 'alert' | 'steps' | 'code' | 'image' | 'list' | 'table';
  title?: string;
  content: unknown; // This will be typed more specifically per section type
  className?: string;
}

// Alert content types
export interface AlertContent {
  variant: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  icon?: LucideIcon;
}

// Step content types
export interface StepContent {
  steps: Step[];
}

export interface Step {
  number: number;
  title: string;
  description: string;
  details?: string[];
  code?: string;
  image?: string;
}

// Navigation types
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

// Component props
export interface DocumentationLayoutProps {
  sections: DocSection[];
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export interface DocumentationSidebarProps {
  sections: DocSection[];
  currentPath: string;
  onNavigate: (path: string) => void;
  expandedSections: Record<string, boolean>;
  onToggleSection: (sectionId: string) => void;
}

export interface DocumentationBreadcrumbProps {
  items: BreadcrumbItem[];
}

export interface DocumentationContentProps {
  content: DocContent;
  currentPath: string;
}