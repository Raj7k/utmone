import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useTeamMembers = (workspaceId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastInvitation, setLastInvitation] = useState<any>(null);

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["team-members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from("workspace_members")
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq("workspace_id", workspaceId);

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  const { data: invitations, isLoading: invitationsLoading } = useQuery({
    queryKey: ["workspace-invitations", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabase
        .from("workspace_invitations")
        .select("*")
        .eq("workspace_id", workspaceId)
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString());

      if (error) throw error;
      return data;
    },
    enabled: !!workspaceId,
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      if (!workspaceId) throw new Error("No workspace selected");

      const { data, error } = await supabase.functions.invoke("invite-team-member", {
        body: { workspaceId, email, role },
      });

      if (error) throw error;
      return data; // Now returns full invitation object with token
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] }); // Update onboarding checklist
      setLastInvitation(data.invitation); // Store for copy link feature
      toast({
        title: "Invitation sent",
        description: "Team member invitation has been sent successfully.",
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

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: "editor" | "viewer" | "workspace_admin" }) => {
      const { error } = await supabase
        .from("workspace_members")
        .update({ role })
        .eq("id", memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", workspaceId] });
      toast({
        title: "Role updated",
        description: "Team member role has been updated successfully.",
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

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("workspace_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", workspaceId] });
      toast({
        title: "Member removed",
        description: "Team member has been removed successfully.",
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

  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from("workspace_invitations")
        .delete()
        .eq("id", invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", workspaceId] });
      toast({
        title: "Invitation cancelled",
        description: "Invitation has been cancelled successfully.",
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
    members,
    invitations,
    isLoading: membersLoading || invitationsLoading,
    inviteTeamMember: inviteMutation.mutate,
    updateRole: updateRoleMutation.mutate,
    removeMember: removeMemberMutation.mutate,
    cancelInvitation: cancelInvitationMutation.mutate,
    lastInvitation,
    clearLastInvitation: () => setLastInvitation(null),
  };
};
