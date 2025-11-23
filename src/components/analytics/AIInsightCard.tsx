import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface AIInsightCardProps {
  workspaceId: string;
}

export const AIInsightCard = ({ workspaceId }: AIInsightCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: insight, isLoading } = useQuery({
    queryKey: ['ai-insights', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-analytics-summary', {
        body: { workspace_id: workspaceId }
      });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      // Delete cached insights to force refresh
      await supabase
        .from('ai_insights')
        .delete()
        .eq('workspace_id', workspaceId)
        .eq('insight_type', 'analytics_summary');

      const { data, error } = await supabase.functions.invoke('generate-analytics-summary', {
        body: { workspace_id: workspaceId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights', workspaceId] });
      toast({
        title: "insights refreshed",
        description: "your ai-powered insights have been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "refresh failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            ai insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">generating insights…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            ai insights
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            aria-label="refresh ai insights"
          >
            <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          powered by lovable ai
          {insight?.cached && ' • cached'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {insight?.summary || 'no insights available yet. create some links to get started.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
