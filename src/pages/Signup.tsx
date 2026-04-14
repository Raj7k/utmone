import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { notify } from "@/lib/notify";
import { Info, Check, Shield, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { AuthLoadingScreen } from "@/components/loading/AuthLoadingScreen";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useUIFeatureFlags } from "@/hooks/useUIFeatureFlag";
import { CleanAuthLayout } from "@/components/layout/CleanAuthLayout";
import { EmailConfirmationScreen } from "@/components/auth/EmailConfirmationScreen";
import { SmartEmailInput } from "@/components/ui/smart-email-input";
import { validateEmailSmart } from "@/lib/emailValidator";
import { identifyUser } from "@/hooks/useUtmOneTracking";

// Value proposition badges
const VALUE_PROPS = [
  { icon: Check, text: "free forever plan" },
  { icon: Shield, text: "no credit card required" },
  { icon: Clock, text: "set up in 2 minutes" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmationPending, setConfirmationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
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
        notify.error("failed to check authentication status");
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
        
        // 🎯 Identify user for cross-device attribution
        identifyUser(
          session.user.email || '', 
          session.user.user_metadata?.full_name
        );
        
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
            
          const { data: memberWorkspaces } = await supabaseFrom('workspace_members')
            .select("workspace_id")
            .eq("user_id", session.user.id)
            .limit(1);
          
          const hasWorkspaces = (ownedWorkspaces?.length || 0) + (memberWorkspaces?.length || 0) > 0;
          
          notify.success(hasWorkspaces ? "taking you to your dashboard..." : "setting up your workspace...");
          
          // Navigate based on workspace status
          if (hasWorkspaces) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
          
        } catch (err) {
          console.error("Access check error:", err);
          hasNavigated.current = false;
          notify.error("please try signing in again");
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
    
    // Final validation check
    const validation = validateEmailSmart(email);
    if (!validation.isValid) {
      notify.error(validation.error || "please enter a valid email");
      return;
    }
    
    setIsLoading(true);
    const normalizedEmail = validation.normalizedEmail || email.trim().toLowerCase();

    try {
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        notify.error(error.message || "sign up failed");
      } else {
        // Check for referral code and store for later (after email confirmation)
        const refCode = localStorage.getItem('utm_referral_code');
        if (refCode) {
          // Store referral info to process after email confirmation
          localStorage.setItem('pending_referral_code', refCode);
          localStorage.setItem('pending_referral_email', normalizedEmail);
        }

        // Show email confirmation screen
        setPendingEmail(normalizedEmail);
        setConfirmationPending(true);
        notify.success("confirmation email sent");
      }
    } catch (error) {
      notify.error("an unexpected error occurred");
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
      notify.error(error.message || "sign up failed");
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
      notify.error(error.message || "sign up failed");
      setIsLoading(false);
    }
  };

  if (isCheckingSession || isAuthenticating) {
    return <AuthLoadingScreen />;
  }

  // Show email confirmation screen when signup is pending
  if (confirmationPending) {
    return (
      <EmailConfirmationScreen
        email={pendingEmail}
        onBack={() => {
          setConfirmationPending(false);
          setPendingEmail("");
          setEmail("");
          setPassword("");
        }}
      />
    );
  }

  return (
    <CleanAuthLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <UtmOneLogo size="xl" className="justify-center mb-2" />
            <h1 className="text-4xl font-display font-bold tracking-tight text-white">create your account</h1>
            <p className="text-zinc-400 text-lg">start making smarter links in seconds</p>
            
            {/* Value proposition badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {VALUE_PROPS.map((prop, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-800/50 px-3 py-1.5 rounded-full"
                >
                  <prop.icon className="h-3.5 w-3.5 text-emerald-500" />
                  {prop.text}
                </div>
              ))}
            </div>
          </div>

          {invitationContext && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-base font-semibold text-white">
                    workspace invitation
                  </p>
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-white">{invitationContext.inviterName}</span> invited you to join{" "}
                    <span className="font-medium text-white">{invitationContext.workspaceName}</span> as{" "}
                    <span className="font-medium text-emerald-400">{invitationContext.role}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <Card className="bg-zinc-900/50 border-white/10 shadow-xl rounded-2xl backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-display font-bold text-white">sign up</CardTitle>
              <CardDescription className="text-zinc-400">choose your preferred method to get started</CardDescription>
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
                    <span className="bg-zinc-900/50 px-2 text-zinc-500">or</span>
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
                    className="h-14 rounded-xl border text-base bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white">
                    email
                  </label>
                  {invitationContext ? (
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      className="h-14 rounded-xl border text-base bg-zinc-800/50 border-white/10 text-white"
                      disabled
                      readOnly
                    />
                  ) : (
                    <SmartEmailInput
                      id="email"
                      value={email}
                      onChange={setEmail}
                      onValidChange={(valid) => setIsEmailValid(valid)}
                      placeholder="you@company.com"
                      className="h-14 rounded-xl border text-base bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                      disabled={isLoading}
                      required
                    />
                  )}
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
                    className="h-14 rounded-xl border text-base bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500"
                  />
                  <p className="text-xs text-zinc-500">
                    minimum 8 characters
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-xl text-base font-semibold bg-white text-black hover:bg-zinc-200"
                  disabled={isLoading}
                >
                  {isLoading ? "creating account..." : "create account"}
                </Button>
              </form>

              <div className="text-center text-sm text-zinc-400">
                already have an account?{" "}
                <Link to="/auth" className="text-white hover:underline font-medium">
                  sign in
                </Link>
              </div>
            </CardContent>
          </Card>

        {/* Trust footer */}
        <p className="text-center text-xs text-zinc-500">
          by signing up, you agree to our{" "}
          <Link to="/terms" className="hover:text-white underline">terms</Link>
          {" "}and{" "}
          <Link to="/privacy" className="hover:text-white underline">privacy policy</Link>
        </p>
      </motion.div>
    </CleanAuthLayout>
  );
};

export default Signup;
