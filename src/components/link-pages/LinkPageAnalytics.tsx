import { Eye, MousePointer, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useLinkPageStats,
  useBlockClickStats,
  usePageViewsTimeSeries,
} from "@/hooks/useLinkPageAnalytics";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

interface LinkPageAnalyticsProps {
  pageId: string;
}

export function LinkPageAnalytics({ pageId }: LinkPageAnalyticsProps) {
  const { data: stats, isLoading: statsLoading } = useLinkPageStats(pageId);
  const { data: blockClicks, isLoading: blocksLoading } = useBlockClickStats(pageId);
  const { data: timeSeries, isLoading: timeSeriesLoading } = usePageViewsTimeSeries(pageId);

  if (statsLoading || blocksLoading || timeSeriesLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Page Views",
      value: stats?.totalViews || 0,
      icon: Eye,
    },
    {
      title: "Unique Visitors",
      value: stats?.uniqueVisitors || 0,
      icon: Users,
    },
    {
      title: "Block Clicks",
      value: stats?.totalClicks || 0,
      icon: MousePointer,
    },
    {
      title: "Click Rate",
      value: `${(stats?.clickThroughRate || 0).toFixed(1)}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="h-4 w-4" />
                <span className="text-xs">{stat.title}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Views Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSeries && timeSeries.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MMM d")}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  fill="url(#viewsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No data yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Blocks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Clicked Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          {blockClicks && blockClicks.length > 0 ? (
            <div className="space-y-3">
              {blockClicks.slice(0, 5).map((block, i) => (
                <div key={block.blockId} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{block.blockTitle}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {block.blockType}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{block.clicks} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No clicks recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
