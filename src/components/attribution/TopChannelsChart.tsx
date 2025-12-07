import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChannelData {
  source: string;
  total_revenue: number;
  total_conversions: number;
}

interface TopChannelsChartProps {
  data: ChannelData[];
  isLoading?: boolean;
}

export const TopChannelsChart = ({ data, isLoading }: TopChannelsChartProps) => {
  const maxRevenue = Math.max(...data.map(d => d.total_revenue), 1);
  const topChannels = data
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5);

  const getChannelColor = (index: number) => {
    const colors = [
      "bg-primary",
      "bg-emerald-500",
      "bg-amber-500",
      "bg-purple-500",
      "bg-rose-500"
    ];
    return colors[index] || "bg-muted";
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-foreground">top channels by revenue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-6 bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (topChannels.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-foreground">top channels by revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground text-sm">no revenue data yet</p>
            <p className="text-muted-foreground text-xs mt-1">conversions will appear here once tracked</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-foreground">top channels by revenue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topChannels.map((channel, index) => {
          const percentage = (channel.total_revenue / maxRevenue) * 100;
          return (
            <div key={channel.source} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground truncate">{channel.source}</span>
                <span className="text-muted-foreground ml-2">
                  ${channel.total_revenue.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-500", getChannelColor(index))}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {channel.total_conversions} conversions
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
