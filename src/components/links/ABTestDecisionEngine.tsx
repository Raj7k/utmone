import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp } from "lucide-react";
import { useABTestDecision } from "@/hooks/useABTestDecision";
import { Skeleton } from "@/components/ui/skeleton";

interface Variant {
  id: string;
  name: string;
  clicks: number;
  conversions: number;
}

interface ABTestDecisionEngineProps {
  variants: Variant[];
}

export const ABTestDecisionEngine = ({ variants }: ABTestDecisionEngineProps) => {
  const { data, isLoading } = useABTestDecision(variants);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">variant comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || variants.length < 2) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
          variant comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/30 rounded-lg">
          <p className="text-sm font-medium text-label">{data.recommendation}</p>
          {data.winner && (
            <p className="text-xs text-tertiary-label mt-1">
              ready to pick a winner ✓
            </p>
          )}
        </div>

        <div className="space-y-2">
          {data.variants.map((variant, idx) => (
            <div
              key={variant.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
            >
              <div className="flex items-center gap-2">
                {idx === 0 && data.confidence >= 85 && (
                  <Trophy className="h-4 w-4 text-system-orange" />
                )}
                <span className="text-sm font-medium text-label">{variant.name}</span>
              </div>
              <Badge variant={idx === 0 ? "default" : "outline"}>
                {Math.round(variant.winProbability * 100)}% win probability
              </Badge>
            </div>
          ))}
        </div>

        <p className="text-xs text-tertiary-label">
          clean track analyzed conversion patterns to recommend the best variant
        </p>
      </CardContent>
    </Card>
  );
};
