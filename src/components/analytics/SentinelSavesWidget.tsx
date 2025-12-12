import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Package, Activity, Bot, Wrench, TrendingUp } from "lucide-react";
import { useSentinelStats } from "@/hooks/useSentinelSaves";
import { Skeleton } from "@/components/ui/skeleton";

interface SentinelSavesWidgetProps {
  workspaceId: string | undefined;
  days?: number;
  compact?: boolean;
}

export function SentinelSavesWidget({ workspaceId, days = 7, compact = false }: SentinelSavesWidgetProps) {
  const { stats, isLoading } = useSentinelStats(workspaceId, days);

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const saveTypes = [
    { 
      key: 'inventory' as const, 
      label: 'stock-aware', 
      icon: Package, 
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    { 
      key: 'health' as const, 
      label: 'health check', 
      icon: Activity, 
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      key: 'ai_bot' as const, 
      label: 'AI bot', 
      icon: Bot, 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    { 
      key: 'auto_heal' as const, 
      label: 'auto-heal', 
      icon: Wrench, 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">
            {stats.total_saves.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">clicks saved</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-lg font-semibold text-emerald-500">
            ${stats.total_value.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">value protected</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          sentinel saves
        </CardTitle>
        <CardDescription>
          clicks rescued from dead ends in the last {days} days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hero Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-3xl font-display font-bold text-foreground">
              {stats.total_saves.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">clicks saved</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-3xl font-display font-bold text-emerald-500">
              ${stats.total_value.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">value protected</p>
          </div>
        </div>

        {/* Breakdown by Type */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">breakdown by type</p>
          <div className="grid grid-cols-2 gap-3">
            {saveTypes.map(({ key, label, icon: Icon, color, bgColor }) => {
              const typeStats = stats.by_type[key];
              return (
                <div 
                  key={key}
                  className={`p-3 rounded-lg ${bgColor} border border-border flex items-center gap-3`}
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {typeStats.count} saves · ${typeStats.value.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROI Indicator */}
        {stats.total_saves > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-sm text-foreground">
              sentinel protected <span className="font-semibold text-primary">{stats.total_saves}</span> visitors from dead ends
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
