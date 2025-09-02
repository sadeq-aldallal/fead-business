import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  Instagram, 
  Bot, 
  Activity,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Power,
  PowerOff
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const { t, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const mockAgents = [
    {
      id: '1',
      name: 'Customer Support Agent',
      status: 'active' as const,
      instagramAccount: '@mybusiness',
      responseTime: 0.8,
      conversationsHandled: 247,
      lastActive: '2 minutes ago',
    },
    {
      id: '2',
      name: 'Sales Assistant',
      status: 'inactive' as const,
      instagramAccount: '@mybusiness_sales',
      responseTime: 1.2,
      conversationsHandled: 89,
      lastActive: '1 hour ago',
    },
  ];

  const mockInstagramAccounts = [
    {
      id: '1',
      username: '@mybusiness',
      isConnected: true,
      followerCount: 15420,
      profilePicture: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
    {
      id: '2',
      username: '@mybusiness_sales',
      isConnected: false,
      followerCount: 8930,
      profilePicture: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
  ];

  const tabs = [
    { id: 'overview', label: t('dashboard.overview'), icon: BarChart3 },
    { id: 'agents', label: t('dashboard.agents'), icon: Bot },
    { id: 'instagram', label: t('dashboard.instagram'), icon: Instagram },
    { id: 'analytics', label: t('dashboard.analytics'), icon: Activity },
    { id: 'settings', label: t('dashboard.settings'), icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:p-6">
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Agents</p>
              <p className="text-2xl font-bold text-white">2</p>
            </div>
            <Bot className="h-8 w-8 text-purple-400" />
            <Bot className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Conversations Today</p>
              <p className="text-2xl font-bold text-white">47</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Response Time</p>
              <p className="text-2xl font-bold text-white">0.8s</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-white">98%</p>
            </div>
            <Users className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: '2 minutes ago', action: 'Customer Support Agent handled inquiry from @user123' },
            { time: '15 minutes ago', action: 'New Instagram account connected: @mybusiness_sales' },
            { time: '1 hour ago', action: 'Sales Assistant completed product recommendation for @customer456' },
            { time: '2 hours ago', action: 'System update: Response time improved by 15%' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
              <div>
                <p className="text-white text-sm">{activity.action}</p>
                <p className="text-white/60 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">AI Agents</h3>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          leftIcon={<Plus size={16} />}
        >
          Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:p-6">
        {mockAgents.map((agent) => (
          <div key={agent.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{agent.name}</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                <span className={`text-sm ${agent.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>
                  {agent.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Instagram Account:</span>
                <span className="text-white">{agent.instagramAccount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Response Time:</span>
                <span className="text-white">{agent.responseTime}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Conversations:</span>
                <span className="text-white">{agent.conversationsHandled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Last Active:</span>
                <span className="text-white">{agent.lastActive}</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1"
                leftIcon={agent.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
              >
                {agent.status === 'active' ? 'Deactivate' : 'Activate'}
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Settings size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInstagram = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Instagram Accounts</h3>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          leftIcon={<Plus size={16} />}
        >
          Connect Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:p-6">
        {mockInstagramAccounts.map((account) => (
          <div key={account.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src={account.profilePicture} 
                alt={account.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="text-lg font-semibold text-white">{account.username}</h4>
                <p className="text-white/60 text-sm">{account.followerCount.toLocaleString()} followers</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60">Status:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${account.isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className={`text-sm ${account.isConnected ? 'text-green-400' : 'text-red-400'}`}>
                  {account.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            <Button 
              variant={account.isConnected ? "outline" : "primary"} 
              size="sm" 
              className="w-full"
            >
              {account.isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'agents':
        return renderAgents();
      case 'instagram':
        return renderInstagram();
      case 'analytics':
        return <div className="text-white">Analytics coming soon...</div>;
      case 'settings':
        return <div className="text-white">Settings coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold text-white ${isRTL ? 'font-arabic' : ''}`}>
              {t('dashboard.title')}
            </h1>
            <p className={`text-white/70 mt-1 ${isRTL ? 'font-arabic' : ''}`}>
              Welcome back, {user?.name}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-card border border-border rounded-lg p-1 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap min-h-[44px] ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-h-96">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};