import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useTestDomain, TestResult, DomainTestResponse } from '@/hooks/useTestDomain';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock,
  ExternalLink,
  RefreshCw,
  Zap,
  Globe,
  Shield,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DomainTestPanelProps {
  initialDomain?: string;
  onVerified?: () => void;
  compact?: boolean;
}

const statusIcons = {
  pass: CheckCircle2,
  fail: XCircle,
  warning: AlertTriangle,
  pending: Clock,
};

const statusColors = {
  pass: 'text-green-500',
  fail: 'text-destructive',
  warning: 'text-amber-500',
  pending: 'text-muted-foreground',
};

const statusBgColors = {
  pass: 'bg-green-500/10 border-green-500/20',
  fail: 'bg-destructive/10 border-destructive/20',
  warning: 'bg-amber-500/10 border-amber-500/20',
  pending: 'bg-muted/50 border-muted',
};

function TestResultItem({ result }: { result: TestResult }) {
  const Icon = statusIcons[result.status];
  
  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border',
      statusBgColors[result.status]
    )}>
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', statusColors[result.status])} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{result.step}</span>
          <Badge 
            variant="outline" 
            className={cn('text-xs', statusColors[result.status])}
          >
            {result.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{result.message}</p>
        {result.details && (
          <p className="text-xs text-muted-foreground/80 mt-1 font-mono">
            {result.details}
          </p>
        )}
      </div>
    </div>
  );
}

export function DomainTestPanel({ 
  initialDomain = '', 
  onVerified,
  compact = false 
}: DomainTestPanelProps) {
  const { toast } = useToast();
  const [domain, setDomain] = useState(initialDomain);
  const [isAutoPolling, setIsAutoPolling] = useState(false);

  const { 
    testDomain, 
    isLoading, 
    error, 
    result, 
    pollCount,
    startPolling,
    stopPolling,
    reset
  } = useTestDomain({
    pollingInterval: 30000,
    onSuccess: (data) => {
      toast({
        title: 'Domain is ready!',
        description: 'All DNS checks passed. Your domain is properly configured.',
      });
      setIsAutoPolling(false);
      stopPolling();
      onVerified?.();
    }
  });

  useEffect(() => {
    if (initialDomain && initialDomain !== domain) {
      setDomain(initialDomain);
      reset();
    }
  }, [initialDomain, domain, reset]);

  const handleTest = () => {
    if (!domain.trim()) {
      toast({
        title: 'Enter a domain',
        description: 'Please enter a domain name to test.',
        variant: 'destructive',
      });
      return;
    }
    testDomain(domain.trim());
  };

  const handleStartAutoPolling = () => {
    if (!domain.trim()) return;
    setIsAutoPolling(true);
    startPolling(domain.trim());
  };

  const handleStopAutoPolling = () => {
    setIsAutoPolling(false);
    stopPolling();
  };

  const isSubdomain = domain.split('.').length > 2;

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="go.yourdomain.com"
            className="flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleTest()}
          />
          <Button 
            onClick={handleTest} 
            disabled={isLoading || !domain.trim()}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            test
          </Button>
        </div>

        {result && (
          <div className="space-y-2">
            {result.results.map((r, i) => (
              <TestResultItem key={i} result={r} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">domain test tool</CardTitle>
        </div>
        <CardDescription>
          test your domain configuration before going live. we'll check DNS, routing, and SSL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domain Input */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="go.yourdomain.com"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleTest()}
            />
            <Button 
              onClick={handleTest} 
              disabled={isLoading || !domain.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              test domain
            </Button>
          </div>

          {/* Smart Recommendation */}
          {domain && !result && (
            <Alert className={cn(
              isSubdomain 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-amber-500/10 border-amber-500/20'
            )}>
              <AlertDescription className="text-sm">
                {isSubdomain ? (
                  <>
                    <span className="font-medium text-green-600 dark:text-green-400">Subdomain detected</span>
                    <span className="text-muted-foreground"> — easiest to configure! Just add a CNAME record.</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-amber-600 dark:text-amber-400">Root domain detected</span>
                    <span className="text-muted-foreground"> — consider using a subdomain like </span>
                    <code className="bg-background px-1 py-0.5 rounded text-xs">go.{domain}</code>
                    <span className="text-muted-foreground"> for easier setup.</span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Overall Status */}
            <div className={cn(
              'flex items-center justify-between p-4 rounded-lg border',
              statusBgColors[result.overallStatus]
            )}>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = statusIcons[result.overallStatus];
                  return <Icon className={cn('w-6 h-6', statusColors[result.overallStatus])} />;
                })()}
                <div>
                  <p className="font-medium">
                    {result.overallStatus === 'pass' && 'All checks passed!'}
                    {result.overallStatus === 'warning' && 'Some checks need attention'}
                    {result.overallStatus === 'fail' && 'Configuration issues found'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {pollCount > 1 && `Checked ${pollCount} times`}
                  </p>
                </div>
              </div>
              
              {result.overallStatus !== 'pass' && (
                <div className="flex items-center gap-2">
                  {isAutoPolling ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleStopAutoPolling}
                    >
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      stop auto-check
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleStartAutoPolling}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      auto-check every 30s
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Individual Results */}
            <div className="space-y-2">
              {result.results.map((r, i) => (
                <TestResultItem key={i} result={r} />
              ))}
            </div>

            {/* Test Link */}
            {result.overallStatus === 'pass' && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                    try your test link
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  click the link below to verify routing is working correctly:
                </p>
                <a 
                  href={result.testLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {result.testLink}
                </a>
              </div>
            )}

            {/* Recommendation */}
            {result.recommendation && result.overallStatus !== 'pass' && (
              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  <span className="font-medium">Recommendation: </span>
                  {result.recommendation}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
