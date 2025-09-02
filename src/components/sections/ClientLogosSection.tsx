import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const ClientLogosSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className={`animated-gradient-text text-sm font-medium tracking-wider uppercase ${isRTL ? 'font-arabic' : ''}`}>
            {t('clients.title')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40">
          {/* Placeholder logos - in a real implementation, these would be actual client logos */}
          <div className="client-logos">
            <div className="w-24 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white/40 text-xs font-medium">Logoipsum</span>
            </div>
          </div>
          
          <div className="client-logos">
            <div className="w-20 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white/40 text-xs font-medium">LOAI</span>
            </div>
          </div>
          
          <div className="client-logos">
            <div className="w-28 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white/40 text-xs font-medium">IPSUM</span>
            </div>
          </div>
          
          <div className="client-logos">
            <div className="w-16 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-white/40 text-xs font-medium">logo</span>
            </div>
          </div>
          
          <div className="client-logos">
            <div className="w-24 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white/40 text-xs font-medium">Logoipsum</span>
            </div>
          </div>
          
          <div className="client-logos">
            <div className="w-28 h-8 bg-white/10 rounded flex items-center justify-center">
              <span className="text-white/40 text-xs font-medium">logoipsum</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};