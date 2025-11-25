import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useClientWorkspaces = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["client-workspaces"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get workspaces where user is owner
      const { data: ownedWorkspaces, error: ownedError } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", user.id);

      if (ownedError) throw ownedError;

      // Get workspaces where user is a member
      const { data: memberWorkspaces, error: memberError } = await supabase
        .from("workspace_members")
        .select(`
          workspace_id,
          role,
          workspaces (*)
        `)
        .eq("user_id", user.id);

      if (memberError) throw memberError;

      const memberWorkspacesList = memberWorkspaces
        ?.map(m => m.workspaces)
        .filter(Boolean) || [];

      return [...ownedWorkspaces, ...memberWorkspacesList];
    },
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async ({ name, isClient, parentWorkspaceId }: { 
      name: string; 
      isClient?: boolean;
      parentWorkspaceId?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const { data, error } = await supabase
        .from("workspaces")
        .insert({
          name,
          slug,
          owner_id: user.id,
          is_client_workspace: isClient || false,
          parent_workspace_id: parentWorkspaceId || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Create default workspace branding
      await supabase
        .from("workspace_branding")
        .insert({
          workspace_id: data.id,
          company_name: name,
        });

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

  const deleteWorkspaceMutation = useMutation({
    mutationFn: async (workspaceId: string) => {
      const { error } = await supabase
        .from("workspaces")
        .delete()
        .eq("id", workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
      toast({
        title: "Workspace deleted",
        description: "Workspace has been deleted successfully.",
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

  return {
    workspaces,
    isLoading,
    createWorkspace: createWorkspaceMutation.mutate,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
  };
};
