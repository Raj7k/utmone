import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Key, Smartphone, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

interface MfaAuditEvent {
  id: string;
  user_id: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  domain: string | null;
  success: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const actionLabels: Record<string, { label: string; icon: typeof Shield }> = {
  webauthn_registration: { label: "Security key registered", icon: Key },
  webauthn_authentication: { label: "Security key verified", icon: Key },
  webauthn_registration_failed: { label: "Key registration failed", icon: Key },
  webauthn_authentication_failed: { label: "Key verification failed", icon: Key },
  totp_enabled: { label: "2FA enabled", icon: Smartphone },
  totp_disabled: { label: "2FA disabled", icon: Smartphone },
  totp_verified: { label: "2FA code verified", icon: Smartphone },
  totp_failed: { label: "2FA code failed", icon: Smartphone },
  recovery_codes_regenerated: { label: "Recovery codes regenerated", icon: Shield },
  recovery_code_used: { label: "Recovery code used", icon: Shield },
};

export function MfaAuditLogViewer() {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['mfa-audit-logs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('mfa_audit_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching MFA audit logs:', error);
        return [];
      }

      return data as MfaAuditEvent[];
    },
  });

  const getActionInfo = (action: string) => {
    return actionLabels[action] || { label: action, icon: Shield };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-foreground" />
          <div>
            <CardTitle>mfa audit log</CardTitle>
            <CardDescription className="mt-1">
              recent security key and 2fa activity
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">loading audit logs...</p>
        ) : auditLogs && auditLogs.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {auditLogs.map((log) => {
                const actionInfo = getActionInfo(log.action);
                const Icon = actionInfo.icon;

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className={`mt-0.5 ${log.success ? 'text-emerald-500' : 'text-destructive'}`}>
                      {log.success ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium text-sm text-foreground">
                          {actionInfo.label}
                        </span>
                        <Badge variant={log.success ? "secondary" : "destructive"} className="text-xs">
                          {log.success ? "success" : "failed"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                        <p>{format(new Date(log.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                        {log.domain && <p>domain: {log.domain}</p>}
                        {log.ip_address && <p>ip: {log.ip_address}</p>}
                        {log.metadata && (log.metadata as any).device_name && (
                          <p>device: {(log.metadata as any).device_name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>no mfa activity recorded yet</p>
            <p className="text-sm mt-1">security events will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}