import React from 'react';
import { FileText, MessageCircle, Target, BarChart3, Settings, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const SolutionSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const solutions = [
    {
      icon: FileText,
      title: 'Intelligent Document Processing',
      description: 'AI-powered system that automatically processes and organizes documents with 99.9% accuracy.',
    },
    {
      icon: MessageCircle,
      title: 'Smart Customer Communication Hub',
      description: 'Centralize all customer interactions across channels with intelligent AI responses.',
    },
    {
      icon: Target,
      title: 'Automated Lead Management System',
      description: 'Smart lead scoring system that identifies prospects and delivers personalized follow-ups.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Business Intelligence Dashboard',
      description: 'Transform data into actionable insights with real-time business performance visibility.',
    },
    {
      icon: Settings,
      title: 'Intelligent Process Automation',
      description: 'Automate repetitive tasks with smart workflows that handle routine work efficiently.',
    },
    {
      icon: Users,
      title: 'AI-Powered Workforce Optimization',
      description: 'Replace manual processes with 24/7 intelligent automation for high-value focus.',
    },
  ];


  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('solution.title')}
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t('solution.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <Card 
                key={index}
                className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-muted-foreground/20 hover:border-primary/50"
              >
                {/* Background Watermark Icon */}
                <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Icon className="w-24 h-24" />
                </div>
                
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className={`text-lg ${isRTL ? 'font-arabic text-right' : ''}`}>
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`${isRTL ? 'font-arabic text-right' : ''}`}>
                    {solution.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};