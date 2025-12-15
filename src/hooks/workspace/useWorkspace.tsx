import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { requireUserId } from "@/lib/getCachedUser";

export const useWorkspace = () => {
  const queryClient = useQueryClient();
  const { currentWorkspace, workspaces, isLoading, isWorkspaceLoading, hasNoWorkspaces, hasTimedOut, error, switchWorkspace, retry } = useWorkspaceContext();

  const createWorkspaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const userId = requireUserId();

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const { data, error } = await supabase
        .from("workspaces")
        .insert({
          name,
          slug,
          owner_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
      notify.success("workspace created");
    },
    onError: (error: any) => {
      notify.error(getFriendlyErrorMessage(error));
    },
  });

  const needsOnboarding = currentWorkspace && !currentWorkspace.onboarding_completed;

  const completeOnboardingMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      const { error } = await supabase
        .from("workspaces")
        .update({ onboarding_completed: true })
        .eq("id", workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  return {
    workspaces,
    currentWorkspace,
    needsOnboarding,
    isLoading,
    isWorkspaceLoading,
    hasNoWorkspaces,
    hasTimedOut,
    error,
    createWorkspace: createWorkspaceMutation.mutate,
    completeOnboarding: completeOnboardingMutation.mutate,
    switchWorkspace,
    retry,
  };
};
