import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";

export interface Domain {
  id: string;
  workspace_id: string;
  domain: string;
  is_verified: boolean;
  is_primary: boolean;
  verification_code: string;
  dns_verified_at: string | null;
  ssl_status: string;
  health_status: string | null;
  last_health_check: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useWorkspaceDomains = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ["domains", workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error("No workspace ID");

      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Domain[];
    },
    enabled: !!workspaceId,
  });
};

export const usePrimaryDomain = (workspaceId: string | undefined) => {
  return useQuery({
    queryKey: ["primaryDomain", workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error("No workspace ID");

      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("is_primary", true)
        .eq("is_verified", true)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as Domain | null;
    },
    enabled: !!workspaceId,
  });
};

export const useAddDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      domain,
    }: {
      workspaceId: string;
      domain: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("domains")
        .insert({
          workspace_id: workspaceId,
          domain: domain.toLowerCase().trim(),
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Domain;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      notify.success("Domain added", {
        description: `${data.domain} has been added. Please verify DNS settings.`,
      });
    },
    onError: (error: Error) => {
      notify.error("Error adding domain", {
        description: error.message,
      });
    },
  });
};

export const useVerifyDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId: string) => {
      const { data, error } = await supabase
        .from("domains")
        .update({
          is_verified: true,
          dns_verified_at: new Date().toISOString(),
        })
        .eq("id", domainId)
        .select()
        .single();

      if (error) throw error;
      return data as Domain;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      notify.success("Domain verified", {
        description: "Your domain has been verified successfully.",
      });
    },
    onError: (error: Error) => {
      notify.error("Verification failed", {
        description: error.message,
      });
    },
  });
};

export const useSetPrimaryDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      domainId,
      workspaceId,
    }: {
      domainId: string;
      workspaceId: string;
    }) => {
      // First, unset all primary domains for this workspace
      await supabase
        .from("domains")
        .update({ is_primary: false })
        .eq("workspace_id", workspaceId);

      // Then set the new primary domain
      const { data, error } = await supabase
        .from("domains")
        .update({ is_primary: true })
        .eq("id", domainId)
        .select()
        .single();

      if (error) throw error;

      // Update workspace primary_domain field
      const domain = data as Domain;
      await supabase
        .from("workspaces")
        .update({ primary_domain: domain.domain })
        .eq("id", workspaceId);

      return domain;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      queryClient.invalidateQueries({ queryKey: ["primaryDomain"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      notify.success("Primary domain updated", {
        description: "Your primary domain has been set successfully.",
      });
    },
    onError: (error: Error) => {
      notify.error("Error updating primary domain", {
        description: error.message,
      });
    },
  });
};

export const useDeleteDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId: string) => {
      const { error } = await supabase
        .from("domains")
        .delete()
        .eq("id", domainId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
      notify.success("Domain removed", {
        description: "The domain has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      notify.error("Error removing domain", {
        description: error.message,
      });
    },
  });
};
