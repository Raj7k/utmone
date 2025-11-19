import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MousePointerClick, Users, Link2 } from "lucide-react";
import { ExportButton } from "./ExportButton";

interface AnalyticsOverviewProps {
  workspaceId: string;
}

export const AnalyticsOverview = ({ workspaceId }: AnalyticsOverviewProps) => {
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

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ExportButton workspaceId={workspaceId} />
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLinks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uniqueClicks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalLinks && stats.totalLinks > 0
                ? Math.round((stats.totalClicks / stats.totalLinks) * 10) / 10
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">clicks per link</p>
          </CardContent>
        </Card>
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
