import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthLoadingScreen } from "@/components/loading/AuthLoadingScreen";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.error("Session error:", sessionError);
          toast({
            title: "Authentication failed",
            description: "Unable to complete sign in. Please try again.",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const userEmail = session.user.email;

        // Priority 1: Check localStorage for pending invite token
        const pendingInviteToken = localStorage.getItem("pending_invite_token");
        if (pendingInviteToken) {
          console.log("Found pending invite token in localStorage");
          localStorage.removeItem("pending_invite_token"); // Clean up
          navigate(`/accept-invite?token=${pendingInviteToken}`);
          return;
        }

        // Priority 2: Check workspace_invitations table for email match
        const { data: invitations } = await supabase
          .from("workspace_invitations")
          .select("token")
          .eq("email", userEmail)
          .is("accepted_at", null)
          .gt("expires_at", new Date().toISOString())
          .limit(1);

        if (invitations && invitations.length > 0) {
          console.log("Found workspace invitation for user");
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
          console.log("User has existing workspace access");
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
          console.log("User has approved early access");
          toast({
            title: "Welcome to utm.one!",
            description: "Let's set up your workspace...",
          });
          navigate("/onboarding");
          return;
        }

        // Access denied - sign out and redirect to waitlist locked page
        console.log("User does not have access - signing out");
        await supabase.auth.signOut();
        
        toast({
          title: "Access Denied",
          description: "You're still on the waitlist. We'll notify you when access is granted.",
          variant: "destructive",
        });
        
        navigate("/waitlist-locked");

      } catch (error) {
        console.error("Auth callback error:", error);
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
        console.warn("Auth callback timeout - redirecting to auth");
        toast({
          title: "Authentication timeout",
          description: "Please try signing in again.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    }, 10000);

    handleCallback();

    return () => clearTimeout(timeout);
  }, [navigate, toast]);

  return <AuthLoadingScreen />;
};

export default AuthCallback;
