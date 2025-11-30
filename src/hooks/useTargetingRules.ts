import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TargetingRule {
  id: string;
  link_id: string;
  rule_name: string;
  rule_type: 'country' | 'device' | 'os' | 'browser' | 'language';
  condition: 'in' | 'not_in' | 'contains' | 'equals';
  value: string[];
  redirect_url: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useTargetingRules(linkId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch targeting rules for a link
  const { data: rules, isLoading, error } = useQuery({
    queryKey: ['targeting-rules', linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('targeting_rules')
        .select('*')
        .eq('link_id', linkId)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as TargetingRule[];
    },
    enabled: !!linkId,
  });

  // Create targeting rule
  const createRuleMutation = useMutation({
    mutationFn: async (ruleData: Omit<TargetingRule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('targeting_rules')
        .insert(ruleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeting-rules', linkId] });
      toast({
        title: "Rule created",
        description: "Targeting rule has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create rule",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update targeting rule
  const updateRuleMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TargetingRule> & { id: string }) => {
      const { data, error } = await supabase
        .from('targeting_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeting-rules', linkId] });
      toast({
        title: "Rule updated",
        description: "Targeting rule has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update rule",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete targeting rule
  const deleteRuleMutation = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('targeting_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeting-rules', linkId] });
      toast({
        title: "Rule deleted",
        description: "Targeting rule has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete rule",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    rules: rules || [],
    isLoading,
    error,
    createRule: createRuleMutation.mutate,
    updateRule: updateRuleMutation.mutate,
    deleteRule: deleteRuleMutation.mutate,
  };
}
