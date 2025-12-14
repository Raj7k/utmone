import { Card } from "@/components/ui/card";
import { Link2, MousePointerClick, QrCode as QrCodeIcon, TrendingUp, ArrowUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface GlanceableMetricsProps {
  stats?: {
    totalLinks: number;
    totalClicks: number;
    totalUniqueClicks: number;
    totalConversions: number;
    avgConversionRate: number;
    totalQRCodes: number;
    recentLinksCount: number;
    clicksChange: number;
  } | null;
  isLoading?: boolean;
}

export function GlanceableMetrics({ stats, isLoading }: GlanceableMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">Total Links</p>
          <Link2 className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{stats.totalLinks.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{stats.recentLinksCount} this month</p>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
          <MousePointerClick className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{stats.totalClicks.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{stats.totalUniqueClicks.toLocaleString()} unique</p>
            {stats.clicksChange > 0 && (
              <span className="flex items-center text-xs font-medium text-green-600">
                <ArrowUp className="h-3 w-3" />
                {stats.clicksChange.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">QR Codes</p>
          <QrCodeIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{stats.totalQRCodes.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Branded codes</p>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{stats.avgConversionRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">{stats.totalConversions} conversions</p>
        </div>
      </Card>
    </div>
  );
}