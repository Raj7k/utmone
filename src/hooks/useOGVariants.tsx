import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface OGVariantInput {
  variant_name: string;
  og_title: string;
  og_description: string;
  og_image: string;
  is_active: boolean;
}

export const useOGVariants = (linkId: string) => {
  return useQuery({
    queryKey: ["og-variants", linkId],
    queryFn: async () => {
      // OG variants table doesn't exist yet - return empty array
      return [] as any[];
    },
    enabled: !!linkId,
  });
};

export const useAddOGVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ linkId, variant }: { linkId: string; variant: OGVariantInput }) => {
      toast.error("OG variants feature not yet available");
      throw new Error("Not implemented");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["og-variants", variables.linkId] });
    },
  });
};

export const useUpdateOGVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, linkId, updates }: { variantId: string; linkId: string; updates: Partial<OGVariantInput> }) => {
      toast.error("OG variants feature not yet available");
      throw new Error("Not implemented");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["og-variants", variables.linkId] });
    },
  });
};

export const useDeleteOGVariant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, linkId }: { variantId: string; linkId: string }) => {
      toast.error("OG variants feature not yet available");
      throw new Error("Not implemented");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["og-variants", variables.linkId] });
    },
  });
};

export const useOGVariantAnalytics = (linkId: string) => {
  return useQuery({
    queryKey: ["og-variant-analytics", linkId],
    queryFn: async () => {
      return [] as { variantId: string; variantName: string; clicks: number }[];
    },
    enabled: !!linkId,
  });
};

interface ABTestStatus {
  ab_test_status: string | null;
  ab_test_winner_id: string | null;
  ab_test_confidence_threshold: number;
  ab_test_min_clicks: number;
}

export const useABTestStatus = (linkId: string) => {
  return useQuery<ABTestStatus>({
    queryKey: ["ab-test-status", linkId],
    queryFn: async () => {
      // These columns don't exist on links table yet - return defaults
      return {
        ab_test_status: 'inactive',
        ab_test_winner_id: null,
        ab_test_confidence_threshold: 0.95,
        ab_test_min_clicks: 100,
      };
    },
    enabled: !!linkId,
  });
};

export const useStartABTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ linkId, confidenceThreshold = 0.95, minClicks = 100 }: { 
      linkId: string; 
      confidenceThreshold?: number;
      minClicks?: number;
    }) => {
      toast.error("A/B testing feature not yet available");
      throw new Error("Not implemented");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ab-test-status", variables.linkId] });
      toast.success("A/B test started successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to start test: ${error.message}`);
    },
  });
};

export const useStopABTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ linkId }: { linkId: string }) => {
      toast.error("A/B testing feature not yet available");
      throw new Error("Not implemented");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ab-test-status", variables.linkId] });
      toast.success("A/B test stopped");
    },
    onError: (error: Error) => {
      toast.error(`Failed to stop test: ${error.message}`);
    },
  });
};

export const useCheckABTests = () => {
  return useMutation({
    mutationFn: async () => {
      toast.error("A/B testing feature not yet available");
      throw new Error("Not implemented");
    },
    onSuccess: (data: any) => {
      if (data?.winners_declared > 0) {
        toast.success(`${data.winners_declared} A/B test(s) completed with winners declared!`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to check tests: ${error.message}`);
    },
  });
};
