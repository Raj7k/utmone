import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChannelMixDonutProps {
  workspaceId?: string;
  days: number;
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

export default function ChannelMixDonut({ workspaceId, days }: ChannelMixDonutProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["channel-mix", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select("referrer, links!inner(workspace_id, utm_source)")
        .eq("links.workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      if (error) throw error;

      // Aggregate by source
      const sourceMap = new Map<string, number>();
      clicks?.forEach((click: any) => {
        const source = click.links?.utm_source || extractDomain(click.referrer) || "direct";
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

      return channels;
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const channels = data || [];
  const total = channels.reduce((sum, c) => sum + c.value, 0);

  return (
    <Card className="h-full">
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
              {channels.map((channel) => (
                <div key={channel.name} className="flex items-center gap-2 text-sm">
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
            key={segment.name}
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
