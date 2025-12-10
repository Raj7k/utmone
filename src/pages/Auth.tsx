import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { ArrowLeft, Info } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLoadingScreen } from "@/components/loading/AuthLoadingScreen";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { MFAChallenge } from "@/components/auth/MFAChallenge";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useUIFeatureFlags } from "@/hooks/useUIFeatureFlag";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";

const Auth = () => {
  const navigate = useNavigate();
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
  
  // Check if social login buttons should be shown
  const { flags: uiFlags } = useUIFeatureFlags(['enable_google_auth', 'enable_microsoft_auth']);
  const showSocialButtons = uiFlags['enable_google_auth'] || uiFlags['enable_microsoft_auth'];

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
          notify.error("failed to check authentication status");
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
            
            notify.success(hasWorkspaces ? "taking you to your dashboard..." : "setting up your workspace...");
            
            navigate(hasWorkspaces ? "/dashboard" : "/onboarding");
            
          } catch (err) {
            console.error('[Auth] Access check error:', err);
            if (isMounted) {
              hasNavigated.current = false;
              notify.error("please try signing in again");
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
  }, [navigate, inviteToken, searchParams]);

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
        notify.error(error.message || "sign in failed");
        setIsLoading(false);
        return;
      }

      // Check if user is admin with WebAuthn keys (security keys)
      const { data: adminRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (adminRole) {
        // Admin user - check for WebAuthn security keys
        const { data: authenticators } = await supabase
          .from('user_authenticators')
          .select('id')
          .eq('user_id', data.user.id)
          .limit(1);

        if (authenticators && authenticators.length > 0) {
          // Admin has security keys - MUST verify via WebAuthn
          const returnTo = inviteToken ? `/accept-invite?token=${inviteToken}` : '/admin';
          navigate(`/admin/mfa-verify?returnTo=${encodeURIComponent(returnTo)}`);
          return;
        }
      }

      // Check if TOTP 2FA is required (for non-admin users or admins without WebAuthn)
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
      notify.success("signed in successfully");
      // onAuthStateChange will handle navigation
    } catch (error) {
      notify.error("an unexpected error occurred");
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
      notify.error(error.message || "sign in failed");
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
      notify.error(error.message || "sign in failed");
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
      notify.warning("please enter your email address first");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);

    if (error) {
      notify.error(error.message);
      return;
    }

    notify.success("password reset link sent to your email");
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
    <ObsidianMarketingLayout showFloatingNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Back to home link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            back to home
          </Link>

          <div className="text-center space-y-4">
            <UtmOneLogo size="xl" className="justify-center mb-2" />
            <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">welcome back</h1>
            <p className="text-muted-foreground text-lg">sign in to your workspace</p>
          </div>

          {invitationContext && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-base font-semibold text-foreground">
                    workspace invitation
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{invitationContext.inviterName}</span> invited you to join{" "}
                    <span className="font-medium text-foreground">{invitationContext.workspaceName}</span> as{" "}
                    <span className="font-medium text-primary">{invitationContext.role}</span>
                  </p>
                </div>
              </div>
              <div className="pl-[52px]">
                <p className="text-xs text-muted-foreground">
                  sign in or create an account with <span className="font-medium text-foreground">{invitationContext.email}</span> to accept
                </p>
              </div>
            </motion.div>
          )}

          <Card className="bg-card border-border shadow-xl rounded-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-display font-bold text-foreground">sign in</CardTitle>
              <CardDescription className="text-muted-foreground">team member and workspace access</CardDescription>
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
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="signin-email" className="text-sm font-medium text-foreground">
                    email
                  </label>
                  <div className="relative">
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => !invitationContext && setEmail(e.target.value)}
                      required
                      readOnly={!!invitationContext}
                      className={`h-14 rounded-xl border-2 text-base bg-muted/30 border-border text-foreground placeholder:text-muted-foreground ${
                        invitationContext ? "pr-12 bg-muted/50" : ""
                      }`}
                    />
                    {invitationContext && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center" title="email from invitation">
                          <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  {invitationContext && (
                    <p className="text-xs text-muted-foreground">
                      this email was specifically invited to join the workspace
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="signin-password" className="text-sm font-medium text-foreground">
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
                  className="w-full h-14 rounded-xl text-base text-muted-foreground hover:text-foreground"
                  onClick={handleForgotPassword}
                >
                  forgot password?
                </Button>
              </form>

              <div className="text-center text-xs text-muted-foreground">
                new user?{" "}
                <Link to="/signup" className="text-foreground hover:underline font-medium">
                  sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ObsidianMarketingLayout>
  );
};

export default Auth;
