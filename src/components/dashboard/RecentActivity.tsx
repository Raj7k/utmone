import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Link2, MousePointerClick, QrCode, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: workspaces } = await supabase
        .from("workspaces")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!workspaces?.[0]) return [];

      // Fetch recent links
      const { data: links } = await supabase
        .from("links")
        .select("id, title, slug, created_at, last_clicked_at, total_clicks")
        .eq("workspace_id", workspaces[0].id)
        .order("created_at", { ascending: false })
        .limit(5);

      return links?.map((link) => ({
        type: "link_created",
        title: link.title,
        subtitle: `/${link.slug}`,
        timestamp: link.created_at,
        linkId: link.id,
        clicks: link.total_clicks || 0,
        lastClicked: link.last_clicked_at,
      })) || [];
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">
          No recent activity. Create your first link to get started.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <Link
            key={index}
            to={`/links/${activity.linkId}`}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.subtitle}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MousePointerClick className="h-3 w-3" />
                  {activity.clicks} clicks
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}