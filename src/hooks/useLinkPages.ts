import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { isValidLinkPageSlug, LinkPageBlockType, LinkPageStatus } from "@/lib/linkPages";
import { useToast } from "@/components/ui/use-toast";

export type LinkPage = Database["public"]["Tables"]["link_pages"]["Row"];
export type LinkPageBlock = Database["public"]["Tables"]["link_page_blocks"]["Row"];
export type LinkPageAnalyticsRow = Database["public"]["Functions"]["get_link_page_analytics"]["Returns"][number];

export interface DateRange {
  start: Date;
  end: Date;
}

const DEFAULT_RANGE: DateRange = {
  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  end: new Date(),
};

const withIsoRange = (range?: DateRange) => ({
  start: (range?.start ?? DEFAULT_RANGE.start).toISOString(),
  end: (range?.end ?? DEFAULT_RANGE.end).toISOString(),
});

export const useLinkPages = (workspaceId?: string, range?: DateRange) => {
  const isoRange = withIsoRange(range);
  return useQuery({
    queryKey: ["link-pages", workspaceId, isoRange.start, isoRange.end],
    queryFn: async () => {
      if (!workspaceId) return { pages: [], analytics: [] as LinkPageAnalyticsRow[] };
      const { data, error } = await supabase
        .from("link_pages")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const { data: analytics, error: analyticsError } = await supabase.rpc(
        "get_link_page_analytics",
        {
          p_workspace_id: workspaceId,
          p_page_id: null,
          p_start: isoRange.start,
          p_end: isoRange.end,
        }
      );

      if (analyticsError) throw analyticsError;

      return { pages: data ?? [], analytics: analytics ?? [] };
    },
    enabled: !!workspaceId,
  });
};

export const useLinkPage = (pageId?: string) => {
  return useQuery({
    queryKey: ["link-page", pageId],
    queryFn: async () => {
      if (!pageId) return null;
      const { data, error } = await supabase
        .from("link_pages")
        .select("*, link_page_blocks(*)")
        .eq("id", pageId)
        .single();

      if (error) throw error;
      return data as LinkPage & { link_page_blocks: LinkPageBlock[] };
    },
    enabled: !!pageId,
  });
};

export const useLinkPageAnalytics = (
  workspaceId: string | undefined,
  pageId: string | undefined,
  range?: DateRange
) => {
  const isoRange = withIsoRange(range);
  return useQuery({
    queryKey: ["link-page-analytics", workspaceId, pageId, isoRange.start, isoRange.end],
    queryFn: async () => {
      if (!workspaceId || !pageId) return [] as LinkPageAnalyticsRow[];
      const { data, error } = await supabase.rpc("get_link_page_analytics", {
        p_workspace_id: workspaceId,
        p_page_id: pageId,
        p_start: isoRange.start,
        p_end: isoRange.end,
      });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!workspaceId && !!pageId,
  });
};

export const useCreateLinkPage = (workspaceId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      slug: string;
      description?: string;
      avatar_url?: string;
    }) => {
      if (!workspaceId) throw new Error("Missing workspace");
      if (!isValidLinkPageSlug(payload.slug)) throw new Error("Invalid slug");

      const { data, error } = await supabase
        .from("link_pages")
        .insert({
          workspace_id: workspaceId,
          title: payload.title,
          slug: payload.slug,
          description: payload.description,
          avatar_url: payload.avatar_url,
        })
        .select()
        .single();
      if (error) throw error;
      return data as LinkPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-pages"] });
      toast({ description: "Link page created" });
    },
    onError: (error) => {
      toast({ variant: "destructive", description: error.message });
    },
  });
};

export const useUpdateLinkPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: Partial<LinkPage> & { id: string }) => {
      const { id, ...changes } = payload;
      const { data, error } = await supabase
        .from("link_pages")
        .update({ ...changes })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as LinkPage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["link-page", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["link-pages"] });
      toast({ description: "Page updated" });
    },
    onError: (error) => toast({ variant: "destructive", description: error.message }),
  });
};

