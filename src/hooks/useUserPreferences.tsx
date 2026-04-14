import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";

interface UserPreference {
  id: string;
  user_id: string;
  workspace_id: string;
  last_domain?: string;
  last_path?: string;
  last_utm_source?: string;
  last_utm_medium?: string;
  last_utm_campaign?: string;
  preferred_domain?: string;
  preferred_path?: string;
  auto_generate_slug: boolean;
  auto_populate_utm: boolean;
  default_redirect_type: string;
  created_at: string;
  updated_at: string;
}

export function useUserPreferences(workspaceId: string) {
  const queryClient = useQueryClient();
  
  // Fetch user preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["user-preferences", workspaceId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabaseFrom('user_preferences')
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as UserPreference | null;
    },
    enabled: !!workspaceId,
  });
  
  // Update preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<Omit<UserPreference, 'id' | 'user_id' | 'workspace_id' | 'created_at' | 'updated_at'>>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabaseFrom('user_preferences')
        .upsert({
          user_id: user.id,
          workspace_id: workspaceId,
          updated_at: new Date().toISOString(),
          ...updates,
        }, {
          onConflict: 'user_id,workspace_id'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences", workspaceId] });
    },
    onError: (error: Error) => {
      toast.error("Failed to update preferences: " + error.message);
    },
  });
  
  return {
    preferences,
    isLoading,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
}
