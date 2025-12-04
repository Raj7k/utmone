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
    <Card 
      className="rounded-xl overflow-hidden"
      style={isWinner ? { 
        background: 'rgba(24,24,27,0.4)', 
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.2)' 
      } : {
        background: 'rgba(24,24,27,0.4)', 
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg" style={{ color: 'rgba(255,255,255,0.9)' }}>Variant {metrics.variant_id}</CardTitle>
          {isWinner && <Badge variant="default">Winner</Badge>}
        </div>
        <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{variant.headlineLine1} {variant.headlineLine2}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Sessions</p>
            <p className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{metrics.sessions}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>CTA Clicks</p>
            <p className="text-2xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{metrics.cta_clicks}</p>
          </div>
        </div>

        <div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Click-Through Rate</p>
          <p className="text-3xl font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{metrics.ctr}%</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Avg Time</p>
            <p className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{metrics.avg_time_on_page}s</p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Avg Scroll</p>
            <p className="text-lg font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{metrics.avg_scroll_depth}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
