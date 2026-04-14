import { Activity, Shield, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Progress } from "@/components/ui/progress";

export const SystemLoadMonitor = () => {
  const { data: systemLoad, isLoading } = useQuery({
    queryKey: ["system-load"],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('system_load_metrics')
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000,
  });

  const { data: tierConfig } = useQuery({
    queryKey: ["rate-limit-tiers"],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('rate_limit_tiers')
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !systemLoad) {
    return (
      <Card variant="glass" className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 rounded w-1/3 bg-white-10"></div>
          <div className="h-24 rounded bg-white-10"></div>
        </div>
      </Card>
    );
  }

  const avgLoad =
    (systemLoad.cpu_load_percent + systemLoad.memory_usage_percent) / 2;
  const loadStatus =
    avgLoad < (tierConfig?.load_threshold_low || 50)
      ? "healthy"
      : avgLoad > (tierConfig?.load_threshold_high || 80)
      ? "high"
      : "normal";

  return (
    <Card variant="glass" className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white-10">
              <Shield className="h-5 w-5 text-white-80" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-white-90">
                elastic shield
              </h3>
              <p className="text-xs text-white-50">
                adaptive throttling active
              </p>
            </div>
          </div>
          <Badge
            variant={
              loadStatus === "healthy"
                ? "default"
                : loadStatus === "high"
                ? "destructive"
                : "secondary"
            }
          >
            {loadStatus}
          </Badge>
        </div>

        {/* Load Metrics */}
        <div className="space-y-4">
          {/* CPU Load */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white-50">cpu load</span>
              <span className="font-medium text-white-90">
                {systemLoad.cpu_load_percent.toFixed(1)}%
              </span>
            </div>
            <Progress value={systemLoad.cpu_load_percent} className="h-2" />
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white-50">memory</span>
              <span className="font-medium text-white-90">
                {systemLoad.memory_usage_percent.toFixed(1)}%
              </span>
            </div>
            <Progress value={systemLoad.memory_usage_percent} className="h-2" />
          </div>

          {/* Request Rate */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white-10">
                <Activity className="h-4 w-4 text-white-80" />
              </div>
              <div>
                <p className="text-xs text-white-50">req/sec</p>
                <p className="text-sm font-medium text-white-90">
                  {systemLoad.requests_per_second}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white-10">
                <Users className="h-4 w-4 text-white-80" />
              </div>
              <div>
                <p className="text-xs text-white-50">connections</p>
                <p className="text-sm font-medium text-white-90">
                  {systemLoad.active_connections}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Throttling Status */}
        <div className="pt-4 border-t border-white-08">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 mt-0.5 text-white-50" />
            <div className="flex-1">
              <p className="text-sm text-white-90">
                {loadStatus === "healthy" && (
                  <>
                    <span className="font-medium text-white-90">burst mode active:</span>{" "}
                    {tierConfig?.burst_multiplier}x rate limits enabled
                  </>
                )}
                {loadStatus === "normal" && (
                  <>
                    <span className="font-medium">standard limits:</span> normal
                    operations
                  </>
                )}
                {loadStatus === "high" && (
                  <>
                    <span className="font-medium text-status-error">
                      penalty mode active:
                    </span>{" "}
                    prioritizing paid users
                  </>
                )}
              </p>
              <p className="text-xs mt-1 text-white-50">
                {loadStatus === "high"
                  ? "free tier requests queued, enterprise users prioritized"
                  : "all tiers operating normally"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};