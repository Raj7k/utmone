import { Activity, Shield, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export const SystemLoadMonitor = () => {
  const { data: systemLoad, isLoading } = useQuery({
    queryKey: ["system-load"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_load_metrics")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    refetchInterval: 5000, // Update every 5 seconds
  });

  const { data: tierConfig } = useQuery({
    queryKey: ["rate-limit-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rate_limit_tiers")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !systemLoad) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-24 bg-muted rounded"></div>
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
    <Card className="p-6 border-border/50 bg-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-foreground">
                elastic shield
              </h3>
              <p className="text-xs text-muted-foreground">
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
              <span className="text-muted-foreground">cpu load</span>
              <span className="font-medium text-foreground">
                {systemLoad.cpu_load_percent.toFixed(1)}%
              </span>
            </div>
            <Progress value={systemLoad.cpu_load_percent} className="h-2" />
          </div>

          {/* Memory Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">memory</span>
              <span className="font-medium text-foreground">
                {systemLoad.memory_usage_percent.toFixed(1)}%
              </span>
            </div>
            <Progress value={systemLoad.memory_usage_percent} className="h-2" />
          </div>

          {/* Request Rate */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">req/sec</p>
                <p className="text-sm font-medium text-foreground">
                  {systemLoad.requests_per_second}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">connections</p>
                <p className="text-sm font-medium text-foreground">
                  {systemLoad.active_connections}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Throttling Status */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                {loadStatus === "healthy" && (
                  <>
                    <span className="font-medium text-primary">burst mode active:</span>{" "}
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
                    <span className="font-medium text-destructive">
                      penalty mode active:
                    </span>{" "}
                    prioritizing paid users
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
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