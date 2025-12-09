import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  RefreshCw,
  Brain,
  Target,
  ChevronDown,
  ChevronUp,
  Calendar
} from "lucide-react";
import { useSmartInsights, TimeRange } from "@/hooks/useSmartInsights";
import { SmartInsightCard } from "./SmartInsightCard";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [timeRange, setTimeRange] = useState<TimeRange>('auto');

  const { data, isLoading, isFetching, error } = useSmartInsights({
    workspaceId,
    scope: 'workspace',
    timeRange
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

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
  };

  // Filter out dismissed insights
  const visibleInsights = data?.insights.filter(i => !dismissedIds.has(i.id)) || [];
  const displayedInsights = expanded ? visibleInsights : visibleInsights.slice(0, 3);
  const hasMore = visibleInsights.length > 3;

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-border bg-gradient-to-br from-muted/30 via-transparent to-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 lowercase">
            <Brain className="h-5 w-5 text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-pulse" />
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
      <Card className="rounded-2xl border-border bg-gradient-to-br from-muted/30 to-muted/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 lowercase">
              <Sparkles className="h-5 w-5 text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              ai command center
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="14d">14 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Target className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground font-medium">
              not enough data yet
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs">
              insights appear after more link activity. keep sharing to unlock ai-powered recommendations.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                10+ clicks for timing insights
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                20+ clicks for geo insights
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border bg-gradient-to-br from-muted/30 via-transparent to-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 lowercase">
              <Brain className="h-5 w-5 text-foreground drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              ai command center
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {visibleInsights.length} actionable insight{visibleInsights.length !== 1 ? 's' : ''} 
              {data?.analysisPeriod && ` • ${data.analysisPeriod}`}
              {data?.clicksAnalyzed !== undefined && ` • ${data.clicksAnalyzed.toLocaleString()} clicks analyzed`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="7d">7 days</SelectItem>
                <SelectItem value="14d">14 days</SelectItem>
                <SelectItem value="30d">30 days</SelectItem>
                <SelectItem value="90d">90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
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
