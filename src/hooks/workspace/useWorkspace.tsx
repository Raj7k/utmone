import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";

export const useWorkspace = () => {
  const queryClient = useQueryClient();
  const { currentWorkspace, workspaces, isLoading, isWorkspaceLoading, isRefreshing, hasNoWorkspaces, hasTimedOut, error, switchWorkspace, retry } = useWorkspaceContext();

  const createWorkspaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const { data, error } = await supabase
        .from("workspaces")
        .insert({
          name,
          slug,
          owner_id: user.id,
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

  const needsOnboarding = false; // onboarding_completed tracked in profiles, not workspaces

  const completeOnboardingMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      // onboarding_completed is on the profiles table, not workspaces
      // This is a no-op for workspace; the profile is updated in OnboardingWizard
      console.log('[useWorkspace] completeOnboarding called for workspace', workspaceId);
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
    isRefreshing,
    hasNoWorkspaces,
    hasTimedOut,
    error,
    createWorkspace: createWorkspaceMutation.mutate,
    completeOnboarding: completeOnboardingMutation.mutate,
    switchWorkspace,
    retry,
  };
};
