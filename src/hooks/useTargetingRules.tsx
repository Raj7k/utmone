import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TargetingRule {
  id: string;
  link_id: string;
  rule_name: string;
  rule_type: 'country' | 'device' | 'os' | 'browser' | 'language';
  condition: 'equals' | 'in' | 'not_in' | 'contains';
  value: string[];
  redirect_url: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTargetingRules = (linkId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: rules, isLoading } = useQuery({
    queryKey: ['targeting-rules', linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('targeting_rules')
        .select('*')
        .eq('link_id', linkId)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data as TargetingRule[];
    },
  });

  const createRule = useMutation({
    mutationFn: async (rule: Omit<TargetingRule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('targeting_rules')
        .insert(rule)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeting-rules', linkId] });
      toast({ title: 'targeting rule created' });
    },
    onError: (error) => {
      toast({
        title: 'failed to create rule',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateRule = useMutation({
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
      toast({ title: 'targeting rule updated' });
    },
    onError: (error) => {
      toast({
        title: 'failed to update rule',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('targeting_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targeting-rules', linkId] });
      toast({ title: 'targeting rule deleted' });
    },
    onError: (error) => {
      toast({
        title: 'failed to delete rule',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    rules,
    isLoading,
    createRule: createRule.mutate,
    updateRule: updateRule.mutate,
    deleteRule: deleteRule.mutate,
  };
};
