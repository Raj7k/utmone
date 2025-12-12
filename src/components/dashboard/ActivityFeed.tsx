import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";
import { Link } from "react-router-dom";
import { ExternalLink, MousePointer, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/queryConfig";

interface LinkWithClicks {
  id: string;
  slug: string;
  short_url: string | null;
  destination_url: string;
  title: string | null;
  created_at: string;
  expires_at: string | null;
  status: string | null;
  todayClicks: number;
}

export const ActivityFeed = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const effectiveWorkspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  const { data: recentLinks, isLoading } = useQuery({
    queryKey: queryKeys.dashboard.activityFeed(effectiveWorkspaceId),
    queryFn: async () => {
      if (!effectiveWorkspaceId) return [];
      
      const { data: links, error } = await supabase
        .from('links')
        .select(`
          id,
          slug,
          short_url,
          destination_url,
          title,
          created_at,
          expires_at,
          status
        `)
        .eq('workspace_id', effectiveWorkspaceId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      if (!links || links.length === 0) return [];
      
      // Get all click counts in parallel instead of sequentially
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString();
      
      const clickCountPromises = links.map(link =>
        supabase
          .from('link_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('link_id', link.id)
          .gte('clicked_at', todayIso)
      );
      
      const clickResults = await Promise.all(clickCountPromises);
      
      const linksWithClicks: LinkWithClicks[] = links.map((link, index) => ({
        ...link,
        todayClicks: clickResults[index].count || 0,
      }));

      return linksWithClicks;
    },
    enabled: !!effectiveWorkspaceId,
    staleTime: 60 * 1000, // 1 minute - activity updates more frequently
    gcTime: 5 * 60 * 1000,
  });

  const getExpiryStatus = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const expiry = new Date(expiresAt);
    const now = new Date();
    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return { text: 'Expired', variant: 'destructive' as const };
    if (daysLeft <= 3) return { text: `Expires in ${daysLeft}d`, variant: 'warning' as const };
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">recent activity</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!recentLinks?.length) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">recent activity</h3>
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <p className="text-foreground font-medium">your links will appear here</p>
          <p className="text-sm text-muted-foreground mt-1">track clicks as they happen</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">recent activity</h3>
        <Link 
          to="/dashboard/links" 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          view all
        </Link>
      </div>
      
      <div className="space-y-2">
        {recentLinks.map((link) => {
          const expiry = getExpiryStatus(link.expires_at);
          const isActive = link.status === 'active';
          
          return (
            <Link
              key={link.id}
              to={`/dashboard/links/${link.id}`}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">
                    {link.short_url || `utm.one/${link.slug}`}
                  </p>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {link.title || link.destination_url}
                </p>
              </div>
              
              <div className="flex items-center gap-4 ml-4">
                {/* Today's clicks */}
                <div className="flex items-center gap-1.5 text-sm">
                  <MousePointer className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-medium">{link.todayClicks}</span>
                  <span className="text-muted-foreground">today</span>
                </div>
                
                {/* Status badge */}
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  expiry?.variant === 'destructive' && "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                  expiry?.variant === 'warning' && "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                  !expiry && isActive && "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                  !expiry && !isActive && "bg-muted text-muted-foreground"
                )}>
                  {expiry?.text || (isActive ? 'Active' : 'Inactive')}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
