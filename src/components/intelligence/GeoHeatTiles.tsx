import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface GeoHeatTilesProps {
  workspaceId?: string;
  days: number;
  preloadedData?: Array<{ city: string; country: string; clicks: number; percentage: number }>;
}

interface CityData {
  city: string;
  country: string;
  clicks: number;
  percentage: number;
}

// Cache helpers
const CACHE_KEY = 'geo-heat-cache';
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

function getCached(workspaceId: string, days: number): CityData[] | undefined {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return undefined;
    const { data, timestamp, wid, d } = JSON.parse(cached);
    if (wid !== workspaceId || d !== days) return undefined;
    if (Date.now() - timestamp > CACHE_EXPIRY) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function setCache(workspaceId: string, days: number, data: CityData[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
      wid: workspaceId,
      d: days,
    }));
  } catch {}
}

export default function GeoHeatTiles({ workspaceId, days, preloadedData }: GeoHeatTilesProps) {
  const hasPreloadedData = !!preloadedData && preloadedData.length > 0;

  const { data, isFetching } = useQuery({
    queryKey: ["geo-heat", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select("city, country")
        .eq("workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString())
        .not("city", "is", null)
        .limit(500);

      if (error) throw error;

      const cityMap = new Map<string, { country: string; count: number }>();
      clicks?.forEach((click: any) => {
        const city = click.city || "Unknown";
        const country = click.country || "";
        const existing = cityMap.get(city);
        if (existing) {
          existing.count++;
        } else {
          cityMap.set(city, { country, count: 1 });
        }
      });

      const total = clicks?.length || 0;
      const cities: CityData[] = Array.from(cityMap.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([city, data]) => ({
          city,
          country: data.country,
          clicks: data.count,
          percentage: total > 0 ? (data.count / total) * 100 : 0,
        }));

      if (workspaceId) setCache(workspaceId, days, cities);
      return cities;
    },
    initialData: () => workspaceId ? getCached(workspaceId, days) : undefined,
    enabled: !!workspaceId && !hasPreloadedData,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const displayData = hasPreloadedData ? preloadedData : data;
  const cities = displayData || [];
  const maxClicks = Math.max(...cities.map((c) => c.clicks), 1);

  return (
    <Card className="h-full relative">
      {/* Subtle loading indicator */}
      {isFetching && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" />
            top locations
          </CardTitle>
          <Link
            to="/dashboard/analytics?tab=geography"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            view map
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {cities.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {cities.map((city, index) => {
              const intensity = city.clicks / maxClicks;
              return (
                <motion.div
                  key={city.city}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative p-3 rounded-xl overflow-hidden cursor-pointer",
                    "hover:scale-[1.02] transition-transform",
                    index === 0 ? "col-span-2" : ""
                  )}
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--primary) / ${0.1 + intensity * 0.2}), hsl(var(--primary) / ${0.05 + intensity * 0.1}))`,
                  }}
                >
                  {/* Heat gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, hsl(var(--primary) / ${intensity * 0.5}), transparent 70%)`,
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          {city.city}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {city.country}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground tabular-nums">
                          {city.clicks.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {city.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Globe className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">no location data yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
