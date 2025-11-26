import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Info } from "lucide-react";
import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [minimumLoadingComplete, setMinimumLoadingComplete] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [invitationContext, setInvitationContext] = useState<{
    email: string;
    workspaceName: string;
    inviterName: string;
    role: string;
  } | null>(null);

  // Start minimum loading timer when loading begins
  useEffect(() => {
    if (isCheckingSession || isAuthenticating) {
      setMinimumLoadingComplete(false);
      // Show loading screen for minimum 4 seconds
      const timer = setTimeout(() => {
        setMinimumLoadingComplete(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isCheckingSession, isAuthenticating]);

  // Navigate only when both minimum timer complete AND navigation ready
  useEffect(() => {
    if (minimumLoadingComplete && pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
      setMinimumLoadingComplete(false);
    }
  }, [minimumLoadingComplete, pendingNavigation, navigate]);

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
          setPendingNavigation(`/accept-invite?token=${inviteToken}`);
        } else {
          setPendingNavigation("/dashboard");
        }
      }
      setIsCheckingSession(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticating(true);
        try {
          // If invite token exists, set pending redirect to accept-invite
          if (inviteToken) {
            setPendingNavigation(`/accept-invite?token=${inviteToken}`);
            return;
          }

          // Check if user has any workspaces (owned or member)
          const { data: ownedWorkspaces, error: ownedError } = await supabase
            .from("workspaces")
            .select("id")
            .eq("owner_id", session.user.id);

          const { data: memberWorkspaces, error: memberError } = await supabase
            .from("workspace_members")
            .select("workspace_id")
            .eq("user_id", session.user.id);

          if (ownedError || memberError) {
            console.error("Workspace query error:", ownedError || memberError);
            toast({
              title: "Warning",
              description: "Could not load workspace data. Redirecting to onboarding.",
              variant: "default",
            });
            setIsAuthenticating(false);
            setPendingNavigation("/onboarding");
            return;
          }
          
          const hasWorkspaces = (ownedWorkspaces?.length || 0) + (memberWorkspaces?.length || 0) > 0;
          
          // New users without workspaces go to onboarding
          if (!hasWorkspaces) {
            setPendingNavigation("/onboarding");
          } else {
            setPendingNavigation("/dashboard");
          }
        } catch (err) {
          console.error("Auth state change error:", err);
          toast({
            title: "Error",
            description: "An error occurred during sign in. Please try again.",
            variant: "destructive",
          });
          setIsAuthenticating(false);
          setPendingNavigation("/onboarding");
        } finally {
          setIsAuthenticating(false);
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


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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

  // Show loading screen during session check or authentication
  if (isCheckingSession || isAuthenticating) {
    return <LoadingScreen duration={4000} showProgress={true} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Back to home link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="text-center space-y-4">
          <UtmOneLogo size="xl" className="justify-center mb-2" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-lg">Sign in to your account or create a new one</p>
        </div>

        {invitationContext && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3"
          >
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-primary">
                You've been invited to join utm.one
              </p>
              <p className="text-sm text-muted-foreground">
                {invitationContext.inviterName} has invited you to join their workspace
                as a {invitationContext.role}. Complete your signup below.
              </p>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue={inviteToken ? "signup" : "signin"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1.5 rounded-full border border-gray-200">
            <TabsTrigger 
              value="signin"
              className="rounded-full font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all"
            >
              Sign in
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="rounded-full font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md transition-all"
            >
              Sign up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-6">
            <Card className="border-border/50 shadow-xl rounded-2xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-display font-bold">Sign in</CardTitle>
                <CardDescription className="text-muted-foreground">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-6">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                    {isLoading ? "Signing in…" : "Sign in"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full rounded-full"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <Card className="border-border/50 shadow-xl rounded-2xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-display font-bold">Create an account</CardTitle>
                <CardDescription className="text-muted-foreground">Sign up to get started with utm.one</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-6">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="signup-fullname" className="text-sm font-medium text-foreground">
                      Full name
                    </label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl"
                      readOnly={!!invitationContext}
                    />
                    {invitationContext && (
                      <p className="text-xs text-muted-foreground">
                        This email is pre-filled from your invitation
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                      Password
                    </label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters
                    </p>
                  </div>
                  <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                    {isLoading ? "Creating account…" : "Create account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Auth;
