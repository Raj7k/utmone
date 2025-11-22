import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { Flag, Zap, Shield, Wrench, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FeatureFlags() {
  const { flags, isLoading, toggleFlag, isToggling } = useFeatureFlags();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return <Zap className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'security':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'maintenance':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const maintenanceFlags = flags?.filter(f => f.category === 'maintenance');
  const criticalFlags = flags?.filter(f => 
    f.metadata?.impact === 'critical' || f.flag_key === 'maintenance_mode'
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">feature flags</h1>
        <p className="text-muted-foreground">
          runtime control for performance optimization and maintenance
        </p>
      </div>

      {/* Critical Warning */}
      {criticalFlags?.some(f => !f.is_enabled && f.flag_key !== 'maintenance_mode') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>critical features disabled</AlertTitle>
          <AlertDescription>
            one or more critical features are currently disabled. this may significantly impact performance and user experience.
          </AlertDescription>
        </Alert>
      )}

      {/* Maintenance Mode Alert */}
      {maintenanceFlags?.some(f => f.is_enabled) && (
        <Alert>
          <Wrench className="h-4 w-4" />
          <AlertTitle>maintenance mode active</AlertTitle>
          <AlertDescription>
            the system is currently in maintenance mode. all redirects are returning a 503 maintenance page.
          </AlertDescription>
        </Alert>
      )}

      {/* Feature Flags by Category */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {['performance', 'security', 'maintenance'].map(category => {
            const categoryFlags = flags?.filter(f => f.category === category);
            if (!categoryFlags || categoryFlags.length === 0) return null;

            return (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <CardTitle className="capitalize">{category} flags</CardTitle>
                  </div>
                  <CardDescription>
                    {category === 'performance' && 'toggle expensive operations during high load'}
                    {category === 'security' && 'control security features and rate limiting'}
                    {category === 'maintenance' && 'system-wide maintenance controls'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryFlags.map(flag => (
                    <div
                      key={flag.id}
                      className="flex items-start justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {flag.flag_key}
                          </code>
                          <Badge 
                            variant="outline" 
                            className={getCategoryColor(flag.category)}
                          >
                            {flag.category}
                          </Badge>
                          {flag.metadata?.impact && (
                            <Badge 
                              variant={
                                flag.metadata.impact === 'critical' ? 'destructive' :
                                flag.metadata.impact === 'high' ? 'default' : 
                                'secondary'
                              }
                            >
                              {flag.metadata.impact} impact
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {flag.description}
                        </p>
                        {flag.metadata && Object.keys(flag.metadata).length > 0 && (
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            {flag.metadata.latency_cost_ms && (
                              <span>latency cost: {flag.metadata.latency_cost_ms}ms</span>
                            )}
                            {flag.metadata.latency_reduction_ms && (
                              <span>latency reduction: {flag.metadata.latency_reduction_ms}ms</span>
                            )}
                            {flag.metadata.write_reduction && (
                              <span>write reduction: {flag.metadata.write_reduction}</span>
                            )}
                            {flag.metadata.limit && (
                              <span>rate limit: {flag.metadata.limit}/{flag.metadata.window_minutes}min</span>
                            )}
                          </div>
                        )}
                        {flag.last_modified_at && (
                          <p className="text-xs text-muted-foreground">
                            last modified: {new Date(flag.last_modified_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">
                            {flag.is_enabled ? 'enabled' : 'disabled'}
                          </p>
                          <Switch
                            checked={flag.is_enabled}
                            onCheckedChange={(checked) => {
                              if (!isToggling) {
                                toggleFlag({ flagKey: flag.flag_key, enabled: checked });
                              }
                            }}
                            disabled={isToggling}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Performance Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>performance impact summary</CardTitle>
          <CardDescription>
            estimated latency impact of current feature flag configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">total latency cost</p>
              <p className="text-2xl font-bold">
                {flags
                  ?.filter(f => f.is_enabled && f.metadata?.latency_cost_ms)
                  .reduce((sum, f) => sum + (f.metadata.latency_cost_ms || 0), 0) || 0}ms
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">enabled critical features</p>
              <p className="text-2xl font-bold text-green-600">
                {flags?.filter(f => f.is_enabled && f.metadata?.impact === 'critical').length || 0}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">disabled features</p>
              <p className="text-2xl font-bold text-red-600">
                {flags?.filter(f => !f.is_enabled).length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
