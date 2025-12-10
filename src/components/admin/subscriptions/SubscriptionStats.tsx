import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign, AlertTriangle, Zap } from "lucide-react";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";

interface SubscriptionStatsProps {
  workspaces: any[];
  isLoading: boolean;
}

interface TierCount {
  tier: PlanTier;
  count: number;
  mrr: number;
}

export function SubscriptionStats({ workspaces, isLoading }: SubscriptionStatsProps) {
  // Calculate tier breakdown
  const tierCounts: TierCount[] = (['free', 'starter', 'growth', 'business', 'enterprise'] as PlanTier[]).map(tier => {
    const tierWorkspaces = workspaces?.filter(w => w.plan_tier === tier) || [];
    const price = PLAN_CONFIG[tier].price;
    const mrr = typeof price === 'number' ? tierWorkspaces.length * price : 0;
    return {
      tier,
      count: tierWorkspaces.length,
      mrr,
    };
  });

  const totalWorkspaces = workspaces?.length || 0;
  const paidWorkspaces = workspaces?.filter(w => w.plan_tier !== 'free').length || 0;
  const totalMRR = tierCounts.reduce((sum, t) => sum + t.mrr, 0);
  const activeWorkspaces = workspaces?.filter(w => w.subscription_status === 'active').length || 0;
  const gracePeriodWorkspaces = workspaces?.filter(w => w.subscription_status === 'grace_period').length || 0;

  // Calculate conversion rate (paid / total)
  const conversionRate = totalWorkspaces > 0 
    ? ((paidWorkspaces / totalWorkspaces) * 100).toFixed(1) 
    : '0';

  const stats = [
    {
      title: "total workspaces",
      value: totalWorkspaces,
      icon: Users,
      description: `${activeWorkspaces} active`,
      color: "text-foreground",
    },
    {
      title: "monthly recurring revenue",
      value: `$${totalMRR.toLocaleString()}`,
      icon: DollarSign,
      description: `${paidWorkspaces} paid`,
      color: "text-emerald-500",
    },
    {
      title: "paid conversion",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      description: `${paidWorkspaces} of ${totalWorkspaces}`,
      color: "text-primary",
    },
    {
      title: "at risk",
      value: gracePeriodWorkspaces,
      icon: AlertTriangle,
      description: "in grace period",
      color: gracePeriodWorkspaces > 0 ? "text-amber-500" : "text-muted-foreground",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tier Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4" />
            subscribers by tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {tierCounts.map(({ tier, count, mrr }) => (
              <div 
                key={tier} 
                className="text-center p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="text-xs text-muted-foreground capitalize mb-1">{tier}</div>
                <div className="text-xl font-bold">{count}</div>
                {tier !== 'free' && tier !== 'enterprise' && (
                  <div className="text-xs text-emerald-500 mt-1">
                    ${mrr}/mo
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
