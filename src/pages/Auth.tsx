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
import { MFAChallenge } from "@/components/auth/MFAChallenge";
import { PasswordInput } from "@/components/auth/PasswordInput";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMFAChallenge, setShowMFAChallenge] = useState(false);
  const [mfaFactorId, setMFAFactorId] = useState("");
  const [invitationContext, setInvitationContext] = useState<{
    email: string;
    workspaceName: string;
    inviterName: string;
    role: string;
  } | null>(null);

  // Navigation guard to prevent duplicate processing
  const hasNavigated = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const redirectTo = searchParams.get("redirect_to");
    
    console.log('[Auth] Component mounted, checking session...');
    
    // Load invitation context if invite token present
    if (inviteToken) {
      loadInvitationContext(inviteToken);
    } else {
      const pendingInvite = localStorage.getItem("pending_invite_token");
      if (pendingInvite) {
        loadInvitationContext(pendingInvite);
      }
    }

    // Shorter timeout (3s) to prevent infinite loading
    const sessionCheckTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('[Auth] Session check timeout (3s) - showing form');
        setIsCheckingSession(false);
      }
    }, 3000);

    // Safety timeout for isAuthenticating state
    const authTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('[Auth] Auth timeout (8s) - showing form');
        setIsAuthenticating(false);
      }
    }, 8000);

    // Check session with async/await for cleaner control flow
    const checkSession = async () => {
      try {
        console.log('[Auth] Calling getSession...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) {
          console.log('[Auth] Component unmounted during session check');
          return;
        }
        
        if (error) {
          console.error('[Auth] Session check error:', error);
          setIsCheckingSession(false);
          return;
        }
        
        console.log('[Auth] Session check result:', !!session);
        
        if (session) {
          hasNavigated.current = true;
          
          if (inviteToken) {
            navigate(`/accept-invite?token=${inviteToken}`);
          } else if (redirectTo) {
            navigate(redirectTo);
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error('[Auth] Session check failed:', error);
        if (isMounted) {
          toast({
            title: "Authentication Error",
            description: "Failed to check authentication status. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          console.log('[Auth] Setting isCheckingSession to false');
          clearTimeout(sessionCheckTimeout);
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    // Listen for auth changes - synchronous callback, defer async work
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth] Auth state change:', event);
      
      if (hasNavigated.current) return;
      
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticating(true);
        hasNavigated.current = true;
        
        // Defer async work to avoid deadlock
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            if (inviteToken) {
              navigate(`/accept-invite?token=${inviteToken}`);
              return;
            }
            
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
            
            toast({
              title: "Signed in successfully",
              description: hasWorkspaces ? "Taking you to your dashboard..." : "Setting up your workspace...",
            });
            
            navigate(hasWorkspaces ? "/dashboard" : "/onboarding");
            
          } catch (err) {
            console.error('[Auth] Access check error:', err);
            if (isMounted) {
              hasNavigated.current = false;
              toast({
                title: "Something went wrong",
                description: "Please try signing in again.",
                variant: "destructive",
              });
              setIsAuthenticating(false);
            }
          }
        }, 0);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(sessionCheckTimeout);
      clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, inviteToken, searchParams, toast]);

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if TOTP 2FA is required
      const { data: mfaSettings } = await supabase
        .from('mfa_settings')
        .select('is_enabled')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (mfaSettings?.is_enabled) {
        // Redirect to 2FA verification page
        const returnTo = inviteToken ? `/accept-invite?token=${inviteToken}` : '/dashboard';
        navigate(`/auth/verify-2fa?returnTo=${encodeURIComponent(returnTo)}`);
        return;
      }

      // Success without 2FA
      toast({
        title: "signed in successfully",
        description: "taking you to your dashboard...",
      });
      // onAuthStateChange will handle navigation
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
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
        title: "Sign in failed",
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
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleMFASuccess = () => {
    setShowMFAChallenge(false);
    // Navigation will be handled by onAuthStateChange
  };

  const handleMFACancel = () => {
    setShowMFAChallenge(false);
    setMFAFactorId("");
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

  // Show loading screen while checking session
  if (isCheckingSession) {
    return <AuthLoadingScreen />;
  }

  // Show loading screen while authenticating
  if (isAuthenticating) {
    return <AuthLoadingScreen />;
  }

  // Show MFA challenge if required
  if (showMFAChallenge && mfaFactorId) {
    return (
      <MFAChallenge
        factorId={mfaFactorId}
        onSuccess={handleMFASuccess}
        onCancel={handleMFACancel}
      />
    );
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: '#050505' }}>
      {/* Subtle background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Back to home link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          back to home
        </Link>

        <div className="text-center space-y-4">
          <UtmOneLogo size="xl" className="justify-center mb-2" />
          <h1 className="text-4xl font-display font-bold tracking-tight hero-gradient">welcome back</h1>
          <p className="text-white/60 text-lg">sign in to your workspace</p>
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
            <CardTitle className="text-2xl font-display font-bold text-white">sign in</CardTitle>
            <CardDescription className="text-white/60">team member and workspace access</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6 space-y-6">
            <SocialLoginButtons
              isLoading={isLoading}
              onGoogleClick={handleGoogleLogin}
              onMicrosoftClick={handleMicrosoftLogin}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900/40 px-2 text-white/40">or</span>
              </div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="signin-email" className="text-sm font-medium text-white">
                  email
                </label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 rounded-xl border-2 text-base bg-white/5 border-white/10 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signin-password" className="text-sm font-medium text-white">
                  password
                </label>
                <PasswordInput
                  id="signin-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl text-base font-semibold" disabled={isLoading}>
                {isLoading ? "signing in…" : "sign in"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-14 rounded-xl text-base text-white/60 hover:text-white hover:bg-white/10"
                onClick={handleForgotPassword}
              >
                forgot password?
              </Button>
            </form>

            <div className="text-center text-xs text-white/60">
              new user?{" "}
              <Link to="/signup" className="text-white hover:underline font-medium">
                sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
