// Enhanced Documentation Components
export { DocumentationLayout } from './DocumentationLayout';
export { DocumentationSidebar } from './DocumentationSidebar';
export { DocumentationBreadcrumb } from './DocumentationBreadcrumb';
export { DocumentationContent } from './DocumentationContent';
export { EnhancedDocumentationPage } from './EnhancedDocumentationPage';

// Enhanced UI Components
export { 
  DocumentationAlert,
  RequirementAlert,
  SecurityAlert,
  QuickTipAlert,
  TimelineAlert,
  HelpAlert
} from './DocumentationAlert';

export { StepByStepGuide } from './StepByStepGuide';
export type { StepGuideStep } from './StepByStepGuide';

export {
  CrossReference,
  RelatedLinks,
  NextStepsSection,
  PrerequisitesSection
} from './CrossReference';

export {
  CopyButton,
  ReadingProgress,
  CollapsibleSection,
  FeedbackSection,
  BookmarkButton,
  ReadingTime,
  QuickActions
} from './InteractiveElements';

// Re-export types for convenience
export type {
  DocSection,
  DocSubsection,
  DocContent,
  ContentSection,
  AlertContent,
  StepContent,
  BreadcrumbItem,
  DocumentationLayoutProps,
  DocumentationSidebarProps,
  DocumentationBreadcrumbProps,
  DocumentationContentProps,
} from '@/types/documentation';