import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDomainHealthCheck } from "@/hooks/useDomainHealthCheck";

interface DomainHealthDetailsProps {
  domainId: string;
  domainName: string;
}

interface HealthLog {
  id: string;
  domain_id: string;
  check_type: string;
  status: string;
  response_time_ms: number | null;
  details: any;
  checked_at: string;
}

export const DomainHealthDetails = ({ domainId, domainName }: DomainHealthDetailsProps) => {
  const { checkSingleDomain } = useDomainHealthCheck();

  const { data: healthLogs, isLoading } = useQuery({
    queryKey: ['domain-health-logs', domainId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('domain_health_logs' as any)
        .select('*')
        .eq('domain_id', domainId)
        .order('checked_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data as unknown) as HealthLog[];
    },
  });

  // Group latest checks by type
  const latestChecks = healthLogs?.reduce((acc, log) => {
    if (!acc[log.check_type]) {
      acc[log.check_type] = log;
    }
    return acc;
  }, {} as Record<string, HealthLog>);

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getCheckLabel = (checkType: string) => {
    const labels: Record<string, string> = {
      'dns_txt': 'DNS TXT Verification',
      'dns_routing': 'DNS Routing (A/CNAME)',
      'http': 'HTTP Reachability',
      'ssl': 'SSL Certificate',
      'redirect': 'Redirect Test',
    };
    return labels[checkType] || checkType;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">{domainName}</h3>
          <p className="text-sm text-muted-foreground">detailed health checks</p>
        </div>
        <Button
          onClick={() => checkSingleDomain.mutate(domainId)}
          disabled={checkSingleDomain.isPending}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${checkSingleDomain.isPending ? 'animate-spin' : ''}`} />
          recheck
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">loading health data...</p>
      ) : latestChecks && Object.keys(latestChecks).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(latestChecks).map(([checkType, log]) => (
            <div key={checkType} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="mt-0.5">{getCheckIcon(log.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm">{getCheckLabel(checkType)}</p>
                  <Badge variant={log.status === 'pass' ? 'outline' : 'destructive'} className="text-xs">
                    {log.status}
                  </Badge>
                </div>
                {log.response_time_ms && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {log.response_time_ms}ms response time
                  </p>
                )}
                {log.details?.error && (
                  <p className="text-xs text-red-500">{log.details.error}</p>
                )}
                {log.details?.message && (
                  <p className="text-xs text-muted-foreground">{log.details.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(log.checked_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          no health check data available yet
        </p>
      )}
    </Card>
  );
};
