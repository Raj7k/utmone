import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HERO_VARIANTS } from '@/lib/heroVariants';
import { VariantMetrics } from '@/hooks/useLandingAnalytics';

interface VariantPerformanceCardProps {
  metrics: VariantMetrics;
  isWinner: boolean;
}

export const VariantPerformanceCard = ({ metrics, isWinner }: VariantPerformanceCardProps) => {
  const variant = HERO_VARIANTS[metrics.variant_id];

  return (
    <Card className={isWinner ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">Variant {metrics.variant_id}</CardTitle>
          {isWinner && <Badge variant="default">Winner</Badge>}
        </div>
        <p className="text-sm text-muted-foreground mt-2">{variant.headlineLine1} {variant.headlineLine2}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Sessions</p>
            <p className="text-2xl font-bold">{metrics.sessions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">CTA Clicks</p>
            <p className="text-2xl font-bold">{metrics.cta_clicks}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Click-Through Rate</p>
          <p className="text-3xl font-bold text-primary">{metrics.ctr}%</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Avg Time</p>
            <p className="text-lg font-semibold">{metrics.avg_time_on_page}s</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Scroll</p>
            <p className="text-lg font-semibold">{metrics.avg_scroll_depth}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
