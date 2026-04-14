import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link2, MousePointerClick, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DomainUsageStatsProps {
  domainId: string;
  domain: string;
}

export const DomainUsageStats = ({ domainId, domain }: DomainUsageStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ["domain-stats", domainId],
    queryFn: async () => {
      // Get link count
      const { count: linkCount, error: linkError } = await supabase
        .from("links")
        .select("*", { count: "exact", head: true })
        .eq("domain", domain);

      if (linkError) throw linkError;

      // Get total clicks
      const { data: links, error: linksError } = await supabase
        .from("links")
        .select("id, total_clicks")
        .eq("domain", domain);

      if (linksError) throw linksError;

      const totalClicks = links?.reduce((sum, link) => sum + (link.total_clicks || 0), 0) || 0;

      // Get last created link
      const { data: lastCreated, error: lastCreatedError } = await supabase
        .from("links")
        .select("created_at")
        .eq("domain", domain)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (lastCreatedError && lastCreatedError.code !== "PGRST116") throw lastCreatedError;

      return {
        linkCount: linkCount || 0,
        totalClicks,
        lastCreatedAt: lastCreated?.created_at,
      };
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>Activity metrics for {domain}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link2 className="w-4 h-4" />
              Total Links
            </div>
            <div className="text-2xl font-bold">{stats?.linkCount || 0}</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MousePointerClick className="w-4 h-4" />
              Total Clicks
            </div>
            <div className="text-2xl font-bold">
              {stats?.totalClicks?.toLocaleString() || 0}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Last Activity
            </div>
            <div className="text-sm font-medium">
              {stats?.lastCreatedAt 
                ? formatDistanceToNow(new Date(stats.lastCreatedAt), { addSuffix: true })
                : stats?.lastCreatedAt
                ? formatDistanceToNow(new Date(stats.lastCreatedAt), { addSuffix: true })
                : "No activity"
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
