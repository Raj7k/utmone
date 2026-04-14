import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, Clock } from "lucide-react";

interface RateLimitStats {
  keyName: string;
  requestsThisWindow: number;
  rateLimit: number;
  windowResetAt: string;
  rateLimitWindow: string;
}

interface RateLimitMonitorProps {
  workspaceId: string;
}

export const RateLimitMonitor = ({ workspaceId }: RateLimitMonitorProps) => {
  const [stats, setStats] = useState<RateLimitStats[]>([]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [workspaceId]);

  const fetchStats = async () => {
    const { data, error } = await supabaseFrom('api_keys')
      .select("key_name, requests_this_window, rate_limit, window_reset_at, rate_limit_window")
      .eq("workspace_id", workspaceId)
      .eq("is_active", true);

    if (!error && data) {
      setStats(
        data.map((d) => ({
          keyName: d.key_name,
          requestsThisWindow: d.requests_this_window || 0,
          rateLimit: d.rate_limit || 600,
          windowResetAt: d.window_reset_at || new Date().toISOString(),
          rateLimitWindow: d.rate_limit_window || "1 minute",
        }))
      );
    }
  };

  const getUsagePercent = (used: number, limit: number) => {
    return (used / limit) * 100;
  };

  const getStatusColor = (percent: number) => {
    if (percent >= 90) return "text-red-500";
    if (percent >= 75) return "text-yellow-500";
    return "text-green-500";
  };

  const getTimeUntilReset = (resetAt: string) => {
    const now = new Date();
    const reset = new Date(resetAt);
    const diff = reset.getTime() - now.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-lg">Rate Limit Monitor</h3>
      </div>

      {stats.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/20">
          <p className="text-sm text-muted-foreground">No active API keys</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {stats.map((stat, index) => {
            const usagePercent = getUsagePercent(stat.requestsThisWindow, stat.rateLimit);
            return (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{stat.keyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.requestsThisWindow} / {stat.rateLimit} requests
                    </p>
                  </div>
                  <Badge
                    variant={usagePercent >= 90 ? "destructive" : "secondary"}
                    className="gap-1.5"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {usagePercent.toFixed(1)}%
                  </Badge>
                </div>

                <Progress value={usagePercent} className="h-2" />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Window: {stat.rateLimitWindow}</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>Resets in {getTimeUntilReset(stat.windowResetAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
