import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { IntelligenceContext } from "./ContextSwitcher";
import MiniSparkline from "./MiniSparkline";
import { Link } from "react-router-dom";

interface TopCampaignsCardProps {
  workspaceId?: string;
  days: number;
  context: IntelligenceContext;
  preloadedCampaigns?: Array<{ id: string; name: string; clicks: number }>;
}

interface CampaignData {
  id: string;
  name: string;
  clicks: number;
  conversions: number;
  trend: number;
  sparkline: number[];
}

// Cache helpers
const CACHE_KEY = 'top-campaigns-cache';
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

function getCached(workspaceId: string, days: number, context: string): CampaignData[] | undefined {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return undefined;
    const { data, timestamp, wid, d, ctx } = JSON.parse(cached);
    if (wid !== workspaceId || d !== days || ctx !== context) return undefined;
    if (Date.now() - timestamp > CACHE_EXPIRY) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function setCache(workspaceId: string, days: number, context: string, data: CampaignData[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
      wid: workspaceId,
      d: days,
      ctx: context,
    }));
  } catch {}
}

export default function TopCampaignsCard({ workspaceId, days, context, preloadedCampaigns }: TopCampaignsCardProps) {
  const hasPreloadedData = !!preloadedCampaigns;

  const { data, isFetching } = useQuery({
    queryKey: ["top-campaigns", workspaceId, days, context],
    queryFn: async () => {
      if (!workspaceId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString();
      
      // Previous period for trend calculation
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - days);
      const prevStartDateStr = prevStartDate.toISOString();

      // Get campaigns with their links
      const { data: campaigns } = await supabase
        .from("campaigns")
        .select("id, name")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .limit(5);

      if (!campaigns || campaigns.length === 0) return [];

      // Get links for these campaigns
      const campaignIds = campaigns.map(c => c.id);
      const { data: links } = await supabase
        .from("links")
        .select("id, campaign_id")
        .eq("workspace_id", workspaceId)
        .in("campaign_id", campaignIds);

      if (!links || links.length === 0) {
        return campaigns.map(c => ({ id: c.id, name: c.name, clicks: 0, conversions: 0, trend: 0, sparkline: [] }));
      }

      const linkIds = links.map(l => l.id);
      
      // Get current period clicks
      const { data: currentClicks } = await supabase
        .from("link_clicks")
        .select("link_id, clicked_at")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDateStr)
        .in("link_id", linkIds);

      // Get previous period clicks for trend
      const { data: prevClicks } = await supabase
        .from("link_clicks")
        .select("link_id")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", prevStartDateStr)
        .lt("clicked_at", startDateStr)
        .in("link_id", linkIds);

      // Get conversions
      const { data: conversions } = await supabase
        .from("conversion_events")
        .select("link_id")
        .eq("workspace_id", workspaceId)
        .gte("attributed_at", startDateStr)
        .in("link_id", linkIds);

      // Aggregate by campaign
      const clicksByCampaign: Record<string, number> = {};
      const prevClicksByCampaign: Record<string, number> = {};
      const conversionsByCampaign: Record<string, number> = {};
      const dailyClicksByCampaign: Record<string, number[]> = {};

      // Initialize
      campaigns.forEach(c => {
        clicksByCampaign[c.id] = 0;
        prevClicksByCampaign[c.id] = 0;
        conversionsByCampaign[c.id] = 0;
        dailyClicksByCampaign[c.id] = Array(7).fill(0);
      });

      // Map link to campaign
      const linkToCampaign: Record<string, string> = {};
      links.forEach(l => { if (l.campaign_id) linkToCampaign[l.id] = l.campaign_id; });

      // Count current clicks and build sparkline
      currentClicks?.forEach((click: any) => {
        const campaignId = linkToCampaign[click.link_id];
        if (campaignId) {
          clicksByCampaign[campaignId]++;
          // Calculate day index for sparkline
          const clickDate = new Date(click.clicked_at);
          const dayIndex = Math.floor((Date.now() - clickDate.getTime()) / (24 * 60 * 60 * 1000));
          if (dayIndex >= 0 && dayIndex < 7) {
            dailyClicksByCampaign[campaignId][6 - dayIndex]++;
          }
        }
      });

      // Count previous period clicks
      prevClicks?.forEach((click: any) => {
        const campaignId = linkToCampaign[click.link_id];
        if (campaignId) prevClicksByCampaign[campaignId]++;
      });

      // Count conversions
      conversions?.forEach((conv: any) => {
        const campaignId = linkToCampaign[conv.link_id];
        if (campaignId) conversionsByCampaign[campaignId]++;
      });

      // Build results with real data
      const campaignStats: CampaignData[] = campaigns.map((campaign: any) => {
        const clicks = clicksByCampaign[campaign.id] || 0;
        const prevClickCount = prevClicksByCampaign[campaign.id] || 0;
        const trend = prevClickCount > 0 ? ((clicks - prevClickCount) / prevClickCount) * 100 : 0;
        
        return {
          id: campaign.id,
          name: campaign.name,
          clicks,
          conversions: conversionsByCampaign[campaign.id] || 0,
          trend,
          sparkline: dailyClicksByCampaign[campaign.id] || [],
        };
      });

      const result = campaignStats.sort((a, b) => b.clicks - a.clicks).slice(0, 3);
      if (workspaceId) setCache(workspaceId, days, context, result);
      return result;
    },
    initialData: () => workspaceId ? getCached(workspaceId, days, context) : undefined,
    enabled: !!workspaceId && !hasPreloadedData,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Use preloaded data if available - with real click data
  const displayData = hasPreloadedData 
    ? preloadedCampaigns.map(c => ({
        ...c,
        conversions: 0, // Would need real query
        trend: 0,
        sparkline: [],
      }))
    : data;

  const campaigns = displayData || [];

  return (
    <Card className="h-full relative">
      {/* Subtle loading indicator */}
      {isFetching && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            top campaigns
          </CardTitle>
          <Link
            to="/dashboard/campaigns"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            view all
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {campaigns.length > 0 ? (
          <div className="space-y-3">
            {campaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                {/* Rank Badge */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                  index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {index + 1}
                </div>

                {/* Campaign Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {campaign.name}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{campaign.clicks.toLocaleString()} clicks</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{campaign.conversions} conversions</span>
                  </div>
                </div>

                {/* Sparkline & Trend */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-16 h-8 hidden sm:block">
                    <MiniSparkline
                      data={campaign.sparkline}
                      color={campaign.trend > 0 ? "hsl(142, 76%, 36%)" : "hsl(var(--destructive))"}
                    />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    campaign.trend > 0 ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {campaign.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(Math.round(campaign.trend))}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Megaphone className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">no campaigns yet</p>
            <Link
              to="/dashboard/campaigns/new"
              className="text-xs text-primary hover:underline mt-1"
            >
              create your first campaign
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
