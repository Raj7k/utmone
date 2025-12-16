import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface OGVariant {
  id: string;
  link_id: string;
  variant_name: string;
  og_title: string | null;
  og_description: string | null;
  og_image: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export interface OGVariantInput {
  variant_name: string;
  og_title?: string;
  og_description?: string;
  og_image: string;
  is_active?: boolean;
}

export const useOGVariants = (linkId: string) => {
  return useQuery({
    queryKey: ["og-variants", linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("og_image_variants")
        .select("*")
        .eq("link_id", linkId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as OGVariant[];
    },
    enabled: !!linkId,
  });
};

export const useAddOGVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      linkId,
      variant,
    }: {
      linkId: string;
      variant: OGVariantInput;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("og_image_variants")
        .insert({
          link_id: linkId,
          variant_name: variant.variant_name,
          og_title: variant.og_title || null,
          og_description: variant.og_description || null,
          og_image: variant.og_image,
          is_active: variant.is_active ?? true,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["og-variants", variables.linkId] });
      toast.success("OG variant added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add variant: ${error.message}`);
    },
  });
};

export const useUpdateOGVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      variantId,
      linkId,
      updates,
    }: {
      variantId: string;
      linkId: string;
      updates: Partial<OGVariantInput>;
    }) => {
      const { data, error } = await supabase
        .from("og_image_variants")
        .update(updates)
        .eq("id", variantId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["og-variants", variables.linkId] });
      toast.success("Variant updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update variant: ${error.message}`);
    },
  });
};

export const useDeleteOGVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, linkId }: { variantId: string; linkId: string }) => {
      const { error } = await supabase
        .from("og_image_variants")
        .delete()
        .eq("id", variantId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["og-variants", variables.linkId] });
      toast.success("Variant deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete variant: ${error.message}`);
    },
  });
};

export const useOGVariantAnalytics = (linkId: string) => {
  return useQuery({
    queryKey: ["og-variant-analytics", linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("link_clicks")
        .select(`
          og_variant_id,
          og_image_variants!inner (
            id,
            variant_name,
            og_image
          )
        `)
        .eq("link_id", linkId)
        .not("og_variant_id", "is", null);

      if (error) throw error;

      // Aggregate clicks by variant
      const variantCounts = data.reduce((acc, click) => {
        const variantId = click.og_variant_id;
        if (!variantId) return acc;
        
        if (!acc[variantId]) {
          acc[variantId] = {
            variantId,
            variantName: (click.og_image_variants as any).variant_name,
            clicks: 0,
          };
        }
        acc[variantId].clicks++;
        return acc;
      }, {} as Record<string, { variantId: string; variantName: string; clicks: number }>);

      return Object.values(variantCounts).sort((a, b) => b.clicks - a.clicks);
    },
    enabled: !!linkId,
  });
};

export const useABTestStatus = (linkId: string) => {
  return useQuery({
    queryKey: ["ab-test-status", linkId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("ab_test_status, ab_test_winner_id, ab_test_started_at, ab_test_completed_at, ab_test_confidence_threshold, ab_test_min_clicks")
        .eq("id", linkId)
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from("links")
        .update({
          ab_test_status: 'running',
          ab_test_started_at: new Date().toISOString(),
          ab_test_completed_at: null,
          ab_test_winner_id: null,
          ab_test_confidence_threshold: confidenceThreshold,
          ab_test_min_clicks: minClicks,
        })
        .eq("id", linkId)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from("links")
        .update({
          ab_test_status: 'inactive',
          ab_test_started_at: null,
          ab_test_completed_at: null,
          ab_test_winner_id: null,
        })
        .eq("id", linkId)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase.functions.invoke('check-ab-tests', {
        method: 'POST',
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.winners_declared > 0) {
        toast.success(`${data.winners_declared} A/B test(s) completed with winners declared!`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to check tests: ${error.message}`);
    },
  });
};
