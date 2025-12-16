import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { IntelligenceContext } from "./ContextSwitcher";

interface ChannelMixDonutProps {
  workspaceId?: string;
  days: number;
  context?: IntelligenceContext;
  preloadedData?: Array<{ name: string; value: number; percentage: number }>;
}

interface ChannelData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const CHANNEL_COLORS = [
  "hsl(var(--primary))",
  "hsl(142, 76%, 36%)",
  "hsl(221, 83%, 53%)",
  "hsl(262, 83%, 58%)",
  "hsl(var(--muted-foreground))",
];

// Cache helpers
const CACHE_KEY = 'channel-mix-cache';
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

function getCached(workspaceId: string, days: number, context: string): ChannelData[] | undefined {
  try {
    const cached = localStorage.getItem(`${CACHE_KEY}-${context}`);
    if (!cached) return undefined;
    const { data, timestamp, wid, d } = JSON.parse(cached);
    if (wid !== workspaceId || d !== days) return undefined;
    if (Date.now() - timestamp > CACHE_EXPIRY) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function setCache(workspaceId: string, days: number, context: string, data: ChannelData[]) {
  try {
    localStorage.setItem(`${CACHE_KEY}-${context}`, JSON.stringify({
      data,
      timestamp: Date.now(),
      wid: workspaceId,
      d: days,
    }));
  } catch {}
}

export default function ChannelMixDonut({ workspaceId, days, context = "all", preloadedData }: ChannelMixDonutProps) {
  const hasPreloadedData = !!preloadedData && preloadedData.length > 0;

  const { data, isFetching } = useQuery({
    queryKey: ["channel-mix", workspaceId, days, context],
    queryFn: async () => {
      if (!workspaceId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // FIX: Include ALL clicks, not just those with utm_source
      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select("referrer, workspace_id, links(utm_source)")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString())
        .limit(1000); // Increased for accuracy

      if (error) throw error;

      // Aggregate by source - include "direct" for clicks without utm_source
      const sourceMap = new Map<string, number>();
      clicks?.forEach((click: any) => {
        // Use utm_source first, then referrer domain, then "direct"
        let source = click.links?.utm_source;
        if (!source) {
          source = extractDomain(click.referrer) || "direct";
        }
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });

      const total = clicks?.length || 0;
      const channels: ChannelData[] = Array.from(sourceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value], index) => ({
          name,
          value,
          percentage: total > 0 ? (value / total) * 100 : 0,
          color: CHANNEL_COLORS[index] || CHANNEL_COLORS[4],
        }));

      if (workspaceId) setCache(workspaceId, days, context, channels);
      return channels;
    },
    initialData: () => workspaceId ? getCached(workspaceId, days, context) : undefined,
    enabled: !!workspaceId && !hasPreloadedData,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Use preloaded data if available
  const displayData = hasPreloadedData 
    ? preloadedData.map((c, index) => ({
        ...c,
        color: CHANNEL_COLORS[index] || CHANNEL_COLORS[4],
      }))
    : data;

  const channels = displayData || [];
  const total = channels.reduce((sum, c) => sum + c.value, 0);

  return (
    <Card className="h-full relative">
      {/* Subtle loading indicator */}
      {isFetching && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <PieChart className="w-4 h-4" />
          channel mix
        </CardTitle>
      </CardHeader>
      <CardContent>
        {channels.length > 0 ? (
          <div className="flex items-center gap-6">
            {/* Donut Chart */}
            <div className="relative w-28 h-28 shrink-0">
              <DonutChart data={channels} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-foreground tabular-nums">
                  {total.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">clicks</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2">
              {channels.map((channel, index) => (
                <div key={`${channel.name}-${index}`} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: channel.color }}
                  />
                  <span className="text-muted-foreground capitalize truncate flex-1">
                    {channel.name}
                  </span>
                  <span className="text-foreground font-medium tabular-nums">
                    {channel.percentage.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PieChart className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">no channel data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DonutChart({ data }: { data: ChannelData[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 112;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {data.map((segment, index) => {
        const segmentLength = (segment.value / total) * circumference;
        const offset = currentOffset;
        currentOffset += segmentLength;

        return (
          <motion.circle
            key={`${segment.name}-${index}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-offset}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${segmentLength} ${circumference - segmentLength}` }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        );
      })}
    </svg>
  );
}

function extractDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace("www.", "").split(".")[0];
  } catch {
    return null;
  }
}
