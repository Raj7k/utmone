import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  section?: string; // For tracking which section errored
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    // Log to admin audit logs
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error: logError } = await supabase.rpc('log_security_event', {
        p_event_type: 'error_boundary',
        p_user_id: user?.id || null,
        p_metadata: {
          section: this.props.section || 'unknown',
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        }
      });
      
      if (logError) {
        console.error('Failed to log error:', logError);
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Update error count for tracking repeated failures
    this.setState(prev => ({ errorCount: prev.errorCount + 1 }));
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorCount: 0 });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private isModuleLoadError(): boolean {
    const message = this.state.error?.message || '';
    return message.includes('Failed to fetch dynamically imported module') ||
           message.includes('error loading dynamically imported module') ||
           message.includes('Importing a module script failed');
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isModuleError = this.isModuleLoadError();

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-grouped-background">
          <Card variant="grouped" className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle className="text-title-2">
                  {isModuleError ? 'page failed to load' : 'something went wrong'}
                </CardTitle>
              </div>
              <CardDescription>
                {isModuleError 
                  ? 'the page could not be loaded. this usually fixes itself with a refresh.'
                  : 'an unexpected error occurred. try refreshing the page.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isModuleError && this.state.error && (
                <div className="p-3 rounded-lg bg-muted/50 border border-separator">
                  <p className="text-xs font-mono text-secondary-label break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              {this.state.errorCount > 1 && (
                <p className="text-xs text-secondary-label">
                  This error has occurred {this.state.errorCount} times. Consider refreshing the page.
                </p>
              )}
              <div className="flex gap-2">
                {!isModuleError && (
                  <Button onClick={this.handleReset} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                )}
                <Button onClick={this.handleReload} className={isModuleError ? "w-full" : "flex-1"}>
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
