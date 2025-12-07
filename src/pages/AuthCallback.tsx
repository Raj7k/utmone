import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLoadingScreen } from "@/components/loading/AuthLoadingScreen";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
          toast({
            title: "Authentication failed",
            description: "Unable to complete sign in. Please try again.",
            variant: "destructive",
          });
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
          toast({
            title: "Signed in successfully",
            description: "Taking you to your dashboard...",
          });
          navigate("/dashboard");
          return;
        }

        // Priority 4: Check early_access_requests table
        const { data: accessRequest } = await supabase
          .from("early_access_requests")
          .select("status, access_level")
          .eq("email", userEmail)
          .maybeSingle();

        if (accessRequest?.status === "approved" && (accessRequest.access_level || 0) >= 2) {
          toast({
            title: "Welcome to utm.one!",
            description: "Let's set up your workspace...",
          });
          navigate("/onboarding");
          return;
        }

        // No workspace and no early access - send to onboarding anyway (open signup)
        toast({
          title: "Welcome to utm.one!",
          description: "Let's set up your workspace...",
        });
        navigate("/onboarding");

      } catch (error) {
        console.error("[AuthCallback] Error:", error);
        toast({
          title: "Something went wrong",
          description: "Please try signing in again.",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setIsChecking(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isChecking) {
        toast({
          title: "Authentication timeout",
          description: "Please try signing in again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    }, 15000); // Extended timeout for profile creation

    handleCallback();

    return () => clearTimeout(timeout);
  }, [navigate, toast]);

  return <AuthLoadingScreen />;
};

export default AuthCallback;
