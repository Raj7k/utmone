import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { notify } from "@/lib/notify";
import { getFriendlyErrorMessage } from "@/lib/errorMessages";
import { useAppSession } from "@/contexts/AppSessionContext";

// Reduced timeout for faster failure
const FETCH_TIMEOUT_MS = 5000;

// Get cached workspaces for instant render
function getCachedWorkspaces(): any[] | null {
  try {
    const cached = localStorage.getItem('utm_workspaces_cache');
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    // 10 minute cache
    if (Date.now() - timestamp > 10 * 60 * 1000) {
      localStorage.removeItem('utm_workspaces_cache');
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function cacheWorkspaces(workspaces: any[]): void {
  try {
    localStorage.setItem('utm_workspaces_cache', JSON.stringify({
      data: workspaces,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore storage errors
  }
}

export const useClientWorkspaces = () => {
  const queryClient = useQueryClient();
  const { user } = useAppSession();
  const userId = user?.id;

  const { data: workspaces, isLoading, error, refetch } = useQuery({
    queryKey: ["client-workspaces", userId],
    queryFn: async ({ signal }) => {
      if (!userId) return [];

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Workspace fetch timed out")), FETCH_TIMEOUT_MS);
      });

      const fetchPromise = async () => {

        // Parallel fetch: owned + member workspaces
        const [ownedResult, memberResult] = await Promise.all([
          supabase
            .from("workspaces")
            .select("*")
            .eq("owner_id", userId),
          supabaseFrom('workspace_members')
            .select(`workspace_id, role, workspaces (*)`)
            .eq("user_id", userId),
        ]);

        if (ownedResult.error) {
          console.error("[useClientWorkspaces] Owned error:", ownedResult.error);
          throw ownedResult.error;
        }

        if (memberResult.error) {
          console.error("[useClientWorkspaces] Member error:", memberResult.error);
          throw memberResult.error;
        }

        const memberWorkspacesList = memberResult.data
          ?.map(m => m.workspaces)
          .filter(Boolean) || [];

        const allWorkspaces = [...(ownedResult.data || []), ...memberWorkspacesList];
        
        // Cache for next load
        cacheWorkspaces(allWorkspaces);
        
        return allWorkspaces;
      };

      try {
        return await Promise.race([fetchPromise(), timeoutPromise]);
      } catch (err) {
        console.error("[useClientWorkspaces] Fetch failed:", err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 500,
    // Use cached workspaces as placeholder for instant render
    placeholderData: getCachedWorkspaces() ?? undefined,
    // 10 minute stale time
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    networkMode: 'offlineFirst',
    enabled: !!userId,
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async ({ name, isClient, parentWorkspaceId }: { 
      name: string; 
      isClient?: boolean;
      parentWorkspaceId?: string;
    }) => {
      if (!userId) throw new Error("Not authenticated");

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const { data, error } = await supabase
        .from("workspaces")
        .insert({
          name,
          slug,
          owner_id: userId,
          is_client_workspace: isClient || false,
          parent_workspace_id: parentWorkspaceId || null,
        })
        .select()
        .single();

      if (error) throw error;

      await supabaseFrom('workspace_branding')
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
