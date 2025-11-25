import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import { useVerifyDomain } from "@/hooks/useVerifyDomain";
import { formatDistanceToNow } from "date-fns";

interface Domain {
  id: string;
  domain: string;
  is_verified: boolean;
  health_status: string | null;
  last_health_check: string | null;
  ssl_expires_at: string | null;
  dns_verified_at: string | null;
}

interface DomainHealthDashboardProps {
  domain: Domain;
}

export const DomainHealthDashboard = ({ domain }: DomainHealthDashboardProps) => {
  const verifyDomain = useVerifyDomain();

  const getHealthBadge = () => {
    if (!domain.health_status) {
      return <Badge variant="outline">Unknown</Badge>;
    }

    switch (domain.health_status) {
      case 'healthy':
        return <Badge className="bg-success/10 text-success border-success/20">Healthy</Badge>;
      case 'verification_pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'dns_changed':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">DNS Changed</Badge>;
      case 'dns_error':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">DNS Error</Badge>;
      case 'check_failed':
        return <Badge variant="outline">Check Failed</Badge>;
      default:
        return <Badge variant="outline">{domain.health_status}</Badge>;
    }
  };

  const getHealthIcon = () => {
    if (domain.health_status === 'healthy') {
      return <Shield className="w-5 h-5 text-success" />;
    }
    return <AlertTriangle className="w-5 h-5 text-warning" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getHealthIcon()}
            <CardTitle>Domain Health</CardTitle>
          </div>
          {getHealthBadge()}
        </div>
        <CardDescription>
          Verification and health status for {domain.domain}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Verification Status</div>
            <div className="font-medium">
              {domain.is_verified ? "Verified" : "Not Verified"}
            </div>
            {domain.dns_verified_at && (
              <div className="text-xs text-muted-foreground mt-1">
                Verified {formatDistanceToNow(new Date(domain.dns_verified_at), { addSuffix: true })}
              </div>
            )}
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Last Health Check</div>
            <div className="font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {domain.last_health_check 
                ? formatDistanceToNow(new Date(domain.last_health_check), { addSuffix: true })
                : "Never"
              }
            </div>
          </div>
        </div>

        {domain.ssl_expires_at && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">SSL Certificate</div>
            <div className="font-medium">
              Expires {formatDistanceToNow(new Date(domain.ssl_expires_at), { addSuffix: true })}
            </div>
          </div>
        )}

        {domain.health_status === 'dns_changed' && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <div className="text-sm text-destructive">
              DNS records have changed since verification. Please re-verify your domain.
            </div>
          </div>
        )}

        {domain.health_status === 'verification_pending' && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="text-sm text-warning">
              Waiting for DNS propagation. This can take up to 72 hours.
            </div>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => verifyDomain.mutate(domain.id)}
          disabled={verifyDomain.isPending}
        >
          {verifyDomain.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Re-verify Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
