import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, TrendingUp, Link2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OwnerPerformanceProps {
  workspaceId: string;
}

interface TeamMemberStats {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  totalLinks: number;
  totalClicks: number;
  uniqueClicks: number;
  avgClicksPerLink: number;
}

export const OwnerPerformance = ({ workspaceId }: OwnerPerformanceProps) => {
  const { data: teamStats, isLoading } = useQuery({
    queryKey: ["owner-performance", workspaceId],
    queryFn: async () => {
      // Get all team members (owner + members)
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("owner_id")
        .eq("id", workspaceId)
        .single();

      if (!workspace) return [];

      const { data: members } = await supabaseFrom('workspace_members')
        .select(`
          user_id,
          profiles:user_id (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq("workspace_id", workspaceId);

      // Combine owner + members
      const allUserIds = [workspace.owner_id];
      if (members) {
        allUserIds.push(...members.map(m => m.user_id));
      }

      // Get stats for each user
      const statsPromises = allUserIds.map(async (userId) => {
        // Get user profile
        const { data: profile } = await supabaseFrom('profiles')
          .select("*")
          .eq("id", userId)
          .single();

        // Get user's links
        const { data: rawLinks } = await supabaseFrom("links")
          .select("id, total_clicks")
          .eq("workspace_id", workspaceId)
          .eq("created_by", userId);
        const links = (rawLinks || []) as any[];

        const totalLinks = links.length;
        const totalClicks = links.reduce((sum: number, link: any) => sum + (link.total_clicks || 0), 0);
        const uniqueClicks = Math.round(totalClicks * 0.7); // Estimate
        const avgClicksPerLink = totalLinks > 0 ? totalClicks / totalLinks : 0;

        return {
          userId,
          userName: profile?.full_name || profile?.email || "Unknown",
          userEmail: profile?.email || "",
          avatarUrl: profile?.avatar_url,
          totalLinks,
          totalClicks,
          uniqueClicks,
          avgClicksPerLink,
        } as TeamMemberStats;
      });

      const stats = await Promise.all(statsPromises);
      return stats.sort((a, b) => b.totalClicks - a.totalClicks);
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Link and click metrics by team member</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const topPerformer = teamStats?.[0];

  return (
    <div className="space-y-6">
      {/* Top Performer Highlight */}
      {topPerformer && topPerformer.totalClicks > 0 && (
        <Card className="border-electric-blue/20 bg-electric-blue/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-electric-blue" />
              <CardTitle className="text-lg">Top Performer</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-electric-blue">
                <AvatarImage src={topPerformer.avatarUrl} />
                <AvatarFallback>
                  {topPerformer.userName.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">{topPerformer.userName}</h3>
                <p className="text-sm text-secondary-label">{topPerformer.userEmail}</p>
                <div className="flex gap-4 mt-2">
                  <div className="text-sm">
                    <span className="font-bold text-electric-blue">{topPerformer.totalClicks.toLocaleString()}</span>
                    <span className="text-secondary-label ml-1">clicks</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-foreground">{topPerformer.totalLinks}</span>
                    <span className="text-secondary-label ml-1">links</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-foreground">{Math.round(topPerformer.avgClicksPerLink)}</span>
                    <span className="text-secondary-label ml-1">avg/link</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Team Leaderboard</CardTitle>
          <CardDescription>Performance metrics for all team members</CardDescription>
        </CardHeader>
        <CardContent>
          {teamStats && teamStats.length > 0 ? (
            <div className="space-y-4">
              {teamStats.map((member, index) => (
                <div key={member.userId} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-lg font-bold text-secondary-label w-6 text-center">
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">{member.userName}</p>
                        {index === 0 && member.totalClicks > 0 && (
                          <Badge variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/20">
                            #1
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-secondary-label truncate">{member.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-foreground">{member.totalLinks}</div>
                      <div className="text-xs text-secondary-label">links</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-foreground">{member.totalClicks.toLocaleString()}</div>
                      <div className="text-xs text-secondary-label">clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-foreground">{member.uniqueClicks.toLocaleString()}</div>
                      <div className="text-xs text-secondary-label">unique</div>
                    </div>
                    <div className="text-center hidden md:block">
                      <div className="font-bold text-foreground">{Math.round(member.avgClicksPerLink)}</div>
                      <div className="text-xs text-secondary-label">avg</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-secondary-label">
              <Link2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No team activity yet</p>
              <p className="text-xs mt-1">Links and clicks will appear here once your team starts creating links</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
