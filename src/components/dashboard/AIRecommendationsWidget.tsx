import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, AlertTriangle, Lightbulb, TrendingUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AIRecommendationsWidgetProps {
  workspaceId: string;
}

const getIconForType = (type: string) => {
  switch (type) {
    case 'opportunity': return <Flame className="h-5 w-5 text-system-orange" />;
    case 'warning': return <AlertTriangle className="h-5 w-5 text-system-yellow" />;
    case 'suggestion': return <Lightbulb className="h-5 w-5 text-system-blue" />;
    case 'pattern': return <TrendingUp className="h-5 w-5 text-system-teal" />;
    default: return <Lightbulb className="h-5 w-5 text-system-blue" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'opportunity': return 'hot opportunity';
    case 'warning': return 'warning';
    case 'suggestion': return 'suggestion';
    case 'pattern': return 'pattern detected';
    default: return type;
  }
};

export const AIRecommendationsWidget = ({ workspaceId }: AIRecommendationsWidgetProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['ai-recommendations', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (recommendationId: string) => {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ 
          dismissed: true, 
          dismissed_at: new Date().toISOString(),
          dismissed_by: (await supabase.auth.getUser()).data.user?.id 
        })
        .eq('id', recommendationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-recommendations', workspaceId] });
      toast({
        title: "recommendation dismissed",
        description: "we'll remember your feedback",
      });
    },
    onError: () => {
      toast({
        title: "failed to dismiss",
        description: "please try again",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card variant="grouped">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-system-blue" />
            ai recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-fill-tertiary rounded-lg" />
            <div className="h-20 bg-fill-tertiary rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card variant="grouped">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-system-blue" />
            ai recommendations
          </CardTitle>
          <CardDescription>
            we're analyzing your data to find opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-caption-1 text-secondary-label">
            recommendations will appear here once you have more data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="grouped">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-system-blue" />
          ai recommendations
        </CardTitle>
        <CardDescription>
          {recommendations.length} action{recommendations.length !== 1 ? 's' : ''} to take now
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div 
            key={rec.id}
            className="p-4 rounded-lg bg-secondary-grouped-background border border-separator hover:border-system-blue transition-apple relative group"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-apple"
              onClick={() => dismissMutation.mutate(rec.id)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-3">
              {getIconForType(rec.recommendation_type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-caption-1 font-semibold text-system-blue uppercase tracking-wide">
                    {getTypeLabel(rec.recommendation_type)}
                  </span>
                </div>
                <h4 className="text-body-apple font-semibold text-label">
                  {rec.title}
                </h4>
                <p className="text-caption-1 text-secondary-label">
                  {rec.description}
                </p>

                {rec.action_url && rec.action_label && (
                  <div className="pt-2">
                    <Button 
                      variant="system" 
                      size="sm"
                      onClick={() => navigate(rec.action_url!)}
                    >
                      {rec.action_label}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
