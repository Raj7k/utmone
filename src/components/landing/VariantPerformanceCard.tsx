import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HERO_VARIANTS } from '@/lib/heroVariants';
import { VariantMetrics } from '@/hooks/analytics';

interface VariantPerformanceCardProps {
  metrics: VariantMetrics;
  isWinner: boolean;
}

export const VariantPerformanceCard = ({ metrics, isWinner }: VariantPerformanceCardProps) => {
  const variant = HERO_VARIANTS[metrics.variant_id];

  return (
    <Card 
      className={`rounded-xl overflow-hidden bg-zinc-900/40 backdrop-blur-xl ${
        isWinner ? 'border-white/20' : 'border-white/[0.08]'
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-white/90">Variant {metrics.variant_id}</CardTitle>
          {isWinner && <Badge variant="default">Winner</Badge>}
        </div>
        <p className="text-sm mt-2 text-white/50">{variant.headlineLine1} {variant.headlineLine2}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/50">Sessions</p>
            <p className="text-2xl font-bold text-white/90">{metrics.sessions}</p>
          </div>
          <div>
            <p className="text-sm text-white/50">CTA Clicks</p>
            <p className="text-2xl font-bold text-white/90">{metrics.cta_clicks}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-white/50">Click-Through Rate</p>
          <p className="text-3xl font-bold text-white/90">{metrics.ctr}%</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
          <div>
            <p className="text-xs text-white/50">Avg Time</p>
            <p className="text-lg font-semibold text-white/90">{metrics.avg_time_on_page}s</p>
          </div>
          <div>
            <p className="text-xs text-white/50">Avg Scroll</p>
            <p className="text-lg font-semibold text-white/90">{metrics.avg_scroll_depth}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
