import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";

export interface BulkUploadSession {
  id: string;
  workspace_id: string;
  created_by: string;
  name: string | null;
  status: string;
  total_links: number;
  successful_links: number;
  failed_links: number;
  assigned_to: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useBulkUploadSession = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["bulk-upload-sessions", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('bulk_uploads')
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as BulkUploadSession[];
    },
  });

  const createSession = useMutation({
    mutationFn: async ({
      name,
      totalLinks,
    }: {
      name?: string;
      totalLinks?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabaseFrom('bulk_uploads')
        .insert({
          workspace_id: workspaceId,
          created_by: user.id,
          name: name || null,
          status: "draft",
          total_links: totalLinks || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-sessions", workspaceId] });
      toast.success("upload session created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateSession = useMutation({
    mutationFn: async ({
      sessionId,
      updates,
    }: {
      sessionId: string;
      updates: Partial<BulkUploadSession>;
    }) => {
      const { error } = await supabaseFrom('bulk_uploads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bulk-upload-sessions", workspaceId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    sessions,
    isLoading,
    createSession,
    updateSession,
  };
};
