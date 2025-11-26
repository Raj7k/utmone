import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Activity, Target } from 'lucide-react';
import { PerformanceCharts } from './PerformanceCharts';

interface Version {
  id: string;
  version: number;
  slug: string;
  total_clicks: number;
  unique_clicks?: number;
  ctr?: number;
  conversion_rate?: number;
}

interface VersionAnalyticsProps {
  versions: Version[];
}

export const VersionAnalytics = ({ versions }: VersionAnalyticsProps) => {
  const totalClicks = versions.reduce((sum, v) => sum + v.total_clicks, 0);
  const avgClicks = totalClicks / versions.length;
  
  const bestPerformer = versions.reduce((best, current) => 
    (current.total_clicks > best.total_clicks) ? current : best
  , versions[0]);
  
  const worstPerformer = versions.reduce((worst, current) => 
    (current.total_clicks < worst.total_clicks) ? current : worst
  , versions[0]);

  const performanceGap = bestPerformer.total_clicks - worstPerformer.total_clicks;
  const gapPercentage = worstPerformer.total_clicks > 0 
    ? ((performanceGap / worstPerformer.total_clicks) * 100).toFixed(0)
    : '0';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-normal text-secondary-label flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground mb-1">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-secondary-label">clicks across {versions.length} versions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-normal text-secondary-label flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-3xl font-bold text-foreground">{bestPerformer.total_clicks.toLocaleString()}</p>
              <Badge variant="outline" className="text-xs">v{bestPerformer.version}</Badge>
            </div>
            <p className="text-xs text-secondary-label font-mono">/{bestPerformer.slug}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-normal text-secondary-label flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-500" />
              Average Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground mb-1">{Math.round(avgClicks).toLocaleString()}</p>
            <p className="text-xs text-secondary-label">clicks per version</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison */}
      <Card className="bg-gray-900/30 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Version Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {versions
              .sort((a, b) => b.total_clicks - a.total_clicks)
              .map((version, idx) => {
                const percentage = totalClicks > 0 ? (version.total_clicks / totalClicks) * 100 : 0;
                const isBest = version.id === bestPerformer.id;
                const isWorst = version.id === worstPerformer.id;
                
                return (
                  <div key={version.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={isBest ? 'default' : 'outline'} className="text-xs font-mono">
                          v{version.version}
                        </Badge>
                        <span className="text-sm text-secondary-label font-mono">/{version.slug}</span>
                        {isBest && (
                          <Badge className="text-xs bg-green-500/20 text-green-500 border-green-500/30">
                            Best
                          </Badge>
                        )}
                        {isWorst && versions.length > 1 && (
                          <Badge variant="outline" className="text-xs">
                            Needs Work
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{version.total_clicks.toLocaleString()}</p>
                        <p className="text-xs text-secondary-label">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isBest ? 'bg-gradient-to-r from-green-500 to-green-400' :
                          isWorst ? 'bg-gray-600' :
                          'bg-gradient-to-r from-primary to-primary/70'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Additional Metrics */}
                    {version.ctr !== undefined && version.conversion_rate !== undefined && (
                      <div className="flex items-center gap-4 text-xs text-secondary-label mt-1">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{version.ctr.toFixed(1)}% CTR</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>{version.conversion_rate.toFixed(1)}% conversion</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Performance Gap Insight */}
          {versions.length > 1 && performanceGap > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Performance Insight</p>
                  <p className="text-xs text-secondary-label">
                    Your best version (v{bestPerformer.version}) outperforms the weakest by{' '}
                    <span className="text-foreground font-semibold">{performanceGap.toLocaleString()} clicks</span>
                    {' '}({gapPercentage}% improvement). Consider archiving underperforming versions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <PerformanceCharts versions={versions} />
    </div>
  );
};
