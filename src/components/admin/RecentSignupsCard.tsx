import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus } from "lucide-react";

interface RecentUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  workspaces: Array<{
    id: string;
    name: string;
    plan_tier: string;
  }>;
}

export function RecentSignupsCard() {
  const navigate = useNavigate();

  const { data: recentUsers, isLoading } = useQuery({
    queryKey: ["admin-recent-signups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          created_at,
          workspaces!workspaces_owner_id_fkey (
            id,
            name,
            plan_tier
          )
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as RecentUser[];
    },
  });

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "business":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "growth":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "starter":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-muted-foreground" />
          recent signups
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/users")}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          view all
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            loading recent signups...
          </div>
        ) : recentUsers && recentUsers.length > 0 ? (
          <div className="space-y-3">
            {recentUsers.map((user) => {
              const workspace = user.workspaces?.[0];
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/admin/users?search=${encodeURIComponent(user.email)}`)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-muted">
                      {getInitials(user.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {user.full_name || user.email.split("@")[0]}
                      </span>
                      {workspace && (
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPlanBadgeVariant(workspace.plan_tier)}`}>
                          {workspace.plan_tier}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            no signups yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
