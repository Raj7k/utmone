import { ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SettingsErrorBoundaryProps {
  children: ReactNode;
}

export const SettingsErrorBoundary = ({ children }: SettingsErrorBoundaryProps) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      section="settings"
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-grouped-background">
          <Card variant="grouped" className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Settings className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle className="text-title-2">Settings Error</CardTitle>
              </div>
              <CardDescription>
                Unable to load settings. Your account is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                variant="default" 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline" 
                className="w-full"
              >
                Back to Dashboard
              </Button>
              <Button
                onClick={() => window.open('https://docs.utm.one/troubleshooting', '_blank')}
                variant="ghost"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
