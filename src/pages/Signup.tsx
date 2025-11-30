import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Info } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLoadingScreen } from "@/components/loading/AuthLoadingScreen";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [invitationContext, setInvitationContext] = useState<{
    email: string;
    workspaceName: string;
    inviterName: string;
    role: string;
  } | null>(null);

  // Navigation guard to prevent duplicate processing
  const hasNavigated = useRef(false);

  useEffect(() => {
    const redirectTo = searchParams.get("redirect_to");
    
    // Load invitation context if invite token present
    if (inviteToken) {
      loadInvitationContext(inviteToken);
    }

    // Check if user is already logged in
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session) {
          // Mark as navigated to prevent duplicate processing
          hasNavigated.current = true;
          
          // Existing session - navigate immediately
          if (inviteToken) {
            navigate(`/accept-invite?token=${inviteToken}`);
          } else if (redirectTo) {
            navigate(redirectTo);
          } else {
            navigate("/dashboard");
          }
        }
      })
      .catch((error) => {
        console.error("Session check failed:", error);
        toast({
          title: "Authentication Error",
          description: "Failed to check authentication status. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsCheckingSession(false);
      });

    // Listen for auth changes - only process fresh sign-ins
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip if we already navigated (prevents duplicate processing for existing sessions)
      if (hasNavigated.current) return;
      
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticating(true);
        hasNavigated.current = true;
        
        try {
          // Handle invite token flow
          if (inviteToken) {
            navigate(`/accept-invite?token=${inviteToken}`);
            return;
          }
          
          // Check workspace ownership/membership
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
          
          // Show success toast
          toast({
            title: "Account created successfully",
            description: hasWorkspaces ? "Taking you to your dashboard..." : "Setting up your workspace...",
          });
          
          // Navigate based on workspace status
          if (hasWorkspaces) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
          
        } catch (err) {
          console.error("Access check error:", err);
          hasNavigated.current = false;
          toast({
            title: "Something went wrong",
            description: "Please try signing in again.",
            variant: "destructive",
          });
          setIsAuthenticating(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, inviteToken, searchParams, toast]);

  const loadInvitationContext = async (token: string) => {
    try {
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
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: partner } = await supabase
                .from('partners')
                .select('id')
                .eq('partner_code', refCode)
                .eq('status', 'approved')
                .single();

              if (partner) {
                await supabase.from('partner_referrals').insert({
                  partner_id: partner.id,
                  referred_user_id: user.id,
                  referral_code: refCode,
                  signup_date: new Date().toISOString(),
                  status: 'pending'
                });
              }
            }
            localStorage.removeItem('utm_referral_code');
          } catch (err) {
            console.error('Error tracking referral:', err);
          }
        }

        toast({
          title: "Success!",
          description: "Account created successfully. Redirecting...",
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'email profile openid',
      }
    });
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (isCheckingSession || isAuthenticating) {
    return <AuthLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="text-center space-y-4">
          <UtmOneLogo size="xl" className="justify-center mb-2" />
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Create your account</h1>
          <p className="text-muted-foreground text-lg">Start making smarter links in seconds</p>
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

        <Card className="border-border/50 shadow-xl rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-display font-bold">Sign up</CardTitle>
            <CardDescription className="text-muted-foreground">Choose your preferred method to get started</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6 space-y-6">
            <SocialLoginButtons
              isLoading={isLoading}
              onGoogleClick={handleGoogleLogin}
              onMicrosoftClick={handleMicrosoftLogin}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="fullname" className="text-sm font-medium text-foreground">
                  Full name
                </label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12 rounded-xl border-2 focus-visible:ring-primary"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-2 focus-visible:ring-primary"
                  disabled={isLoading || !!invitationContext}
                  readOnly={!!invitationContext}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 rounded-xl border-2 focus-visible:ring-primary"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