export const usePublishLinkPage = () => {
  const mutation = useUpdateLinkPage();
  return useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      return mutation.mutateAsync({
        id,
        status: publish ? ("published" as LinkPageStatus) : ("draft" as LinkPageStatus),
        published_at: publish ? new Date().toISOString() : null,
      });
    },
  });
};

export const useSaveBlock = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: Partial<LinkPageBlock> & { page_id: string }) => {
      const { data, error } = await supabase
        .from("link_page_blocks")
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as LinkPageBlock;
    },
    onSuccess: (block) => {
      queryClient.invalidateQueries({ queryKey: ["link-page", block.page_id] });
      toast({ description: "Block saved" });
    },
    onError: (error) => toast({ variant: "destructive", description: error.message }),
  });
};

export const useReorderBlocks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pageId,
      blocks,
    }: {
      pageId: string;
      blocks: Array<{ id: string; order_index: number }>;
    }) => {
      const payload = blocks.map(b => ({ id: b.id, order_index: b.order_index }));
      const { error } = await supabase.from("link_page_blocks").upsert(payload);
      if (error) throw error;
      return payload;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["link-page", variables.pageId] });
    },
  });
};

export const useDeleteBlock = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pageId }: { id: string; pageId: string }) => {
      const { error } = await supabase.from("link_page_blocks").delete().eq("id", id);
      if (error) throw error;
      return { id, pageId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["link-page", variables.pageId] });
    },
  });
};

export const useDeleteLinkPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("link_pages").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-pages"] });
      toast({ description: "Page deleted" });
    },
    onError: (error) => toast({ variant: "destructive", description: error.message }),
  });
};

export const useDuplicateLinkPage = (workspaceId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (pageId: string) => {
      if (!workspaceId) throw new Error("Missing workspace");
      const { data, error } = await supabase
        .from("link_pages")
        .select("*, link_page_blocks(*)")
        .eq("id", pageId)
        .single();
      if (error) throw error;
      const page = data as LinkPage & { link_page_blocks: LinkPageBlock[] };
      const baseSlug = `${page.slug}-copy`;
      const newSlug = isValidLinkPageSlug(baseSlug) ? baseSlug : `${baseSlug}-${Date.now()}`;
      const { data: created, error: createError } = await supabase
        .from("link_pages")
        .insert({
          workspace_id: workspaceId,
          title: `${page.title} (Copy)`,
          slug: newSlug,
          description: page.description,
          avatar_url: page.avatar_url,
          theme: page.theme,
        })
        .select()
        .single();
      if (createError) throw createError;
      const newPageId = created.id;
      if (page.link_page_blocks?.length) {
        const clonedBlocks = page.link_page_blocks.map(block => ({
          page_id: newPageId,
          type: block.type as LinkPageBlockType,
          data: block.data,
          order_index: block.order_index,
          is_enabled: block.is_enabled,
        }));
        const { error: cloneError } = await supabase.from("link_page_blocks").insert(clonedBlocks);
        if (cloneError) throw cloneError;
      }
      return created as LinkPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-pages"] });
      toast({ description: "Page duplicated" });
    },
    onError: (error) => toast({ variant: "destructive", description: error.message }),
  });
};

export const usePublishAnalytics = (
  analytics: LinkPageAnalyticsRow[] | undefined,
  pageId: string | undefined
) => {
  return useMemo(() => {
    const pageAnalytics = (analytics || []).filter(row => row.page_id === pageId);
    const pageViews = pageAnalytics.filter(row => row.event_type === "page_view");
    const blockClicks = pageAnalytics.filter(row => row.event_type === "block_click");

    const totalViews = pageViews.reduce((sum, row) => sum + (row.total_events || 0), 0);
    const uniqueViews = pageViews.reduce((sum, row) => sum + (row.unique_visitors || 0), 0);
    const totalClicks = blockClicks.reduce((sum, row) => sum + (row.total_events || 0), 0);

    return { totalViews, uniqueViews, totalClicks };
  }, [analytics, pageId]);
};
