import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_ATTRIBUTION_DATA, getDemoFeaturesForPlan } from "@/hooks/useDemoMode";
import { TrendingUp, DollarSign, Users, Lock } from "lucide-react";
import { PlanTier } from "@/lib/planConfig";

interface DemoAttributionTileProps {
  planTier?: PlanTier;
}

export const DemoAttributionTile = ({ planTier = 'free' }: DemoAttributionTileProps) => {
  const { sources, totalRevenue, conversions } = DEMO_ATTRIBUTION_DATA;
  const features = getDemoFeaturesForPlan(planTier);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">attribution overview</CardTitle>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">demo · {planTier}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.attribution ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">attributed revenue</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+23%</span>
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-muted-foreground">revenue attribution</p>
                <p className="text-xs text-muted-foreground">upgrade to growth to unlock</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
          <Users className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{conversions.toLocaleString()} conversions</p>
            <p className="text-xs text-muted-foreground">from tracked links</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">by source</p>
          {sources.map((source, index) => (
            <div key={source.name} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-20 text-sm font-medium truncate">{source.name}</div>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: features.attribution ? `${source.percentage}%` : '0%' }} />
              </div>
              <div className="w-16 text-right text-sm text-muted-foreground">
                {features.attribution ? `$${(source.value / 1000).toFixed(0)}k` : <Lock className="h-3 w-3 inline-block" />}
              </div>
            </div>
          ))}
          {!features.attribution && <p className="text-xs text-muted-foreground text-center pt-2">upgrade to growth to see revenue by source</p>}
        </div>
      </CardContent>
    </Card>
  );
};
