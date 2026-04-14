import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { supabaseFrom } from '@/lib/supabaseHelper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Activity, CheckCircle } from 'lucide-react';

export function SecurityOverview() {
  // Query recent security events
  const { data: securityEvents } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('admin_audit_logs')
        .select('action, resource_type, created_at')
        .eq('resource_type', 'security_event')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Calculate metrics
  const rateLimitViolations = securityEvents?.filter(
    (e) => e.action === 'rate_limit_exceeded'
  ).length || 0;

  const failedAuthAttempts = securityEvents?.filter(
    (e) => e.action === 'auth_failed'
  ).length || 0;

  const totalSecurityEvents = securityEvents?.length || 0;
  const healthScore = Math.max(0, 100 - (rateLimitViolations * 2 + failedAuthAttempts * 3));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-secondary-label">
              Security Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Shield className={`w-8 h-8 ${
                healthScore >= 90 ? 'text-green-500' : 
                healthScore >= 70 ? 'text-yellow-500' : 
                'text-red-500'
              }`} />
              <div>
                <div className="text-2xl font-bold">{healthScore}%</div>
                <p className="text-xs text-secondary-label">
                  {healthScore >= 90 ? 'Excellent' : healthScore >= 70 ? 'Good' : 'Needs Attention'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-secondary-label">
              Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{totalSecurityEvents}</div>
                <p className="text-xs text-secondary-label">Last 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limit Violations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-secondary-label">
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {rateLimitViolations > 0 ? (
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-500" />
              )}
              <div>
                <div className="text-2xl font-bold">{rateLimitViolations}</div>
                <p className="text-xs text-secondary-label">Violations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Failed Auth */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-secondary-label">
              Failed Auth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {failedAuthAttempts > 0 ? (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              ) : (
                <CheckCircle className="w-8 h-8 text-green-500" />
              )}
              <div>
                <div className="text-2xl font-bold">{failedAuthAttempts}</div>
                <p className="text-xs text-secondary-label">Attempts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>Last 10 security-related events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {securityEvents?.slice(0, 10).map((event, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    event.action === 'rate_limit_exceeded' ? 'bg-yellow-500' :
                    event.action === 'auth_failed' ? 'bg-red-500' :
                    'bg-primary'
                  }`} />
                  <span className="text-sm">{event.action}</span>
                </div>
                <span className="text-xs text-secondary-label">
                  {new Date(event.created_at).toLocaleString()}
                </span>
              </div>
            ))}
            {(!securityEvents || securityEvents.length === 0) && (
              <p className="text-sm text-secondary-label text-center py-4">
                No security events in the last 24 hours
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
