import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  title: string;
  time: string;
}

interface UsageStepsProps {
  steps: Step[];
  className?: string;
}

export const UsageSteps = ({ steps, className }: UsageStepsProps) => {
  return (
    <div className={cn("my-8", className)}>
      <h3 className="text-xl font-display font-semibold text-foreground mb-6">
        how to use this template
      </h3>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white" style={{ background: 'rgba(59,130,246,1)' }}>
              {step.number}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h4 className="font-semibold text-foreground">{step.title}</h4>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                  <Clock className="w-3 h-3" />
                  {step.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
