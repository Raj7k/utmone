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
