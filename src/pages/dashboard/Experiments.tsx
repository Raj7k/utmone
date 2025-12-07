import { useState } from "react";
import { Beaker, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { ExperimentConfidenceMeter } from "@/components/experiments/ExperimentConfidenceMeter";
import { Badge } from "@/components/ui/badge";
import { useExperiment } from "@/hooks/useExperiment";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { CreateExperimentDialog } from "@/components/experiments/CreateExperimentDialog";

export default function Experiments() {
  const { currentWorkspace } = useWorkspaceContext();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: experiments, isLoading } = useQuery({
    queryKey: ["experiments", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const { data, error } = await supabase
        .from("experiments")
        .select(`
          *,
          links (
            title,
            short_url
          )
        `)
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <PageContentWrapper
      title="smart testing"
      description="find out which version of your link performs better"
      breadcrumbs={[{ label: "smart testing" }]}
      action={
        <Button variant="default" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          new test
        </Button>
      }
    >
      {/* Experiments Grid */}
      {experiments && experiments.length > 0 ? (
        <div className="grid gap-6">
          {experiments.map((exp) => (
            <ExperimentCard key={exp.id} experiment={exp} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed">
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Beaker className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold text-foreground">
                create your first test
              </h3>
              <p className="text-muted-foreground mt-2">
                compare two versions of a link to see which one gets more clicks or conversions
              </p>
            </div>
            <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              start testing
            </Button>
          </div>
        </Card>
      )}

      {/* Create Experiment Dialog */}
      {currentWorkspace?.id && (
        <CreateExperimentDialog 
          workspaceId={currentWorkspace.id}
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      )}
    </PageContentWrapper>
  );
}

interface ExperimentCardProps {
  experiment: any;
}

function ExperimentCard({ experiment }: ExperimentCardProps) {
  const { declareWinner, pauseExperiment, resumeExperiment } = useExperiment(
    experiment.link_id
  );

  return (
    <Card className="p-6 border-border bg-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-display font-semibold text-foreground">
                {experiment.experiment_name}
              </h3>
              <Badge
                variant={
                  experiment.status === "running"
                    ? "default"
                    : experiment.status === "completed"
                    ? "secondary"
                    : "outline"
                }
              >
                {experiment.status}
              </Badge>
            </div>
            {experiment.links && (
              <p className="text-sm text-muted-foreground mt-1">
                {experiment.links.title} • {experiment.links.short_url}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {experiment.status === "running" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => pauseExperiment.mutate()}
              >
                pause
              </Button>
            )}
            {experiment.status === "paused" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => resumeExperiment.mutate()}
              >
                resume
              </Button>
            )}
          </div>
        </div>

        {/* Confidence Meter */}
        <ExperimentConfidenceMeter
          probabilityBWins={experiment.probability_b_wins || 0.5}
          variantALabel={experiment.variant_a_label}
          variantBLabel={experiment.variant_b_label}
          variantAClicks={experiment.variant_a_clicks}
          variantBClicks={experiment.variant_b_clicks}
          variantAConversions={experiment.variant_a_conversions}
          variantBConversions={experiment.variant_b_conversions}
          status={experiment.status}
          onDeclareWinner={(winner) => declareWinner.mutate(winner)}
        />

        {/* Experiment Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">started</p>
            <p className="text-sm font-medium text-foreground">
              {experiment.started_at
                ? new Date(experiment.started_at).toLocaleDateString()
                : "not started yet"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">total clicks</p>
            <p className="text-sm font-medium text-foreground">
              {experiment.variant_a_clicks + experiment.variant_b_clicks}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
