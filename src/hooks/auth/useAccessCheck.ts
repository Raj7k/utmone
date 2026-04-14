import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

interface AccessCheckResult {
  isLoading: boolean;
  hasAccess: boolean;
  reason: 'workspace_invite' | 'workspace_member' | 'approved' | 'pending' | 'not_found' | null;
  workspaceInviteToken?: string;
  error?: string;
}

export function useAccessCheck(email: string | undefined): AccessCheckResult {
  const [result, setResult] = useState<AccessCheckResult>({
    isLoading: true,
    hasAccess: false,
    reason: null,
  });

  useEffect(() => {
    if (!email) {
      setResult({
        isLoading: false,
        hasAccess: false,
        reason: 'not_found',
      });
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const checkAccess = async () => {
      try {
        // Set 10-second timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Access check timed out')), 10000);
        });

        // Priority 1: Check workspace invitations
        const inviteCheckPromise = supabaseFrom('workspace_invitations')
          .select("id, workspace_id")
          .eq("email", email)
          .is("accepted_at", null)
          .gt("expires_at", new Date().toISOString())
          .limit(1)
          .single();

        const { data: invite, error: inviteError } = await Promise.race([
          inviteCheckPromise,
          timeoutPromise,
        ]);

        if (invite && !inviteError) {
          clearTimeout(timeoutId);
          setResult({
            isLoading: false,
            hasAccess: true,
            reason: 'workspace_invite',
            workspaceInviteToken: invite.id,
          });
          return;
        }

        // Priority 2: Check existing workspace membership
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const [ownedWorkspacesResult, memberWorkspacesResult] = await Promise.all([
            supabase
              .from("workspaces")
              .select("id")
              .eq("owner_id", user.id)
              .limit(1),
            supabaseFrom('workspace_members')
              .select("workspace_id")
              .eq("user_id", user.id)
              .limit(1),
          ]);

          const hasWorkspaces = 
            (ownedWorkspacesResult.data?.length || 0) + 
            (memberWorkspacesResult.data?.length || 0) > 0;

          if (hasWorkspaces) {
            clearTimeout(timeoutId);
            setResult({
              isLoading: false,
              hasAccess: true,
              reason: 'workspace_member',
            });
            return;
          }
        }

        // Priority 3: Check early access status
        const { data: earlyAccess, error: earlyAccessError } = await supabase
          .from("early_access_requests")
          .select("status, access_level")
          .eq("email", email)
          .single();

        clearTimeout(timeoutId);

        if (earlyAccessError || !earlyAccess) {
          setResult({
            isLoading: false,
            hasAccess: false,
            reason: 'not_found',
          });
          return;
        }

        if (earlyAccess.status === 'approved' && (earlyAccess.access_level || 0) >= 2) {
          setResult({
            isLoading: false,
            hasAccess: true,
            reason: 'approved',
          });
        } else {
          setResult({
            isLoading: false,
            hasAccess: false,
            reason: 'pending',
          });
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("Access check error:", err);
        setResult({
          isLoading: false,
          hasAccess: false,
          reason: 'not_found',
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    };

    checkAccess();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [email]);

  return result;
}
