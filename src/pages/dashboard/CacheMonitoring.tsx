import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, Database, HardDrive, RefreshCw, TrendingUp, Activity } from "lucide-react";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function CacheMonitoring() {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Fetch cache statistics
  const { data: cacheData, isLoading } = useQuery({
    queryKey: ['cache-stats', currentWorkspace?.id],
    queryFn: async () => {
      const { data: links, error } = await supabase
        .from('links')
        .select('id, title, slug, short_url, cache_priority, cache_score, clicks_last_hour, total_clicks, last_cached_at')
        .eq('workspace_id', currentWorkspace!.id)
        .eq('status', 'active')
        .order('cache_score', { ascending: false })
        .limit(100);

      if (error) throw error;
      return links;
    },
    enabled: !!currentWorkspace?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Manual cache optimization trigger
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('optimize-cache', {
        body: {},
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('Cache optimized successfully', {
        description: `${data.stats.hot_cache.count} links in hot cache, ${data.stats.hot_cache.capacity_used_percent}% capacity used`,
      });
      queryClient.invalidateQueries({ queryKey: ['cache-stats'] });
      setIsOptimizing(false);
    },
    onError: (error: Error) => {
      toast.error('Failed to optimize cache', {
        description: error.message,
      });
      setIsOptimizing(false);
    },
  });

  const handleOptimize = () => {
    setIsOptimizing(true);
    optimizeMutation.mutate();
  };

  // Calculate stats
  const hotLinks = cacheData?.filter(l => l.cache_priority === 'hot') || [];
  const warmLinks = cacheData?.filter(l => l.cache_priority === 'warm') || [];
  const coldLinks = cacheData?.filter(l => l.cache_priority === 'cold' || !l.cache_priority) || [];
  
  const totalClicks = cacheData?.reduce((sum, l) => sum + (l.total_clicks || 0), 0) || 0;
  const hotClicks = hotLinks.reduce((sum, l) => sum + (l.total_clicks || 0), 0);
  const hotClickPercent = totalClicks > 0 ? (hotClicks / totalClicks) * 100 : 0;

  const getTierBadge = (priority: string | null) => {
    switch (priority) {
      case 'hot':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Hot &lt;100ms</Badge>;
      case 'warm':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">Warm ~200ms</Badge>;
      default:
        return <Badge variant="outline">Cold ~500ms</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="cache monitoring"
        description="Knapsack optimization for sub-100ms redirects"
        breadcrumbs={[{ label: "cache" }]}
        action={
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing || optimizeMutation.isPending}
            variant="marketing"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
            Optimize Cache
          </Button>
        }
      />

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">hot cache</CardTitle>
            <Zap className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              {hotClickPercent.toFixed(1)}% of traffic
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">warm cache</CardTitle>
            <HardDrive className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warmLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              mid-priority links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">cold (database)</CardTitle>
            <Database className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coldLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              infrequent access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            how knapsack optimization works
          </CardTitle>
          <CardDescription>
            intelligent caching for enterprise-grade performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">score calculation</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Score = (Clicks_Last_Hour × 10) + (Total_Clicks × 1)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">knapsack allocation</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Links sorted by score, allocated to hot/warm/cold tiers by memory capacity
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">two-tier routing</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Hot links cached in-memory (sub-100ms), others query database with 1-hour TTL
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span>Cache refreshes automatically every 10 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Cached Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>top cached links</CardTitle>
          <CardDescription>
            highest-scoring links optimized for speed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link</TableHead>
                    <TableHead>Cache Tier</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right">Last Hour</TableHead>
                    <TableHead className="text-right">Total Clicks</TableHead>
                    <TableHead>Last Cached</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cacheData?.slice(0, 20).map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{link.title}</p>
                          <p className="text-xs text-muted-foreground">{link.short_url}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTierBadge(link.cache_priority)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {link.cache_score?.toFixed(0) || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {link.clicks_last_hour || 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {link.total_clicks || 0}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {link.last_cached_at
                          ? formatDistanceToNow(new Date(link.last_cached_at), { addSuffix: true })
                          : 'Never'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
