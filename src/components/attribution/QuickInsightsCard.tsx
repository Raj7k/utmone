import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Clock, Zap, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickInsight {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

interface QuickInsightsCardProps {
  demandCreators: number;
  churnDrivers: number;
  topChannel?: string;
  avgTimeToConvert?: string;
  isLoading?: boolean;
}

export const QuickInsightsCard = ({
  demandCreators,
  churnDrivers,
  topChannel,
  avgTimeToConvert,
  isLoading
}: QuickInsightsCardProps) => {
  const insights: QuickInsight[] = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "demand creators",
      value: demandCreators,
      variant: demandCreators > 0 ? 'success' : 'default'
    },
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      label: "needs review",
      value: churnDrivers,
      variant: churnDrivers > 0 ? 'warning' : 'default'
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: "top performer",
      value: topChannel || "—",
      variant: 'default'
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: "avg. time to convert",
      value: avgTimeToConvert || "—",
      variant: 'default'
    }
  ];

  const getVariantClasses = (variant: QuickInsight['variant']) => {
    switch (variant) {
      case 'success':
        return "text-emerald-500 bg-emerald-500/10";
      case 'warning':
        return "text-amber-500 bg-amber-500/10";
      case 'danger':
        return "text-red-500 bg-red-500/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            quick insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2 p-3 rounded-lg bg-muted/50">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-5 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          quick insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn(
                  "p-1.5 rounded-md",
                  getVariantClasses(insight.variant)
                )}>
                  {insight.icon}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-0.5">{insight.label}</p>
              <p className="text-lg font-semibold text-foreground">{insight.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
