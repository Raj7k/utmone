import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { calculateProbabilityBWins, shouldDeclareWinner } from "@/lib/bayesian";
import { toast } from "sonner";

export const useExperiment = (linkId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: experiment, isLoading } = useQuery({
    queryKey: ["experiment", linkId],
    queryFn: async () => {
      if (!linkId) return null;

      const { data, error } = await supabaseFrom('experiments')
        .select("*")
        .eq("link_id", linkId)
        .eq("status", "running")
        .maybeSingle();

      if (error) throw error;

      // Calculate probability if experiment exists
      if (data) {
        const probabilityBWins = calculateProbabilityBWins(
          data.variant_a_clicks,
          data.variant_a_conversions,
          data.variant_b_clicks,
          data.variant_b_conversions
        );

        return {
          ...data,
          probability_b_wins: probabilityBWins,
        };
      }

      return null;
    },
    enabled: !!linkId,
    refetchInterval: 30000, // Refetch every 30 seconds for live experiments
  });

  const createExperiment = useMutation({
    mutationFn: async (params: {
      link_id: string;
      workspace_id: string;
      experiment_name: string;
      variant_a_label: string;
      variant_b_label: string;
      variant_a_url: string;
      variant_b_url: string;
    }) => {
      const { data, error } = await supabaseFrom('experiments')
        .insert({
          ...params,
          created_by: (await supabase.auth.getUser()).data.user!.id,
          status: "running",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiment", linkId] });
      toast.success("experiment started");
    },
    onError: (error) => {
      toast.error("failed to start experiment");
      console.error("Error creating experiment:", error);
    },
  });

  const declareWinner = useMutation({
    mutationFn: async (winner: "A" | "B") => {
      if (!experiment) throw new Error("No experiment found");

      const { error } = await supabaseFrom('experiments')
        .update({
          status: "completed",
          winner_variant: winner,
          declared_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
        })
        .eq("id", experiment.id);

      if (error) throw error;

      // Update link to use winner's destination
      // This would require additional logic to store variant URLs
      return winner;
    },
    onSuccess: (winner) => {
      queryClient.invalidateQueries({ queryKey: ["experiment", linkId] });
      toast.success(`variant ${winner} declared as winner`);
    },
    onError: (error) => {
      toast.error("failed to declare winner");
      console.error("Error declaring winner:", error);
    },
  });

  const pauseExperiment = useMutation({
    mutationFn: async () => {
      if (!experiment) throw new Error("No experiment found");

      const { error } = await supabaseFrom('experiments')
        .update({ status: "paused" })
        .eq("id", experiment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiment", linkId] });
      toast.success("experiment paused");
    },
    onError: (error) => {
      toast.error("failed to pause experiment");
      console.error("Error pausing experiment:", error);
    },
  });

  const resumeExperiment = useMutation({
    mutationFn: async () => {
      if (!experiment) throw new Error("No experiment found");

      const { error } = await supabaseFrom('experiments')
        .update({ status: "running" })
        .eq("id", experiment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiment", linkId] });
      toast.success("experiment resumed");
    },
    onError: (error) => {
      toast.error("failed to resume experiment");
      console.error("Error resuming experiment:", error);
    },
  });

  // Calculate recommendation
  const recommendation = experiment
    ? shouldDeclareWinner(experiment.probability_b_wins)
    : null;

  return {
    experiment,
    isLoading,
    recommendation,
    createExperiment,
    declareWinner,
    pauseExperiment,
    resumeExperiment,
  };
};