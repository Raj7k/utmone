import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface AnalyticsDataPoint {
  date: string;
  totalClicks: number;
  uniqueClicks: number;
  isEstimated: boolean;
  margin?: number;
}

interface DeviceData {
  device: string;
  clicks: number;
  isEstimated: boolean;
}

interface StratifiedAnalyticsResult {
  timeSeries: AnalyticsDataPoint[];
  devices: DeviceData[];
  totalClicks: number;
  uniqueVisitors: number;
  topCountries?: { country: string; clicks: number }[];
  isEstimated: boolean;
  sampleRate: number;
  confidence: number;
  isLoadingPrecise: boolean;
}

export function useStratifiedAnalytics(
  workspaceId: string | undefined,
  linkId?: string,
  days: number = 30
) {
  const [preciseData, setPreciseData] = useState<any>(null);
  const [isLoadingPrecise, setIsLoadingPrecise] = useState(false);

  // Fast query with sampling (renders immediately)
  const { data: fastData, isLoading: isLoadingFast } = useQuery({
    queryKey: ["analytics-fast", workspaceId, linkId, days],
    queryFn: async () => {
      if (!workspaceId) return null;

      const { data, error } = await supabase.functions.invoke("analytics-fast", {
        body: { workspaceId, linkId, days },
      });

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Precise query in background (backfills when ready)
  useEffect(() => {
    if (!workspaceId || !fastData) return;

    setIsLoadingPrecise(true);

    const fetchPrecise = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("analytics-precise", {
          body: { workspaceId, linkId, days },
        });

        if (error) throw error;
        setPreciseData(data);
      } catch (error) {
        console.error("Error fetching precise analytics:", error);
      } finally {
        setIsLoadingPrecise(false);
      }
    };

    // Delay to let fast data render first
    const timer = setTimeout(fetchPrecise, 100);
    return () => clearTimeout(timer);
  }, [workspaceId, linkId, days, fastData]);

  // Return precise data if available, otherwise fast data
  const data = preciseData || fastData;

  return {
    data: data as StratifiedAnalyticsResult | null,
    isLoading: isLoadingFast,
    isLoadingPrecise,
    isEstimated: !preciseData,
  };
}
