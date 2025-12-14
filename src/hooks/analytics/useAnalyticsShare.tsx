import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAnalyticsShare = (workspaceId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shareLinks, isLoading } = useQuery({
    queryKey: ["analytics-share-links", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from("analytics_share_links")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  const createShareLinkMutation = useMutation({
    mutationFn: async ({
      expiresAt,
      showClicks = true,
      showGeography = true,
      showDevices = true,
      showCampaigns = true,
    }: {
      expiresAt?: string;
      showClicks?: boolean;
      showGeography?: boolean;
      showDevices?: boolean;
      showCampaigns?: boolean;
    }) => {
      if (!workspaceId) throw new Error("No workspace selected");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("analytics_share_links")
        .insert({
          workspace_id: workspaceId,
          expires_at: expiresAt || null,
          show_clicks: showClicks,
          show_geography: showGeography,
          show_devices: showDevices,
          show_campaigns: showCampaigns,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics-share-links", workspaceId] });
      toast({
        title: "Share link created",
        description: "Analytics share link has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteShareLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from("analytics_share_links")
        .delete()
        .eq("id", linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analytics-share-links", workspaceId] });
      toast({
        title: "Share link deleted",
        description: "Analytics share link has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    shareLinks,
    isLoading,
    createShareLink: createShareLinkMutation.mutate,
    deleteShareLink: deleteShareLinkMutation.mutate,
  };
};
