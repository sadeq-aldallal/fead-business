import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DocumentationContentProps, ContentSection, AlertContent, StepContent } from '@/types/documentation';
import { 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  Copy,
  ArrowRight 
} from 'lucide-react';

const getAlertIcon = (variant: AlertContent['variant']) => {
  switch (variant) {
    case 'info':
      return Info;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    case 'success':
      return CheckCircle;
    default:
      return Info;
  }
};

const getAlertVariant = (variant: AlertContent['variant']) => {
  switch (variant) {
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'error':
      return 'destructive';
    case 'success':
      return 'success';
    default:
      return 'default';
  }
};

const renderContentSection = (section: ContentSection, index: number) => {
  switch (section.type) {
    case 'text':
      return (
        <div key={index} className="prose prose-gray dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      );

    case 'alert': {
      const alertContent = section.content as AlertContent;
      const AlertIcon = alertContent.icon || getAlertIcon(alertContent.variant);
      
      return (
        <Alert key={index} variant={getAlertVariant(alertContent.variant)} className="my-6">
          <AlertIcon className="h-4 w-4" />
          <AlertTitle>{alertContent.title}</AlertTitle>
          <AlertDescription>
            {alertContent.description}
          </AlertDescription>
        </Alert>
      );
    }

    case 'steps': {
      const stepContent = section.content as StepContent;
      
      return (
        <div key={index} className="space-y-6 my-8">
          {section.title && (
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {section.title}
            </h3>
          )}
          <div className="space-y-6">
            {stepContent.steps.map((step, stepIndex) => (
              <Card key={stepIndex} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                      {step.number}
                    </div>
                    <span>{step.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  
                  {step.details && step.details.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-foreground mb-3 flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        Step Details
                      </h5>
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-3 text-sm group">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                              <ArrowRight className="w-3 h-3 text-primary" />
                            </div>
                            <span className="group-hover:text-foreground transition-colors">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.code && (
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      <pre>{step.code}</pre>
                    </div>
                  )}

                  {step.image && (
                    <div className="rounded-lg overflow-hidden border">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-auto"
                        loading="lazy"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    case 'code':
      return (
        <div key={index} className="my-6">
          {section.title && (
            <h4 className="text-lg font-medium text-foreground mb-3">
              {section.title}
            </h4>
          )}
          <div className="bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto border">
            <pre className="text-foreground">{section.content}</pre>
          </div>
        </div>
      );

    case 'image':
      return (
        <div key={index} className="my-8">
          {section.title && (
            <h4 className="text-lg font-medium text-foreground mb-4">
              {section.title}
            </h4>
          )}
          <div className="rounded-lg overflow-hidden border">
            <img
              src={section.content.src}
              alt={section.content.alt || section.title || 'Documentation image'}
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>
      );

    case 'list':
      return (
        <div key={index} className="my-6">
          {section.title && (
            <h4 className="text-lg font-medium text-foreground mb-3">
              {section.title}
            </h4>
          )}
          <ul className="space-y-2">
            {section.content.items.map((item: string, itemIndex: number) => (
              <li key={itemIndex} className="flex items-start space-x-2">
                <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'table':
      return (
        <div key={index} className="my-8">
          {section.title && (
            <h4 className="text-lg font-medium text-foreground mb-4">
              {section.title}
            </h4>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-lg">
              <thead>
                <tr className="bg-muted">
                  {section.content.headers.map((header: string, headerIndex: number) => (
                    <th key={headerIndex} className="border border-border px-4 py-2 text-left font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.content.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border border-border px-4 py-2">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const DocumentationContent: React.FC<DocumentationContentProps> = ({
  content,
  currentPath,
}) => {
  const copyCurrentUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}${currentPath}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <article className="max-w-4xl mx-auto documentation-content">
      {/* Header */}
      <header className="mb-8 pb-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {content.title}
            </h1>
            {content.subtitle && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content.subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              Documentation
            </Badge>
            <button
              onClick={copyCurrentUrl}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Copy page URL"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content Sections */}
      <div className="space-y-8">
        {content.sections.map((section, index) => (
          <React.Fragment key={index}>
            {renderContentSection(section, index)}
            {index < content.sections.length - 1 && (
              <Separator className="my-8" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    </article>
  );
};