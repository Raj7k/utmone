import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  RefreshCw,
  Brain,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useSmartInsights } from "@/hooks/useSmartInsights";
import { SmartInsightCard } from "./SmartInsightCard";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface AICommandCenterProps {
  workspaceId: string;
  // Legacy props for backward compatibility
  insights?: string[];
  topChannel?: string;
  topChannelClicks?: number;
  peakDay?: string;
  peakDayClicks?: number;
  avgClicksPerDay?: number;
}

export const AICommandCenter = ({
  workspaceId,
  insights: legacyInsights = [],
  topChannel,
  topChannelClicks,
  peakDay,
  peakDayClicks,
  avgClicksPerDay
}: AICommandCenterProps) => {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const { data, isLoading, isFetching, error } = useSmartInsights({
    workspaceId,
    scope: 'workspace'
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['smart-insights', workspaceId] });
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleRemindLater = (id: string) => {
    // For now, just dismiss - could add snooze functionality later
    setDismissedIds(prev => new Set([...prev, id]));
  };

  // Filter out dismissed insights
  const visibleInsights = data?.insights.filter(i => !dismissedIds.has(i.id)) || [];
  const displayedInsights = expanded ? visibleInsights : visibleInsights.slice(0, 3);
  const hasMore = visibleInsights.length > 3;

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 lowercase">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            generating insights…
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error || visibleInsights.length === 0) {
    return (
      <Card className="rounded-2xl border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 lowercase">
              <Sparkles className="h-5 w-5 text-primary" />
              ai command center
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
              className="h-8 px-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              more insights will appear as you gather more data
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              create links and drive traffic to see ai-powered recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 lowercase">
              <Brain className="h-5 w-5 text-primary" />
              ai command center
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {visibleInsights.length} actionable insight{visibleInsights.length !== 1 ? 's' : ''} • click to take action
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-8 px-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedInsights.map((insight) => (
          <SmartInsightCard
            key={insight.id}
            insight={insight}
            onDismiss={handleDismiss}
            onRemindLater={handleRemindLater}
          />
        ))}
        
        {hasMore && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                View {visibleInsights.length - 3} more insight{visibleInsights.length - 3 !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
