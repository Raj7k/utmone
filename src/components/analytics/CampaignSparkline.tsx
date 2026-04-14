import { LazyLineChart, Line, ResponsiveContainer, LazyChartContainer } from "@/components/charts/LazyCharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { startOfDay, subDays, format } from "date-fns";

interface CampaignSparklineProps {
  workspaceId: string;
  campaign: string;
  source: string;
  medium: string;
  term: string;
  content: string;
}

export const CampaignSparkline = ({
  workspaceId,
  campaign,
  source,
  medium,
  term,
  content,
}: CampaignSparklineProps) => {
  const { data: sparklineData } = useQuery({
    queryKey: ["campaign-sparkline", workspaceId, campaign, source, medium, term, content],
    queryFn: async () => {
      const endDate = startOfDay(new Date());
      const startDate = subDays(endDate, 13); // Last 14 days

      // Get all links for this campaign
      let query = supabase
        .from("links")
        .select("id")
        .eq("workspace_id", workspaceId)
        .eq("utm_campaign", campaign);

      if (source) query = query.eq("utm_source", source);
      if (medium) query = query.eq("utm_medium", medium);
      if (term) query = query.eq("utm_term", term);
      if (content) query = query.eq("utm_content", content);

      const { data: links } = await query;
      if (!links || links.length === 0) return [];

      const linkIds = links.map(link => link.id);

      // Get clicks for these links in the last 14 days
      const { data: clicks } = await supabaseFrom('link_clicks')
        .select("clicked_at")
        .in("link_id", linkIds)
        .gte("clicked_at", startDate.toISOString())
        .lte("clicked_at", endDate.toISOString());

      if (!clicks) return [];

      // Group by day
      const clicksByDay: Record<string, number> = {};
      for (let i = 0; i < 14; i++) {
        const day = format(subDays(endDate, 13 - i), "yyyy-MM-dd");
        clicksByDay[day] = 0;
      }

      clicks.forEach(click => {
        const day = format(new Date(click.clicked_at), "yyyy-MM-dd");
        if (clicksByDay[day] !== undefined) {
          clicksByDay[day]++;
        }
      });

      return Object.entries(clicksByDay).map(([date, count]) => ({
        date,
        clicks: count,
      }));
    },
  });

  if (!sparklineData || sparklineData.length === 0) {
    return <div className="w-20 h-8 flex items-center justify-center text-secondary-label text-xs">-</div>;
  }

  const maxClicks = Math.max(...sparklineData.map(d => d.clicks));
  const hasActivity = maxClicks > 0;

  return (
    <LazyChartContainer height={32}>
      <ResponsiveContainer width={80} height={32}>
        <LazyLineChart data={sparklineData}>
          <Line
            type="monotone"
            dataKey="clicks"
            stroke={hasActivity ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LazyLineChart>
      </ResponsiveContainer>
    </LazyChartContainer>
  );
};
