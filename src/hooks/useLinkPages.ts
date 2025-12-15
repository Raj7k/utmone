import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isValidLinkPageSlug } from "@/lib/linkPages";
import { useToast } from "@/components/ui/use-toast";

export interface LinkPage {
  id: string;
  workspace_id: string;
  slug: string;
  title: string;
  bio: string | null;
  theme: string;
  is_published: boolean;
  scheduled_publish_at: string | null;
  custom_domain: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export const useLinkPages = (workspaceId?: string, _range?: DateRange) => {
  return useQuery({
    queryKey: ["link-pages", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return { pages: [], count: 0 };
      const { data, error, count } = await supabase
        .from("link_pages")
        .select("*", { count: 'exact' })
        .eq("workspace_id", workspaceId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return { pages: (data ?? []) as LinkPage[], count: count ?? 0 };
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
        .select("*")
        .eq("id", pageId)
        .single();

      if (error) throw error;
      return data as LinkPage;
    },
    enabled: !!pageId,
  });
};

export const useCreateLinkPage = (workspaceId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: { title: string; slug: string; bio?: string }) => {
      if (!workspaceId) throw new Error("Missing workspace");
      if (!isValidLinkPageSlug(payload.slug)) throw new Error("Invalid slug");

      const { data: user } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("link_pages")
        .insert({
          workspace_id: workspaceId,
          title: payload.title,
          slug: payload.slug,
          bio: payload.bio,
          created_by: user.user?.id,
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
    mutationFn: async (payload: { id: string; title?: string; slug?: string; bio?: string; is_published?: boolean }) => {
      const { id, ...changes } = payload;
      const { data, error } = await supabase
        .from("link_pages")
        .update(changes)
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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const { data, error } = await supabase
        .from("link_pages")
        .update({ is_published: publish })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as LinkPage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["link-page", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["link-pages"] });
      toast({ description: variables.publish ? "Page published" : "Page unpublished" });
    },
    onError: (error) => toast({ variant: "destructive", description: error.message }),
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
        .select("*")
        .eq("id", pageId)
        .single();
      if (error) throw error;
      
      const page = data as LinkPage;
      const newSlug = `${page.slug}-copy-${Date.now()}`;
      
      const { data: user } = await supabase.auth.getUser();
      
      const { data: created, error: createError } = await supabase
        .from("link_pages")
        .insert({
          workspace_id: workspaceId,
          title: `${page.title} (Copy)`,
          slug: newSlug,
          bio: page.bio,
          theme: page.theme,
          created_by: user.user?.id,
        })
        .select()
        .single();
      if (createError) throw createError;
      
      return created as LinkPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["link-pages"] });
      toast({ description: "Page duplicated" });
    },
    onError: (error) => toast({ variant: "destructive", description: error.message }),
  });
};

export const useLinkPageCount = (workspaceId?: string) => {
  return useQuery({
    queryKey: ["link-page-count", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return 0;
      const { count, error } = await supabase
        .from("link_pages")
        .select("*", { count: 'exact', head: true })
        .eq("workspace_id", workspaceId);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!workspaceId,
  });
};
