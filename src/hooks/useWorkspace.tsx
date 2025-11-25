import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";

export const useWorkspace = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentWorkspace, workspaces, isLoading, switchWorkspace } = useWorkspaceContext();

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
      toast({
        title: "Workspace created",
        description: "Your workspace has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    workspaces,
    currentWorkspace,
    needsOnboarding,
    isLoading,
    createWorkspace: createWorkspaceMutation.mutate,
    completeOnboarding: completeOnboardingMutation.mutate,
    switchWorkspace,
  };
};
