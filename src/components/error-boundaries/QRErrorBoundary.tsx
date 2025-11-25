import { ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { QrCode, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QRErrorBoundaryProps {
  children: ReactNode;
}

export const QRErrorBoundary = ({ children }: QRErrorBoundaryProps) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      section="qr-generator"
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-grouped-background">
          <Card variant="grouped" className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <QrCode className="h-5 w-5 text-destructive" />
                </div>
                <CardTitle className="text-title-2">QR Code Generation Error</CardTitle>
              </div>
              <CardDescription>
                Unable to generate QR code. Please try again.
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
                  Retry Generation
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                If the problem persists, contact support@utm.one
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
};
