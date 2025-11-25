import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    loadInvitation(token);
  }, [searchParams]);

  const loadInvitation = async (token: string) => {
    try {
      console.log("🔍 Loading invitation with token:", token);
      
      // Simple query - no JOINs
      const { data, error } = await supabase
        .from("workspace_invitations")
        .select("id, email, role, workspace_id, invited_by, token, accepted_at, expires_at")
        .eq("token", token)
        .single();

      console.log("📋 Invitation data:", { data, error });

      if (error) {
        console.error("❌ Error fetching invitation:", error);
        setError("Invalid invitation link");
        setLoading(false);
        return;
      }

      if (data?.accepted_at) {
        console.log("⚠️ Invitation already accepted at:", data.accepted_at);
        setError("This invitation has already been accepted");
        setLoading(false);
        return;
      }

      // Check if expired
      const expiryDate = new Date(data.expires_at);
      const now = new Date();
      console.log("⏰ Expiry check:", { expiryDate, now, isExpired: expiryDate < now });
      
      if (expiryDate < now) {
        setError("This invitation has expired");
        setLoading(false);
        return;
      }

      // Try to get workspace name if possible
      const { data: { user } } = await supabase.auth.getUser();
      let workspaceName = "a workspace";
      let inviterName = "A team member";
      
      if (user) {
        // Authenticated user might have access to workspace details
        const { data: workspace } = await supabase
          .from("workspaces")
          .select("name")
          .eq("id", data.workspace_id)
          .single();
        
        if (workspace) workspaceName = workspace.name;

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", data.invited_by)
          .single();
        
        if (profile) inviterName = profile.full_name || profile.email;
      }

      setInvitation({
        ...data,
        workspaces: { id: data.workspace_id, name: workspaceName },
        profiles: { full_name: inviterName, email: data.email }
      });
      setLoading(false);
      console.log("✅ Invitation loaded successfully");
    } catch (err) {
      console.error("❌ Error loading invitation:", err);
      setError("Invalid invitation link");
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!invitation) return;

    setAccepting(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to auth with invitation token
        navigate(`/auth?invite=${invitation.token}`);
        return;
      }

      // Check if user's email matches invitation
      if (user.email !== invitation.email) {
        toast({
          title: "Email mismatch",
          description: `This invitation was sent to ${invitation.email}. Please log in with that email.`,
          variant: "destructive",
        });
        setAccepting(false);
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
      const { error: acceptError } = await supabase
        .from("workspace_invitations")
        .update({ accepted_at: new Date().toISOString() })
        .eq("id", invitation.id);

      if (acceptError) throw acceptError;

      toast({
        title: "Invitation accepted",
        description: `You've joined ${invitation.workspaces.name}`,
      });

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error accepting invitation:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to accept invitation",
        variant: "destructive",
      });
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-grouped-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-system-blue" />
            <p className="text-body-apple text-secondary-label">Loading invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-grouped-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-system-red mx-auto mb-4" />
            <CardTitle className="text-title-1 font-display">Invitation Invalid</CardTitle>
            <CardDescription className="text-body-apple">
              {error || "This invitation link is no longer valid"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="system"
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grouped-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-system-green mx-auto mb-4" />
          <CardTitle className="text-title-1 font-display">You're Invited!</CardTitle>
          <CardDescription className="text-body-apple">
            {invitation.profiles?.full_name || invitation.profiles?.email} invited you to join{" "}
            <span className="font-semibold text-label">{invitation.workspaces.name}</span> as{" "}
            <span className="font-semibold text-label">{invitation.role}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-fill-secondary rounded-lg p-4 space-y-2">
            <p className="text-footnote-apple text-secondary-label">Invited to:</p>
            <p className="text-body-apple font-medium text-label">{invitation.email}</p>
          </div>

          <Button
            onClick={handleAccept}
            disabled={accepting}
            variant="system"
            size="lg"
            className="w-full"
          >
            {accepting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              "Accept & Join →"
            )}
          </Button>

          <Button
            onClick={() => navigate("/")}
            variant="system-tertiary"
            className="w-full"
          >
            Decline
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
