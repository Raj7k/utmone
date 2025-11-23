import { AlertTriangle, TrendingUp, Globe, ExternalLink, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Anomaly {
  id: string;
  anomaly_type: 'traffic_spike' | 'new_country' | 'ctr_drop' | 'new_referrer';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  baseline_value?: number;
  current_value?: number;
  change_percent?: number;
  link_id?: string;
  is_dismissed: boolean;
  detected_at: string;
}

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

  const getSeverityColor = () => {
    switch (anomaly.severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
    }
  };

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
    <Card className={`p-4 ${getSeverityColor()} border-0`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1">{anomaly.title}</h3>
          <p className="text-sm opacity-90 mb-3">{anomaly.description}</p>
          
          {anomaly.change_percent && (
            <div className="text-xs font-medium mb-3">
              {anomaly.baseline_value && (
                <span>baseline: {Math.round(anomaly.baseline_value)} → </span>
              )}
              current: {Math.round(anomaly.current_value || 0)}
              <span className="ml-2">({anomaly.change_percent > 0 ? '+' : ''}{anomaly.change_percent}%)</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleViewDetails}
              className="h-8 text-xs"
            >
              view details
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleDismiss}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              dismiss
            </Button>
          </div>
        </div>
        
        <div className="text-xs opacity-60">
          {new Date(anomaly.detected_at).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
}
