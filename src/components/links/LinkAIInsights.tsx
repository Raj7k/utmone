import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSmartInsights } from "@/hooks/useSmartInsights";
import { SmartInsightCard } from "@/components/analytics/SmartInsightCard";
import { Sparkles, RefreshCw, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { preserveAcronyms as p } from "@/utils/textFormatter";

interface LinkAIInsightsProps {
  linkId: string;
  workspaceId: string;
}

export const LinkAIInsights = ({ linkId, workspaceId }: LinkAIInsightsProps) => {
  const queryClient = useQueryClient();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const { data, isLoading, isFetching } = useSmartInsights({
    workspaceId,
    linkId,
    scope: 'link'
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['smart-insights', workspaceId, linkId, 'link'] });
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const visibleInsights = data?.insights.filter(i => !dismissedIds.has(i.id)) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            {p("AI")} insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-primary" />
            {p("AI")} insights for this link
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-7 px-2"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          actionable recommendations based on this link's performance
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleInsights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Sparkles className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground font-medium">
              not enough data yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              insights unlock after more clicks on this link
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                10+ clicks needed
              </span>
            </div>
          </div>
        ) : (
          visibleInsights.slice(0, 4).map((insight) => (
            <SmartInsightCard
              key={insight.id}
              insight={insight}
              onDismiss={handleDismiss}
              compact
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
