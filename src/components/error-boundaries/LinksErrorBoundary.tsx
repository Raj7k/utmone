import { ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Link2, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LinksErrorBoundaryProps {
  children: ReactNode;
}

export const LinksErrorBoundary = ({ children }: LinksErrorBoundaryProps) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      section="links"
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-grouped-background">
          <Card variant="grouped" className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Link2 className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle className="text-title-2">Link Management Error</CardTitle>
              </div>
              <CardDescription>
                Something went wrong while managing your links. Your data is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="default" 
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard/links/new')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Link
                </Button>
              </div>
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="ghost" 
                className="w-full"
              >
                Back to Dashboard
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
