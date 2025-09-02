import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AccessibleFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  errorSummary?: string[];
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({
  title,
  description,
  errorSummary = [],
  children,
  onSubmit,
  className,
  ariaLabelledBy,
  ariaDescribedBy,
  ...props
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  
  // Generate unique IDs for accessibility
  const formId = `form-${Math.random().toString(36).substr(2, 9)}`;
  const titleId = `${formId}-title`;
  const descriptionId = `${formId}-description`;
  const errorSummaryId = `${formId}-error-summary`;

  // Focus error summary when errors appear
  useEffect(() => {
    if (errorSummary.length > 0 && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
    }
  }, [errorSummary]);

  // Announce form submission status
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default to handle custom submission
    e.preventDefault();
    
    // Screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Processing form submission...';
    document.body.appendChild(announcement);
    
    // Clean up announcement after delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
    
    // Call original handler
    onSubmit(e);
  };

  return (
    <div className="space-y-6 sm:space-y-4">
      {/* Form Title and Description */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 
              id={titleId}
              className="text-xl sm:text-lg font-semibold text-foreground"
            >
              {title}
            </h2>
          )}
          {description && (
            <p 
              id={descriptionId}
              className="text-base sm:text-sm text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>
      )}

      {/* Error Summary for Screen Readers */}
      {errorSummary.length > 0 && (
        <div
          ref={errorSummaryRef}
          id={errorSummaryId}
          role="alert"
          aria-live="polite"
          tabIndex={-1}
          className="p-4 bg-destructive/10 border border-destructive/30 rounded-md focus:outline-none focus:ring-2 focus:ring-destructive"
        >
          <h3 className="font-semibold text-destructive text-base mb-2">
            {errorSummary.length === 1 ? 'There is an error:' : `There are ${errorSummary.length} errors:`}
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {errorSummary.map((error, index) => (
              <li key={index} className="text-sm text-destructive">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Form */}
      <form
        ref={formRef}
        id={formId}
        onSubmit={handleSubmit}
        aria-labelledby={ariaLabelledBy || (title ? titleId : undefined)}
        aria-describedby={[
          ariaDescribedBy,
          description ? descriptionId : undefined,
          errorSummary.length > 0 ? errorSummaryId : undefined
        ].filter(Boolean).join(' ') || undefined}
        noValidate
        className={cn(
          "space-y-6 sm:space-y-4 form-spacing-mobile",
          className
        )}
        {...props}
      >
        {children}
      </form>
    </div>
  );
};

// Enhanced fieldset component for grouping related fields
interface AccessibleFieldsetProps {
  legend: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

export const AccessibleFieldset: React.FC<AccessibleFieldsetProps> = ({
  legend,
  children,
  className,
  required = false
}) => {
  return (
    <fieldset className={cn("space-y-4 sm:space-y-3", className)}>
      <legend className="text-lg sm:text-base font-semibold text-foreground mb-3">
        {legend}
        {required && (
          <span 
            className="text-destructive ml-1" 
            aria-label="required section"
          >
            *
          </span>
        )}
      </legend>
      {children}
    </fieldset>
  );
};

// Status announcement component for dynamic updates
interface StatusAnnouncementProps {
  message: string;
  type?: 'polite' | 'assertive';
  className?: string;
}

export const StatusAnnouncement: React.FC<StatusAnnouncementProps> = ({
  message,
  type = 'polite',
  className
}) => {
  return (
    <div
      aria-live={type}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  );
};

// Instructions component for complex forms
interface FormInstructionsProps {
  instructions: string[];
  className?: string;
}

export const FormInstructions: React.FC<FormInstructionsProps> = ({
  instructions,
  className
}) => {
  const instructionsId = `instructions-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div 
      id={instructionsId}
      className={cn("bg-muted/50 p-4 rounded-md border border-border/50", className)}
      role="note"
      aria-label="Form instructions"
    >
      <h3 className="font-medium text-foreground mb-2 text-base">
        Before you begin:
      </h3>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex items-start gap-2">
            <span aria-hidden="true" className="text-primary mt-0.5">•</span>
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};