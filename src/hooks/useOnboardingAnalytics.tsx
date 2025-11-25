import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";

interface TrackStepParams {
  workspaceId: string;
  stepName: string;
  completed?: boolean;
  skipped?: boolean;
  metadata?: any;
}

export const useOnboardingAnalytics = () => {
  const trackStep = useMutation({
    mutationFn: async ({ workspaceId, stepName, completed, skipped, metadata }: TrackStepParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if step already exists
      const { data: existing } = await supabase
        .from("onboarding_analytics")
        .select("id")
        .eq("user_id", user.id)
        .eq("workspace_id", workspaceId)
        .eq("step_name", stepName)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const updateData: any = {};
        if (completed) {
          updateData.completed_at = new Date().toISOString();
        }
        if (skipped !== undefined) {
          updateData.skipped = skipped;
        }
        if (metadata) {
          updateData.metadata = metadata;
        }

        const { error } = await supabase
          .from("onboarding_analytics")
          .update(updateData)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("onboarding_analytics")
          .insert({
            user_id: user.id,
            workspace_id: workspaceId,
            step_name: stepName,
            completed_at: completed ? new Date().toISOString() : null,
            skipped: skipped || false,
            metadata: metadata || {},
          });

        if (error) throw error;
      }
    },
  });

  return { trackStep: trackStep.mutateAsync };
};
