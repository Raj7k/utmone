import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: boolean[];
  onStepClick?: (step: number) => void;
  steps: { number: number; label: string }[];
}

export const StepIndicator = ({
  currentStep,
  completedSteps,
  onStepClick,
  steps,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
      {steps.map((step, index) => {
        const isActive = currentStep === step.number;
        const isCompleted = completedSteps[index];
        const isClickable = isCompleted || step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <button
              onClick={() => isClickable && onStepClick?.(step.number)}
              disabled={!isClickable}
              className={cn(
                "flex flex-col items-center gap-2 transition-apple",
                isClickable && "cursor-pointer hover:opacity-80"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-apple",
                  isActive && "ring-4 ring-white/20",
                  isCompleted && !isActive && "bg-system-green",
                  !isActive && !isCompleted && "bg-fill-tertiary"
                )}
                style={isActive ? { background: 'rgba(59,130,246,1)' } : undefined}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-secondary-label"
                    )}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs text-center",
                  isActive ? "text-label font-medium" : "text-secondary-label"
                )}
              >
                {step.label}
              </span>
            </button>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-apple",
                  isCompleted ? "bg-system-green" : "bg-separator"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
