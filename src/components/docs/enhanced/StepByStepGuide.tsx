import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  CheckCircle, 
  Circle, 
  Code, 
  ImageIcon, 
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export interface StepGuideStep {
  number: number;
  title: string;
  description: string;
  details?: string[];
  code?: string;
  image?: string;
  estimatedTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface StepByStepGuideProps {
  title?: string;
  steps: StepGuideStep[];
  allowNavigation?: boolean;
  showProgress?: boolean;
  className?: string;
}

export const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  title = 'Step-by-Step Guide',
  steps,
  allowNavigation = false,
  showProgress = false,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleStepComplete = (stepNumber: number) => {
    setCompletedSteps(prev => new Set([...prev, stepNumber]));
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const progress = allowNavigation ? (completedSteps.size / steps.length) * 100 : 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Guide Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {steps.length} steps
          </Badge>
        </div>
        
        {showProgress && allowNavigation && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{completedSteps.size} of {steps.length} completed</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(step.number);
          const isCurrent = allowNavigation && index === currentStep;
          const isActive = !allowNavigation || index <= currentStep;

          return (
            <Card 
              key={step.number} 
              className={`
                transition-all duration-200 
                ${isCurrent ? 'ring-2 ring-primary shadow-lg' : ''}
                ${!isActive ? 'opacity-50' : ''}
                ${isCompleted ? 'border-green-300 bg-green-50/30 dark:bg-green-900/10' : ''}
              `}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg flex-shrink-0 transition-colors
                      ${isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{step.title}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        {step.estimatedTime && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{step.estimatedTime}</span>
                          </div>
                        )}
                        {step.difficulty && (
                          <Badge className={`text-xs ${getDifficultyColor(step.difficulty)}`}>
                            {step.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {allowNavigation && !isCompleted && isActive && (
                    <Button
                      size="sm"
                      onClick={() => handleStepComplete(step.number)}
                      className="ml-4"
                    >
                      Mark Complete
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>

              {isActive && (
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  {step.details && step.details.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <h5 className="text-sm font-medium text-foreground flex items-center">
                        <Circle className="w-3 h-3 mr-2 text-primary" />
                        Detailed Instructions
                      </h5>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li 
                            key={detailIndex} 
                            className="flex items-start space-x-3 text-sm group hover:bg-muted/20 rounded p-2 transition-colors"
                          >
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <ArrowRight className="w-3 h-3 text-primary" />
                            </div>
                            <span className="flex-1">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.code && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-foreground flex items-center">
                        <Code className="w-3 h-3 mr-2" />
                        Code Example
                      </h5>
                      <div className="bg-gray-950 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto border">
                        <pre className="text-gray-100">{step.code}</pre>
                      </div>
                    </div>
                  )}

                  {step.image && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-foreground flex items-center">
                        <ImageIcon className="w-3 h-3 mr-2" />
                        Visual Guide
                      </h5>
                      <div className="rounded-lg overflow-hidden border">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {allowNavigation && (
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          
          <Button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};