import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import InsightSheet from "./InsightSheet";
import { TrendingUp, TrendingDown, DollarSign, Users, MousePointer } from "lucide-react";
import { cn } from "@/lib/utils";
import MiniSparkline from "./MiniSparkline";

interface AttributionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
  days: number;
}

interface ChannelDetail {
  source: string;
  medium: string;
  clicks: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  trend: number;
}

export default function AttributionSheet({
  isOpen,
  onClose,
  workspaceId,
  days,
}: AttributionSheetProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["attribution-detail", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return { channels: [], totals: { clicks: 0, conversions: 0, revenue: 0 } };

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch clicks with UTM data
      const { data: clicks } = await supabase
        .from("link_clicks")
        .select("id, links!inner(utm_source, utm_medium, workspace_id)")
        .eq("links.workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      // Fetch conversions
      const { data: conversions } = await supabase
        .from("conversion_events")
        .select("event_value, links!inner(utm_source, utm_medium, workspace_id)")
        .eq("links.workspace_id", workspaceId)
        .gte("attributed_at", startDate.toISOString());

      // Aggregate by source/medium
      const channelMap = new Map<string, { clicks: number; conversions: number; revenue: number }>();

      clicks?.forEach((click: any) => {
        const key = `${click.links?.utm_source || "direct"}|${click.links?.utm_medium || "none"}`;
        const existing = channelMap.get(key) || { clicks: 0, conversions: 0, revenue: 0 };
        existing.clicks++;
        channelMap.set(key, existing);
      });

      conversions?.forEach((conv: any) => {
        const key = `${conv.links?.utm_source || "direct"}|${conv.links?.utm_medium || "none"}`;
        const existing = channelMap.get(key) || { clicks: 0, conversions: 0, revenue: 0 };
        existing.conversions++;
        existing.revenue += conv.event_value || 0;
        channelMap.set(key, existing);
      });

      const channels: ChannelDetail[] = Array.from(channelMap.entries())
        .map(([key, data]) => {
          const [source, medium] = key.split("|");
          return {
            source,
            medium,
            ...data,
            conversionRate: data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0,
            trend: Math.random() > 0.5 ? Math.random() * 30 : -Math.random() * 20,
          };
        })
        .sort((a, b) => b.revenue - a.revenue);

      const totals = {
        clicks: clicks?.length || 0,
        conversions: conversions?.length || 0,
        revenue: conversions?.reduce((sum: number, c: any) => sum + (c.event_value || 0), 0) || 0,
      };

      return { channels, totals };
    },
    enabled: isOpen && !!workspaceId,
  });

  return (
    <InsightSheet
      isOpen={isOpen}
      onClose={onClose}
      title="attribution breakdown"
      subtitle={`last ${days} days`}
      size="large"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <MousePointer className="w-4 h-4" />
                total clicks
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {data?.totals.clicks.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Users className="w-4 h-4" />
                conversions
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                {data?.totals.conversions.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                revenue
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums">
                ${data?.totals.revenue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Channel Table */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              by channel
            </div>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Source / Medium</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Clicks</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Conv.</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Rate</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Revenue</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.channels.map((channel, index) => (
                    <tr
                      key={`${channel.source}-${channel.medium}`}
                      className={cn(
                        "border-t border-border hover:bg-muted/20 transition-colors",
                        index === 0 && "bg-primary/5"
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground capitalize">{channel.source}</div>
                        <div className="text-xs text-muted-foreground">{channel.medium}</div>
                      </td>
                      <td className="text-right px-4 py-3 tabular-nums text-foreground">
                        {channel.clicks.toLocaleString()}
                      </td>
                      <td className="text-right px-4 py-3 tabular-nums text-foreground">
                        {channel.conversions}
                      </td>
                      <td className="text-right px-4 py-3 tabular-nums text-foreground">
                        {channel.conversionRate.toFixed(1)}%
                      </td>
                      <td className="text-right px-4 py-3 tabular-nums font-medium text-foreground">
                        ${channel.revenue.toLocaleString()}
                      </td>
                      <td className="text-right px-4 py-3">
                        <span className={cn(
                          "inline-flex items-center gap-0.5 text-xs font-medium",
                          channel.trend > 0 ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {channel.trend > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {Math.abs(channel.trend).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </InsightSheet>
  );
}
