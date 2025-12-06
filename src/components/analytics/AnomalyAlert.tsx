import { AlertTriangle, TrendingUp, Globe, ExternalLink, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Anomaly = Database['public']['Tables']['analytics_anomalies']['Row'];

interface AnomalyAlertProps {
  anomaly: Anomaly;
  onDismiss?: () => void;
}

export function AnomalyAlert({ anomaly, onDismiss }: AnomalyAlertProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (anomaly.anomaly_type) {
      case 'traffic_spike': return <TrendingUp className="h-5 w-5" />;
      case 'new_country': return <Globe className="h-5 w-5" />;
      case 'ctr_drop': return <AlertTriangle className="h-5 w-5" />;
      case 'new_referrer': return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getSeverityStyles = () => {
    switch (anomaly.severity) {
      case 'critical': 
        return {
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-500 animate-pulse',
          text: 'text-red-600 dark:text-red-400',
          icon: '🔴'
        };
      case 'high': 
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/20',
          border: 'border-orange-500',
          text: 'text-orange-600 dark:text-orange-400',
          icon: '🟠'
        };
      case 'medium': 
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/20',
          border: 'border-yellow-500',
          text: 'text-yellow-600 dark:text-yellow-400',
          icon: '🟡'
        };
      case 'low': 
        return {
          bg: 'bg-primary/5 dark:bg-primary/10',
          border: 'border-primary',
          text: 'text-primary',
          icon: '🔵'
        };
      default:
        return {
          bg: 'bg-muted/50',
          border: 'border-border',
          text: 'text-foreground',
          icon: '⚪'
        };
    }
  };

  const severityStyles = getSeverityStyles();

  const handleDismiss = async () => {
    try {
      const { error } = await supabase
        .from('analytics_anomalies')
        .update({ is_dismissed: true })
        .eq('id', anomaly.id);

      if (error) throw error;

      toast.success('anomaly dismissed');
      onDismiss?.();
    } catch (error) {
      console.error('Error dismissing anomaly:', error);
      toast.error('failed to dismiss anomaly');
    }
  };

  const handleViewDetails = () => {
    if (anomaly.link_id) {
      navigate(`/links/${anomaly.link_id}`);
    } else {
      navigate('/analytics');
    }
  };

  return (
    <Card className={`p-5 ${severityStyles.bg} border-2 ${severityStyles.border}`}>
      <div className="flex items-start gap-4">
        <div className="text-2xl mt-0.5">{severityStyles.icon}</div>
        <div className="flex-1 min-w-0 space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getIcon()}
              <h3 className={`font-display font-semibold text-base ${severityStyles.text}`}>
                {anomaly.title}
              </h3>
            </div>
            <p className="text-sm text-secondary-label">{anomaly.description}</p>
          </div>

          {/* What Happened Section */}
          {anomaly.change_percent && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-label">What Happened</p>
              <div className="text-sm text-foreground">
                {anomaly.baseline_value && (
                  <span>Baseline: {Math.round(anomaly.baseline_value)} → </span>
                )}
                Current: {Math.round(anomaly.current_value || 0)}
                <span className={`ml-2 font-semibold ${anomaly.change_percent > 0 ? 'text-system-green' : 'text-destructive'}`}>
                  ({anomaly.change_percent > 0 ? '+' : ''}{anomaly.change_percent}%)
                </span>
              </div>
            </div>
          )}

          {/* Why It Matters */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-label">Why It Matters</p>
            <p className="text-sm text-secondary-label">
              {anomaly.severity === 'critical' && 'Immediate action required to prevent impact on campaign performance.'}
              {anomaly.severity === 'high' && 'Significant deviation detected that may affect your metrics.'}
              {anomaly.severity === 'medium' && 'Notable change in pattern worth investigating.'}
              {anomaly.severity === 'low' && 'Minor fluctuation for your awareness.'}
            </p>
          </div>

          {/* What To Do */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-label">What To Do</p>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="default"
                onClick={handleViewDetails}
                className="h-9"
              >
                Investigate
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleDismiss}
                className="h-9"
              >
                <X className="h-4 w-4 mr-1" />
                Dismiss
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                className="h-9"
              >
                Create Alert Rule
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-tertiary-label whitespace-nowrap">
          {new Date(anomaly.detected_at || anomaly.created_at).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
}
