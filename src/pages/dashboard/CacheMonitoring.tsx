import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, Database, HardDrive, RefreshCw, Clock, Link as LinkIcon } from "lucide-react";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

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
    refetchInterval: 30000,
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
      toast.success('cache optimized', {
        description: `${data.stats.hot_cache.count} links ready for instant access`,
      });
      queryClient.invalidateQueries({ queryKey: ['cache-stats'] });
      setIsOptimizing(false);
    },
    onError: (error: Error) => {
      toast.error('optimization failed', {
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
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">instant &lt;100ms</Badge>;
      case 'warm':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">fast ~200ms</Badge>;
      default:
        return <Badge variant="outline">standard ~500ms</Badge>;
    }
  };

  return (
    <PageContentWrapper
      title="instant links"
      description="your most popular links load in under 100 milliseconds"
      breadcrumbs={[{ label: "instant links" }]}
      action={
        <Button
          onClick={handleOptimize}
          disabled={isOptimizing || optimizeMutation.isPending}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
          optimize now
        </Button>
      }
    >

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">instant links</CardTitle>
            <Zap className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              {hotClickPercent.toFixed(1)}% of your traffic
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">fast links</CardTitle>
            <HardDrive className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warmLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              medium priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">standard links</CardTitle>
            <Database className="w-4 h-4 text-white/40" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coldLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              occasional use
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            how instant links work
          </CardTitle>
          <CardDescription>
            automatic speed optimization for your most important links
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">we track which links get the most traffic</p>
                <p className="text-xs text-muted-foreground mt-1">
                  your busiest links are identified automatically based on recent clicks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">popular links are kept ready for instant access</p>
                <p className="text-xs text-muted-foreground mt-1">
                  high-traffic links load in under 100 milliseconds—faster than a blink.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">less popular links still work, just slightly slower</p>
                <p className="text-xs text-muted-foreground mt-1">
                  occasional-use links load in around 500ms—still very fast.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>optimization happens automatically every 10 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Cached Links Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>your fastest links</CardTitle>
              <CardDescription>
                links optimized for speed
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/links">
                <LinkIcon className="w-4 h-4 mr-2" />
                view all links
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">loading...</p>
          ) : (
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>link</TableHead>
                    <TableHead>speed tier</TableHead>
                    <TableHead className="text-right">score</TableHead>
                    <TableHead className="text-right">recent clicks</TableHead>
                    <TableHead className="text-right">total clicks</TableHead>
                    <TableHead>last updated</TableHead>
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
                          : 'not yet'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContentWrapper>
  );
}
