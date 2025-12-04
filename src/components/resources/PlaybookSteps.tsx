import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  completed?: boolean;
}

interface PlaybookStepsProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const PlaybookSteps = ({ steps, currentStep, className }: PlaybookStepsProps) => {
  return (
    <div className={cn("relative", className)}>
      {/* Progress Line */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-border">
        <div 
          className="h-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, background: 'rgba(59,130,246,1)' }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = step.completed || step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center gap-3 bg-background px-2">
              {/* Step Circle */}
              <button
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  "border-2 font-semibold text-sm",
                  isCompleted && "text-white",
                  isCurrent && "border-white/30 scale-110",
                  !isCompleted && !isCurrent && "bg-background border-border text-muted-foreground"
                )}
                style={isCompleted ? { background: 'rgba(59,130,246,1)', borderColor: 'rgba(59,130,246,1)' } : isCurrent ? { background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,1)', color: 'rgba(59,130,246,1)' } : undefined}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </button>

              {/* Step Title */}
              <span className={cn(
                "text-xs font-medium text-center max-w-[100px] transition-colors",
                isCurrent && "text-foreground",
                !isCurrent && "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
