import { CheckCircle2 } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const StepIndicator = ({ currentStep, totalSteps, steps }: StepIndicatorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-medium
                    ${isCompleted ? 'bg-white/90 text-black' : ''}
                    ${isActive ? 'bg-white/90 text-black' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <p className={`text-sm mt-2 ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`h-0.5 flex-1 mx-2 ${stepNumber < currentStep ? 'bg-white/60' : 'bg-muted'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
