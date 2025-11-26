import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface RedirectRule {
  id: string;
  workspace_id: string;
  link_id?: string;
  rule_name: string;
  rule_type: string;
  conditions: Record<string, any>;
  destination_url: string;
  priority: number;
  is_active: boolean;
  match_count: number;
  created_by?: string;
  created_at: string;
}

export const useRedirectRules = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["redirect-rules", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("redirect_rules")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("priority", { ascending: false });

      if (error) throw error;
      return data as RedirectRule[];
    },
    enabled: !!workspaceId,
  });

  const createRule = useMutation({
    mutationFn: async (rule: Omit<RedirectRule, "id" | "created_at" | "created_by" | "match_count">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("redirect_rules")
        .insert({
          ...rule,
          workspace_id: workspaceId,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redirect-rules", workspaceId] });
      toast.success("Redirect rule created");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create rule");
    },
  });

  const updateRule = useMutation({
    mutationFn: async ({ ruleId, updates }: { ruleId: string; updates: Partial<RedirectRule> }) => {
      const { error } = await supabase
        .from("redirect_rules")
        .update(updates)
        .eq("id", ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redirect-rules", workspaceId] });
      toast.success("Rule updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update rule");
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from("redirect_rules")
        .delete()
        .eq("id", ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["redirect-rules", workspaceId] });
      toast.success("Rule deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete rule");
    },
  });

  return {
    rules,
    isLoading,
    createRule,
    updateRule,
    deleteRule,
  };
};
