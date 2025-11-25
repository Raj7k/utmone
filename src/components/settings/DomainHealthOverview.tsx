import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDomainHealthCheck } from "@/hooks/useDomainHealthCheck";
import type { Domain } from "@/hooks/useDomains";

interface DomainHealthOverviewProps {
  domains: Domain[];
  workspaceId: string;
}

export const DomainHealthOverview = ({ domains, workspaceId }: DomainHealthOverviewProps) => {
  const { checkAllDomains } = useDomainHealthCheck();

  const getHealthIcon = (status: string | null) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'dns_changed':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'dns_error':
      case 'check_failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getHealthBadge = (status: string | null) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="border-green-500 text-green-500">healthy</Badge>;
      case 'warning':
      case 'dns_changed':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">warning</Badge>;
      case 'dns_error':
      case 'check_failed':
        return <Badge variant="destructive">error</Badge>;
      default:
        return <Badge variant="secondary">unknown</Badge>;
    }
  };

  const healthyCount = domains.filter(d => d.health_status === 'healthy').length;
  const totalCount = domains.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">domain health overview</h3>
          <p className="text-sm text-muted-foreground">
            {healthyCount} of {totalCount} domains healthy
          </p>
        </div>
        <Button
          onClick={() => checkAllDomains.mutate(workspaceId)}
          disabled={checkAllDomains.isPending}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${checkAllDomains.isPending ? 'animate-spin' : ''}`} />
          check all now
        </Button>
      </div>

      <div className="space-y-3">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getHealthIcon(domain.health_status)}
              <div>
                <p className="font-medium">{domain.domain}</p>
                {domain.last_health_check && (
                  <p className="text-xs text-muted-foreground">
                    checked {formatDistanceToNow(new Date(domain.last_health_check), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
            {getHealthBadge(domain.health_status)}
          </div>
        ))}

        {domains.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            no domains configured yet
          </p>
        )}
      </div>
    </Card>
  );
};
