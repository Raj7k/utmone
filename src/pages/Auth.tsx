import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link as LinkIcon, UserPlus } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [invitationContext, setInvitationContext] = useState<{
    email: string;
    workspaceName: string;
    inviterName: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Load invitation context if invite token present
    if (inviteToken) {
      loadInvitationContext(inviteToken);
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // If has invite token, redirect to accept-invite
        if (inviteToken) {
          navigate(`/accept-invite?token=${inviteToken}`);
        } else {
          navigate("/dashboard");
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // If invite token exists, redirect back to accept-invite
        if (inviteToken) {
          navigate(`/accept-invite?token=${inviteToken}`);
          return;
        }

        // Check if user has any workspaces
        const { data: workspaces } = await supabase
          .from("workspaces")
          .select("id")
          .or(`owner_id.eq.${session.user.id}`);
        
        // New users without workspaces go to onboarding
        if (!workspaces || workspaces.length === 0) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, inviteToken]);

  const loadInvitationContext = async (token: string) => {
    try {
      // Use secure edge function instead of direct query
      const { data, error } = await supabase.functions.invoke('get-invitation-by-token', {
        body: { token }
      });

      if (error || !data) {
        console.error("Error loading invitation:", error);
        return;
      }

      setInvitationContext({
        email: data.email,
        workspaceName: data.workspaceName,
        inviterName: data.inviterName,
        role: data.role,
      });

      // Pre-fill email from invitation
      setEmail(data.email);
    } catch (err) {
      console.error("Error loading invitation context:", err);
    }
  };

  const checkEmailAllowed = async (email: string): Promise<{allowed: boolean; reason: string; message?: string}> => {
    // FIRST: Check if this email belongs to an admin user
    const { data: adminCheck } = await supabase
      .from("profiles")
      .select(`
        id,
        user_roles!inner(role)
      `)
      .eq("email", email.toLowerCase())
      .eq("user_roles.role", "admin")
      .single();

    if (adminCheck) {
      return { allowed: true, reason: "admin" };
    }

    // THEN: Check early_access_requests for approved status
    const { data: request } = await supabase
      .from("early_access_requests")
      .select("status")
      .eq("email", email.toLowerCase())
      .single();

    if (request?.status === "approved") {
      return { allowed: true, reason: "approved" };
    }

    // Check early_access_invites for valid invite
    const { data: invite } = await supabase
      .from("early_access_invites")
      .select("id, claimed_at, expires_at")
      .eq("email", email.toLowerCase())
      .is("claimed_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (invite) {
      return { allowed: true, reason: "invited" };
    }

    return { 
      allowed: false, 
      reason: "not_approved",
      message: "Your email hasn't been approved yet. Request early access to join the waitlist." 
    };
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if email is allowed
      const emailCheck = await checkEmailAllowed(email);
      if (!emailCheck.allowed) {
        toast({
          title: "Access restricted",
          description: emailCheck.message,
          variant: "destructive",
        });
        setIsLoading(false);
        // Redirect to early access page
        setTimeout(() => navigate("/early-access"), 2000);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Check for referral code and create partner_referral record
        const refCode = localStorage.getItem('utm_referral_code');
        if (refCode) {
          try {
            // Get the new user's ID
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              // Find partner by code
              const { data: partner } = await supabase
                .from('partners')
                .select('id')
                .eq('partner_code', refCode)
                .eq('status', 'approved')
                .single();

              if (partner) {
                // Create referral record
                await supabase.from('partner_referrals').insert({
                  partner_id: partner.id,
                  referred_user_id: user.id,
                  referral_code: refCode,
                  signup_date: new Date().toISOString(),
                  status: 'pending'
                });
                console.log('Partner referral tracked');
              }
            }
            localStorage.removeItem('utm_referral_code');
          } catch (err) {
            console.error('Error tracking referral:', err);
          }
        }

        toast({
          title: "Success!",
          description: "Account created successfully. You can now sign in.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if email is allowed
      const emailCheck = await checkEmailAllowed(email);
      if (!emailCheck.allowed) {
        toast({
          title: "Access restricted",
          description: emailCheck.message,
          variant: "destructive",
        });
        setIsLoading(false);
        // Redirect to early access page
        setTimeout(() => navigate("/early-access"), 2000);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Check your email",
      description: "We've sent you a password reset link.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grouped-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/src/assets/utm-one-logo.svg" 
            alt="utm.one" 
            className="h-10 w-auto"
          />
        </div>

        {invitationContext && (
          <Card variant="grouped" className="mb-4 bg-system-blue/5 border-system-blue/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-system-blue/10">
                  <UserPlus className="h-5 w-5 text-system-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-body-apple font-medium text-label mb-1">
                    You've been invited to join {invitationContext.workspaceName}
                  </p>
                  <p className="text-footnote-apple text-secondary-label">
                    <span className="font-medium">{invitationContext.inviterName}</span> invited you as{" "}
                    <span className="font-medium">{invitationContext.role}</span>
                  </p>
                  <p className="text-footnote-apple text-tertiary-label mt-1">
                    Create an account with <span className="font-medium text-secondary-label">{invitationContext.email}</span> to accept
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue={inviteToken ? "signup" : "signin"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-fill-tertiary">
            <TabsTrigger value="signin" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card variant="grouped">
              <CardHeader>
                <CardTitle className="text-title-2">Welcome back</CardTitle>
                <CardDescription className="text-body-apple text-secondary-label">Sign in to your account to continue</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-subheadline text-label">Email</Label>
                    <Input
                      variant="system"
                      id="signin-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-subheadline text-label">Password</Label>
                    <Input
                      variant="system"
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-system-blue hover:underline block"
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="system" type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card variant="grouped">
              <CardHeader>
                <CardTitle className="text-title-2">Create an account</CardTitle>
                <CardDescription className="text-body-apple text-secondary-label">Enter your details to get started</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-subheadline text-label">Full Name</Label>
                    <Input
                      variant="system"
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-subheadline text-label">Email</Label>
                    <Input
                      variant="system"
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={!!invitationContext}
                    />
                    {invitationContext && (
                      <p className="text-footnote-apple text-tertiary-label">Email from invitation</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-subheadline text-label">Password</Label>
                    <Input
                      variant="system"
                      id="signup-password"
                      type="password"
                      placeholder="Enter your password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-footnote-apple text-tertiary-label">Minimum 6 characters</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="system" type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : invitationContext ? "Create account & join →" : "Sign up"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
