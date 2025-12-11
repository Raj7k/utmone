import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EnrichmentSettings {
  enrichment_provider?: string;
  apollo_api_key?: string;
  clay_webhook_url?: string;
  zoominfo_client_id?: string;
  auto_enrich_enabled?: boolean;
  crm_push_enabled?: boolean;
  crm_push_target?: 'hubspot' | 'salesforce' | null;
}

export const useEnrichmentSettings = (workspaceId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['enrichment-settings', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      if (error) throw error;
      return ((data as any)?.settings as EnrichmentSettings) || {};
    },
    enabled: !!workspaceId,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<EnrichmentSettings>) => {
      if (!workspaceId) throw new Error('No workspace ID');
      
      const { data: current } = await supabase
        .from('workspaces')
        .select('*')
        .eq('id', workspaceId)
        .single();

      const currentSettings = ((current as any)?.settings as EnrichmentSettings) || {};
      const merged = { ...currentSettings, ...newSettings };

      const { error } = await supabase
        .from('workspaces')
        .update({ settings: merged } as any)
        .eq('id', workspaceId);

      if (error) throw error;
      return merged;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrichment-settings', workspaceId] });
    },
  });

  const isConfigured = !!(
    settings?.apollo_api_key || 
    settings?.clay_webhook_url || 
    settings?.zoominfo_client_id
  );

  const provider = settings?.enrichment_provider || null;
  const autoEnrichEnabled = settings?.auto_enrich_enabled ?? false;
  const crmPushEnabled = settings?.crm_push_enabled ?? false;
  const crmPushTarget = settings?.crm_push_target || null;

  return {
    settings,
    isLoading,
    isConfigured,
    provider,
    autoEnrichEnabled,
    crmPushEnabled,
    crmPushTarget,
    updateSettings,
  };
};
