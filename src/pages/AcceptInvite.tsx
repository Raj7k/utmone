import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, XCircle, Clock, UserCheck, Building2, User, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { InvitationSuccess } from "@/components/invite/InvitationSuccess";
import { EmailMismatchDialog } from "@/components/invite/EmailMismatchDialog";
import { notify } from "@/lib/notify";

type InvitationState = 
  | "loading" 
  | "valid" 
  | "expired" 
  | "already_accepted" 
  | "invalid" 
  | "already_member"
  | "email_mismatch"
  | "accepting"
  | "success";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<InvitationState>("loading");
  const [invitation, setInvitation] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState("finding invitation...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("invalid");
      setErrorMessage("no invitation token provided");
      return;
    }

    loadInvitation(token);
  }, [searchParams]);

  // Loading message progression
  useEffect(() => {
    if (state !== "loading") return;
    
    const messages = [
      "finding invitation...",
      "loading workspace details...",
      "almost there..."
    ];
    let index = 0;
    
    const interval = setInterval(() => {
      index = Math.min(index + 1, messages.length - 1);
      setLoadingMessage(messages[index]);
    }, 1500);

    // Timeout after 10s
    const timeout = setTimeout(() => {
      if (state === "loading") {
        setState("invalid");
        setErrorMessage("this is taking longer than expected. please try again.");
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [state]);

  const loadInvitation = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-invitation-by-token', {
        body: { token }
      });

      if (error || !data) {
        const errorMsg = data?.error || 'invitation not found';
        
        if (errorMsg.includes('expired')) {
          setState("expired");
          setErrorMessage("this invitation has expired");
        } else if (errorMsg.includes('accepted')) {
          setState("already_accepted");
          setErrorMessage("this invitation has already been used");
        } else {
          setState("invalid");
          setErrorMessage(errorMsg);
        }
        return;
      }

      setInvitation({
        token,
        email: data.email,
        role: data.role,
        workspace_id: data.workspaceId,
        workspace_name: data.workspaceName,
        inviter_name: data.inviterName,
        expires_at: data.expiresAt
      });
      setState("valid");
    } catch (err) {
      console.error('Error loading invitation:', err);
      setState("invalid");
      setErrorMessage("couldn't load invitation details");
    }
  };

  const handleAccept = async () => {
    if (!invitation) return;

    setState("accepting");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in - redirect to auth with invite token
        navigate(`/auth?invite=${invitation.token}`);
        return;
      }

      // Check email match
      if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
        setCurrentUserEmail(user.email || "");
        setState("email_mismatch");
        return;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", invitation.workspace_id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingMember) {
        setState("already_member");
        return;
      }

      // Add user to workspace
      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({
          workspace_id: invitation.workspace_id,
          user_id: user.id,
          role: invitation.role,
        });

      if (memberError) throw memberError;

      // Mark invitation as accepted
      await supabase
        .from("workspace_invitations")
        .update({ accepted_at: new Date().toISOString() })
        .eq("token", invitation.token);

      // Store workspace ID for context
      localStorage.setItem("currentWorkspaceId", invitation.workspace_id);

      // Show success state
      setState("success");

      // Redirect after celebration
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);

    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      
      if (err.code === "23505") {
        setState("already_member");
      } else {
        setState("valid"); // Return to valid state to retry
        notify.error("couldn't complete your request. please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate(`/auth?invite=${invitation.token}`);
  };

  const handleCancelMismatch = () => {
    setState("valid");
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "workspace_admin": return "default";
      case "editor": return "secondary";
      default: return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "workspace_admin": return "admin";
      case "editor": return "editor";
      default: return "viewer";
    }
  };

  const getDaysUntilExpiry = () => {
    if (!invitation?.expires_at) return null;
    const days = Math.ceil((new Date(invitation.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  // Email mismatch dialog
  if (state === "email_mismatch") {
    return (
      <EmailMismatchDialog
        invitedEmail={invitation.email}
        currentEmail={currentUserEmail}
        onSignOut={handleSignOut}
        onCancel={handleCancelMismatch}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <UtmOneLogo size="lg" />
        </div>

        <Card className="border-border shadow-2xl">
          {/* Loading State */}
          {state === "loading" && (
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <div className="relative w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{loadingMessage}</p>
              </div>
            </CardContent>
          )}

          {/* Success State */}
          {state === "success" && invitation && (
            <CardContent className="pt-8 pb-8">
              <InvitationSuccess 
                workspaceName={invitation.workspace_name} 
                role={getRoleLabel(invitation.role)} 
              />
            </CardContent>
          )}

          {/* Accepting State */}
          {state === "accepting" && (
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-foreground font-medium">accepting invitation...</p>
                  <p className="text-muted-foreground text-sm">setting up your access</p>
                </div>
              </div>
            </CardContent>
          )}

          {/* Valid Invitation State */}
          {state === "valid" && invitation && (
            <>
              <CardHeader className="text-center pb-4 pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
                >
                  <Mail className="h-8 w-8 text-primary" />
                </motion.div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  workspace invitation
                </h1>
                <p className="text-muted-foreground text-sm mt-2">
                  you've been invited to collaborate
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6 pb-8">
                {/* Invitation Details */}
                <div className="space-y-3">
                  {/* Workspace */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">workspace</p>
                      <p className="font-medium text-foreground truncate">{invitation.workspace_name}</p>
                    </div>
                  </div>

                  {/* Inviter */}
                  {invitation.inviter_name && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">invited by</p>
                        <p className="font-medium text-foreground truncate">{invitation.inviter_name}</p>
                      </div>
                    </div>
                  )}

                  {/* Role */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">your role</p>
                      <Badge variant={getRoleBadgeVariant(invitation.role)} className="mt-1">
                        {getRoleLabel(invitation.role)}
                      </Badge>
                    </div>
                  </div>

                  {/* Invited Email */}
                  <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">invitation sent to</p>
                      <p className="font-medium text-foreground truncate">{invitation.email}</p>
                    </div>
                  </div>
                </div>

                {/* Expiry Notice */}
                {getDaysUntilExpiry() !== null && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>expires in {getDaysUntilExpiry()} days</span>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={handleAccept}
                    size="lg"
                    className="w-full h-14 rounded-xl text-base font-semibold"
                  >
                    accept invitation
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="ghost"
                    className="w-full h-12 rounded-xl text-muted-foreground"
                  >
                    not now
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Error States */}
          {(state === "expired" || state === "already_accepted" || state === "invalid" || state === "already_member") && (
            <>
              <CardHeader className="text-center pb-4 pt-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    state === "already_member" ? "bg-primary/10" : "bg-destructive/10"
                  }`}
                >
                  {state === "already_member" ? (
                    <UserCheck className="h-8 w-8 text-primary" />
                  ) : state === "expired" ? (
                    <Clock className="h-8 w-8 text-destructive" />
                  ) : (
                    <XCircle className="h-8 w-8 text-destructive" />
                  )}
                </motion.div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  {state === "expired" && "invitation expired"}
                  {state === "already_accepted" && "invitation already used"}
                  {state === "invalid" && "invitation not found"}
                  {state === "already_member" && "you're already a member"}
                </h1>
              </CardHeader>
              
              <CardContent className="space-y-6 pb-8 text-center">
                <p className="text-muted-foreground text-sm">
                  {state === "expired" && "this invitation link has expired. please ask your team admin to send a new one."}
                  {state === "already_accepted" && "this invitation has already been used. if you're having trouble accessing the workspace, contact your team admin."}
                  {state === "invalid" && (errorMessage || "this invitation link is invalid or no longer exists.")}
                  {state === "already_member" && `you already have access to ${invitation?.workspace_name || "this workspace"}.`}
                </p>

                <div className="space-y-3">
                  {state === "already_member" && (
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="w-full h-12 rounded-xl"
                    >
                      go to workspace
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => navigate("/")}
                    variant={state === "already_member" ? "ghost" : "default"}
                    className="w-full h-12 rounded-xl"
                  >
                    {state === "already_member" ? "go home" : "back to home"}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Help Text */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          need help? contact <a href="mailto:support@utm.one" className="underline">support@utm.one</a>
        </p>
      </motion.div>
    </div>
  );
}
