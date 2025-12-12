import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { TrendingUp, TrendingDown, Minus, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { PLAN_CONFIG } from "@/lib/planConfig";
import { queryKeys } from "@/lib/queryConfig";

export const QuickStats = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const effectiveWorkspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";
  const { id: planId } = useCurrentPlan();
  const planConfig = PLAN_CONFIG[planId] || PLAN_CONFIG.free;

  // Get clicks this week - optimized with parallel queries
  const { data: clicksData, isLoading: clicksLoading } = useQuery({
    queryKey: queryKeys.dashboard.clicksWeek(effectiveWorkspaceId),
    queryFn: async () => {
      if (!effectiveWorkspaceId) return { current: 0, previous: 0 };
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Get all link IDs for this workspace first
      const { data: links } = await supabase
        .from('links')
        .select('id')
        .eq('workspace_id', effectiveWorkspaceId);

      const linkIds = links?.map(l => l.id) || [];
      if (linkIds.length === 0) return { current: 0, previous: 0 };

      // Run both week queries in parallel
      const [currentResult, previousResult] = await Promise.all([
        supabase
          .from('link_clicks')
          .select('*', { count: 'exact', head: true })
          .gte('clicked_at', weekAgo.toISOString())
          .in('link_id', linkIds),
        supabase
          .from('link_clicks')
          .select('*', { count: 'exact', head: true })
          .gte('clicked_at', twoWeeksAgo.toISOString())
          .lt('clicked_at', weekAgo.toISOString())
          .in('link_id', linkIds),
      ]);

      return { 
        current: currentResult.count || 0, 
        previous: previousResult.count || 0 
      };
    },
    enabled: !!effectiveWorkspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  });

  // Get link count for plan usage
  const { data: linksData, isLoading: linksLoading } = useQuery({
    queryKey: queryKeys.dashboard.linksCount(effectiveWorkspaceId),
    queryFn: async () => {
      if (!effectiveWorkspaceId) return 0;
      const { count } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', effectiveWorkspaceId);
      return count || 0;
    },
    enabled: !!effectiveWorkspaceId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  });

  const calculateChange = () => {
    if (!clicksData) return 0;
    if (clicksData.previous === 0) return clicksData.current > 0 ? 100 : 0;
    return Math.round(((clicksData.current - clicksData.previous) / clicksData.previous) * 100);
  };

  const change = calculateChange();
  const monthlyLinks = planConfig.features.monthlyLinks;
  const linkLimit = typeof monthlyLinks === 'number' ? monthlyLinks : 10000;
  const usagePercent = linksData ? Math.min((linksData / linkLimit) * 100, 100) : 0;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Clicks This Week */}
      <div className="bg-card rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">this week</p>
            {clicksLoading ? (
              <Skeleton className="h-10 w-24 mt-1" />
            ) : (
              <p className="text-4xl font-semibold tracking-tight mt-1">
                {formatNumber(clicksData?.current || 0)}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">clicks</p>
          </div>
          {!clicksLoading && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
              change > 0 && "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
              change < 0 && "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
              change === 0 && "text-muted-foreground bg-muted"
            )}>
              {change > 0 && <TrendingUp className="h-3.5 w-3.5" />}
              {change < 0 && <TrendingDown className="h-3.5 w-3.5" />}
              {change === 0 && <Minus className="h-3.5 w-3.5" />}
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Plan Usage */}
      <div className="bg-card rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">plan usage</p>
            {linksLoading ? (
              <Skeleton className="h-10 w-32 mt-1" />
            ) : (
              <p className="text-4xl font-semibold tracking-tight mt-1">
                {linksData}/{typeof monthlyLinks === 'number' ? monthlyLinks : '∞'}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">links</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {!linksLoading && typeof monthlyLinks === 'number' && (
          <Progress value={usagePercent} className="mt-4 h-2" />
        )}
      </div>
    </div>
  );
};
