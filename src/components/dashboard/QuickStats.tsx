import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { TrendingUp, TrendingDown, Minus, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { PLAN_CONFIG } from "@/lib/planConfig";
import { DashboardStats } from "@/hooks/dashboard";

interface QuickStatsProps {
  stats?: DashboardStats;
  clicksChange?: number;
  isLoading?: boolean;
}

export const QuickStats = ({ stats, clicksChange = 0, isLoading }: QuickStatsProps) => {
  const { id: planId } = useCurrentPlan();
  const planConfig = PLAN_CONFIG[planId] || PLAN_CONFIG.free;

  const monthlyLinks = planConfig.features.monthlyLinks;
  const linkLimit = typeof monthlyLinks === 'number' ? monthlyLinks : 10000;
  const totalLinks = stats?.totalLinks || 0;
  const usagePercent = totalLinks ? Math.min((totalLinks / linkLimit) * 100, 100) : 0;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Clicks This Week */}
      <div className="bg-card rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">today</p>
            <p className="text-4xl font-semibold tracking-tight mt-1">
              {formatNumber(stats?.clicksToday || 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">clicks</p>
          </div>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
            clicksChange > 0 && "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
            clicksChange < 0 && "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
            clicksChange === 0 && "text-muted-foreground bg-muted"
          )}>
            {clicksChange > 0 && <TrendingUp className="h-3.5 w-3.5" />}
            {clicksChange < 0 && <TrendingDown className="h-3.5 w-3.5" />}
            {clicksChange === 0 && <Minus className="h-3.5 w-3.5" />}
            <span>{clicksChange > 0 ? '+' : ''}{clicksChange}%</span>
          </div>
        </div>
      </div>

      {/* Plan Usage */}
      <div className="bg-card rounded-2xl border border-border p-6 transition-all duration-200 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium">plan usage</p>
            <p className="text-4xl font-semibold tracking-tight mt-1">
              {totalLinks}/{typeof monthlyLinks === 'number' ? monthlyLinks : '∞'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">links</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Link2 className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        {typeof monthlyLinks === 'number' && (
          <Progress value={usagePercent} className="mt-4 h-2" />
        )}
      </div>
    </div>
  );
};