import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DashboardLink } from "@/hooks/useDashboardUnified";

interface TopCampaignsTableProps {
  workspaceId: string;
  /** Pre-fetched links data - if provided, skips internal query */
  links?: DashboardLink[];
}

interface CampaignData {
  id: string;
  title: string;
  shortUrl: string;
  totalClicks: number;
  uniqueClicks: number;
  utmCampaign?: string;
  trend: 'up' | 'down' | 'neutral';
  trendPercent: number;
}

const MiniTrendLine = ({ values }: { values: number[] }) => {
  if (!values.length) return null;
  
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  
  const points = values.map((val, i) => {
    const x = (i / (values.length - 1)) * 60;
    const y = 20 - ((val - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  const trend = values[values.length - 1] > values[0] ? 'up' : values[values.length - 1] < values[0] ? 'down' : 'neutral';
  const color = trend === 'up' ? 'hsl(var(--system-green))' : trend === 'down' ? 'hsl(var(--system-red))' : 'hsl(var(--muted-foreground))';

  return (
    <svg viewBox="0 0 60 20" className="w-12 h-5">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TopCampaignsTable = ({ workspaceId, links: prefetchedLinks }: TopCampaignsTableProps) => {
  // Only fetch if no pre-fetched data provided
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["top-campaigns", workspaceId],
    queryFn: async () => {
      const { data: links, error } = await supabase
        .from("links")
        .select(`
          id,
          title,
          short_url,
          total_clicks,
          unique_clicks,
          utm_campaign
        `)
        .eq("workspace_id", workspaceId)
        .gt("total_clicks", 0)
        .order("total_clicks", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Simulate trend data (in real app, this would come from historical data)
      return (links || []).map((link): CampaignData => {
        const randomTrend = Math.random();
        const trend = randomTrend > 0.6 ? 'up' : randomTrend > 0.3 ? 'neutral' : 'down';
        const trendPercent = Math.round((Math.random() * 30) * (trend === 'down' ? -1 : 1));
        
        return {
          id: link.id,
          title: link.title || 'Untitled Link',
          shortUrl: link.short_url,
          totalClicks: link.total_clicks || 0,
          uniqueClicks: link.unique_clicks || 0,
          utmCampaign: link.utm_campaign || undefined,
          trend,
          trendPercent: trend === 'neutral' ? 0 : trendPercent
        };
      });
    },
    enabled: !!workspaceId && !prefetchedLinks,
    staleTime: 5 * 60 * 1000, // 5 min stale time
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Convert prefetched links to campaign format
  const campaignData: CampaignData[] | undefined = prefetchedLinks 
    ? prefetchedLinks
        .filter(l => l.total_clicks > 0)
        .sort((a, b) => b.total_clicks - a.total_clicks)
        .slice(0, 10)
        .map(link => ({
          id: link.id,
          title: link.title || 'Untitled Link',
          shortUrl: link.short_url,
          totalClicks: link.total_clicks || 0,
          uniqueClicks: 0,
          trend: 'neutral' as const,
          trendPercent: 0
        }))
    : campaigns;

  const showLoading = isLoading && !prefetchedLinks;

  if (showLoading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!campaignData?.length) {
    return (
      <Card className="rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">top performing links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-secondary-label mb-4">
              no links with clicks yet
            </p>
            <Button asChild size="sm">
              <Link to="/dashboard">Create your first link</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTrendIcon = (trend: CampaignData['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-system-green" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-system-red" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">top performing links</CardTitle>
            <p className="text-sm text-secondary-label">your highest traffic links</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard/links">View all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {campaignData.map((campaign, index) => (
            <div
              key={campaign.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
            >
              <span className="text-sm font-medium text-muted-foreground w-6 text-center">
                {index + 1}
              </span>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-label truncate">
                    {campaign.title}
                  </p>
                  {campaign.utmCampaign && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {campaign.utmCampaign}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-secondary-label truncate">
                  {campaign.shortUrl}
                </p>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <MiniTrendLine values={[1, 2, 3, 2, 4, 3, 5].map(v => v * (campaign.totalClicks / 10))} />
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-label">
                    {campaign.totalClicks.toLocaleString()}
                  </span>
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs",
                    campaign.trend === 'up' && "text-system-green",
                    campaign.trend === 'down' && "text-system-red",
                    campaign.trend === 'neutral' && "text-muted-foreground"
                  )}>
                    {getTrendIcon(campaign.trend)}
                    <span>{Math.abs(campaign.trendPercent)}%</span>
                  </div>
                </div>
                <p className="text-xs text-secondary-label">
                  {campaign.uniqueClicks.toLocaleString()} unique
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <Link to={`/dashboard/links/${campaign.id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};