import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertCircle, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export const AdminHealthHUD = () => {
  // Live traffic (links clicked in last hour)
  const { data: trafficData } = useQuery({
    queryKey: ['admin-traffic'],
    queryFn: async () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .gte('clicked_at', oneHourAgo);
      return count || 0;
    },
    refetchInterval: 30000, // Refresh every 30s
  });

  // Error rate (failed operations)
  const { data: errorRate } = useQuery({
    queryKey: ['admin-error-rate'],
    queryFn: async () => {
      // Mock data - replace with actual error tracking
      return Math.random() * 2; // 0-2%
    },
    refetchInterval: 60000,
  });

  // Signups today
  const { data: signupsToday } = useQuery({
    queryKey: ['admin-signups-today'],
    queryFn: async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString());
      
      return count || 0;
    },
    refetchInterval: 60000,
  });

  // Revenue velocity (mock)
  const { data: revenueVelocity } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      // Mock data - replace with actual MRR tracking
      return 12450;
    },
    refetchInterval: 300000, // Refresh every 5 min
  });

  const getStatusColor = (rate: number | undefined) => {
    if (!rate) return 'text-muted-foreground';
    if (rate < 1) return 'text-green-500';
    if (rate < 3) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Live Traffic */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Live Traffic
          </div>
          <Activity className="w-4 h-4 text-primary" />
        </div>
        <div className="text-3xl font-bold font-mono">
          {trafficData || 0}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          requests/hour
        </div>
      </Card>

      {/* Error Rate */}
      <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Error Rate
          </div>
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
        <div className={`text-3xl font-bold font-mono ${getStatusColor(errorRate)}`}>
          {errorRate?.toFixed(2) || '0.00'}%
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {(errorRate || 0) < 1 ? 'healthy' : 'degraded'}
        </div>
      </Card>

      {/* Signups Today */}
      <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Signups Today
          </div>
          <Users className="w-4 h-4 text-green-500" />
        </div>
        <div className="text-3xl font-bold font-mono">
          {signupsToday || 0}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          new users
        </div>
      </Card>

      {/* Revenue Velocity */}
      <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            MRR Velocity
          </div>
          <TrendingUp className="w-4 h-4 text-purple-500" />
        </div>
        <div className="text-3xl font-bold font-mono">
          ${((revenueVelocity || 0) / 1000).toFixed(1)}k
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          this week
        </div>
      </Card>
    </div>
  );
};
