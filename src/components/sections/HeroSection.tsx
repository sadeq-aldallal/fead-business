import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const { t, isRTL } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="h-screen flex items-center justify-center relative overflow-hidden hero-with-dots">
      {/* AI Customer Support Themed Background */}
      <div className="ai-customer-support-bg">

        {/* AI Bot Icons */}
        <div className="ai-bots-container">
          <div className="ai-bot bot-1">
            <div className="bot-core"></div>
            <div className="bot-eyes">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
          </div>
          <div className="ai-bot bot-2">
            <div className="bot-core"></div>
            <div className="bot-eyes">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
          </div>
          <div className="ai-bot bot-3">
            <div className="bot-core"></div>
            <div className="bot-eyes">
              <div className="eye"></div>
              <div className="eye"></div>
            </div>
          </div>
        </div>

        {/* Conversation Flow Lines */}
        <div className="conversation-flows">
          <div className="flow-line flow-1"></div>
          <div className="flow-line flow-2"></div>
          <div className="flow-line flow-3"></div>
          <div className="flow-line flow-4"></div>
        </div>

        {/* Support Icons */}
        <div className="support-icons">
          <div className="support-icon icon-1">
            <div className="icon-chat"></div>
          </div>
          <div className="support-icon icon-2">
            <div className="icon-bot"></div>
          </div>
          <div className="support-icon icon-3">
            <div className="icon-lightning"></div>
          </div>
          <div className="support-icon icon-4">
            <div className="icon-star"></div>
          </div>
          <div className="support-icon icon-5">
            <div className="icon-phone"></div>
          </div>
          <div className="support-icon icon-6">
            <div className="icon-bulb"></div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse"> {/* Swapped to lg:flex-row-reverse */}
          {/* Left Side - Content */}
          <div className="text-center lg:text-left">
            {/* Main Content */}
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Main Headline */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-8 ${isRTL ? 'font-arabic' : ''}`}>
                {t('hero.newTitle')}
              </h1>
              
              <p className={`text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 ${isRTL ? 'font-arabic' : ''}`}>
                {t('hero.newSubtitle')}
              </p>

              {/* CTA Button */}
              <div className={`flex justify-center lg:justify-start items-center mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className={`px-8 py-4 text-lg font-semibold ${isRTL ? 'font-arabic' : ''}`}
                >
                  Request Demo
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Animation Space (Hidden on mobile, visible on desktop) */}
          <div className="hidden lg:block relative">
            <div className="ai-animation-container">
              {/* Central AI Hub */}
              <div className="ai-hub">
                <div className="ai-hub-core"></div>
                <div className="ai-hub-pulse"></div>
              </div>
              
              {/* Orbiting Elements */}
              <div className="ai-orbit orbit-1">
                <div className="orbit-element"></div>
              </div>
              <div className="ai-orbit orbit-2">
                <div className="orbit-element"></div>
              </div>
              <div className="ai-orbit orbit-3">
                <div className="orbit-element"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};