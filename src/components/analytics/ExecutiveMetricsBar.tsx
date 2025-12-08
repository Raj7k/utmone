import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, MousePointerClick, DollarSign, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: number[];
  icon: React.ReactNode;
  suffix?: string;
}

const MiniSparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
  if (!data.length) return null;
  
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-16 h-8" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "hsl(var(--system-green))" : "hsl(var(--system-red))"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MetricCard = ({ title, value, change, trend, icon, suffix }: MetricCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card className="p-6 rounded-2xl border-border bg-card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-xl bg-white/5">
          {icon}
        </div>
        <MiniSparkline data={trend} positive={isPositive} />
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-secondary-label">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-label tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {suffix && <span className="text-sm text-secondary-label">{suffix}</span>}
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-system-green" />
        ) : (
          <TrendingDown className="h-4 w-4 text-system-red" />
        )}
        <span className={cn(
          "text-sm font-medium",
          isPositive ? "text-system-green" : "text-system-red"
        )}>
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </span>
        <span className="text-xs text-tertiary-label">vs last period</span>
      </div>
    </Card>
  );
};

interface ExecutiveMetricsBarProps {
  totalClicks: number;
  uniqueVisitors: number;
  conversionRate: number;
  revenue: number;
  clicksChange: number;
  visitorsChange: number;
  conversionChange: number;
  revenueChange: number;
  clicksTrend: number[];
  visitorsTrend: number[];
  isLoading?: boolean;
}

export const ExecutiveMetricsBar = ({
  totalClicks,
  uniqueVisitors,
  conversionRate,
  revenue,
  clicksChange,
  visitorsChange,
  conversionChange,
  revenueChange,
  clicksTrend,
  visitorsTrend,
  isLoading
}: ExecutiveMetricsBarProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="p-6 rounded-2xl">
            <Skeleton className="h-10 w-10 rounded-xl mb-4" />
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="total clicks"
        value={totalClicks}
        change={clicksChange}
        trend={clicksTrend}
        icon={<MousePointerClick className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />}
      />
      <MetricCard
        title="unique visitors"
        value={uniqueVisitors}
        change={visitorsChange}
        trend={visitorsTrend}
        icon={<Users className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />}
      />
      <MetricCard
        title="conversion rate"
        value={conversionRate.toFixed(1)}
        change={conversionChange}
        trend={[]}
        suffix="%"
        icon={<BarChart3 className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />}
      />
      <MetricCard
        title="revenue"
        value={`$${revenue.toLocaleString()}`}
        change={revenueChange}
        trend={[]}
        icon={<DollarSign className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />}
      />
    </div>
  );
};
