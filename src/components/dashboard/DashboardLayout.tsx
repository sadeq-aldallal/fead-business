import React, { useState } from 'react';
import { Users, Menu, X, Settings, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';
import { Navigation } from '../layout/Navigation';
import { UserSettingsModal } from '../modals/UserSettingsModal';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: 'organization' | 'business';
  onViewChange: (view: 'organization' | 'business') => void;
  onDocsClick?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentView,
  onViewChange,
  onDocsClick
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { user, signOut } = useAuth();
  const { organization, currentBusiness } = useDashboard();

  const sidebarItems = [
    {
      id: 'organization',
      label: 'Organization',
      icon: Users,
      active: currentView === 'organization'
    }
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Navigation 
        onLoginClick={() => {}}
        onSignupClick={() => {}}
        onDashboardClick={() => {}}
        onProfileClick={() => {}}
        onHomeClick={() => {}}
        currentPage="dashboard"
      />

      {/* Dashboard Layout Container */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-16 bg-card border-r border-border">
          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                onClick={() => !item.disabled && onViewChange(item.id as 'organization' | 'business')}
                variant={item.active ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${item.disabled ? 'opacity-50' : ''}`}
                disabled={item.disabled}
                leftIcon={<Icon size={20} />}
              >
                {item.label}
              </Button>
            );
          })}
        </nav>

          {/* Bottom Section */}
          <div className="mt-auto space-y-2 p-4">
          {/* Documentation */}
          {onDocsClick && (
            <Button
              onClick={onDocsClick}
              variant="ghost"
              className="w-full justify-start"
              leftIcon={<FileText size={20} />}
            >
              Documentation
            </Button>
          )}

          {/* Settings */}
          <Button
            onClick={() => setShowSettingsModal(true)}
            variant="ghost"
            className="w-full justify-start"
            leftIcon={<Settings size={20} />}
          >
            Settings
          </Button>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            leftIcon={<LogOut size={20} />}
          >
            Logout
          </Button>
        </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 overflow-auto">
          <div className="p-6 pt-16">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Sheet */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>
                <img 
                  src="/fead.app_logo.png" 
                  alt="fead.app" 
                  className="h-8 w-auto"
                />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col h-full">
              <nav className="space-y-2 flex-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      onClick={() => {
                        if (!item.disabled) {
                          onViewChange(item.id as 'organization' | 'business');
                          setSidebarOpen(false);
                        }
                      }}
                      variant={item.active ? 'secondary' : 'ghost'}
                      className={`w-full justify-start ${item.disabled ? 'opacity-50' : ''}`}
                      disabled={item.disabled}
                      leftIcon={<Icon size={20} />}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-2 pb-4">
                {onDocsClick && (
                  <Button
                    onClick={() => {
                      onDocsClick();
                      setSidebarOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start"
                    leftIcon={<FileText size={20} />}
                  >
                    Documentation
                  </Button>
                )}

                <Button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setSidebarOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start"
                  leftIcon={<Settings size={20} />}
                >
                  Settings
                </Button>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  leftIcon={<LogOut size={20} />}
                >
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* User Settings Modal */}
      <UserSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
};