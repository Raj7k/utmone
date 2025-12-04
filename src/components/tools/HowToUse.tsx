import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HowToUseProps {
  steps: { title: string; description: string }[];
}

export const HowToUse = ({ steps }: HowToUseProps) => {
  return (
    <Card className="mb-8 bg-muted/20 border-dashed">
      <CardHeader>
        <CardTitle className="text-lg lowercase flex items-center gap-2">
          <HelpCircle className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
          how to use this tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>
                {index + 1}
              </span>
              <div>
                <div className="font-medium text-foreground">{step.title}</div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};
