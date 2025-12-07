import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  Lightbulb,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  type: 'opportunity' | 'alert' | 'recommendation';
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AICommandCenterProps {
  insights: string[];
  topChannel?: string;
  topChannelClicks?: number;
  peakDay?: string;
  peakDayClicks?: number;
  avgClicksPerDay?: number;
}

export const AICommandCenter = ({
  insights,
  topChannel,
  topChannelClicks,
  peakDay,
  peakDayClicks,
  avgClicksPerDay
}: AICommandCenterProps) => {
  // Generate smart insights from data
  const smartInsights: Insight[] = [];

  if (topChannel && topChannelClicks) {
    smartInsights.push({
      type: 'opportunity',
      title: `${topChannel} is driving results`,
      description: `${topChannelClicks.toLocaleString()} clicks from ${topChannel}. Consider increasing investment here.`,
      action: 'View channel details',
      priority: 'high'
    });
  }

  if (peakDay && peakDayClicks && avgClicksPerDay) {
    const improvement = ((peakDayClicks - avgClicksPerDay) / avgClicksPerDay * 100).toFixed(0);
    if (Number(improvement) > 50) {
      smartInsights.push({
        type: 'recommendation',
        title: 'Optimize posting schedule',
        description: `Your peak day saw ${improvement}% more clicks than average. Schedule key campaigns for similar timing.`,
        action: 'See timing insights',
        priority: 'medium'
      });
    }
  }

  // Add existing text insights
  insights.forEach(insight => {
    smartInsights.push({
      type: 'recommendation',
      title: 'AI Insight',
      description: insight,
      priority: 'low'
    });
  });

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getInsightStyles = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity':
        return 'bg-system-green/10 text-system-green border-system-green/20';
      case 'alert':
        return 'bg-system-orange/10 text-system-orange border-system-orange/20';
      case 'recommendation':
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (smartInsights.length === 0) {
    return (
      <Card className="rounded-2xl border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            ai command center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-secondary-label">
              more insights will appear as you gather more data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          ai command center
        </CardTitle>
        <p className="text-sm text-secondary-label">smart recommendations based on your data</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {smartInsights.slice(0, 4).map((insight, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-xl border transition-all hover:shadow-md",
              getInsightStyles(insight.type)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-background/50">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-label mb-1">
                  {insight.title}
                </h4>
                <p className="text-xs text-secondary-label line-clamp-2">
                  {insight.description}
                </p>
                {insight.action && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-7 px-0 text-xs hover:bg-transparent"
                  >
                    {insight.action}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {smartInsights.length > 4 && (
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View {smartInsights.length - 4} more insights
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
