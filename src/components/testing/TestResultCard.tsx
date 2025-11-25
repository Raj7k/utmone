import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { TestResult } from "@/lib/testUtils";

interface TestResultCardProps {
  result: TestResult;
}

export const TestResultCard = ({ result }: TestResultCardProps) => {
  return (
    <Card className={`p-4 ${result.passed ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : 'border-red-500/50 bg-red-50/50 dark:bg-red-950/20'}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${result.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {result.passed ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">{result.name}</h4>
            <div className="flex items-center gap-1 text-xs text-secondary-label">
              <Clock className="h-3 w-3" />
              {result.duration}ms
            </div>
          </div>
          
          <p className={`text-sm ${result.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {result.message}
          </p>
          
          {result.details && (
            <details className="mt-2">
              <summary className="text-xs text-secondary-label cursor-pointer hover:text-foreground">
                View Details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </Card>
  );
};
