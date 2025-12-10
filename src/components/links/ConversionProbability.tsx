import { RareEventEstimator } from "@/components/analytics/RareEventEstimator";

interface ConversionProbabilityProps {
  linkId: string;
}

export function ConversionProbability({ linkId }: ConversionProbabilityProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-display font-semibold">conversion estimate</h3>
        <p className="text-sm text-muted-foreground">
          statistical estimate of how many visitors are likely to convert based on your historical data
        </p>
      </div>

      <RareEventEstimator linkId={linkId} title="conversion probability" />

      <div className="p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">how this works:</span> we use cross-entropy methods 
          to estimate low-probability conversion events. the confidence interval shows the range where 
          your true conversion rate is likely to fall 95% of the time.
        </p>
      </div>
    </div>
  );
}
