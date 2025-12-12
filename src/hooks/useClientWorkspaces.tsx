import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";

// Maximum time for workspace fetch before aborting
const FETCH_TIMEOUT_MS = 10000;

export const useClientWorkspaces = () => {
  const queryClient = useQueryClient();

  const { data: workspaces, isLoading, error, refetch } = useQuery({
    queryKey: ["client-workspaces"],
    queryFn: async ({ signal }) => {
      // Create timeout for the entire operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Workspace fetch timed out")), FETCH_TIMEOUT_MS);
      });

      const fetchPromise = async () => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("[useClientWorkspaces] Auth error:", authError);
          return [];
        }
        if (!user) return [];

        // Get workspaces where user is owner
        const { data: ownedWorkspaces, error: ownedError } = await supabase
          .from("workspaces")
          .select("*")
          .eq("owner_id", user.id);

        if (ownedError) {
          console.error("[useClientWorkspaces] Owned workspaces error:", ownedError);
          throw ownedError;
        }

        // Get workspaces where user is a member
        const { data: memberWorkspaces, error: memberError } = await supabase
          .from("workspace_members")
          .select(`
            workspace_id,
            role,
            workspaces (*)
          `)
          .eq("user_id", user.id);

        if (memberError) {
          console.error("[useClientWorkspaces] Member workspaces error:", memberError);
          throw memberError;
        }

        const memberWorkspacesList = memberWorkspaces
          ?.map(m => m.workspaces)
          .filter(Boolean) || [];

        return [...(ownedWorkspaces || []), ...memberWorkspacesList];
      };

      // Race between fetch and timeout
      try {
        return await Promise.race([fetchPromise(), timeoutPromise]);
      } catch (err) {
        console.error("[useClientWorkspaces] Fetch failed:", err);
        throw err;
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    staleTime: 30000, // Cache for 30 seconds to prevent excessive refetches
    gcTime: 60000, // Keep in cache for 1 minute
    refetchOnWindowFocus: false, // Don't refetch on window focus to prevent unnecessary requests
    networkMode: 'offlineFirst', // Use cached data when available
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
      notify.success("workspace created");
    },
    onError: (error: any) => {
      notify.error(getFriendlyErrorMessage(error));
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
      notify.success("workspace deleted");
    },
    onError: (error: any) => {
      notify.error(getFriendlyErrorMessage(error));
    },
  });

  return {
    workspaces: workspaces || [],
    isLoading,
    error,
    refetch,
    createWorkspace: createWorkspaceMutation.mutate,
    deleteWorkspace: deleteWorkspaceMutation.mutate,
  };
};
