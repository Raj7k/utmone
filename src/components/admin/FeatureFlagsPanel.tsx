import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Zap, Shield, Flag as FlagIcon, Clock } from "lucide-react";
import { useFeatureFlags, FeatureFlag } from "@/hooks/useFeatureFlags";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function FeatureFlagsPanel() {
  const { flags, isLoading, toggleFlag, isToggling } = useFeatureFlags();
  const [pendingToggle, setPendingToggle] = useState<{ flag: FeatureFlag; enabled: boolean } | null>(null);

  const flagsByCategory = {
    performance: flags?.filter(f => f.category === 'performance') || [],
    security: flags?.filter(f => f.category === 'security') || [],
    maintenance: flags?.filter(f => f.category === 'maintenance') || [],
  };

  const isDangerousFlag = (flagKey: string) => {
    return ['maintenance_mode', 'enable_cache', 'enable_batch_processing'].includes(flagKey);
  };

  const handleToggleClick = (flag: FeatureFlag, enabled: boolean) => {
    if (isDangerousFlag(flag.feature_key)) {
      setPendingToggle({ flag, enabled });
    } else {
      toggleFlag({ flagKey: flag.feature_key, enabled });
    }
  };

  const confirmToggle = () => {
    if (pendingToggle) {
      toggleFlag({ 
        flagKey: pendingToggle.flag.feature_key, 
        enabled: pendingToggle.enabled 
      });
      setPendingToggle(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-secondary-label">loading flags...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Cache Status Card */}
      <Card className="bg-muted/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>cache status:</span>
              <Badge variant="secondary">auto-refresh every 30s</Badge>
            </div>
            <div className="text-secondary-label">
              changes propagate within 60 seconds
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Flags */}
      {flagsByCategory.performance.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <CardTitle>performance flags</CardTitle>
            </div>
            <CardDescription>
              runtime controls for latency, caching, and database optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flagsByCategory.performance.map(flag => (
              <FlagRow 
                key={flag.id} 
                flag={flag} 
                onToggle={handleToggleClick}
                isToggling={isToggling}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Security Flags */}
      {flagsByCategory.security.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>security flags</CardTitle>
            </div>
            <CardDescription>
              controls for security features and fraud prevention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flagsByCategory.security.map(flag => (
              <FlagRow 
                key={flag.id} 
                flag={flag} 
                onToggle={handleToggleClick}
                isToggling={isToggling}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Maintenance Flags */}
      {flagsByCategory.maintenance.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <CardTitle>emergency flags</CardTitle>
            </div>
            <CardDescription>
              ⚠️ dangerous flags that affect system availability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {flagsByCategory.maintenance.map(flag => (
              <FlagRow 
                key={flag.id} 
                flag={flag} 
                onToggle={handleToggleClick}
                isToggling={isToggling}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!pendingToggle} onOpenChange={(open) => !open && setPendingToggle(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingToggle?.enabled ? 'enable' : 'disable'} {pendingToggle?.flag.feature_key}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingToggle?.flag.feature_key === 'maintenance_mode' 
                ? "This will serve a maintenance page instead of redirects. All short links will be unavailable to end users."
                : pendingToggle?.flag.feature_key === 'enable_cache'
                ? "Disabling cache will increase redirect latency by ~250ms. This is a critical performance flag."
                : pendingToggle?.flag.feature_key === 'enable_batch_processing'
                ? "Disabling batch processing will increase database write load by 100x. Only disable if necessary."
                : "This flag has critical impact on system performance. Confirm this change."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle}>
              confirm change
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface FlagRowProps {
  flag: FeatureFlag;
  onToggle: (flag: FeatureFlag, enabled: boolean) => void;
  isToggling: boolean;
}

function FlagRow({ flag, onToggle, isToggling }: FlagRowProps) {
  const impact = (flag.metadata as any)?.impact || 'unknown';
  const latencyCost = (flag.metadata as any)?.latency_cost_ms;
  const latencyReduction = (flag.metadata as any)?.latency_reduction_ms;
  const writeReduction = (flag.metadata as any)?.write_reduction;
  const isDangerous = flag.category === 'maintenance';
  const navigate = useNavigate();
  
  const getImpactVariant = (impact: string) => {
    if (impact === 'critical') return 'destructive';
    if (impact === 'high') return 'default';
    return 'secondary';
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border-2 transition-colors",
      isDangerous && "border-red-200 bg-red-50/50 dark:bg-red-950/20"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate(`/admin/flags/${flag.feature_key}`)}
              className="text-sm font-mono bg-muted px-2 py-0.5 rounded hover:bg-muted/80 transition-colors cursor-pointer"
            >
              {flag.feature_key}
            </button>
            <Badge variant={getImpactVariant(impact)}>
              {impact.toUpperCase()}
            </Badge>
            {isDangerous && <AlertTriangle className="w-4 h-4 text-red-600" />}
          </div>
          
          <p className="text-sm text-secondary-label">
            {flag.description}
          </p>
          
          {/* Metadata display */}
          <div className="flex items-center gap-4 text-xs text-secondary-label flex-wrap">
            {latencyReduction && (
              <span>saves: {latencyReduction}ms</span>
            )}
            {latencyCost && (
              <span>costs: +{latencyCost}ms</span>
            )}
            {writeReduction && (
              <span>writes: {writeReduction}</span>
            )}
          </div>
          
          {/* Last modified */}
          {flag.last_modified_at && (
            <p className="text-xs text-secondary-label">
              modified {formatDistanceToNow(new Date(flag.last_modified_at))} ago
            </p>
          )}
        </div>
        
        <Switch
          checked={flag.is_enabled}
          onCheckedChange={(checked) => onToggle(flag, checked)}
          disabled={isToggling}
        />
      </div>
    </div>
  );
}
