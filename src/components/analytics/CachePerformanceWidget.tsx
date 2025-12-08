import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Database, HardDrive, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CacheStats {
  hot_count: number;
  warm_count: number;
  cold_count: number;
  hot_clicks: number;
  warm_clicks: number;
  cold_clicks: number;
}

export const CachePerformanceWidget = ({ workspaceId }: { workspaceId: string }) => {
  const { data: cacheStats, isLoading } = useQuery({
    queryKey: ['cache-performance', workspaceId],
    queryFn: async () => {
      const { data: links, error } = await supabase
        .from('links')
        .select('cache_priority, total_clicks, clicks_last_hour, cache_score')
        .eq('workspace_id', workspaceId)
        .eq('status', 'active');

      if (error) throw error;

      const stats: CacheStats = {
        hot_count: 0,
        warm_count: 0,
        cold_count: 0,
        hot_clicks: 0,
        warm_clicks: 0,
        cold_clicks: 0,
      };

      links?.forEach(link => {
        const tier = link.cache_priority || 'cold';
        const clicks = link.total_clicks || 0;

        if (tier === 'hot') {
          stats.hot_count++;
          stats.hot_clicks += clicks;
        } else if (tier === 'warm') {
          stats.warm_count++;
          stats.warm_clicks += clicks;
        } else {
          stats.cold_count++;
          stats.cold_clicks += clicks;
        }
      });

      return stats;
    },
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white-80" />
            cache performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const totalLinks = (cacheStats?.hot_count || 0) + (cacheStats?.warm_count || 0) + (cacheStats?.cold_count || 0);
  const totalClicks = (cacheStats?.hot_clicks || 0) + (cacheStats?.warm_clicks || 0) + (cacheStats?.cold_clicks || 0);
  
  const hotPercent = totalLinks > 0 ? (cacheStats!.hot_count / totalLinks) * 100 : 0;
  const warmPercent = totalLinks > 0 ? (cacheStats!.warm_count / totalLinks) * 100 : 0;
  
  const hotClickPercent = totalClicks > 0 ? (cacheStats!.hot_clicks / totalClicks) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-white-80" />
          cache performance
        </CardTitle>
        <CardDescription>
          intelligent caching using knapsack optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cache Tier Distribution */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Hot Cache</span>
              <Badge variant="outline" className="text-xs">
                &lt;100ms
              </Badge>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {cacheStats?.hot_count || 0} links
            </span>
          </div>
          <Progress value={hotPercent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {hotClickPercent.toFixed(1)}% of all clicks served from hot cache
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">Warm Cache</span>
              <Badge variant="outline" className="text-xs">
                ~200ms
              </Badge>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {cacheStats?.warm_count || 0} links
            </span>
          </div>
          <Progress value={warmPercent} className="h-2" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-white-40" />
              <span className="text-sm font-medium">Cold (Database)</span>
              <Badge variant="outline" className="text-xs">
                ~500ms
              </Badge>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {cacheStats?.cold_count || 0} links
            </span>
          </div>
        </div>

        {/* Performance Insight */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5 text-white-80" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                optimization active
              </p>
              <p className="text-xs text-muted-foreground">
                Your highest-traffic links are cached using Knapsack algorithm for sub-100ms redirects. 
                Cache refreshes every 10 minutes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};