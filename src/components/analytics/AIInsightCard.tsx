import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/lib/notify";

interface AIInsightCardProps {
  workspaceId: string;
}

// Inspect an error from supabase.functions.invoke and decide whether it's a
// "AI not configured" case (our 503 + AI_UNAVAILABLE code) vs a transient
// failure. This lets us distinguish "we can't do AI at all" from "try again".
function isAiUnavailable(err: any): boolean {
  if (!err) return false;
  const msg = String(err.message || '');
  if (msg.toLowerCase().includes('ai is not configured')) return true;
  // Some Supabase clients surface the JSON body on err.context; try to parse.
  try {
    const ctx = err.context;
    if (ctx?.status === 503) return true;
    const body = ctx?.response?.body;
    if (body && typeof body === 'string' && body.includes('AI_UNAVAILABLE')) return true;
  } catch { /* noop */ }
  return false;
}

export const AIInsightCard = ({ workspaceId }: AIInsightCardProps) => {
  const queryClient = useQueryClient();

  const { data: insight, isLoading, error } = useQuery({
    queryKey: ['ai-insights', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-analytics-summary', {
        body: { workspace_id: workspaceId }
      });

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await supabaseFrom('ai_insights')
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
      notify.success("your ai-powered insights have been updated");
    },
    onError: (error: Error) => {
      if (isAiUnavailable(error)) {
        notify.error('AI is not configured on this workspace yet.');
      } else {
        notify.error(error.message);
      }
    },
  });

  if (isLoading) {
    return (
      <Card variant="glass" className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white-15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse text-white-80" />
            ai insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-white-50">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">generating insights…</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Explicit "AI not configured" state — separate from "no data yet" so the
  // user knows to enable AI instead of thinking it's a data issue.
  if (error && isAiUnavailable(error)) {
    return (
      <Card variant="glass" className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white-15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            ai insights unavailable
          </CardTitle>
          <CardDescription>
            ai features aren't configured on this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white-60 leading-relaxed">
            ask an admin to set the <code className="px-1 py-0.5 rounded bg-white/10 text-xs">LOVABLE_API_KEY</code> secret
            in the supabase project. analytics will keep working — only the ai-generated commentary is paused.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Generic error (network, 5xx, etc.) — distinct from both "no data" and
  // "AI unavailable" so the user can retry.
  if (error) {
    return (
      <Card variant="glass" className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white-15">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-400" />
              couldn't load ai insights
            </CardTitle>
            <Button
              variant="glass-ghost"
              size="icon"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
              aria-label="retry ai insights"
            >
              <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <CardDescription>try again in a moment.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white-15">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-white-80" />
            ai insights
          </CardTitle>
          <Button
            variant="glass-ghost"
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
          <p className="text-sm whitespace-pre-wrap leading-relaxed text-white-70">
            {insight?.summary || 'no insights available yet. create some links to get started.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
