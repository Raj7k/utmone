import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { notify } from "@/lib/notify";

export const useTeamMembers = (workspaceId: string | undefined) => {
  const queryClient = useQueryClient();
  const [lastInvitation, setLastInvitation] = useState<any>(null);

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["team-members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      
      const { data, error } = await supabaseFrom('workspace_members')
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
      
      const { data, error } = await supabaseFrom('workspace_invitations')
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

      // Step 1: Check for fraud risk before sending invite
      const { data: fraudCheck, error: fraudError } = await supabase.functions.invoke("check-invite-fraud", {
        body: { 
          targetEmail: email,
          senderEmail: (await supabase.auth.getUser()).data.user?.email,
          workspaceId 
        },
      });

      if (fraudError) throw fraudError;

      // Block high-risk invites
      if (!fraudCheck.allowed) {
        throw new Error(`Invitation blocked: ${fraudCheck.reasons.join(", ")}. Please contact support if this is a mistake.`);
      }

      // Show warning for medium risk but allow
      if (fraudCheck.riskLevel === 'medium') {
        notify.warning("Unusual activity detected", {
          description: "This invitation looks suspicious but will be sent. Please verify the email address.",
        });
      }

      // Step 2: Send the actual invite
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
      notify.success("Invitation sent", {
        description: "Team member invitation has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      notify.error("Error", {
        description: error.message,
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: "editor" | "viewer" | "workspace_admin" }) => {
      const { error } = await supabaseFrom('workspace_members')
        .update({ role })
        .eq("id", memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", workspaceId] });
      notify.success("Role updated", {
        description: "Team member role has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      notify.error("Error", {
        description: error.message,
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabaseFrom('workspace_members')
        .delete()
        .eq("id", memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members", workspaceId] });
      notify.success("Member removed", {
        description: "Team member has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      notify.error("Error", {
        description: error.message,
      });
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabaseFrom('workspace_invitations')
        .delete()
        .eq("id", invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", workspaceId] });
      notify.success("Invitation cancelled", {
        description: "Invitation has been cancelled successfully.",
      });
    },
    onError: (error: Error) => {
      notify.error("Error", {
        description: error.message,
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
