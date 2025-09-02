import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  ThumbsUp, 
  ThumbsDown, 
  BookmarkPlus,
  Bookmark,
  Share2,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Timer,
  Zap
} from 'lucide-react';

// Copy to Clipboard Component
interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  label = 'Copy', 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`h-8 w-8 p-0 ${className}`}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : `Copy ${label}`}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Reading Progress Indicator
export const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / scrollHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', calculateProgress);
    calculateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 h-1 bg-muted">
      <div 
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Collapsible Section
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border rounded-lg ${className}`}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between p-4 h-auto text-left font-medium hover:bg-muted/50"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      
      {isOpen && (
        <div className="p-4 pt-0 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

// Feedback Component
interface FeedbackProps {
  pageId: string;
  className?: string;
}

export const FeedbackSection: React.FC<FeedbackProps> = ({ 
  pageId, 
  className = '' 
}) => {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    setSubmitted(true);
    // Here you would typically send the feedback to your analytics service
    console.log(`Feedback for ${pageId}: ${type}`);
  };

  return (
    <div className={`p-4 bg-muted/30 rounded-lg border ${className}`}>
      <h4 className="text-sm font-medium text-foreground mb-3">Was this helpful?</h4>
      
      {!submitted ? (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback('helpful')}
            className="flex items-center space-x-2"
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Yes</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeedback('not-helpful')}
            className="flex items-center space-x-2"
          >
            <ThumbsDown className="h-3 w-3" />
            <span>No</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-green-600" />
          <span>Thank you for your feedback!</span>
        </div>
      )}
    </div>
  );
};

// Bookmark Component
interface BookmarkProps {
  pageId: string;
  title: string;
  className?: string;
}

export const BookmarkButton: React.FC<BookmarkProps> = ({ 
  pageId, 
  title, 
  className = '' 
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('doc-bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(pageId));
  }, [pageId]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('doc-bookmarks') || '[]');
    
    if (isBookmarked) {
      const updated = bookmarks.filter((id: string) => id !== pageId);
      localStorage.setItem('doc-bookmarks', JSON.stringify(updated));
      setIsBookmarked(false);
    } else {
      bookmarks.push(pageId);
      localStorage.setItem('doc-bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            className={`h-8 w-8 p-0 ${className}`}
          >
            {isBookmarked ? (
              <Bookmark className="h-4 w-4 text-primary fill-current" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isBookmarked ? 'Remove bookmark' : 'Bookmark this page'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Estimated Reading Time
interface ReadingTimeProps {
  content: string;
  className?: string;
}

export const ReadingTime: React.FC<ReadingTimeProps> = ({ 
  content, 
  className = '' 
}) => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return (
    <div className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      <Timer className="h-3 w-3" />
      <span>{readingTime} min read</span>
    </div>
  );
};

// Quick Actions Bar
interface QuickActionsProps {
  pageId: string;
  pageTitle: string;
  content: string;
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  pageId,
  pageTitle,
  content,
  className = '',
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageTitle,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`flex items-center justify-between py-4 border-t ${className}`}>
      <div className="flex items-center space-x-4">
        <ReadingTime content={content} />
        <Badge variant="secondary" className="text-xs">
          <Zap className="w-3 h-3 mr-1" />
          Documentation
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <BookmarkButton pageId={pageId} title={pageTitle} />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share this page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};