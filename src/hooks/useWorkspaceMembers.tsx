import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WorkspaceMember {
  user_id: string;
  role: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

export const useWorkspaceMembers = (workspaceId: string) => {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select(`
          user_id,
          role,
          profiles:user_id (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq("workspace_id", workspaceId);

      if (error) throw error;
      return data as WorkspaceMember[];
    },
  });

  const getMemberName = (userId: string): string => {
    const member = members.find((m) => m.user_id === userId);
    return member?.profile?.full_name || member?.profile?.email || `User ${userId.substring(0, 8)}`;
  };

  const getMemberAvatar = (userId: string): string | null => {
    const member = members.find((m) => m.user_id === userId);
    return member?.profile?.avatar_url || null;
  };

  return {
    members,
    isLoading,
    getMemberName,
    getMemberAvatar,
  };
};
