import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";

export const useDomainHealthCheck = () => {
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
      
      notify.success("health check complete", {
        description: `checked ${data.checked || 0} domains`,
      });
    },
    onError: (error: Error) => {
      notify.error("health check failed", {
        description: error.message,
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
      
      notify.success("domain checked", {
        description: "health status updated",
      });
    },
    onError: (error: Error) => {
      notify.error("check failed", {
        description: error.message,
      });
    },
  });

  return {
    checkAllDomains,
    checkSingleDomain,
  };
};
