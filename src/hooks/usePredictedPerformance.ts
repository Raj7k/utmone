import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UTMPerformance {
  tag: string;
  ctr: number;
  totalClicks: number;
  totalLinks: number;
}

export const usePredictedPerformance = (workspaceId: string, fieldType: 'utm_source' | 'utm_medium') => {
  return useQuery({
    queryKey: ['utm-performance', workspaceId, fieldType],
    queryFn: async () => {
      if (!workspaceId) return [];

      // Query to get CTR per utm tag
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select(`
          id,
          ${fieldType},
          link_clicks!inner(id, is_unique)
        `)
        .eq('workspace_id', workspaceId)
        .not(fieldType, 'is', null);

      if (linksError) throw linksError;

      // Calculate CTR per tag
      const performanceMap = new Map<string, { clicks: number; uniqueLinks: Set<string> }>();

      links?.forEach((link: any) => {
        const tag = link[fieldType]?.toLowerCase();
        if (!tag) return;

        if (!performanceMap.has(tag)) {
          performanceMap.set(tag, { clicks: 0, uniqueLinks: new Set() });
        }

        const stats = performanceMap.get(tag)!;
        stats.clicks += link.link_clicks.length;
        stats.uniqueLinks.add(link.id);
      });

      // Convert to performance array with CTR
      const performance: UTMPerformance[] = Array.from(performanceMap.entries()).map(([tag, stats]) => ({
        tag,
        totalClicks: stats.clicks,
        totalLinks: stats.uniqueLinks.size,
        ctr: stats.uniqueLinks.size > 0 ? (stats.clicks / stats.uniqueLinks.size) * 100 : 0,
      }));

      return performance.sort((a, b) => b.ctr - a.ctr);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!workspaceId,
  });
};

export const getPerformanceBadge = (ctr: number | null, totalLinks: number) => {
  if (totalLinks === 0 || ctr === null) {
    return {
      label: "new — no data yet",
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
      icon: "✨",
      tier: "new" as const,
    };
  }

  if (ctr >= 5) {
    return {
      label: `high impact — ${ctr.toFixed(1)}% ctr`,
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      icon: "🔥",
      tier: "high" as const,
    };
  }

  return {
    label: `~${ctr.toFixed(1)}% engagement`,
    color: "bg-muted text-secondary-label",
    icon: "📊",
    tier: "average" as const,
  };
};
