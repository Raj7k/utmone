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
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useUIFeatureFlags } from "@/hooks/useUIFeatureFlag";

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
  
  // Check if social login buttons should be shown
  const { flags: uiFlags } = useUIFeatureFlags(['enable_google_auth', 'enable_microsoft_auth']);
  const showSocialButtons = uiFlags['enable_google_auth'] || uiFlags['enable_microsoft_auth'];

  // Navigation guard to prevent duplicate processing
  const hasNavigated = useRef(false);

  useEffect(() => {
    const redirectTo = searchParams.get("redirect_to");
    
    // Load invitation context if invite token present
    if (inviteToken) {
      loadInvitationContext(inviteToken);
    }

    // Add timeout to prevent infinite loading - use functional update to avoid stale closure
    const sessionCheckTimeout = setTimeout(() => {
      setIsCheckingSession(prev => {
        if (prev) {
          console.warn("Session check timeout - proceeding to signup form");
        }
        return false;
      });
    }, 5000);

    // Safety timeout for isAuthenticating state
    const authTimeout = setTimeout(() => {
      setIsAuthenticating(prev => {
        if (prev) {
          console.warn("Authentication timeout - showing form");
        }
        return false;
      });
    }, 10000);

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
        clearTimeout(sessionCheckTimeout);
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

    return () => {
      clearTimeout(sessionCheckTimeout);
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, inviteToken]);

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
    
    // Store invite token in localStorage to survive OAuth redirect
    if (inviteToken) {
      localStorage.setItem("pending_invite_token", inviteToken);
    }
    
    // Always redirect to auth callback for gatekeeper logic
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    
    // Store invite token in localStorage to survive OAuth redirect
    if (inviteToken) {
      localStorage.setItem("pending_invite_token", inviteToken);
    }
    
    // Always redirect to auth callback for gatekeeper logic
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    <div className="dark min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          back to home
        </Link>

        <div className="text-center space-y-4">
          <UtmOneLogo size="xl" className="justify-center mb-2" />
          <h1 className="text-4xl font-display font-bold tracking-tight hero-gradient">create your account</h1>
          <p className="text-white/60 text-lg">start making smarter links in seconds</p>
        </div>

        {invitationContext && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3"
          >
            <Info className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-white">
                you've been invited to join utm.one
              </p>
              <p className="text-sm text-white/60">
                {invitationContext.inviterName} has invited you to join their workspace
                as a {invitationContext.role}. complete your signup below.
              </p>
            </div>
          </motion.div>
        )}

        <Card className="bg-zinc-900/40 backdrop-blur-xl border-white/10 shadow-xl rounded-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-display font-bold text-white">sign up</CardTitle>
            <CardDescription className="text-white/60">choose your preferred method to get started</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6 space-y-6">
            <SocialLoginButtons
              isLoading={isLoading}
              onGoogleClick={handleGoogleLogin}
              onMicrosoftClick={handleMicrosoftLogin}
            />

            {showSocialButtons && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900/40 px-2 text-white/40">or</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="fullname" className="text-sm font-medium text-white">
                  full name
                </label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="john doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-14 rounded-xl border-2 text-base bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-xl border-2 text-base bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  disabled={isLoading || !!invitationContext}
                  readOnly={!!invitationContext}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  password
                </label>
                <PasswordInput
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <p className="text-xs text-white/40">
                  minimum 8 characters
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "creating account..." : "create account"}
              </Button>
            </form>

            <div className="text-center text-xs text-white/60">
              already have an account?{" "}
              <Link to="/auth" className="text-white hover:underline font-medium">
                sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
