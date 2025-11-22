import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Activity, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface FlagDetailedAnalyticsProps {
  flagKey: string;
}

interface MetricsSnapshot {
  id: string;
  timestamp: string;
  flag_enabled: boolean;
  latency_p95_before: number;
  latency_p95_after: number;
  latency_impact: number;
  error_rate_before: number;
  error_rate_after: number;
  error_rate_impact: number;
  cache_hit_rate_before: number;
  cache_hit_rate_after: number;
  cache_hit_rate_impact: number;
  system_load: string;
  traffic_pattern: string;
}

export function FlagDetailedAnalytics({ flagKey }: FlagDetailedAnalyticsProps) {
  const { data: snapshots, isLoading } = useQuery({
    queryKey: ['flag-metrics-history', flagKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metrics_snapshots')
        .select('*')
        .eq('flag_key', flagKey)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as MetricsSnapshot[];
    },
    refetchInterval: 30000,
  });

  const calculateAverageImpact = (metric: 'latency_impact' | 'error_rate_impact' | 'cache_hit_rate_impact') => {
    if (!snapshots || snapshots.length === 0) return 0;
    
    const validSnapshots = snapshots.filter(s => s[metric] !== null);
    if (validSnapshots.length === 0) return 0;
    
    const sum = validSnapshots.reduce((acc, s) => acc + (s[metric] || 0), 0);
    return Math.round((sum / validSnapshots.length) * 10) / 10;
  };

  const getImpactTrend = (metric: 'latency_impact' | 'error_rate_impact' | 'cache_hit_rate_impact') => {
    if (!snapshots || snapshots.length < 2) return 'stable';
    
    const recent = snapshots.slice(0, 5);
    const older = snapshots.slice(5, 10);
    
    const recentAvg = recent.reduce((acc, s) => acc + (s[metric] || 0), 0) / recent.length;
    const olderAvg = older.reduce((acc, s) => acc + (s[metric] || 0), 0) / older.length;
    
    if (Math.abs(recentAvg - olderAvg) < 5) return 'stable';
    
    // For latency and error rate, lower is better
    if (metric === 'latency_impact' || metric === 'error_rate_impact') {
      return recentAvg < olderAvg ? 'improving' : 'degrading';
    }
    
    // For cache hit rate, higher is better
    return recentAvg > olderAvg ? 'improving' : 'degrading';
  };

  const detectAnomalies = () => {
    if (!snapshots || snapshots.length < 5) return [];
    
    const anomalies: { timestamp: string; reason: string; severity: 'high' | 'medium' | 'low' }[] = [];
    
    snapshots.forEach(snapshot => {
      if (Math.abs(snapshot.latency_impact || 0) > 200) {
        anomalies.push({
          timestamp: snapshot.timestamp,
          reason: `Extreme latency impact: ${snapshot.latency_impact}ms`,
          severity: 'high'
        });
      }
      
      if (Math.abs(snapshot.error_rate_impact || 0) > 1.0) {
        anomalies.push({
          timestamp: snapshot.timestamp,
          reason: `Significant error rate change: ${snapshot.error_rate_impact}%`,
          severity: 'high'
        });
      }
      
      if (snapshot.system_load === 'high' && Math.abs(snapshot.latency_impact || 0) > 50) {
        anomalies.push({
          timestamp: snapshot.timestamp,
          reason: 'High latency impact during peak load',
          severity: 'medium'
        });
      }
    });
    
    return anomalies.slice(0, 5);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!snapshots || snapshots.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">no historical data available for this flag</p>
          <p className="text-xs text-muted-foreground mt-2">
            toggle the flag to start collecting metrics
          </p>
        </CardContent>
      </Card>
    );
  }

  const anomalies = detectAnomalies();

  return (
    <div className="space-y-6">
      {/* Impact Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>avg latency impact</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className={cn(
                "text-3xl",
                calculateAverageImpact('latency_impact') < 0 ? "text-green-600" : "text-red-600"
              )}>
                {calculateAverageImpact('latency_impact') > 0 ? '+' : ''}{calculateAverageImpact('latency_impact')}ms
              </CardTitle>
              {getImpactTrend('latency_impact') === 'improving' && (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
              {getImpactTrend('latency_impact') === 'degrading' && (
                <TrendingUp className="w-5 h-5 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={getImpactTrend('latency_impact') === 'improving' ? 'default' : 'secondary'}>
              {getImpactTrend('latency_impact')}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>avg error rate impact</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className={cn(
                "text-3xl",
                calculateAverageImpact('error_rate_impact') < 0 ? "text-green-600" : "text-red-600"
              )}>
                {calculateAverageImpact('error_rate_impact') > 0 ? '+' : ''}{calculateAverageImpact('error_rate_impact')}%
              </CardTitle>
              {getImpactTrend('error_rate_impact') === 'improving' && (
                <TrendingDown className="w-5 h-5 text-green-600" />
              )}
              {getImpactTrend('error_rate_impact') === 'degrading' && (
                <TrendingUp className="w-5 h-5 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={getImpactTrend('error_rate_impact') === 'improving' ? 'default' : 'secondary'}>
              {getImpactTrend('error_rate_impact')}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>avg cache impact</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className={cn(
                "text-3xl",
                calculateAverageImpact('cache_hit_rate_impact') > 0 ? "text-green-600" : "text-red-600"
              )}>
                {calculateAverageImpact('cache_hit_rate_impact') > 0 ? '+' : ''}{calculateAverageImpact('cache_hit_rate_impact')}%
              </CardTitle>
              {getImpactTrend('cache_hit_rate_impact') === 'improving' && (
                <TrendingUp className="w-5 h-5 text-green-600" />
              )}
              {getImpactTrend('cache_hit_rate_impact') === 'degrading' && (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant={getImpactTrend('cache_hit_rate_impact') === 'improving' ? 'default' : 'secondary'}>
              {getImpactTrend('cache_hit_rate_impact')}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <CardTitle>detected anomalies</CardTitle>
            </div>
            <CardDescription>
              unusual patterns or significant impacts detected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {anomalies.map((anomaly, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-red-200 bg-red-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{anomaly.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(anomaly.timestamp))} ago
                      </p>
                    </div>
                    <Badge variant="destructive">{anomaly.severity}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Toggle History */}
      <Card>
        <CardHeader>
          <CardTitle>toggle history</CardTitle>
          <CardDescription>
            last {snapshots.length} flag changes and measured impacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {snapshots.slice(0, 10).map((snapshot) => (
              <div key={snapshot.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={snapshot.flag_enabled ? 'default' : 'secondary'}>
                      {snapshot.flag_enabled ? 'enabled' : 'disabled'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(snapshot.timestamp))} ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{snapshot.system_load} load</Badge>
                    <Badge variant="outline">{snapshot.traffic_pattern}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">latency impact</p>
                    <p className={cn(
                      "font-medium",
                      (snapshot.latency_impact || 0) < 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {(snapshot.latency_impact || 0) > 0 ? '+' : ''}{snapshot.latency_impact || 'N/A'}ms
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">error rate impact</p>
                    <p className={cn(
                      "font-medium",
                      (snapshot.error_rate_impact || 0) < 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {(snapshot.error_rate_impact || 0) > 0 ? '+' : ''}{snapshot.error_rate_impact || 'N/A'}%
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">cache impact</p>
                    <p className={cn(
                      "font-medium",
                      (snapshot.cache_hit_rate_impact || 0) > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {(snapshot.cache_hit_rate_impact || 0) > 0 ? '+' : ''}{snapshot.cache_hit_rate_impact || 'N/A'}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
