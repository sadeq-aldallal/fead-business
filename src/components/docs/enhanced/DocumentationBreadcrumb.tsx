import React from 'react';
import { ChevronRight, Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DocumentationBreadcrumbProps } from '@/types/documentation';
import { cn } from '@/lib/utils';

interface ExtendedBreadcrumbProps extends DocumentationBreadcrumbProps {
  showHome?: boolean;
  showPageCount?: boolean;
}

export const DocumentationBreadcrumb: React.FC<ExtendedBreadcrumbProps> = ({
  items,
  showHome = true,
  showPageCount = false,
}) => {
  const handleNavigation = (path: string) => {
    if (path === '/docs') {
      window.location.hash = '';
    } else {
      window.location.hash = path.replace('/docs/', '');
    }
  };

  const getPageDepth = () => items.length - 1;

  return (
    <TooltipProvider>
      <nav className="flex items-center justify-between py-2" aria-label="Breadcrumb navigation">
        <div className="flex items-center space-x-1 text-sm">
          <ol className="flex items-center space-x-1">
            {/* Home Icon for Quick Navigation */}
            {showHome && (
              <li className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-md hover:bg-muted"
                      onClick={() => handleNavigation('/docs')}
                      aria-label="Go to documentation home"
                    >
                      <Home className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Documentation Home</p>
                  </TooltipContent>
                </Tooltip>
                
                {items.length > 1 && (
                  <ChevronRight className="mx-2 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                )}
              </li>
            )}

            {items.slice(1).map((item, index) => {
              const actualIndex = index + 1;
              const isLast = actualIndex === items.length - 1;
              const isClickable = item.path && !isLast;

              return (
                <li key={actualIndex} className="flex items-center">
                  {actualIndex > 1 && (
                    <ChevronRight className="mx-2 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  
                  {isClickable ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-auto px-2 py-1 font-normal text-muted-foreground hover:text-foreground",
                            "underline-offset-4 hover:underline rounded-md hover:bg-muted transition-all"
                          )}
                          onClick={() => handleNavigation(item.path!)}
                        >
                          <span className="flex items-center space-x-1">
                            <span>{item.label}</span>
                            <ExternalLink className="h-3 w-3 opacity-50" />
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Navigate to {item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-md",
                          isLast
                            ? "font-medium text-foreground bg-primary/10"
                            : "text-muted-foreground"
                        )}
                        aria-current={isLast ? "page" : undefined}
                      >
                        {item.label}
                      </span>
                      {isLast && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Page Depth Indicator */}
        {showPageCount && items.length > 1 && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs">
                  Level {getPageDepth()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>You are {getPageDepth()} levels deep in the documentation</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </nav>
    </TooltipProvider>
  );
};