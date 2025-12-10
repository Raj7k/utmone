import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Crown, Gem, Rocket, Sparkles, User } from "lucide-react";

interface PlanCount {
  plan_tier: string;
  count: number;
}

const PLAN_CONFIG = {
  free: { icon: User, color: "bg-muted text-muted-foreground", label: "free" },
  starter: { icon: Sparkles, color: "bg-blue-500/20 text-blue-300", label: "starter" },
  growth: { icon: Rocket, color: "bg-emerald-500/20 text-emerald-300", label: "growth" },
  business: { icon: Gem, color: "bg-purple-500/20 text-purple-300", label: "business" },
  enterprise: { icon: Crown, color: "bg-amber-500/20 text-amber-300", label: "enterprise" },
};

export function PlanTierStats() {
  const navigate = useNavigate();

  const { data: planStats, isLoading } = useQuery({
    queryKey: ["admin-plan-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("plan_tier");

      if (error) throw error;

      // Count by plan tier
      const counts: Record<string, number> = {
        free: 0,
        starter: 0,
        growth: 0,
        business: 0,
        enterprise: 0,
      };

      data?.forEach((workspace) => {
        const tier = workspace.plan_tier || "free";
        if (counts[tier] !== undefined) {
          counts[tier]++;
        } else {
          counts.free++;
        }
      });

      return Object.entries(counts).map(([plan_tier, count]) => ({
        plan_tier,
        count,
      }));
    },
  });

  const totalWorkspaces = planStats?.reduce((sum, p) => sum + p.count, 0) || 0;
  const paidWorkspaces = planStats?.filter(p => p.plan_tier !== "free").reduce((sum, p) => sum + p.count, 0) || 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-display flex items-center justify-between">
          <span>workspaces by plan</span>
          <Badge variant="outline" className="font-normal">
            {paidWorkspaces} paid / {totalWorkspaces} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground text-sm">
            loading plan stats...
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {planStats?.map(({ plan_tier, count }) => {
              const config = PLAN_CONFIG[plan_tier as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
              const Icon = config.icon;
              
              return (
                <button
                  key={plan_tier}
                  onClick={() => navigate(`/admin/users?plan=${plan_tier}`)}
                  className={`
                    flex flex-col items-center gap-1 p-3 rounded-lg border border-border
                    hover:bg-muted/50 transition-colors cursor-pointer
                    ${count > 0 ? "" : "opacity-50"}
                  `}
                >
                  <div className={`p-2 rounded-full ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-2xl font-bold">{count}</span>
                  <span className="text-xs text-muted-foreground">{config.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
