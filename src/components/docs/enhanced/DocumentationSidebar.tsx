import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Home, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DocumentationSidebarProps } from '@/types/documentation';
import { cn } from '@/lib/utils';

export const DocumentationSidebar: React.FC<DocumentationSidebarProps> = ({
  sections,
  currentPath,
  onNavigate,
  expandedSections,
  onToggleSection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const isActivePage = (path: string) => currentPath === path;
  
  const isActiveSection = (sectionId: string) =>
    sections.find(section => 
      section.id === sectionId && 
      section.subsections.some(subsection => subsection.path === currentPath)
    );

  // Enhanced search filtering with highlighting
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    return sections.map(section => ({
      ...section,
      subsections: section.subsections.filter(subsection =>
        subsection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter(section => 
      section.subsections.length > 0 || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sections, searchQuery]);

  // Auto-expand sections when searching
  React.useEffect(() => {
    if (searchQuery.trim()) {
      filteredSections.forEach(section => {
        if (section.subsections.length > 0 && !expandedSections[section.id]) {
          onToggleSection(section.id);
        }
      });
    }
  }, [searchQuery, filteredSections, expandedSections, onToggleSection]);

  const highlightSearchMatch = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-primary/20 text-primary font-medium rounded px-1">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <nav className="space-y-4" role="navigation" aria-label="Documentation navigation">
      {/* Search Interface */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Navigation</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-3 w-3" />
          </Button>
        </div>
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 h-9 text-sm"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        
        {searchQuery && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Found {filteredSections.reduce((acc, section) => acc + section.subsections.length, 0)} results</span>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              {filteredSections.length} sections
            </Badge>
          </div>
        )}
      </div>

      {/* Overview Link */}
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-10 px-3 font-medium",
          isActivePage('/docs')
            ? "bg-primary/10 text-primary hover:bg-primary/15"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        onClick={() => onNavigate('/docs')}
      >
        <Home className="mr-3 h-4 w-4" />
        {highlightSearchMatch('Overview')}
      </Button>

      {/* Section Navigation */}
      <div className="space-y-2">
        {filteredSections.map((section) => (
          <div key={section.id} className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between h-10 px-3 font-medium group",
                isActiveSection(section.id)
                  ? "bg-primary/10 text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => onToggleSection(section.id)}
              aria-expanded={expandedSections[section.id]}
              aria-controls={`section-${section.id}`}
            >
              <div className="flex items-center min-w-0 flex-1">
                {section.icon && (
                  <section.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                )}
                <span className="truncate flex items-center">
                  {highlightSearchMatch(section.title)}
                  {section.subsections.length > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs px-2 py-0 flex-shrink-0">
                      {section.subsections.length}
                    </Badge>
                  )}
                  {section.subsections.length > 0 && (
                    <div className="ml-2 flex items-center">
                      {expandedSections[section.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </span>
              </div>
            </Button>
            
            {expandedSections[section.id] && section.subsections.length > 0 && (
              <div
                id={`section-${section.id}`}
                className="ml-6 space-y-1 border-l-2 border-primary/20 pl-4"
                role="group"
                aria-labelledby={`section-${section.id}-heading`}
              >
                {section.subsections.map((subsection, index) => (
                  <Button
                    key={subsection.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-9 px-3 text-sm font-normal relative group",
                      isActivePage(subsection.path)
                        ? "bg-primary/10 text-primary hover:bg-primary/15 border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted border-l-2 border-transparent hover:border-primary/30"
                    )}
                    onClick={() => onNavigate(subsection.path)}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground mr-3 flex-shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="truncate">
                        {highlightSearchMatch(subsection.title)}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {filteredSections.length === 0 && searchQuery && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No results found for "{searchQuery}"</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};