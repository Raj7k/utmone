import { ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardErrorBoundaryProps {
  children: ReactNode;
}

export const DashboardErrorBoundary = ({ children }: DashboardErrorBoundaryProps) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      section="dashboard"
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-grouped-background">
          <Card variant="grouped" className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-title-2">Dashboard Error</CardTitle>
              <CardDescription>
                An error occurred while loading your dashboard. This has been logged and we'll investigate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()} variant="default" className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => navigate('/')} variant="outline" className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
