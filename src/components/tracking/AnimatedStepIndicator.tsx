import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

const AnimatedStepIndicator: React.FC<AnimatedStepIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels = [],
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line background */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        
        {/* Progress line filled */}
        <div 
          className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
        
        {/* Step indicators */}
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center relative z-10">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse",
                  isPending && "bg-muted text-muted-foreground border-2 border-border"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              
              {labels[index] && (
                <span
                  className={cn(
                    "mt-2 text-xs text-center max-w-[80px] transition-colors duration-300",
                    isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {labels[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedStepIndicator;
