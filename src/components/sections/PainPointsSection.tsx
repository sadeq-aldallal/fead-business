import React from 'react';
import { DollarSign, Clock, Zap, MessageSquare, Calendar, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const PainPointsSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const painPoints = [
    {
      icon: DollarSign,
      title: t('pain.cost.title'),
      description: t('pain.cost.desc'),
    },
    {
      icon: Clock,
      title: t('pain.availability.title'),
      description: t('pain.availability.desc'),
    },
    {
      icon: Zap,
      title: t('pain.speed.title'),
      description: t('pain.speed.desc'),
    },
    {
      icon: MessageSquare,
      title: t('pain.context.title'),
      description: t('pain.context.desc'),
    },
    {
      icon: Calendar,
      title: t('pain.coverage.title'),
      description: t('pain.coverage.desc'),
    },
    {
      icon: Users,
      title: t('pain.manual.title'),
      description: t('pain.manual.desc'),
    },
  ];

  return (
    <section id="challenges" className="pt-8 pb-20 relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('pain.title')}
          </h2>
          <p className={`text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto ${isRTL ? 'font-arabic' : ''}`}>
            {t('pain.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
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
                    {point.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`${isRTL ? 'font-arabic text-right' : ''}`}>
                    {point.description}
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