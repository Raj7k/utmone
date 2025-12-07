import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, HelpCircle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const LinkHealthWidget = () => {
  const { data: healthStats, isLoading } = useQuery({
    queryKey: ["link-health-stats"],
    queryFn: async () => {
      const { data: links, error } = await supabase
        .from("links")
        .select("health_status")
        .eq("status", "active");

      if (error) throw error;

      const stats = {
        healthy: 0,
        unhealthy: 0,
        unknown: 0,
        total: links?.length || 0,
      };

      links?.forEach((link) => {
        if (link.health_status === "healthy") stats.healthy++;
        else if (link.health_status === "unhealthy") stats.unhealthy++;
        else stats.unknown++;
      });

      return stats;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">link health</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const healthyPercent = healthStats?.total 
    ? Math.round((healthStats.healthy / healthStats.total) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          link health monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-3xl font-bold">{healthyPercent}%</div>
            <div className="text-sm text-muted-foreground">links healthy</div>
          </div>
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">healthy</span>
            </div>
            <span className="font-medium">{healthStats?.healthy || 0}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">unhealthy</span>
            </div>
            <span className="font-medium">{healthStats?.unhealthy || 0}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">unknown</span>
            </div>
            <span className="font-medium">{healthStats?.unknown || 0}</span>
          </div>
        </div>

        {(healthStats?.unhealthy || 0) > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-900 dark:text-red-100">
                <span className="font-medium">{healthStats.unhealthy} link{healthStats.unhealthy > 1 ? 's' : ''}</span> returning errors. Configure fallback URLs to prevent lost clicks.
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <HelpCircle className="h-3 w-3" />
          Auto-checked every hour for top 100 links
        </div>
      </CardContent>
    </Card>
  );
};
