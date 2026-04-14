import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, User } from "lucide-react";

export default function FraudAlerts() {
  const { data: flaggedUsers, isLoading } = useQuery({
    queryKey: ["fraud-alerts"],
    queryFn: async () => {
      const { data, error } = await supabaseFrom("early_access_requests")
        .select(`
          *,
          fraud_logs:fraud_detection_logs(*)
        `)
        .eq("is_flagged", true)
        .order("fraud_risk_score", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div>loading fraud alerts...</div>;
  }

  if (!flaggedUsers || flaggedUsers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            fraud alerts
          </CardTitle>
          <CardDescription>no flagged users detected</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              all users are clear. fraud detection is monitoring continuously.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          fraud alerts ({flaggedUsers.length})
        </CardTitle>
        <CardDescription>users flagged by automated fraud detection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {flaggedUsers.map((user: any) => {
          const latestLog = user.fraud_logs?.[0];
          const riskLevel = user.fraud_risk_score >= 80 ? "high" : user.fraud_risk_score >= 60 ? "medium" : "low";
          
          return (
            <Card key={user.id} className="border-destructive/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-secondary-label">{user.email}</div>
                    </div>
                  </div>
                  <Badge variant="destructive" className="capitalize">
                    {riskLevel} risk
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-label">fraud risk score</span>
                    <span className="font-semibold">{user.fraud_risk_score}/100</span>
                  </div>

                  {latestLog && latestLog.details && (
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-semibold mb-2">detection details</div>
                      <ul className="text-sm space-y-1 text-secondary-label">
                        {latestLog.details.disposable_email && (
                          <li>• disposable email domain detected</li>
                        )}
                        {latestLog.details.duplicate_email && (
                          <li>• duplicate email found</li>
                        )}
                        {latestLog.details.suspicious_ip && (
                          <li>• suspicious IP activity</li>
                        )}
                        {latestLog.details.suspicious_referral_timing && (
                          <li>• suspicious referral timing</li>
                        )}
                        {latestLog.details.circular_referral && (
                          <li>• circular referral pattern</li>
                        )}
                        {latestLog.details.bot_like_behavior && (
                          <li>• bot-like engagement detected</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="text-xs text-secondary-label mt-2">
                    flagged: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}