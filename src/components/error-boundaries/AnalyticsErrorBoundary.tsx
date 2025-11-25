import { ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { BarChart3, RefreshCw } from 'lucide-react';

interface AnalyticsErrorBoundaryProps {
  children: ReactNode;
}

export const AnalyticsErrorBoundary = ({ children }: AnalyticsErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      section="analytics"
      fallback={
        <div className="p-6">
          <Alert variant="destructive">
            <BarChart3 className="h-4 w-4" />
            <AlertTitle>Analytics Unavailable</AlertTitle>
            <AlertDescription>
              Unable to load analytics data. This might be a temporary issue.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
