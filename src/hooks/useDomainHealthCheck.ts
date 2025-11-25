import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDomainHealthCheck = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkAllDomains = useMutation({
    mutationFn: async (workspaceId: string) => {
      const { data, error } = await supabase.functions.invoke('domain-health-check', {
        body: { workspace_id: workspaceId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-health-logs'] });
      
      toast({
        title: "health check complete",
        description: `checked ${data.checked || 0} domains`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "health check failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const checkSingleDomain = useMutation({
    mutationFn: async (domainId: string) => {
      const { data, error } = await supabase.functions.invoke('domain-health-check', {
        body: { domain_id: domainId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['workspace-domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-health-logs'] });
      
      toast({
        title: "domain checked",
        description: "health status updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "check failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    checkAllDomains,
    checkSingleDomain,
  };
};
