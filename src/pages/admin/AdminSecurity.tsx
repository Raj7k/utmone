import { SecurityKeyManager } from "@/components/admin/SecurityKeyManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminSecurity() {
  const { data: mfaStatus } = useQuery({
    queryKey: ['admin-mfa-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { hasKeys: false, verified: false };

      const { data: keys } = await supabase
        .from('user_authenticators')
        .select('id')
        .limit(1);

      const { data: profile } = await supabase
        .from('profiles')
        .select('mfa_verified_at')
        .eq('id', user.id)
        .single();

      return {
        hasKeys: (keys?.length || 0) > 0,
        verified: profile?.mfa_verified_at ? 
          new Date(profile.mfa_verified_at) > new Date(Date.now() - 12 * 60 * 60 * 1000) : 
          false,
      };
    },
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">security settings</h1>
        <p className="text-secondary-label">
          manage hardware security keys and admin authentication
        </p>
      </div>

      {/* MFA Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
              <CardTitle>multi-factor authentication status</CardTitle>
            </div>
            {mfaStatus?.hasKeys && (
              <Badge variant={mfaStatus.verified ? "default" : "secondary"}>
                {mfaStatus.verified ? "verified" : "requires verification"}
              </Badge>
            )}
          </div>
          <CardDescription>
            current security posture for admin access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
              <Key className="h-5 w-5 mt-0.5" style={{ color: 'rgba(59,130,246,1)' }} />
              <div>
                <p className="font-medium">hardware keys</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mfaStatus?.hasKeys ? "configured" : "not configured"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
              <CheckCircle2 className="h-5 w-5 mt-0.5" style={{ color: 'rgba(59,130,246,1)' }} />
              <div>
                <p className="font-medium">session verification</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {mfaStatus?.verified ? "valid (12h)" : "expired or not set"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Key Manager */}
      <SecurityKeyManager />
    </div>
  );
}
