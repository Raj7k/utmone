import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";

export interface ZapierWebhook {
  id: string;
  workspace_id: string;
  webhook_name: string;
  trigger_type: string;
  target_url: string;
  secret_key?: string;
  is_active: boolean;
  last_triggered_at?: string;
  total_triggers: number;
  created_by?: string;
  created_at: string;
}

export const useZapierWebhooks = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ["zapier-webhooks", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('zapier_webhooks')
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ZapierWebhook[];
    },
    enabled: !!workspaceId,
  });

  const createWebhook = useMutation({
    mutationFn: async (webhook: Omit<ZapierWebhook, "id" | "created_at" | "created_by" | "last_triggered_at" | "total_triggers">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabaseFrom('zapier_webhooks')
        .insert({
          ...webhook,
          workspace_id: workspaceId,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zapier-webhooks", workspaceId] });
      toast.success("Webhook created");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create webhook");
    },
  });

  const updateWebhook = useMutation({
    mutationFn: async ({ webhookId, updates }: { webhookId: string; updates: Partial<ZapierWebhook> }) => {
      const { error } = await supabaseFrom('zapier_webhooks')
        .update(updates)
        .eq("id", webhookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zapier-webhooks", workspaceId] });
      toast.success("Webhook updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update webhook");
    },
  });

  const deleteWebhook = useMutation({
    mutationFn: async (webhookId: string) => {
      const { error } = await supabaseFrom('zapier_webhooks')
        .delete()
        .eq("id", webhookId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zapier-webhooks", workspaceId] });
      toast.success("Webhook deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete webhook");
    },
  });

  return {
    webhooks,
    isLoading,
    createWebhook,
    updateWebhook,
    deleteWebhook,
  };
};
