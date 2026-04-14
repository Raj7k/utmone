import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { GaussianProcess, TimeSlot } from "@/lib/gaussianProcess";

interface ForecastDataPoint {
  date: string;
  clicks: number;
  isHistorical: boolean;
  lower?: number;
  upper?: number;
}

export function useTrafficForecast(workspaceId: string, days: number = 7) {
  return useQuery({
    queryKey: ["traffic-forecast", workspaceId, days],
    queryFn: async () => {
      // Fetch last 7 days of click data
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: clicks, error } = await supabaseFrom('link_clicks')
        .select("clicked_at, link_id")
        .eq("link_id", workspaceId) // Filter by workspace links
        .gte("clicked_at", startDate.toISOString())
        .order("clicked_at", { ascending: true });

      if (error) throw error;

      // Aggregate by day
      const dailyClicks = new Map<string, number>();
      clicks?.forEach((click) => {
        const date = new Date(click.clicked_at).toISOString().split("T")[0];
        dailyClicks.set(date, (dailyClicks.get(date) || 0) + 1);
      });

      // Convert to time slots for GP (day index and hour)
      const timeSlots: TimeSlot[] = [];
      const historicalData: ForecastDataPoint[] = [];
      
      dailyClicks.forEach((clicks, date) => {
        const dayDate = new Date(date);
        timeSlots.push({
          dayOfWeek: dayDate.getDay(),
          hourOfDay: 12, // Use noon as representative time
          clicks,
        });
        
        historicalData.push({
          date,
          clicks,
          isHistorical: true,
        });
      });

      // Need at least 7 days of data for prediction
      if (timeSlots.length < 7) {
        return {
          historical: historicalData,
          forecast: [],
          needsMoreData: true,
        };
      }

      // Fit Gaussian Process
      const gp = new GaussianProcess(3.0, 1.0, 0.1);
      gp.fit(timeSlots);

      // Generate predictions for next 7 days
      const forecastData: ForecastDataPoint[] = [];
      const today = new Date();

      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        
        const dayOfWeek = futureDate.getDay();
        const prediction = gp.predict(dayOfWeek, 12);
        
        // Variance grows with time (uncertainty increases)
        const timeMultiplier = 1 + (i * 0.15); // 15% increase per day
        const adjustedStd = Math.sqrt(prediction.variance) * timeMultiplier;
        
        forecastData.push({
          date: futureDate.toISOString().split("T")[0],
          clicks: Math.max(0, Math.round(prediction.mean)),
          isHistorical: false,
          lower: Math.max(0, Math.round(prediction.mean - 1.96 * adjustedStd)),
          upper: Math.round(prediction.mean + 1.96 * adjustedStd),
        });
      }

      return {
        historical: historicalData,
        forecast: forecastData,
        needsMoreData: false,
      };
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}
