import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLoadingScreen } from "@/components/loading/AuthLoadingScreen";
import { notify } from "@/lib/notify";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [statusMessage, setStatusMessage] = useState("verifying session...");

  // Ensure profile exists before proceeding
  const ensureProfileExists = async (userId: string, email: string | undefined): Promise<boolean> => {
    setStatusMessage("preparing workspace...");
    
    try {
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking profile:", checkError);
        return false;
      }

      // Profile exists
      if (existingProfile) {
        return true;
      }

      // Create profile if missing (race condition fix)
      console.log("[AuthCallback] Profile missing, creating...");
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: email,
        });

      if (insertError) {
        // If duplicate key error, profile was created by trigger - that's fine
        if (insertError.code === "23505") {
          console.log("[AuthCallback] Profile already created by trigger");
          return true;
        }
        console.error("Error creating profile:", insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("[AuthCallback] Profile check failed:", error);
      return false;
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatusMessage("verifying session...");
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          notify.error("unable to complete sign in");
          navigate("/auth");
          return;
        }

        const userEmail = session.user.email;

        // Race Condition Guard: Ensure profile exists before proceeding
        const profileReady = await ensureProfileExists(session.user.id, userEmail);
        if (!profileReady) {
          console.warn("[AuthCallback] Profile creation failed, proceeding anyway");
        }

        // Priority 1: Check localStorage for pending invite token
        const pendingInviteToken = localStorage.getItem("pending_invite_token");
        if (pendingInviteToken) {
          localStorage.removeItem("pending_invite_token");
          navigate(`/accept-invite?token=${pendingInviteToken}`);
          return;
        }

        setStatusMessage("checking workspace...");

        // Priority 2: Check workspace_invitations table for email match
        const { data: invitations } = await supabase
          .from("workspace_invitations")
          .select("token")
          .eq("email", userEmail)
          .is("accepted_at", null)
          .gt("expires_at", new Date().toISOString())
          .limit(1);

        if (invitations && invitations.length > 0) {
          navigate(`/accept-invite?token=${invitations[0].token}`);
          return;
        }

        // Priority 3: Check existing workspace membership
        const { data: ownedWorkspaces } = await supabase
          .from("workspaces")
          .select("id")
          .eq("owner_id", session.user.id)
          .limit(1);
          
        const { data: memberWorkspaces } = await supabase
          .from("workspace_members")
          .select("workspace_id")
          .eq("user_id", session.user.id)
          .limit(1);
        
        const hasWorkspaces = (ownedWorkspaces?.length || 0) + (memberWorkspaces?.length || 0) > 0;
        
        if (hasWorkspaces) {
          notify.success("taking you to your dashboard...");
          navigate("/dashboard");
          return;
        }

        // Priority 4: Check early_access_invites for valid unclaimed invite
        const { data: validInvite } = await supabase
          .from("early_access_invites")
          .select("invite_token, claimed_at, access_level")
          .eq("email", userEmail)
          .gt("expires_at", new Date().toISOString())
          .maybeSingle();

        if (validInvite && !validInvite.claimed_at) {
          // User has unclaimed invite - redirect to claim
          navigate(`/claim-access?token=${validInvite.invite_token}`);
          return;
        } else if (validInvite && validInvite.claimed_at) {
          // Invite was claimed - user should have access, go to onboarding
          notify.success("let's set up your workspace...");
          navigate("/onboarding");
          return;
        }

        // Priority 5: Check early_access_requests table
        const { data: accessRequest } = await supabase
          .from("early_access_requests")
          .select("status, access_level")
          .eq("email", userEmail)
          .maybeSingle();

        if (accessRequest?.status === "approved" && (accessRequest.access_level || 0) >= 2) {
          notify.success("let's set up your workspace...");
          navigate("/onboarding");
          return;
        }

        // No workspace and no early access - send to onboarding anyway (open signup)
        notify.success("welcome to utm.one!");
        navigate("/onboarding");

      } catch (error) {
        console.error("[AuthCallback] Error:", error);
        notify.error("please try signing in again");
        navigate("/auth");
      } finally {
        setIsChecking(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isChecking) {
        notify.error("authentication timeout");
        navigate("/auth");
      }
    }, 15000); // Extended timeout for profile creation

    handleCallback();

    return () => clearTimeout(timeout);
  }, [navigate]);

  return <AuthLoadingScreen />;
};

export default AuthCallback;
