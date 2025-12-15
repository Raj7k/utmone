import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import type { LinkPageBlockType } from "@/lib/linkPages";

export interface LinkPageBlock {
  id: string;
  page_id: string;
  type: LinkPageBlockType;
  order_index: number;
  data: Record<string, unknown>;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBlockInput {
  page_id: string;
  type: LinkPageBlockType;
  data?: Record<string, unknown>;
  order_index?: number;
}

export interface UpdateBlockInput {
  id: string;
  data?: Record<string, unknown>;
  is_enabled?: boolean;
}

export interface ReorderBlocksInput {
  blocks: { id: string; order_index: number }[];
}

export function useLinkPageBlocks(pageId: string | undefined) {
  return useQuery({
    queryKey: ["link-page-blocks", pageId],
    queryFn: async () => {
      if (!pageId) return [];
      
      const { data, error } = await supabase
        .from("link_page_blocks")
        .select("*")
        .eq("page_id", pageId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as LinkPageBlock[];
    },
    enabled: !!pageId,
  });
}

export function useCreateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBlockInput) => {
      // Get max order_index for this page
      const { data: existingBlocks } = await supabase
        .from("link_page_blocks")
        .select("order_index")
        .eq("page_id", input.page_id)
        .order("order_index", { ascending: false })
        .limit(1);

      const maxOrder = existingBlocks?.[0]?.order_index ?? -1;

      const { data, error } = await supabase
        .from("link_page_blocks")
        .insert([{
          page_id: input.page_id,
          type: input.type,
          data: input.data || getDefaultBlockData(input.type),
          order_index: input.order_index ?? maxOrder + 1,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as LinkPageBlock;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["link-page-blocks", data.page_id] });
      notify.success("block added");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });
}

export function useUpdateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateBlockInput) => {
      const updateData: Record<string, unknown> = {};
      if (input.data !== undefined) updateData.data = input.data;
      if (input.is_enabled !== undefined) updateData.is_enabled = input.is_enabled;

      const { data, error } = await supabase
        .from("link_page_blocks")
        .update(updateData)
        .eq("id", input.id)
        .select()
        .single();

      if (error) throw error;
      return data as LinkPageBlock;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["link-page-blocks", data.page_id] });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pageId }: { id: string; pageId: string }) => {
      const { error } = await supabase
        .from("link_page_blocks")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { id, pageId };
    },
    onSuccess: ({ pageId }) => {
      queryClient.invalidateQueries({ queryKey: ["link-page-blocks", pageId] });
      notify.success("block removed");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });
}

export function useReorderBlocks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blocks, pageId }: ReorderBlocksInput & { pageId: string }) => {
      // Update each block's order_index
      const updates = blocks.map(({ id, order_index }) =>
        supabase
          .from("link_page_blocks")
          .update({ order_index })
          .eq("id", id)
      );

      const results = await Promise.all(updates);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;

      return { pageId };
    },
    onSuccess: ({ pageId }) => {
      queryClient.invalidateQueries({ queryKey: ["link-page-blocks", pageId] });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });
}

function getDefaultBlockData(type: LinkPageBlockType): Record<string, unknown> {
  switch (type) {
    case "link":
      return { url: "", title: "New Link", icon: "" };
    case "header":
      return { text: "Header", size: "h2" };
    case "text":
      return { content: "Add your text here" };
    case "image":
      return { url: "", alt: "" };
    case "divider":
      return { style: "solid" };
    case "social":
      return { platforms: [] };
    default:
      return {};
  }
}
