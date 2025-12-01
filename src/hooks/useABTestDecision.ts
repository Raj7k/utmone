import { useQuery } from "@tanstack/react-query";
import { calculateWinProbability } from "@/lib/bayesianOptimization";

interface Variant {
  id: string;
  name: string;
  clicks: number;
  conversions: number;
}

interface ABTestResult {
  winner: string | null;
  confidence: number;
  recommendation: string;
  variants: Array<{
    id: string;
    name: string;
    winProbability: number;
  }>;
}

export const useABTestDecision = (variants: Variant[]) => {
  return useQuery({
    queryKey: ["ab-test-decision", variants.map(v => v.id).join(",")],
    queryFn: async (): Promise<ABTestResult> => {
      if (variants.length < 2) {
        return {
          winner: null,
          confidence: 0,
          recommendation: "need at least 2 variants",
          variants: [],
        };
      }

      const totalClicks = variants.reduce((sum, v) => sum + v.clicks, 0);
      if (totalClicks < 100) {
        return {
          winner: null,
          confidence: 0,
          recommendation: "too early — need more data",
          variants: [],
        };
      }

      // Calculate win probabilities for all variants
      const winProbs = variants.map((variant, idx) => {
        const otherVariants = variants.filter((_, i) => i !== idx);
        const avgWinProb = otherVariants.reduce((sum, other) => {
          return sum + calculateWinProbability(
            { clicks: variant.clicks, conversions: variant.conversions },
            { clicks: other.clicks, conversions: other.conversions }
          );
        }, 0) / otherVariants.length;

        return {
          id: variant.id,
          name: variant.name,
          winProbability: avgWinProb,
        };
      });

      const sorted = winProbs.sort((a, b) => b.winProbability - a.winProbability);
      const topWinProb = sorted[0].winProbability;

      let recommendation: string;
      let winner: string | null = null;

      if (topWinProb >= 0.85) {
        winner = sorted[0].id;
        recommendation = `${sorted[0].name} is winning (${Math.round(topWinProb * 100)}% confident)`;
      } else if (topWinProb >= 0.70) {
        recommendation = `${sorted[0].name} looks promising — wait a bit longer`;
      } else {
        recommendation = "too close to call — need more scans";
      }

      return {
        winner,
        confidence: Math.round(topWinProb * 100),
        recommendation,
        variants: sorted,
      };
    },
    enabled: variants.length > 0,
  });
};
