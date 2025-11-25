import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, MousePointerClick, Users, TrendingUp } from "lucide-react";
import { ExportButton } from "./ExportButton";
import { ClicksOverTime } from "./ClicksOverTime";
import { useComparisonMetrics } from "@/hooks/useComparisonMetrics";
import { ComparisonCard } from "./ComparisonCard";
import { MyLinksToggle } from "./MyLinksToggle";
import { OwnerFilter } from "./OwnerFilter";

interface AnalyticsOverviewProps {
  workspaceId: string;
}

export const AnalyticsOverview = ({ workspaceId }: AnalyticsOverviewProps) => {
  const [viewMode, setViewMode] = useState<"my" | "all">("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  
  const { data: comparisonData } = useComparisonMetrics({ workspaceId });
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ["analytics-overview", workspaceId, viewMode, ownerFilter],
    queryFn: async () => {
      // Get current user for "my links" mode
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = user?.id;
      // Build query with filters
      let linksQuery = supabase
        .from("links")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);

      // Apply owner filter
      if (viewMode === "my" && currentUserId) {
        linksQuery = linksQuery.eq("created_by", currentUserId);
      } else if (ownerFilter !== "all") {
        linksQuery = linksQuery.eq("created_by", ownerFilter);
      }

      const { count: linksCount } = await linksQuery;

      // Get link IDs with same filters
      let dataQuery = supabase
        .from("links")
        .select("id")
        .eq("workspace_id", workspaceId);

      if (viewMode === "my" && currentUserId) {
        dataQuery = dataQuery.eq("created_by", currentUserId);
      } else if (ownerFilter !== "all") {
        dataQuery = dataQuery.eq("created_by", ownerFilter);
      }

      const { data: links } = await dataQuery;

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

      // Get top performing links with same filters
      let topLinksQuery = supabase
        .from("links")
        .select("id, title, short_url, total_clicks")
        .eq("workspace_id", workspaceId);

      if (viewMode === "my" && currentUserId) {
        topLinksQuery = topLinksQuery.eq("created_by", currentUserId);
      } else if (ownerFilter !== "all") {
        topLinksQuery = topLinksQuery.eq("created_by", ownerFilter);
      }

      const { data: topLinks } = await topLinksQuery
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

    return <div className="text-center py-8 text-secondary-label">loading analytics…</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          <MyLinksToggle value={viewMode} onChange={setViewMode} />
          {viewMode === "all" && (
            <OwnerFilter 
              workspaceId={workspaceId} 
              value={ownerFilter} 
              onChange={setOwnerFilter} 
            />
          )}
        </div>
        <ExportButton workspaceId={workspaceId} />
      </div>

      <ClicksOverTime workspaceId={workspaceId} />

      <div className="grid md:grid-cols-4 gap-6">
        <ComparisonCard
          title="Total Links"
          current={comparisonData?.links.current || stats?.totalLinks || 0}
          change={comparisonData?.links.change || 0}
          icon={<Link2 className="h-4 w-4 text-secondary-label" />}
        />
        <ComparisonCard
          title="Total Clicks"
          current={comparisonData?.clicks.current || stats?.totalClicks || 0}
          change={comparisonData?.clicks.change || 0}
          icon={<MousePointerClick className="h-4 w-4 text-secondary-label" />}
        />
        <ComparisonCard
          title="Unique Visitors"
          current={comparisonData?.uniqueClicks.current || stats?.uniqueClicks || 0}
          change={comparisonData?.uniqueClicks.change || 0}
          icon={<Users className="h-4 w-4 text-secondary-label" />}
        />
        <ComparisonCard
          title="Click Rate"
          current={comparisonData?.clickRate.current || (stats?.totalLinks && stats.totalLinks > 0 ? stats.totalClicks / stats.totalLinks : 0)}
          change={comparisonData?.clickRate.change || 0}
          format="decimal"
          icon={<TrendingUp className="h-4 w-4 text-secondary-label" />}
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
                    <p className="text-xs text-secondary-label font-mono">{link.short_url}</p>
                  </div>
                  <div className="text-sm font-bold text-foreground">{link.total_clicks || 0} clicks</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary-label text-center py-4">No click data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
