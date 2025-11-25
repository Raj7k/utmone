import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnimatedCounter } from "@/components/reports/AnimatedCounter";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface GlanceableStatsProps {
  workspaceId: string;
}

export const GlanceableStats = ({ workspaceId }: GlanceableStatsProps) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['glanceable-stats', workspaceId],
    queryFn: async () => {
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Get all links for workspace
      const { data: allLinks } = await supabase
        .from('links')
        .select('id, total_clicks, created_at')
        .eq('workspace_id', workspaceId);

      const linkIds = allLinks?.map(l => l.id) || [];

      // Get clicks for last 7 days
      const { data: recentClicks } = await supabase
        .from('link_clicks')
        .select('clicked_at, link_id')
        .in('link_id', linkIds)
        .gte('clicked_at', sevenDaysAgo.toISOString());

      // Get clicks for previous 7 days
      const { data: previousClicks } = await supabase
        .from('link_clicks')
        .select('clicked_at')
        .in('link_id', linkIds)
        .gte('clicked_at', fourteenDaysAgo.toISOString())
        .lt('clicked_at', sevenDaysAgo.toISOString());

      // Calculate totals
      const totalLinks = allLinks?.length || 0;
      const totalClicks = allLinks?.reduce((sum, link) => sum + (link.total_clicks || 0), 0) || 0;
      const recentClickCount = recentClicks?.length || 0;
      const previousClickCount = previousClicks?.length || 0;

      // Calculate percentage change
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const clicksChange = calculateChange(recentClickCount, previousClickCount);

      // Generate sparkline data (last 7 days)
      const sparklineData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayClicks = recentClicks?.filter(c => {
          const clickDate = new Date(c.clicked_at);
          return clickDate.toDateString() === date.toDateString();
        }).length || 0;
        return { value: dayClicks };
      });

      // Get QR codes count
      const { data: qrCodes } = await supabase
        .from('qr_codes')
        .select('id')
        .in('link_id', linkIds);

      return {
        totalLinks,
        totalClicks,
        recentClickCount,
        clicksChange,
        sparklineData,
        qrCodesCount: qrCodes?.length || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="grouped">
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-fill-tertiary rounded w-1/2" />
                <div className="h-8 bg-fill-tertiary rounded w-3/4" />
                <div className="h-3 bg-fill-tertiary rounded w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-system-green" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-system-red" />;
    return <Minus className="h-4 w-4 text-tertiary-label" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-system-green';
    if (change < 0) return 'text-system-red';
    return 'text-tertiary-label';
  };

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {/* Total Clicks */}
      <Card variant="grouped" className="hover:shadow-lg transition-apple">
        <CardHeader className="pb-2">
          <CardDescription className="text-secondary-label">total clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-label metric-text">
            <AnimatedCounter to={stats?.totalClicks || 0} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getTrendIcon(stats?.clicksChange || 0)}
            <span className={`text-caption-1 font-semibold ${getTrendColor(stats?.clicksChange || 0)}`}>
              {Math.abs(Math.round(stats?.clicksChange || 0))}% vs last week
            </span>
          </div>
          {/* Sparkline */}
          <div className="h-12 mt-2 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.sparklineData || []}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--system-blue))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {stats?.recentClickCount && stats.recentClickCount > 10 && (
            <p className="text-caption-1 text-system-blue mt-2">
              🎉 your best week yet!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Total Links */}
      <Card variant="grouped" className="hover:shadow-lg transition-apple">
        <CardHeader className="pb-2">
          <CardDescription className="text-secondary-label">total links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-label metric-text">
            <AnimatedCounter to={stats?.totalLinks || 0} />
          </div>
          <p className="text-caption-1 text-tertiary-label mt-4">
            {stats?.totalLinks === 0 ? 'create your first link' : 'active links'}
          </p>
        </CardContent>
      </Card>

      {/* QR Codes */}
      <Card variant="grouped" className="hover:shadow-lg transition-apple">
        <CardHeader className="pb-2">
          <CardDescription className="text-secondary-label">qr codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-label metric-text">
            <AnimatedCounter to={stats?.qrCodesCount || 0} />
          </div>
          <p className="text-caption-1 text-tertiary-label mt-4">
            {stats?.qrCodesCount === 0 ? 'generate your first qr' : 'generated this month'}
          </p>
        </CardContent>
      </Card>

      {/* Click Rate */}
      <Card variant="grouped" className="hover:shadow-lg transition-apple">
        <CardHeader className="pb-2">
          <CardDescription className="text-secondary-label">click rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-label metric-text">
            {stats?.totalLinks && stats.totalLinks > 0 
              ? <AnimatedCounter to={Math.round((stats.totalClicks / stats.totalLinks) * 10) / 10} decimals={1} />
              : '0'}
          </div>
          <p className="text-caption-1 text-tertiary-label mt-4">
            clicks per link
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
