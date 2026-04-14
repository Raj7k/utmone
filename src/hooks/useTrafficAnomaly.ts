import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { GaussianProcess } from "@/lib/gaussianProcess";

interface AnomalyResult {
  status: "normal" | "spike" | "drop";
  deviation: number;
  message: string;
}

export const useTrafficAnomaly = (linkId: string) => {
  return useQuery({
    queryKey: ["traffic-anomaly", linkId],
    queryFn: async (): Promise<AnomalyResult> => {
      const { data: clicks } = await supabaseFrom('link_clicks')
        .select("clicked_at")
        .eq("link_id", linkId)
        .gte("clicked_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("clicked_at", { ascending: true });

      if (!clicks || clicks.length < 7) {
        return {
          status: "normal",
          deviation: 0,
          message: "not enough data yet",
        };
      }

      // Group by day
      const dailyCounts = clicks.reduce((acc, click) => {
        const day = new Date(click.clicked_at).toISOString().split("T")[0];
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const days = Object.keys(dailyCounts).sort();
      const counts = days.map((day) => dailyCounts[day]);

      // Train GP on historical data
      const gp = new GaussianProcess(1.0, 1.0, 0.1);
      const trainingData = days.slice(0, -1).map((day, idx) => ({
        dayOfWeek: new Date(day).getDay(),
        hourOfDay: 12,
        clicks: counts[idx],
      }));

      gp.fit(trainingData);

      // Predict yesterday
      const yesterday = days[days.length - 1];
      const yesterdayCount = counts[counts.length - 1];
      const prediction = gp.predict(new Date(yesterday).getDay(), 12);

      const deviation = Math.abs(yesterdayCount - prediction.mean) / Math.sqrt(prediction.variance);

      if (deviation > 2.5) {
        const multiplier = (yesterdayCount / prediction.mean).toFixed(1);
        return {
          status: yesterdayCount > prediction.mean ? "spike" : "drop",
          deviation,
          message:
            yesterdayCount > prediction.mean
              ? `unusual spike: ${multiplier}x more clicks than expected yesterday`
              : `sudden drop: ${Math.round((1 - yesterdayCount / prediction.mean) * 100)}% fewer clicks than usual`,
        };
      }

      return {
        status: "normal",
        deviation,
        message: "traffic looks normal",
      };
    },
    enabled: !!linkId,
  });
};
