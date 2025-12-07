import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueHeroCardProps {
  totalRevenue: number;
  previousRevenue?: number;
  conversions: number;
  previousConversions?: number;
  isLoading?: boolean;
}

export const RevenueHeroCard = ({
  totalRevenue,
  previousRevenue = 0,
  conversions,
  previousConversions = 0,
  isLoading
}: RevenueHeroCardProps) => {
  const revenueChange = previousRevenue > 0 
    ? ((totalRevenue - previousRevenue) / previousRevenue * 100) 
    : 0;
  const conversionChange = previousConversions > 0 
    ? ((conversions - previousConversions) / previousConversions * 100) 
    : 0;
  const isPositive = revenueChange >= 0;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-12 w-48 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "border-0 overflow-hidden relative",
      isPositive 
        ? "bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent" 
        : "bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent"
    )}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <CardContent className="p-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Revenue Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wider">total revenue</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl md:text-6xl font-display font-bold text-foreground tracking-tight">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              {revenueChange !== 0 && (
                <div className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium",
                  isPositive 
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                    : "bg-red-500/20 text-red-600 dark:text-red-400"
                )}>
                  {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {Math.abs(revenueChange).toFixed(1)}%
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">vs previous period</p>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-20 bg-border" />

          {/* Conversions Section */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">conversions</span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-display font-bold text-foreground">
                {conversions.toLocaleString()}
              </span>
              {conversionChange !== 0 && (
                <span className={cn(
                  "text-sm font-medium",
                  conversionChange >= 0 ? "text-emerald-500" : "text-red-500"
                )}>
                  {conversionChange >= 0 ? "+" : ""}{conversionChange.toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* Average Revenue Per Conversion */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">avg. per conversion</span>
            <span className="text-4xl font-display font-bold text-foreground block">
              ${conversions > 0 ? (totalRevenue / conversions).toFixed(0) : 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
