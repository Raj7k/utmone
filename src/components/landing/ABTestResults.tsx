import { VariantMetrics } from '@/hooks/analytics';
import { VariantPerformanceCard } from './VariantPerformanceCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ABTestResultsProps {
  metrics: VariantMetrics[];
}

export const ABTestResults = ({ metrics }: ABTestResultsProps) => {
  const winnerVariant = metrics.reduce((prev, current) => 
    current.ctr > prev.ctr ? current : prev
  );

  const handleExport = () => {
    const csvContent = [
      ['Variant', 'Sessions', 'CTA Clicks', 'CTR', 'Avg Time', 'Avg Scroll'],
      ...metrics.map(m => [
        m.variant_id,
        m.sessions,
        m.cta_clicks,
        m.ctr,
        m.avg_time_on_page,
        m.avg_scroll_depth
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalSessions = metrics.reduce((sum, m) => sum + m.sessions, 0);
  const totalClicks = metrics.reduce((sum, m) => sum + m.cta_clicks, 0);
  const overallCTR = totalSessions > 0 ? ((totalClicks / totalSessions) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">A/B Test Results</h2>
          <p className="text-white-50">
            Total Sessions: {totalSessions} | Overall CTR: {overallCTR}%
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(metric => (
          <VariantPerformanceCard
            key={metric.variant_id}
            metrics={metric}
            isWinner={metric.variant_id === winnerVariant.variant_id}
          />
        ))}
      </div>
    </div>
  );
};
