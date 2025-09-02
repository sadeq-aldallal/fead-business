import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ExternalLink, 
  ArrowRight, 
  BookOpen, 
  Link as LinkIcon,
  ChevronRight
} from 'lucide-react';

interface CrossReferenceProps {
  title: string;
  description?: string;
  path: string;
  variant?: 'inline' | 'card' | 'button';
  className?: string;
  showIcon?: boolean;
}

interface RelatedLinksProps {
  title?: string;
  links: Array<{
    title: string;
    description?: string;
    path: string;
    category?: string;
  }>;
  className?: string;
}

export const CrossReference: React.FC<CrossReferenceProps> = ({
  title,
  description,
  path,
  variant = 'inline',
  className = '',
  showIcon = true,
}) => {
  const handleNavigation = () => {
    if (path.startsWith('/docs')) {
      window.location.hash = path.replace('/docs/', '');
    } else {
      window.location.hash = path;
    }
  };

  switch (variant) {
    case 'card':
      return (
        <Card className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/30 ${className}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">
                {showIcon && <BookOpen className="w-4 h-4 text-primary" />}
                <span>{title}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          {description && (
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          )}
        </Card>
      );

    case 'button':
      return (
        <Button
          variant="outline"
          onClick={handleNavigation}
          className={`justify-start h-auto p-3 text-left ${className}`}
        >
          <div className="flex items-center space-x-3 w-full">
            {showIcon && <LinkIcon className="w-4 h-4 text-primary flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium">{title}</div>
              {description && (
                <div className="text-sm text-muted-foreground mt-1 truncate">
                  {description}
                </div>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </Button>
      );

    default: // inline
      return (
        <button
          onClick={handleNavigation}
          className={`
            inline-flex items-center space-x-1 text-primary hover:text-primary/80 
            underline-offset-4 hover:underline transition-colors
            ${className}
          `}
        >
          <span>{title}</span>
          {showIcon && <ExternalLink className="w-3 h-3" />}
        </button>
      );
  }
};

export const RelatedLinks: React.FC<RelatedLinksProps> = ({
  title = 'Related Documentation',
  links,
  className = '',
}) => {
  const groupedLinks = links.reduce((acc, link) => {
    const category = link.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, typeof links>);

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-lg font-semibold text-foreground flex items-center">
        <BookOpen className="w-4 h-4 mr-2 text-primary" />
        {title}
      </h4>
      
      <div className="space-y-6">
        {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
          <div key={category} className="space-y-3">
            {Object.keys(groupedLinks).length > 1 && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                <div className="flex-1 h-px bg-border"></div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-2">
              {categoryLinks.map((link, index) => (
                <CrossReference
                  key={index}
                  title={link.title}
                  description={link.description}
                  path={link.path}
                  variant="button"
                  className="w-full"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pre-built cross-reference components for common patterns
export const NextStepsSection: React.FC<{
  steps: Array<{
    title: string;
    description: string;
    path: string;
  }>;
}> = ({ steps }) => (
  <div className="mt-12 p-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-lg border border-primary/20">
    <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
      <ArrowRight className="w-5 h-5 mr-2 text-primary" />
      What's Next?
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {steps.map((step, index) => (
        <CrossReference
          key={index}
          title={step.title}
          description={step.description}
          path={step.path}
          variant="card"
          className="bg-background/50"
        />
      ))}
    </div>
  </div>
);

export const PrerequisitesSection: React.FC<{
  prerequisites: Array<{
    title: string;
    description?: string;
    path: string;
    completed?: boolean;
  }>;
}> = ({ prerequisites }) => (
  <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
    <h4 className="text-lg font-medium text-orange-900 dark:text-orange-100 mb-3 flex items-center">
      <BookOpen className="w-4 h-4 mr-2" />
      Prerequisites
    </h4>
    
    <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
      Make sure you've completed these steps before continuing:
    </p>
    
    <div className="space-y-2">
      {prerequisites.map((prereq, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0
            ${prereq.completed 
              ? 'border-green-500 bg-green-500 text-white' 
              : 'border-orange-400 bg-transparent'}
          `}>
            {prereq.completed && (
              <div className="w-2 h-2 bg-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1">
            <CrossReference
              title={prereq.title}
              description={prereq.description}
              path={prereq.path}
              variant="inline"
              className="text-orange-900 dark:text-orange-100 hover:text-orange-700 dark:hover:text-orange-300"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);