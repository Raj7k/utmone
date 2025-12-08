import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Zap,
  ArrowRight,
  X,
  Bell,
  Target,
  Clock,
  Users,
  DollarSign,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SmartInsight } from "@/hooks/useSmartInsights";

interface SmartInsightCardProps {
  insight: SmartInsight;
  onDismiss?: (id: string) => void;
  onRemindLater?: (id: string) => void;
  compact?: boolean;
}

export const SmartInsightCard = ({ 
  insight, 
  onDismiss, 
  onRemindLater,
  compact = false 
}: SmartInsightCardProps) => {
  const navigate = useNavigate();

  const getTypeIcon = () => {
    switch (insight.type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'anomaly':
        return <Zap className="h-4 w-4" />;
      case 'optimization':
        return <Lightbulb className="h-4 w-4" />;
      case 'trend':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = () => {
    switch (insight.category) {
      case 'revenue':
        return <DollarSign className="h-3 w-3" />;
      case 'traffic':
        return <BarChart3 className="h-3 w-3" />;
      case 'campaign':
        return <Target className="h-3 w-3" />;
      case 'channel':
        return <Users className="h-3 w-3" />;
      case 'conversion':
        return <TrendingUp className="h-3 w-3" />;
      case 'timing':
        return <Clock className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTypeStyles = () => {
    switch (insight.type) {
      case 'opportunity':
        return 'border-system-green/30 bg-system-green/5';
      case 'warning':
        return 'border-system-orange/30 bg-system-orange/5';
      case 'anomaly':
        return 'border-system-red/30 bg-system-red/5';
      case 'optimization':
        return 'border-white/20 bg-white/5';
      case 'trend':
        return 'border-white/15 bg-white/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconStyles = () => {
    switch (insight.type) {
      case 'opportunity':
        return 'text-system-green bg-system-green/10';
      case 'warning':
        return 'text-system-orange bg-system-orange/10';
      case 'anomaly':
        return 'text-system-red bg-system-red/10';
      case 'optimization':
        return 'text-white bg-white/10';
      case 'trend':
        return 'text-white/80 bg-white/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getSeverityBadge = () => {
    const styles = {
      critical: 'bg-system-red/10 text-system-red border-system-red/20',
      high: 'bg-system-orange/10 text-system-orange border-system-orange/20',
      medium: 'bg-white/10 text-white border-white/20',
      low: 'bg-muted text-muted-foreground border-border',
    };

    return (
      <span className={cn(
        "text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase",
        styles[insight.severity]
      )}>
        {insight.severity}
      </span>
    );
  };

  const handleAction = () => {
    navigate(insight.actionUrl);
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md",
          getTypeStyles()
        )}
        onClick={handleAction}
      >
        <div className={cn("p-1.5 rounded-lg", getIconStyles())}>
          {getTypeIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{insight.title}</p>
          <p className="text-xs text-muted-foreground truncate">{insight.description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </div>
    );
  }

  return (
    <Card className={cn("transition-all hover:shadow-md", getTypeStyles())}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-xl flex-shrink-0", getIconStyles())}>
            {getTypeIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              {getSeverityBadge()}
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {insight.description}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getCategoryIcon()}
                  <span className="capitalize">{insight.category}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>Impact: {insight.impactScore}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <Button 
                size="sm" 
                variant="default"
                className="h-7 text-xs"
                onClick={handleAction}
              >
                {insight.actionLabel}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
              
              {onRemindLater && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemindLater(insight.id);
                  }}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  Later
                </Button>
              )}
              
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(insight.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
