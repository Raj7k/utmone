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
            title: "Signed in successfully",
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

      // Check if MFA is required
      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      
      if (factorsData?.totp && factorsData.totp.length > 0) {
        // User has MFA enabled - show challenge
        setShowMFAChallenge(true);
        setMFAFactorId(factorsData.totp[0].id);
        setIsLoading(false);
      }
      // If no MFA, onAuthStateChange will handle navigation
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
    
    // Preserve invite token in redirect URL
    const redirectUrl = inviteToken 
      ? `${window.location.origin}/accept-invite?token=${inviteToken}`
      : `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
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
    
    // Preserve invite token in redirect URL
    const redirectUrl = inviteToken 
      ? `${window.location.origin}/accept-invite?token=${inviteToken}`
      : `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: redirectUrl,
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
          <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">Admin sign in</h1>
          <p className="text-muted-foreground text-lg">Access your admin dashboard</p>
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
            <CardTitle className="text-2xl font-display font-bold">Sign in</CardTitle>
            <CardDescription className="text-muted-foreground">Admin and team member access</CardDescription>
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

            <div className="text-center text-sm text-muted-foreground">
              New user?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
