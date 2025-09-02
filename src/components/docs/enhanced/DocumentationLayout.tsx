import React, { useState, useEffect } from 'react';
import { Search, FileText, Menu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DocumentationSidebar } from './DocumentationSidebar';
import { DocumentationBreadcrumb } from './DocumentationBreadcrumb';
import { DocumentationLayoutProps } from '@/types/documentation';

export const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({
  sections,
  currentPath,
  onNavigate,
  children,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'getting-started': true,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize expanded sections based on current path
  useEffect(() => {
    const currentSection = sections.find(section =>
      section.subsections.some(subsection => subsection.path === currentPath)
    );
    
    if (currentSection && !expandedSections[currentSection.id]) {
      setExpandedSections(prev => ({
        ...prev,
        [currentSection.id]: true,
      }));
    }
  }, [currentPath, sections, expandedSections]);

  const handleToggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    const items = [{ label: 'Documentation', path: '/docs' }];
    
    const currentSection = sections.find(section =>
      section.subsections.some(subsection => subsection.path === currentPath)
    );
    
    const currentSubsection = currentSection?.subsections.find(
      subsection => subsection.path === currentPath
    );

    if (currentSection) {
      items.push({
        label: currentSection.title,
        path: undefined, // Section headers are not directly navigable
      });
    }

    if (currentSubsection) {
      items.push({
        label: currentSubsection.title,
        path: currentSubsection.path,
      });
    }

    return items;
  };

  // Filter sections based on search query
  const filteredSections = sections.map(section => ({
    ...section,
    subsections: section.subsections.filter(subsection =>
      searchQuery === '' ||
      subsection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.subsections.length > 0);

  const sidebarContent = (
    <DocumentationSidebar
      sections={filteredSections}
      currentPath={currentPath}
      onNavigate={handleNavigate}
      expandedSections={expandedSections}
      onToggleSection={handleToggleSection}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-16 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">Documentation</span>
                    </div>
                    {sidebarContent}
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold text-foreground">Documentation</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-40 space-y-4">
              <div className="sm:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4"
                  />
                </div>
              </div>
              {sidebarContent}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-6">
              {/* Enhanced Breadcrumb */}
              <DocumentationBreadcrumb 
                items={getBreadcrumbItems()} 
                showHome={true}
                showPageCount={true}
              />

              {/* Content */}
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="p-0">
                  {children}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};