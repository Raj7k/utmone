import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, MousePointerClick, Users, TrendingUp } from "lucide-react";
import { ExportButton } from "./ExportButton";
import { ClicksOverTime } from "./ClicksOverTime";
import { useComparisonMetrics } from "@/hooks/useComparisonMetrics";
import { ComparisonCard } from "./ComparisonCard";

interface AnalyticsOverviewProps {
  workspaceId: string;
}

export const AnalyticsOverview = ({ workspaceId }: AnalyticsOverviewProps) => {
  const { data: comparisonData } = useComparisonMetrics({ workspaceId });
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["analytics-overview", workspaceId],
    queryFn: async () => {
      // Get total links
      const { count: linksCount } = await supabase
        .from("links")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);

      // Get link IDs for this workspace
      const { data: links } = await supabase
        .from("links")
        .select("id")
        .eq("workspace_id", workspaceId);

      if (!links || links.length === 0) {
        return {
          totalLinks: 0,
          totalClicks: 0,
          uniqueClicks: 0,
          topLinks: [],
        };
      }

      const linkIds = links.map(l => l.id);

      // Get total clicks
      const { data: clicksData } = await supabase
        .from("link_clicks")
        .select("link_id, is_unique")
        .in("link_id", linkIds);

      const totalClicks = clicksData?.length || 0;
      const uniqueClicks = clicksData?.filter(c => c.is_unique).length || 0;

      // Get top performing links
      const { data: topLinks } = await supabase
        .from("links")
        .select("id, title, short_url, total_clicks")
        .eq("workspace_id", workspaceId)
        .order("total_clicks", { ascending: false })
        .limit(5);

      return {
        totalLinks: linksCount || 0,
        totalClicks,
        uniqueClicks,
        topLinks: topLinks || [],
      };
    },
  });

    return <div className="text-center py-8 text-muted-foreground">loading analytics…</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ExportButton workspaceId={workspaceId} />
      </div>

      <ClicksOverTime workspaceId={workspaceId} />

      <div className="grid md:grid-cols-4 gap-6">
        <ComparisonCard
          title="Total Links"
          current={comparisonData?.links.current || stats?.totalLinks || 0}
          change={comparisonData?.links.change || 0}
          icon={<Link2 className="h-4 w-4 text-muted-foreground" />}
        />
        <ComparisonCard
          title="Total Clicks"
          current={comparisonData?.clicks.current || stats?.totalClicks || 0}
          change={comparisonData?.clicks.change || 0}
          icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
        />
        <ComparisonCard
          title="Unique Visitors"
          current={comparisonData?.uniqueClicks.current || stats?.uniqueClicks || 0}
          change={comparisonData?.uniqueClicks.change || 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <ComparisonCard
          title="Click Rate"
          current={comparisonData?.clickRate.current || (stats?.totalLinks && stats.totalLinks > 0 ? stats.totalClicks / stats.totalLinks : 0)}
          change={comparisonData?.clickRate.change || 0}
          format="decimal"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Links</CardTitle>
          <CardDescription>Your most clicked links</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.topLinks && stats.topLinks.length > 0 ? (
            <div className="space-y-4">
              {stats.topLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{link.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{link.short_url}</p>
                  </div>
                  <div className="text-sm font-bold text-foreground">{link.total_clicks || 0} clicks</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No click data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
