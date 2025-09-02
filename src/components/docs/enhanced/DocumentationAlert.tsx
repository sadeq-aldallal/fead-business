import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  FileText,
  Clock,
  Shield,
  Zap,
  HelpCircle
} from 'lucide-react';

type AlertVariant = 'info' | 'warning' | 'success' | 'error' | 'tip' | 'note';

interface DocumentationAlertProps {
  variant: AlertVariant;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    variant: 'info' as const,
  },
  warning: {
    icon: AlertTriangle,
    variant: 'warning' as const,
  },
  success: {
    icon: CheckCircle,
    variant: 'success' as const,
  },
  error: {
    icon: AlertCircle,
    variant: 'destructive' as const,
  },
  tip: {
    icon: Lightbulb,
    variant: 'tip' as const,
  },
  note: {
    icon: FileText,
    variant: 'note' as const,
  },
};

export const DocumentationAlert: React.FC<DocumentationAlertProps> = ({
  variant,
  title,
  children,
  className = '',
}) => {
  const config = alertConfig[variant];
  const Icon = config.icon;

  return (
    <Alert variant={config.variant} className={`my-6 ${className}`}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {children}
      </AlertDescription>
    </Alert>
  );
};

// Pre-configured alert components for common documentation scenarios
export const RequirementAlert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <DocumentationAlert variant="warning" title="Requirements">
    {children}
  </DocumentationAlert>
);

export const SecurityAlert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Alert variant="destructive" className="my-6">
    <Shield className="h-4 w-4" />
    <AlertTitle>Security Notice</AlertTitle>
    <AlertDescription className="mt-2">
      {children}
    </AlertDescription>
  </Alert>
);

export const QuickTipAlert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Alert variant="tip" className="my-6">
    <Zap className="h-4 w-4" />
    <AlertTitle>Quick Tip</AlertTitle>
    <AlertDescription className="mt-2">
      {children}
    </AlertDescription>
  </Alert>
);

export const TimelineAlert: React.FC<{ timeframe: string; children: React.ReactNode }> = ({ timeframe, children }) => (
  <Alert variant="info" className="my-6">
    <Clock className="h-4 w-4" />
    <AlertTitle>Timeline: {timeframe}</AlertTitle>
    <AlertDescription className="mt-2">
      {children}
    </AlertDescription>
  </Alert>
);

export const HelpAlert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Alert variant="note" className="my-6">
    <HelpCircle className="h-4 w-4" />
    <AlertTitle>Need Help?</AlertTitle>
    <AlertDescription className="mt-2">
      {children}
    </AlertDescription>
  </Alert>
);