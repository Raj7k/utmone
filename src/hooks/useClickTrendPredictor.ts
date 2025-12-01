import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GaussianProcess } from "@/lib/gaussianProcess";

interface TimePoint {
  date: string;
  clicks: number;
  predicted?: boolean;
  lower?: number;
  upper?: number;
}

interface TrendResult {
  predictions: TimePoint[];
  trend: string;
  confidence: number;
}

export const useClickTrendPredictor = (linkId: string) => {
  return useQuery({
    queryKey: ["click-trend", linkId],
    queryFn: async (): Promise<TrendResult> => {
      const { data: clicks } = await supabase
        .from("link_clicks")
        .select("clicked_at")
        .eq("link_id", linkId)
        .gte("clicked_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("clicked_at", { ascending: true });

      if (!clicks || clicks.length < 14) {
        return {
          predictions: [],
          trend: "not enough data",
          confidence: 0,
        };
      }

      // Group by day
      const dailyCounts = clicks.reduce((acc, click) => {
        const day = new Date(click.clicked_at).toISOString().split("T")[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const days = Object.keys(dailyCounts).sort();
      const historical: TimePoint[] = days.map((day) => ({
        date: day,
        clicks: dailyCounts[day],
      }));

      // Train GP
      const gp = new GaussianProcess(2.0, 1.0, 0.1);
      const trainingData = days.map((day, idx) => ({
        dayOfWeek: new Date(day).getDay(),
        hourOfDay: 12,
        clicks: dailyCounts[day],
      }));

      gp.fit(trainingData);

      // Predict next 7 days
      const predictions: TimePoint[] = [];
      const lastDate = new Date(days[days.length - 1]);

      for (let i = 1; i <= 7; i++) {
        const futureDate = new Date(lastDate);
        futureDate.setDate(futureDate.getDate() + i);
        const prediction = gp.predict(futureDate.getDay(), 12);
        const ci = gp.getConfidenceInterval(prediction.mean, prediction.variance, 0.8);

        predictions.push({
          date: futureDate.toISOString().split("T")[0],
          clicks: Math.round(prediction.mean),
          predicted: true,
          lower: Math.round(ci[0]),
          upper: Math.round(ci[1]),
        });
      }

      // Calculate trend
      const recentAvg = historical.slice(-7).reduce((sum, p) => sum + p.clicks, 0) / 7;
      const futureAvg = predictions.reduce((sum, p) => sum + p.clicks, 0) / 7;
      const change = ((futureAvg - recentAvg) / recentAvg) * 100;

      let trend: string;
      if (change > 10) {
        trend = `trending up — expect ~${Math.round(futureAvg * 7)} clicks next week`;
      } else if (change < -10) {
        trend = `cooling off — down ${Math.abs(Math.round(change))}% from peak`;
      } else {
        trend = `steady at ~${Math.round(recentAvg)} clicks/day`;
      }

      return {
        predictions: [...historical, ...predictions],
        trend,
        confidence: Math.round((1 - Math.sqrt(predictions[0].upper! - predictions[0].lower!) / predictions[0].clicks) * 100),
      };
    },
    enabled: !!linkId,
  });
};
